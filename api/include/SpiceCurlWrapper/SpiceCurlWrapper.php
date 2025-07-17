<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

class SpiceCurlWrapper
{
    public static function newRequest(string $url, string $method): SpiceCurlRequest
    {
        $request = new SpiceCurlRequest($url, $method);

        return $request;
    }

    public static function getRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_GET);
    }

    public static function postRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_POST);
    }

    public static function putRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_PUT);
    }

    public static function patchRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_PATCH);
    }

    public static function deleteRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_DELETE);
    }
}