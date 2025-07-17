<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

use \CurlHandle;
use SpiceCRM\includes\Logger\APILogEntryHandler;

class SpiceCurlConnector
{
    private CurlHandle $curl;

    private SpiceCurlRequest $request;

    public function __construct(SpiceCurlRequest $request)
    {
        $this->request = $request;
        $this->curl    = curl_init();
    }

    public function process(bool $closeAtFinish = true): SpiceCurlResponse
    {
        $curlOptions = $this->request->getOptions();

        if ($this->request->loggingEnabled()) {
            $logEntryHandler = new APILogEntryHandler();
            $logEntryHandler->generateOutgoingLogEntry($curlOptions, $this->request->getLoggedRoute());
            $logEntryHandler->writeOutogingLogEntry();
        }

        curl_setopt_array($this->curl, $curlOptions);

        $response = curl_exec($this->curl);
        $errors = curl_error($this->curl);
        $info = curl_getinfo($this->curl);

        if ($this->request->loggingEnabled()) {
            $logEntryHandler->updateOutgoingLogEntry($this->curl, $response);
        }

        if ($closeAtFinish) {
            curl_close($this->curl);
        }

        return $this->generateResponse($response, $errors, $info);
    }

    public function closeConnection(): void
    {
        curl_close($this->curl);
    }

    private function generateResponse(string|bool $response, string $errors, mixed $info): SpiceCurlResponse
    {
        return new SpiceCurlResponse($response, $errors, $info);
    }
}