<?php
namespace SpiceCRM\includes\utils;

use Crypt_Blowfish;

class EncryptionUtils
{
    /**
     * retrives the system's private key; will build one if not found, but anything encrypted before is gone...
     * @param string type
     * @return string key
     */
    public static function blowfishGetKey($type): string {
        $key = [];

        $type = str_rot13($type);

        $keyCache = "custom/blowfish/{$type}.php";

        // build cache dir if needed
        if (!file_exists('custom/blowfish')) {
            FileUtils::mkdirRecursive('custom/blowfish');
        }

        // get key from cache, or build if not exists
        if (file_exists($keyCache)) {
            include($keyCache);
        } else {
            // create a key
            $key[0] = SpiceUtils::createGuid();
            FileUtils::writeArrayToFile('key', $key, $keyCache);
        }
        return $key[0];
    }

    /**
     * Uses blowfish to encrypt data and base 64 encodes it. It stores the iv as part of the data
     * @param STRING key - key to base encoding off of
     * @param STRING data - string to be encrypted and encoded
     * @return string
     */
    public static function blowfishEncode($key, $data): string {
        $bf = new Crypt_Blowfish($key);
        $encrypted = $bf->encrypt($data);
        return base64_encode($encrypted);
    }

    /**
     * Uses blowfish to decode data assumes data has been base64 encoded with the iv stored as part of the data
     * @param STRING key - key to base decoding off of
     * @param STRING encoded base64 encoded blowfish encrypted data
     * @return string
     */
    public static function blowfishDecode($key, $encoded): string {
        $data = base64_decode($encoded);
        $bf = new Crypt_Blowfish($key);
        return trim($bf->decrypt($data));
    }
}