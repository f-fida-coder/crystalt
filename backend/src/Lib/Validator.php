<?php
namespace Crystal\Lib;

final class Validator
{
    public static function readJson(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        if ($raw === '') {
            return [];
        }
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            Response::error('Invalid JSON body', 400);
        }
        return $data;
    }

    public static function str(array $data, string $key, int $min = 0, int $max = 65535): string
    {
        $v = trim((string) ($data[$key] ?? ''));
        if (strlen($v) < $min) {
            Response::error("Field '$key' must be at least $min characters", 422);
        }
        if (strlen($v) > $max) {
            Response::error("Field '$key' must be at most $max characters", 422);
        }
        return $v;
    }

    public static function optStr(array $data, string $key, int $max = 65535): ?string
    {
        $v = isset($data[$key]) ? trim((string) $data[$key]) : '';
        if ($v === '') {
            return null;
        }
        if (strlen($v) > $max) {
            Response::error("Field '$key' must be at most $max characters", 422);
        }
        return $v;
    }

    public static function email(array $data, string $key): string
    {
        $v = self::str($data, $key, 3, 254);
        if (!filter_var($v, FILTER_VALIDATE_EMAIL)) {
            Response::error("Field '$key' must be a valid email", 422);
        }
        return $v;
    }

    public static function int(array $data, string $key, int $min = PHP_INT_MIN, int $max = PHP_INT_MAX): int
    {
        if (!isset($data[$key]) || !is_numeric($data[$key])) {
            Response::error("Field '$key' must be a number", 422);
        }
        $v = (int) $data[$key];
        if ($v < $min || $v > $max) {
            Response::error("Field '$key' must be between $min and $max", 422);
        }
        return $v;
    }
}
