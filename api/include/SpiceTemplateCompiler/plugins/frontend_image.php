<?php
namespace SpiceCRM\includes\SpiceTemplateCompiler\plugins;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

function frontend_image()
{
    
    $frontend_url = SpiceConfig::getInstance()->config['frontend_url'];
    if(substr($frontend_url, -1) == "/")
        $frontend_url = substr($frontend_url, 0, (strlen($frontend_url) -1));


    return "<img class=\"frontend_image\" src=\"$frontend_url/config/loginimage\">";

    return $frontend_url;
}
