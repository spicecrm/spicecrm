<?php

namespace SpiceCRM\modules\EmailTrackingActions;

use SpiceCRM\includes\SugarObjects\SpiceConfig;

class EmailTracking
{

    /**
     * attach an element to the email body
     * @param string $element
     * @param string $body
     * @return string
     */
    public static function attachElementToBody(string $element, string $body): string
    {
        if (strpos($body, '</body>')) {
            return str_replace('</body>', "$element</body>", $body);
        } else {
            return $body . $element;
        }
    }

    /**
     * encodes the tracking ID
     *
     * @param $trackingData
     * @return string
     */
    static function encodeTrackingID($trackingData){
        $key = SpiceConfig::getInstance()->get('emailtracking.blowfishkey') ?? "2fs5uhnjcnpxcpg9";
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
        $key = SpiceConfig::getInstance()->get('emailtracking.blowfishkey') ?? "2fs5uhnjcnpxcpg9";
        return openssl_decrypt(base64_decode(urldecode($trackingData)), 'blowfish', $key);
    }


    /**
     * generates the source URL for the tracking Image
     *
     * @param $trackingData
     * @return array|mixed|string|string[]|null
     */
    static function getTrackingPixelSrc($trackingData){
        $url = SpiceConfig::getInstance()->get('emailtracking.tracking_pixel_url');
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
        return '<img style="visibility: hidden" src="' . self::getTrackingPixelSrc($trackingData) . '" alt="emailrefid_' . self::encodeTrackingID($trackingData) . '_" height="1" width="1">';
    }


    /**
     * generates the tracking pixel image
     *
     * @param $trackingData
     * @return string
     */
    static function getUnsubscribeURL($email){
        $url = SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl');
        if($url){
            return str_replace('{refid}', self::encodeTrackingID('Emails:' . $email->id), $url);
        }
        return false;
    }

}