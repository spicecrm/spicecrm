<?php

namespace SpiceCRM\modules\Administration\api\controllers;

use ReflectionClass;
use ReflectionMethod;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class AdminPHPClassController
{
    public static function checkClass(Request $req, Response $res, array $args): Response {
        $class = base64_decode($args['class']);
        $classExists = class_exists($class);
        $publicMethods = [];
        if ($classExists) {
            $class = new ReflectionClass($class);
            $methods = $class->getMethods(ReflectionMethod::IS_PUBLIC);
            foreach($methods as $method)
                $publicMethods[] = $method->name;
        }

        return $res->withJson(['classexists' => $classExists, 'methods' => $publicMethods]);
    }
}