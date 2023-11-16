<?php

namespace SpiceCRM\modules\EmailTrackingActions;

use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\Emails\Email;

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
     * @param $trackingData string must have the following syntax "ParentType:$parentType:ParentId:$parentId"
     * @return string
     */
    static function encodeTrackingID(string $trackingData): string
    {
        $key = SpiceConfig::getInstance()->get('emailtracking.blowfishkey') ?? "2fs5uhnjcnpxcpg9";

        if($key){
            return urlencode(base64_encode(openssl_encrypt($trackingData, 'blowfish', $key)));
        } else {
            return urlencode(base64_encode($trackingData));
        }

    }

    /**
     * decodes the tracking ID
     *
     * @param $trackingData
     * @return array
     */
    static function decodeTrackingID($trackingData): ?array
    {
        $key = SpiceConfig::getInstance()->get('emailtracking.blowfishkey') ?? "2fs5uhnjcnpxcpg9";

        if (!$key) {
            $decrypted = base64_decode(urldecode($trackingData));
        } else {
            $decrypted = openssl_decrypt(base64_decode(urldecode($trackingData)), 'blowfish', $key);;
        }

        if (!$decrypted) return null;

        $chunks = array_chunk(preg_split('/(:|:)/', $decrypted), 2);
        return array_combine(array_column($chunks, 0), array_column($chunks, 1));
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
     * @param Email $email
     * @return string
     */
    static function getUnsubscribeURL(Email $email){
        $url = SpiceConfig::getInstance()->get('emailtracking.unsubscribeurl');

        [$parentType, $parentId] = $email->getTrackingParentData();

        if($url){
            return str_replace('{refid}', self::encodeTrackingID("ParentType:$parentType:ParentId:$parentId"), $url);
        }
        return false;
    }

}