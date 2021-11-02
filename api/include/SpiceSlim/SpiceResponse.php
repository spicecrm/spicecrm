<?php
namespace SpiceCRM\includes\SpiceSlim;

use Slim\Psr7\Response as BaseResponse;
use SpiceCRM\includes\ErrorHandlers\Exception;

class SpiceResponse extends BaseResponse
{
    /**
     * Json.
     *
     * Note: This method is not part of the PSR-7 standard.
     *
     * This method prepares the response object to return an HTTP Json
     * response to the client.
     *
     * Added in order to keep backwards compatibility with the function of the same name from Slim 3.
     *
     * @param $data
     * @param null $status
     * @param int $encodingOptions
     * @return SpiceResponse
     */
    public function withJson($data, $status = null, $encodingOptions = JSON_INVALID_UTF8_IGNORE): SpiceResponse {
        $json = json_encode($data, $encodingOptions);

        // Ensure that the json encoding passed successfully
        if ($json === false) {
            throw new \RuntimeException(json_last_error_msg());
        }
        $this->getBody()->write($json);

        $responseWithJson = $this->withHeader('Content-Type', 'application/json;charset=utf-8');
        if (isset($status)) {
            return $responseWithJson->withStatus($status);
        }
        return $responseWithJson;
    }
}
