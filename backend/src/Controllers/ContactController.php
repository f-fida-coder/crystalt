<?php
namespace Crystal\Controllers;

use Crystal\Lib\Auth;
use Crystal\Lib\Db;
use Crystal\Lib\Response;
use Crystal\Lib\Validator;

final class ContactController
{
    public static function create(): void
    {
        $body = Validator::readJson();
        $name    = Validator::str($body, 'name', 2, 120);
        $email   = Validator::email($body, 'email');
        $phone   = Validator::optStr($body, 'phone', 40);
        $subject = Validator::str($body, 'subject', 2, 200);
        $message = Validator::str($body, 'message', 10, 5000);

        Db::run(
            'INSERT INTO contact_messages
                (name, email, phone, subject, message, status, ip, created_at)
             VALUES (?, ?, ?, ?, ?, "new", ?, NOW())',
            [$name, $email, $phone, $subject, $message, $_SERVER['REMOTE_ADDR'] ?? null]
        );
        $id = (int) Db::pdo()->lastInsertId();

        // Best-effort email notification (silently ignore failures so the form still succeeds)
        @self::notify($name, $email, $subject, $message);

        Response::json(['ok' => true, 'id' => $id], 201);
    }

    private static function notify(string $name, string $email, string $subject, string $message): void
    {
        $cfg = require dirname(__DIR__, 2) . '/config/config.php';
        $to = $cfg['notify_emails'] ?? [];
        if (!$to) {
            return;
        }
        $body = "New contact form submission\n\n"
              . "Name:    $name\nEmail:   $email\nSubject: $subject\n\n$message\n";
        $headers = "From: no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'localhost') . "\r\n"
                 . "Reply-To: $email\r\n"
                 . "Content-Type: text/plain; charset=UTF-8\r\n";
        @mail(implode(',', $to), "[Contact] $subject", $body, $headers);
    }

    public static function list(string $secret): void
    {
        Auth::requireAdmin($secret);
        $rows = Db::run(
            'SELECT id, name, email, phone, subject, message, status, created_at
             FROM contact_messages
             ORDER BY created_at DESC
             LIMIT 500'
        )->fetchAll();
        Response::json(['messages' => $rows]);
    }

    public static function updateStatus(string $secret, array $params): void
    {
        Auth::requireAdmin($secret);
        $body = Validator::readJson();
        $status = Validator::str($body, 'status', 1, 32);
        if (!in_array($status, ['new', 'read', 'replied', 'archived'], true)) {
            Response::error('Invalid status', 422);
        }
        Db::run('UPDATE contact_messages SET status = ? WHERE id = ?', [$status, (int) $params['id']]);
        Response::json(['ok' => true]);
    }
}
