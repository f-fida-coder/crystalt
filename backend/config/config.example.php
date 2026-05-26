<?php
/**
 * Crystal Tech backend configuration.
 *
 * 1. Copy this file to `config.php` (do NOT commit `config.php`).
 * 2. Fill in your cPanel MySQL credentials and a long random JWT secret.
 * 3. Update CORS_ORIGINS to match the domain the React app is served from.
 */

return [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'your_cpanel_db_name',
        'username' => 'your_cpanel_db_user',
        'password' => 'your_cpanel_db_password',
        'charset'  => 'utf8mb4',
    ],

    // Generate with: php -r 'echo bin2hex(random_bytes(48));'
    'jwt_secret'  => 'CHANGE_ME_TO_A_LONG_RANDOM_HEX_STRING',
    'jwt_ttl'     => 60 * 60 * 24 * 7, // 7 days

    // Allowed Origins for browser API calls. Use ['*'] only during local dev.
    'cors_origins' => [
        'https://crystaltechnologys.com',
        'https://www.crystaltechnologys.com',
        'http://localhost:5173',
    ],

    // Notification inbox(es) for new contact / project requests.
    'notify_emails' => [
        'technologycrystals6@gmail.com',
    ],

    // Set to true to log PHP errors to /api/storage/error.log instead of showing them.
    'debug' => false,
];
