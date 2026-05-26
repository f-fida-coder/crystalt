<?php
namespace Crystal\Controllers;

use Crystal\Lib\Auth;
use Crystal\Lib\Db;
use Crystal\Lib\Response;
use Crystal\Lib\Validator;

final class ProjectController
{
    /** GET /api/projects — projects belonging to the logged-in client. */
    public static function mine(string $secret): void
    {
        $claims = Auth::require($secret);
        $rows = Db::run(
            'SELECT p.id, p.title, p.project_type, p.description, p.status, p.progress,
                    p.timeline, p.budget, p.created_at, p.updated_at
             FROM projects p
             WHERE p.user_id = ?
             ORDER BY p.created_at DESC',
            [$claims['sub']]
        )->fetchAll();

        $ids = array_column($rows, 'id');
        $updates = [];
        if ($ids) {
            $place = implode(',', array_fill(0, count($ids), '?'));
            $updates = Db::run(
                "SELECT project_id, id, message, created_at
                 FROM project_updates
                 WHERE project_id IN ($place)
                 ORDER BY created_at DESC",
                $ids
            )->fetchAll();
        }
        $byId = [];
        foreach ($updates as $u) {
            $byId[$u['project_id']][] = $u;
        }
        foreach ($rows as &$r) {
            $r['updates'] = $byId[$r['id']] ?? [];
        }
        Response::json(['projects' => $rows]);
    }

    public static function create(string $secret): void
    {
        $claims = Auth::require($secret);
        $body = Validator::readJson();
        $title       = Validator::str($body, 'title', 2, 200);
        $projectType = Validator::str($body, 'project_type', 2, 40);
        $description = Validator::str($body, 'description', 10, 5000);
        $features    = Validator::optStr($body, 'features', 1000);
        $timeline    = Validator::optStr($body, 'timeline', 60);
        $budget      = Validator::optStr($body, 'budget', 60);

        Db::run(
            'INSERT INTO projects
                (user_id, title, project_type, description, features, timeline, budget,
                 status, progress, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, "requested", 0, NOW(), NOW())',
            [$claims['sub'], $title, $projectType, $description, $features, $timeline, $budget]
        );
        Response::json(['ok' => true, 'id' => (int) Db::pdo()->lastInsertId()], 201);
    }

    public static function adminList(string $secret): void
    {
        Auth::requireAdmin($secret);
        $rows = Db::run(
            'SELECT p.id, p.user_id, u.email, u.full_name, p.title, p.project_type,
                    p.status, p.progress, p.created_at, p.updated_at
             FROM projects p
             JOIN users u ON u.id = p.user_id
             ORDER BY p.created_at DESC'
        )->fetchAll();
        Response::json(['projects' => $rows]);
    }

    public static function adminUpdate(string $secret, array $params): void
    {
        Auth::requireAdmin($secret);
        $body = Validator::readJson();
        $id   = (int) $params['id'];

        $fields = [];
        $values = [];
        if (isset($body['status'])) {
            $allowed = ['requested', 'in_review', 'scoping', 'in_progress', 'delivered', 'cancelled'];
            if (!in_array($body['status'], $allowed, true)) {
                Response::error('Invalid status', 422);
            }
            $fields[] = 'status = ?';
            $values[] = $body['status'];
        }
        if (isset($body['progress'])) {
            $p = (int) $body['progress'];
            if ($p < 0 || $p > 100) {
                Response::error('Progress must be 0-100', 422);
            }
            $fields[] = 'progress = ?';
            $values[] = $p;
        }
        if (!empty($body['update_message'])) {
            $msg = trim((string) $body['update_message']);
            if (strlen($msg) > 2000) {
                Response::error('Update message too long', 422);
            }
            Db::run(
                'INSERT INTO project_updates (project_id, message, created_at) VALUES (?, ?, NOW())',
                [$id, $msg]
            );
        }
        if ($fields) {
            $values[] = $id;
            Db::run(
                'UPDATE projects SET ' . implode(', ', $fields) . ', updated_at = NOW() WHERE id = ?',
                $values
            );
        }
        Response::json(['ok' => true]);
    }
}
