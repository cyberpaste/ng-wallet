<?php

use Slim\App;
use App\Controllers\{
    ApiController,
    UsersController,
};

class Auth
{

    private $container;

    public function __construct($container) {
        $this->container = $container;
    }

    public function __invoke($request, $response, $next)
    {
        $em =  $this->container->get('db')->get('em')->getEntityManager();
        $qb = $em->createQueryBuilder();
        $headers = $request->getHeader('Authorization');
        $token = '';
        foreach($headers as $item){
            if(preg_match('/Bearer/', $item)){
                $token = explode(' ', $item)[1] ?? '';		
                $token = substr(preg_replace('/[^A-Za-z0-9]/', '', $token),0,128);
            }
        }

        $istokenValid = $qb->select('u')
        ->from('Users', 'u')
        ->where('u.token = :token')
        ->andWhere('u.tokenexpiredate >= :tokenexpiredate')
        ->setParameters([
            'token' => $token,
            'tokenexpiredate' => time(),
        ])
        ->getQuery()
        ->getOneOrNullResult();

        if(!$token || !$istokenValid){
            return $response->withJson(['error' => [ 'message' => 'Unauthorised']])->withStatus(401);
        }
        return $next($request, $response);
    }
}

return function (App $app) {
    
    $app->group('/users', function () use ($app) {
        $app->post('/authenticate', UsersController::class . ':authenticate');
        $app->get('/logout', UsersController::class . ':logout');
    });

    $app->group('/users', function () use ($app) {
        $app->get('', UsersController::class . ':usersGet');
        $app->put('', UsersController::class . ':userAdd');
        $app->delete('/{id}', UsersController::class . ':userDelete');
        $app->put('/{id}', UsersController::class . ':userEdit');
        $app->get('/clear', UsersController::class . ':usersClear');
    })->add('Auth');

    $app->group('/balance', function () use ($app) {
        $app->get('', ApiController::class . ':balanceGet');
        $app->put('', ApiController::class . ':balanceAdd');
        $app->delete('/{id}', ApiController::class . ':balanceDelete');
        $app->put('/{id}', ApiController::class . ':balanceEdit');
        $app->get('/clear', ApiController::class . ':balanceClear');
    })->add('Auth');
    $app->get('/test/{id}', ApiController::class . ':test');
    
};
