<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}
require __DIR__ . '/vendor/autoload.php';
session_start();
$configDir = dirname(__DIR__) . '/config/';
// Instantiate the app
$settings = require __DIR__ . '/app/settings.php';
$app = new \Slim\App($settings);
// Set up dependencies
$dependencies = require __DIR__ . '/app/dependencies.php';
$dependencies($app);
// Register middleware
$middleware = require __DIR__ . '/app/middleware.php';
$middleware($app);
// Register routes
$routes = require __DIR__ . '/app/routes.php';
$routes($app);
// Run app
$app->run();
