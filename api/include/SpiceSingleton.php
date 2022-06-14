<?php

namespace SpiceCRM\includes;

abstract class SpiceSingleton
{
    /**
     * the instance for the singleton pattern
     *
     * @var
     */
    protected static $instance = null;

    final protected function __construct() {}

    final protected function __clone() {}

    /**
     * @return static
     */
    final public static function getInstance(): self {
        static $instances = [];
        $calledClass = get_called_class();
        if(!isset($instances[$calledClass])){
            $instances[$calledClass] = new $calledClass();
        }
        return $instances[$calledClass];
    }
}