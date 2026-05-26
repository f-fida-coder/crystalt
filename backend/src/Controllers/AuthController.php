<?php
namespace Crystal\Controllers;

use Crystal\Lib\Db;
use Crystal\Lib\Jwt;
use Crystal\Lib\Response;
use Crystal\Lib\Validator;
use Crystal\Lib\Auth;

final class AuthController
{
    public static function register(string $secret, int $ttl): void
    {
        $body = Validator::readJson();
        $name     = Validator::str($body, 'full_name', 2, 120);
        $email    = strtolower(Validator::email($body, 'email'));
        $password = Validator::str($body, 'password', 8, 200);

        $exists = Db::run('SELECT id FROM users WHERE email = ?', [$email])->fetch();
        if ($exists) {
            Response::error('An account with this email already exists', 409);
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        Db::run(
            'INSERT INTO users (email, password_hash, full_name, role, created_at)
             VALUES (?, ?, ?, "client", NOW())',
            [$email, $hash, $name]
        );
        $userId = (int) Db::pdo()->lastInsertId();

        $token = Jwt::encode(['sub' => $userId, 'role' => 'client', 'email' => $email], $secret, $ttl);
        Response::json([
            'token' => $token,
            'user'  => ['id' => $userId, 'email' => $email, 'full_name' => $name, 'role' => 'client'],
        ], 201);
    }

    public static function login(string $secret, int $ttl): void
    {
        $body = Validator::readJson();
        $email    = strtolower(Validator::email($body, 'email'));
        $password = Validator::str($body, 'password', 1, 200);

        $row = Db::run('SELECT id, password_hash, full_name, role FROM users WHERE email = ?', [$email])->fetch();
        if (!$row || !password_verify($password, $row['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }

        $token = Jwt::encode(
            ['sub' => (int) $row['id'], 'role' => $row['role'], 'email' => $email],
            $secret,
            $ttl
        );
        Response::json([
            'token' => $token,
            'user'  => [
                'id'        => (int) $row['id'],
                'email'     => $email,
                'full_name' => $row['full_name'],
                'role'      => $row['role'],
            ],
        ]);
    }

    public static function me(string $secret): void
    {
        $claims = Auth::require($secret);
        $row = Db::run(
            'SELECT id, email, full_name, role, created_at FROM users WHERE id = ?',
            [$claims['sub']]
        )->fetch();
        if (!$row) {
            Response::unauthorized('User no longer exists');
        }
        Response::json(['user' => $row]);
    }
}
