<?php

namespace SpiceCRM\modules\EmailTrackingActions;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

class EmailTracking
{
    /**
     * encodes the tracking ID
     *
     * @param $trackingData
     * @return string
     */
    static function encodeTrackingID($trackingData){
        $key = SpiceConfig::getInstance()->get('emailtracking.blwofishkey');
        $data = $trackingData;
        if($key){
            return urlencode(base64_encode(openssl_encrypt($data, 'blowfish', $key)));
        } else {
            return urlencode(base64_encode($data));
        }

    }

    /**
     * decodes the tracking ID
     *
     * @param $trackingData
     * @return false|string
     */
    static function decodeTrackingID($trackingData){
        $key = SpiceConfig::getInstance()->get('emailtracking.blwofishkey');
        if($key) {
            return openssl_decrypt(base64_decode(urldecode($trackingData)), 'blowfish', $key);
        } else {
            return base64_decode(urldecode($trackingData));
        }
    }


    /**
     * generates the source URL for the tracking Image
     *
     * @param $trackingData
     * @return array|mixed|string|string[]|null
     */
    static function getTrackingPixelSrc($trackingData){
        $url = SpiceConfig::getInstance()->get('emailtracking.trackingurl');
        if($url){
            $url = str_replace('{refid}', self::encodeTrackingID($trackingData), $url);
        }
        return $url;
    }

    /**
     * generates the tracking pixel image
     *
     * @param $trackingData
     * @return string
     */
    static function getTrackingPixel($trackingData){
        return '<img src="' . self::getTrackingPixelSrc($trackingData) . '" height="1" width="1">';
    }

}