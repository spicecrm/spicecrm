<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

use Psr\Http\Message\ServerRequestInterface;

class SpiceCurlWrapper
{
    public function newRequest($url): ServerRequestInterface
    {
        $request = new SpiceCurlRequest();

        return $request;
    }
}