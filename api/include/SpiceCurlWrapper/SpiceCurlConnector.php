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

    /**
     * This function processes a curl request.
     * It sets up the request in the CurlHandle,
     * logs the request in the API log (unless it's disabled),
     * executes the request,
     * generates a response object with response, errors and info,
     * closes the curl handle (unless it's disabled by the flag $closeAtFinish).
     *
     * @param bool $closeAtFinish
     * @return SpiceCurlResponse
     * @throws \Exception
     */
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

    /**
     * Closes the curl handle connection.
     * Mainly useful for the request which had the $closeAtFinish flag set to false.
     *
     * @return void
     */
    public function closeConnection(): void
    {
        curl_close($this->curl);
    }

    /**
     * Generates a response object with response, errors and info.
     *
     * @param string|bool $response
     * @param string $errors
     * @param mixed $info
     * @return SpiceCurlResponse
     */
    private function generateResponse(string|bool $response, string $errors, mixed $info): SpiceCurlResponse
    {
        return new SpiceCurlResponse($response, $errors, $info);
    }
}