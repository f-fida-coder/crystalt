<?php
namespace Crystal\Lib;

final class Jwt
{
    private static function b64UrlEncode(string $bytes): string
    {
        return rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    }

    private static function b64UrlDecode(string $s): string
    {
        $pad = strlen($s) % 4;
        if ($pad) {
            $s .= str_repeat('=', 4 - $pad);
        }
        return base64_decode(strtr($s, '-_', '+/')) ?: '';
    }

    public static function encode(array $payload, string $secret, int $ttlSeconds): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $now = time();
        $payload = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $ttlSeconds,
        ]);
        $segments = [
            self::b64UrlEncode(json_encode($header, JSON_UNESCAPED_SLASHES)),
            self::b64UrlEncode(json_encode($payload, JSON_UNESCAPED_SLASHES)),
        ];
        $signingInput = implode('.', $segments);
        $sig = hash_hmac('sha256', $signingInput, $secret, true);
        $segments[] = self::b64UrlEncode($sig);
        return implode('.', $segments);
    }

    /** Returns the decoded payload, or null if invalid/expired. */
    public static function decode(string $token, string $secret): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        [$h, $p, $s] = $parts;
        $expected = self::b64UrlEncode(hash_hmac('sha256', "$h.$p", $secret, true));
        if (!hash_equals($expected, $s)) {
            return null;
        }
        $payload = json_decode(self::b64UrlDecode($p), true);
        if (!is_array($payload) || !isset($payload['exp']) || $payload['exp'] < time()) {
            return null;
        }
        return $payload;
    }
}
