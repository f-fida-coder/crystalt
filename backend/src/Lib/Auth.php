<?php
namespace Crystal\Lib;

final class Auth
{
    /** Returns user payload from a valid Bearer token, or null. */
    public static function user(string $secret): ?array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
            ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
        if (!$header && function_exists('apache_request_headers')) {
            $h = apache_request_headers();
            $header = $h['Authorization'] ?? ($h['authorization'] ?? '');
        }
        if (!preg_match('/Bearer\s+(.+)/i', (string) $header, $m)) {
            return null;
        }
        return Jwt::decode(trim($m[1]), $secret);
    }

    public static function require(string $secret): array
    {
        $user = self::user($secret);
        if (!$user) {
            Response::unauthorized('Authentication required');
        }
        return $user;
    }

    public static function requireAdmin(string $secret): array
    {
        $user = self::require($secret);
        if (($user['role'] ?? '') !== 'admin') {
            Response::error('Admin privileges required', 403);
        }
        return $user;
    }
}
