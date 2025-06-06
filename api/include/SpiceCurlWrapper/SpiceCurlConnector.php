<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use \CurlHandle;

class SpiceCurlConnector
{
    private CurlHandle $curl;

    public function __construct()
    {
        $this->curl = curl_init();
    }

    public function process(ServerRequestInterface $request): ResponseInterface
    {
        curl_setopt_array($this->curl, $this->generateOptions());

        $response = curl_exec($this->curl);
        $errors = curl_error($this->curl);
        $info = curl_getinfo($this->curl);

        curl_close($this->curl);

        return $this->generateResponse($response, $errors, $info);
    }

    private function generateOptions(): array
    {
        return [];
    }

    private function generateResponse(string|bool $response, string $errors, mixed $info): SpiceCurlResponse
    {
        return new SpiceCurlResponse();
    }
}