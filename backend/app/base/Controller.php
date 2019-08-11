<?php

namespace App\Base;

use Slim\Http\Request;
use Slim\Http\Response;
use Psr\Container\ContainerInterface;

abstract class Controller {

    protected $container;

    public function __construct(ContainerInterface $container) {
        $this->container = $container;
    }

    public function __invoke(Request $request, Response $response, $args) {
        return $response;
    }

}
