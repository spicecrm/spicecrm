<?php

namespace SpiceCRM\includes\DataStreams;

use Exception;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\DataStreams\wrappers\UploadStream;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceSingleton;

class StreamFactory extends SpiceSingleton
{
    /**
     * holds the streams data
     * @var array
     */
    private static array $streams = [
        'upload' => [
            'name' => 'upload',
            'class_namespace' => UploadStream::class,
            'config' => null
        ]
    ];

    /**
     * load the streams data from the database
     * @throws Exception
     */
    public static function initialize(): void
    {
        $db = DBManagerFactory::getInstance();

        if($db->tableExists('sysdatastreams') && $query = $db->query("SELECT * FROM sysdatastreams")){
            while ($stream = $db->fetchByAssoc($query)) {
                if (empty($stream['name']) || empty($stream['class_namespace'])) continue;
                $stream['config'] = json_decode($stream['config']);
                self::$streams[$stream['name']] = $stream;
            }
        }

        if (empty(self::$streams['upload'])) {
            UploadStream::register('upload');
        }
    }

    /**
     * call the register method on the wrapper class if it was not registered
     * get the path prefix by the given stream alias
     * @param string $name
     * @return string
     */
    public static function getPathPrefix(string $name): ?string
    {
        if (!self::$streams[$name]) {
            LoggerManager::getLogger()->warn("StreamFactory: No configuration found for $name");
            return null;
        }

        self::register($name);

        return self::$streams[$name]['name'] . "://" . self::$streams[$name]['config']->path;
    }

    /**
     * handle registering the stream wrapper
     * @param string $name
     * @return void
     */
    private static function register(string $name): void
    {
        if (in_array(self::$streams[$name]['name'], stream_get_wrappers())) return;

        $className = self::$streams[$name]['class_namespace'];

        $classInstance = new $className();

        if (!method_exists($classInstance, 'register')) {
            LoggerManager::getLogger()->error("Class: $className must have ( register ) method. Checkout StreamWrapperI for more details.");
            return;
        }

        $classInstance->register($name, self::$streams[$name]['config']->class_config);
    }

    /**
     * returns the streams array
     * @return array
     */
    public function getStreams()
    {
        if (self::$streams)
            return self::$streams;
        else {
            return [];
        }
    }

    /**
     * returns stats for the stream based on specific implementations for the streamhandler
     *
     * @param string $name
     * @return int[]|void
     */
    public static function getStats(string $name){
        $className = self::$streams[$name]['class_namespace'];

        $classInstance = new $className();

        if (!method_exists($classInstance, 'register')) {
            LoggerManager::getLogger()->error("Class: $className must have ( register ) method. Checkout StreamWrapperI for more details.");
            return;
        }

        return method_exists($classInstance, 'getStats') ? $classInstance->getStats($name, self::$streams[$name]['config']->class_config, self::$streams[$name]['config']->path) : ['size' => 0, 'count' => 0];
    }

}