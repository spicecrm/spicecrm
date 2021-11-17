<?php
namespace SpiceCRM\includes\utils;

use SpiceCRM\modules\Roles\Role;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class SecurityUtils
{
    public static function queryUserHasRoles($userId) {
        $role = new Role();

        return $role->check_user_role_count($userId);
    }

    public static function getUserAllowedModules($userId): array {
        $role = new Role();

        return $role->query_user_allowed_modules($userId);
    }

    /**
     * grabs client ip address and returns its value
     *
     * @return false|mixed
     */
    public static function queryClientIp() {
        global $_SERVER;
        $clientIP = false;
        if (!empty(SpiceConfig::getInstance()->config['ip_variable']) &&
            !empty($_SERVER[SpiceConfig::getInstance()->config['ip_variable']])) {
            $clientIP = $_SERVER[SpiceConfig::getInstance()->config['ip_variable']];
        } elseif (isset($_SERVER['HTTP_CLIENT_IP'])) {
            $clientIP = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR']) AND
            preg_match_all('#\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}#s', $_SERVER['HTTP_X_FORWARDED_FOR'], $matches)) {
            // check for internal ips by looking at the first octet
            foreach ($matches[0] AS $ip) {
                if (!preg_match("#^(10|172\.16|192\.168)\.#", $ip)) {
                    $clientIP = $ip;
                    break;
                }
            }
        } elseif (isset($_SERVER['HTTP_FROM'])) {
            $clientIP = $_SERVER['HTTP_FROM'];
        } else {
            $clientIP = $_SERVER['REMOTE_ADDR'];
        }
        return $clientIP;
    }
}