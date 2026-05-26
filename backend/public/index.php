<?php
/**
 * Crystal Tech API — front controller.
 *
 * Every /api/* request is rewritten here by .htaccess.
 * Loads config, wires PDO, applies CORS, then dispatches to controllers.
 */
declare(strict_types=1);

$root = dirname(__DIR__);

// --- Load config --------------------------------------------------------
$configPath = $root . '/config/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Backend not configured: copy config/config.example.php to config/config.php']);
    exit;
}
$config = require $configPath;

// --- Error handling -----------------------------------------------------
if (!empty($config['debug'])) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    @mkdir($root . '/storage', 0775, true);
    ini_set('log_errors', '1');
    ini_set('error_log', $root . '/storage/error.log');
}

// --- Autoloader (PSR-4 style, no Composer needed) -----------------------
spl_autoload_register(static function (string $class) use ($root): void {
    if (str_starts_with($class, 'Crystal\\')) {
        $rel = str_replace('\\', '/', substr($class, strlen('Crystal\\')));
        $file = $root . '/src/' . $rel . '.php';
        if (is_file($file)) {
            require $file;
        }
    }
});

use Crystal\Lib\Db;
use Crystal\Lib\Response;
use Crystal\Lib\Router;
use Crystal\Controllers\ContactController;
use Crystal\Controllers\ReviewController;
use Crystal\Controllers\AuthController;
use Crystal\Controllers\ProjectController;

// --- CORS ---------------------------------------------------------------
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $config['cors_origins'] ?? [];
if ($origin && (in_array('*', $allowed, true) || in_array($origin, $allowed, true))) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- Init DB ------------------------------------------------------------
Db::init($config['db']);

// --- Routes -------------------------------------------------------------
$router = new Router();
$secret = $config['jwt_secret'];
$ttl    = (int) ($config['jwt_ttl'] ?? 604800);

$router->get('/api/health',          fn() => Response::json(['ok' => true, 'time' => date('c')]));

// Auth
$router->post('/api/auth/register',  fn() => AuthController::register($secret, $ttl));
$router->post('/api/auth/login',     fn() => AuthController::login($secret, $ttl));
$router->get ('/api/auth/me',        fn() => AuthController::me($secret));

// Contact
$router->post('/api/contact',                       fn() => ContactController::create());
$router->get ('/api/admin/contact',                 fn() => ContactController::list($secret));
$router->patch('/api/admin/contact/:id',            fn($p) => ContactController::updateStatus($secret, $p));

// Reviews
$router->get ('/api/reviews',                       fn() => ReviewController::publicList());
$router->post('/api/reviews',                       fn() => ReviewController::create());
$router->get ('/api/admin/reviews',                 fn() => ReviewController::adminList($secret));
$router->patch('/api/admin/reviews/:id',            fn($p) => ReviewController::moderate($secret, $p));
$router->delete('/api/admin/reviews/:id',           fn($p) => ReviewController::remove($secret, $p));

// Client portal projects
$router->get ('/api/projects',                      fn() => ProjectController::mine($secret));
$router->post('/api/projects',                      fn() => ProjectController::create($secret));
$router->get ('/api/admin/projects',                fn() => ProjectController::adminList($secret));
$router->patch('/api/admin/projects/:id',           fn($p) => ProjectController::adminUpdate($secret, $p));

// --- Dispatch -----------------------------------------------------------
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
try {
    $router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', $path);
} catch (\Throwable $e) {
    error_log('[api] ' . $e->getMessage() . "\n" . $e->getTraceAsString());
    Response::error(
        !empty($config['debug']) ? $e->getMessage() : 'Internal server error',
        500
    );
}
