<?php

class configHandler
{

    static function getSites()
    {
        $sites = array();

        $configDriHandler = opendir("../config/sites");
        if ($configDriHandler) {
            while (false !== ($configFile = readdir($configDriHandler))) {
                if (preg_match('/.conf$/', $configFile)) {
                    $string = file_get_contents("../config/sites/$configFile");
                    $site = json_decode($string, true);
                    if (is_array($site))
                        if ($site['proxy']) {
                            $site['backendUrl'] = 'proxy/' . $site['id'];
                        }
                    $sites[] = $site;
                }
            }
        }

        return $sites;
    }

    static function getSite($siteid)
    {
        $configDriHandler = opendir("../config/sites");
        if ($configDriHandler) {
            while (false !== ($configFile = readdir($configDriHandler))) {
                if (preg_match('/.conf$/', $configFile)) {
                    $string = file_get_contents("../config/sites/$configFile");
                    $site = json_decode($string, true);
                    if (is_array($site) && $site['id'] == $siteid) {
                        return $site;
                    }
                }
            }
        }

        return false;
    }

    static function setSite($siteDetails)    {
        $configDriHandler = opendir("../config/sites");
        if (!$configDriHandler) {
            mkdir('../config/sites', 0755, true);
            $configDriHandler = opendir("../config/sites");
        }

        if(!$configDriHandler){
            return false;
        }

        $confFileName = $siteDetails['id'] . '.conf';

        $confFile = fopen("../config/sites/$confFileName", "w");
        fwrite($confFile, json_encode(array(
            'id' => $siteDetails['id'],
            'display' => $siteDetails['display'],
            'backendUrl' => $siteDetails['backendUrl'],
            'proxy' => $siteDetails['proxy'] == 1 ? true : false,
            'developerMode' => $siteDetails['developerMode'] == 1 ? true : false,
            'loginProgressBar' => $siteDetails['loginProgressBar'] == 1 ? true : false,
            'allowForgotPass' => $siteDetails['allowForgotPass'] == 1 ? true : false,
            'autoLogout' => 0,
        )));
        fclose($confFile);

        $string = file_get_contents("../config/sites/$confFileName");
        return json_decode($string, true);

    }

    static function getGeneralConfig() {
        $generalConfig = (object)array();
        $filepath = '../config/general/general.conf';
        if ( is_file( $filepath ) and is_readable( $filepath ))
            $generalConfig = json_decode( file_get_contents( $filepath ), true );
        return $generalConfig;
    }

}
