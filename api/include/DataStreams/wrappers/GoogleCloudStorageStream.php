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

    /**
     * @param string $name
     * @param object|null $config
     * @param $path
     * @return int[]
     * @throws \Google\Cloud\Core\Exception\GoogleException
     *
     * gets the stats
     */
    public function getStats(string $name, ?object $config = null, $path){

        $size = 0;
        $count = 0;

        $storage = new StorageClient([
            'keyFile' => (array) $config
        ]);

        // first part of the path is the bucketname
        $pathParts = explode('/', $path);

        $buckets = $storage->buckets();
        foreach($buckets as $bucket){
            if($bucket->info()['name'] == $pathParts[0]){
                // further parts of the name are the subdir names if set
                unset($pathParts['0']);
                $dirName = implode('/', $pathParts);

                // get objects and itarate
                $objects = iterator_to_array($storage->buckets())[0]->objects(['prefix' => $dirName]);
                foreach($objects as $key => $info) {
                    $count++;
                    $size += (int)$info->info()['size'];
                }

                // leav the loop
                break;
            }
        }

        // return the results
        return ['size' => $size, 'count' => $count];
    }
}