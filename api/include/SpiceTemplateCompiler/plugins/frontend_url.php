<?php
namespace SpiceCRM\includes\SpiceTemplateCompiler\plugins;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

function frontend_url()
{
    
    $frontend_url = SpiceConfig::getInstance()->config['frontend_url'];
    if(substr($frontend_url, -1) == "/")
        $frontend_url = substr($frontend_url, 0, (strlen($frontend_url) -1));
    return $frontend_url;
}