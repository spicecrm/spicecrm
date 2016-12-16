<?php

/* 
 * Copyright notice
 * 
 * (c) 2014 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

require 'vendor/autoload.php';

spl_autoload_register(function($className) {
    
    $prefix = 'TRBusinessConnector';
    $len = strlen($prefix);
    if (strncmp($prefix, $className, $len) !== 0) {
        return false;
    }
    $basePath = __DIR__;    
    $relativeClass = substr($className, $len);
    $file = $basePath . str_replace('\\', DIRECTORY_SEPARATOR, $relativeClass) . '.php';
    return (file_exists($file) ? require $file : false);
});
