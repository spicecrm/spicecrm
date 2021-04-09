<?php
namespace SpiceCRM\modules\SystemDeploymentPackages;

class SystemDeploymentPackageSource
{
    /** @var string used when no entry is set in sysuipackagerepositories table */
    public static $public_source = 'https://spicecrmrelease.spicecrm.io/proxy/000/';


    /**
     * used by SpiceUILoader & SpiceInstaller
     * @return string
     */
    public static function getPublicSource(){
        $add = '';
        if(substr(self::$public_source, -1) != '/'){
            $add = '/';
        }
        return self::$public_source.$add;
    }


}
