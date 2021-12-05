<?php

namespace SpiceCRM\includes;

class SpiceSingleton
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
    public static function getInstance(): self {
        if (self::$instance === null) {
            //set instance
            self::$instance = new self;
        }
        return self::$instance;
    }
}