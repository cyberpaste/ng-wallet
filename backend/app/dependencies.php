<?php

use Slim\App;

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Driver\AnnotationDriver;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Common\Annotations\AnnotationRegistry;

return function (App $app) {
    $container = $app->getContainer();

    $container['db'] = function ($c) {
        $settings = $c->get('settings')['db'];
        $paths = array(__DIR__ . '/app/entities');
        $isDevMode = false;
        $config = Setup::createConfiguration($isDevMode);
        $driver = new AnnotationDriver(new AnnotationReader(), $paths);
        AnnotationRegistry::registerLoader('class_exists');
        $config->setMetadataDriverImpl($driver);
        $em = EntityManager::create($settings, $config);
        $helperSet = new \Symfony\Component\Console\Helper\HelperSet(array(
            'db' => new \Doctrine\DBAL\Tools\Console\Helper\ConnectionHelper($em->getConnection()),
            'em' => new \Doctrine\ORM\Tools\Console\Helper\EntityManagerHelper($em)
        ));
        return $helperSet;
    };

    $container['errorHandler'] = function ($c) {
        return function ($request, $response, $exception) use ($c) {
            return $response->withStatus(500)
                    ->withHeader('Content-Type', 'text/html')
                    ->write('Something went wrong!' . $exception->getMessage());
        };
    };

    $container['notFoundHandler'] = function ($c) {
        return function ($request, $response) use ($c) {
            return $response->withJson([ 'message' => 'Page not found'])
                    ->withStatus(404);
        };
    };
};

