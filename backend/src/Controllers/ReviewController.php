<?php
namespace Crystal\Controllers;

use Crystal\Lib\Auth;
use Crystal\Lib\Db;
use Crystal\Lib\Response;
use Crystal\Lib\Validator;

final class ReviewController
{
    public static function publicList(): void
    {
        $rows = Db::run(
            'SELECT id, author_name, author_role, service, rating, content, created_at
             FROM reviews
             WHERE approved = 1
             ORDER BY created_at DESC
             LIMIT 100'
        )->fetchAll();
        Response::json(['reviews' => $rows]);
    }

    public static function create(): void
    {
        $body = Validator::readJson();
        $name    = Validator::str($body, 'author_name', 2, 80);
        $role    = Validator::optStr($body, 'author_role', 120);
        $service = Validator::optStr($body, 'service', 80);
        $rating  = Validator::int($body, 'rating', 1, 5);
        $content = Validator::str($body, 'content', 10, 1500);

        Db::run(
            'INSERT INTO reviews
                (author_name, author_role, service, rating, content, approved, created_at)
             VALUES (?, ?, ?, ?, ?, 0, NOW())',
            [$name, $role, $service, $rating, $content]
        );
        Response::json([
            'ok'      => true,
            'message' => 'Thanks! Your review is pending moderation.',
        ], 201);
    }

    public static function adminList(string $secret): void
    {
        Auth::requireAdmin($secret);
        $rows = Db::run(
            'SELECT id, author_name, author_role, service, rating, content, approved, created_at
             FROM reviews
             ORDER BY created_at DESC'
        )->fetchAll();
        Response::json(['reviews' => $rows]);
    }

    public static function moderate(string $secret, array $params): void
    {
        Auth::requireAdmin($secret);
        $body = Validator::readJson();
        $approved = (int) (!empty($body['approved']));
        Db::run('UPDATE reviews SET approved = ? WHERE id = ?', [$approved, (int) $params['id']]);
        Response::json(['ok' => true]);
    }

    public static function remove(string $secret, array $params): void
    {
        Auth::requireAdmin($secret);
        Db::run('DELETE FROM reviews WHERE id = ?', [(int) $params['id']]);
        Response::json(['ok' => true]);
    }
}
