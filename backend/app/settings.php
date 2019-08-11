<?php

error_reporting(E_ALL);
ini_set('display_errors', 'On');
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header
        // DB settings
        'db' => [
            'driver' => 'pdo_mysql',
            'host' => 'database',
            'port' => '3306',
            'user' => 'root',
            'password' => 'secret',
            'dbname' => 'db',
            'charset' => 'utf8',
        ],
        'auth' => [
            'tokenExpireDate' => 60 * 60 * 24 * 7, /** 7 days */
        ],
    ],
];
