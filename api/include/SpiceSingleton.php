<?php

namespace SpiceCRM\includes;

abstract class SpiceSingleton
{
    /**
     * the instances for the singleton pattern
     *
     * @var
     */
    private static array $instances = [];


    protected function __construct() {}

    final protected function __clone(): void {}

    /**
     * @return static
     */
    final public static function getInstance(): static
    {
        return self::$instances[static::class] ??= new static();
    }

    final public function __serialize(): array
    {
        throw new \LogicException(static::class . ' cannot be serialized');
    }

    final public function __unserialize(array $data): void
    {
        throw new \LogicException(static::class . ' cannot be unserialized');
    }
}