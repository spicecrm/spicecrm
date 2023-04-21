<?php

namespace SpiceCRM\modules\EmailTrackingActions;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

class EmailTracking
{
    static function encodeTrackingID($trackingData){
        $key = SpiceConfig::getInstance()->get('emailtracking.blwofishkey');
        $data = $trackingData;
        if($key){
            return urlencode(base64_encode(openssl_encrypt($data, 'blowfish', $key)));
        } else {
            return urlencode(base64_encode($data));
        }

    }

    static function decodeTrackingID($trackingData){
        $key = SpiceConfig::getInstance()->get('emailtracking.blwofishkey');
        if($key) {
            return openssl_decrypt(base64_decode(urldecode($trackingData)), 'blowfish', $key);
        } else {
            return base64_decode(urldecode($trackingData));
        }
    }


    static function getTrackingPixelSrc($trackingData){
        $url = SpiceConfig::getInstance()->get('emailtracking.trackingurl');
        if($url){
            $url = str_replace('{refid}', self::encodeTrackingID($trackingData), $url);
        }
        return $url;
    }

}