<?php

namespace SpiceCRM\includes\DataStreams\interfaces;

interface StreamWrapperRegisterI
{
    /**
     * handle registering the stream wrapper
     * set the streamName from the $name param
     * @param string $name
     * @param object|null $config
     */
    public static function register(string $name, ?object $config = null);
}