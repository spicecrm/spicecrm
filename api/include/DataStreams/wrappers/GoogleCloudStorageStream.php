<?php

namespace SpiceCRM\includes\DataStreams\wrappers;

use Google\Cloud\Storage\StorageClient;
use SpiceCRM\includes\DataStreams\interfaces\StreamWrapperRegisterI;

/**
 * implement google storage stream
 */
class GoogleCloudStorageStream implements StreamWrapperRegisterI
{
    /**
     * handle registering the stream wrapper
     * set the streamName from the $name param
     * @param string $name
     * @param object|null $config
     */
    public static function register(string $name, ?object $config = null): void
    {
        $storage = new StorageClient([
            'keyFile' => (array) $config,
        ]);

        $storage->registerStreamWrapper($name);
    }
}