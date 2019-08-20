<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once './vendor/autoload.php';

session_start();

$c = new \Slim\Container();

$c['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        return $response->withJson([ 'message' => 'Page not found'])->withStatus(404);
    };
};

$authMiddleware = function ($request, $response, $next) {
    $user = $_SESSION['user'] ?? null;
    if(!$user){
        return $response->withJson(['error' => [ 'message' => 'Unauthorised']])->withStatus(401);
    }
    return $next($request, $response);
};

$app = new \Slim\App($c);

$users = [
    [
        'id' => '1',
        'username' => 'admin',
        'password' => 'admin',
        'firstName' => 'Admin',
        'lastName' => 'Adminov',
        'token' => '',
    ], 
];



$app->post('/users/authenticate', function ($request, $response, $args) use ($users){
    $post = $request->getParsedBody();
    $data = $users[0];
    if($users[0]['username'] == $post['username'] ?? '' && $users[0]['password'] == $post['password'] ?? ''){
        $data['token'] = 'test';
        $_SESSION['user'] = $data;
        return $response->withJson($data);
    }else{
        return $response->withJson(['message' => 'Username or password is incorrect'])->withStatus(400);
    }
    
});

$app->get('/users/logout', function ($request, $response, $args) {
    $data = [];
    session_destroy();
    return $response->withJson($data);
});

$app->get('/balance', function ($request, $response, $args) {
    $data = [
        [
            'id' => 1,
            'type' => 'credit',
            'amount' => 200,
            'added' => time()
        ]
    ];
    $data = $_SESSION['balance'] ?? [];
    return $response->withJson($data);
})->add($authMiddleware);

$app->get('/balance/clear', function ($request, $response, $args) {
    $_SESSION['balance'] = [];
    return $response->withJson(['ok' => true]);
})->add($authMiddleware);

$app->post('/balance', function ($request, $response, $args) {
    $post = $request->getParsedBody();
    $balance = $_SESSION['balance'] ?? [];

    $total = 0;
    forEach($balance as $item) {
        if ($item['type'] == 'debit') {
            $total -= $item['amount'];
        }
        if ($item['type'] == 'credit') {
            $total += $item['amount'];
        }
    }
                
    if($post['type'] == 'debit' && $total < $post['amount']){
        return $response->withJson(['message' => 'Operation error. Balance will be below zero.'])->withStatus(400);
    }

    if(!in_array($post['type'],['debit','credit'])){
        return $response->withJson(['message' => 'Invalid type'])->withStatus(400);
    }

    if($post['amount'] < 0){
        return $response->withJson(['message' => 'Invalid amount'])->withStatus(400);
    }

    $id = count($balance) + 1;
    $_SESSION['balance'][] = [
        'id' => $id,
        'type' => $post['type'],
        'amount' => $post['amount'],
        'added' => time()
    ];
    $data = [
        'success' => true,
        'id' => $id
    ];
    return $response->withJson($data);
})->add($authMiddleware);


$app->run();