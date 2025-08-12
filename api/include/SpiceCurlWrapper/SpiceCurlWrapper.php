<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

class SpiceCurlWrapper
{
    /**
     * Creates a new curl request.
     *
     * @param string $url
     * @param string $method
     * @return SpiceCurlRequest
     */
    public static function newRequest(string $url, string $method): SpiceCurlRequest
    {
        $request = new SpiceCurlRequest($url, $method);

        return $request;
    }

    /**
     * Creates a new get request.
     *
     * @param string $url
     * @return SpiceCurlRequest
     */
    public static function getRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_GET);
    }

    /**
     * Creates a new post request.
     *
     * @param string $url
     * @return SpiceCurlRequest
     */
    public static function postRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_POST);
    }

    /**
     * Creates a new put request.
     *
     * @param string $url
     * @return SpiceCurlRequest
     */
    public static function putRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_PUT);
    }

    /**
     * Creates a new patch request.
     *
     * @param string $url
     * @return SpiceCurlRequest
     */
    public static function patchRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_PATCH);
    }

    /**
     * Creates a new delete request.
     *
     * @param string $url
     * @return SpiceCurlRequest
     */
    public static function deleteRequest(string $url): SpiceCurlRequest
    {
        return self::newRequest($url, SpiceCurlRequest::REQUEST_DELETE);
    }
}