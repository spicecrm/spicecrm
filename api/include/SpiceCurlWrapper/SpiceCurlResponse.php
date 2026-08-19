<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

class SpiceCurlResponse
{
    /**
     * The return value of the curl_exec function.
     *
     * @var string|bool
     */
    private string|bool $response;

    /**
     * The return value of the curl_error function.
     *
     * @var string
     */
    private string $errors;

    /**
     * The return value of the curl_getinfo function.
     *
     * @var mixed
     */
    private mixed $info;

    /**
     * Constant for Content type JSON
     */
    public const CONTENT_TYPE_JSON = 'application/json';

    public function __construct(string|bool $response, string $errors, mixed $info)
    {
        $this->response = $response;
        $this->errors   = $errors;
        $this->info     = $info;
    }

    /**
     * Getter for the response.
     *
     * @return string|bool
     */
    public function getRawResponse(): string|bool
    {
        return $this->response;
    }

    /**
     * Getter for the errors.
     *
     * @return string
     */
    public function getErrors(): string
    {
        return $this->errors;
    }

    /**
     * Getter for the info.
     *
     * @return mixed
     */
    public function getInfo(): mixed
    {
        return $this->info;
    }

    /**
     * Getter for the HTTP Code of the response.
     *
     * @return int
     */
    public function getHttpCode(): int
    {
        if (isset($this->info['http_code'])) {
            return (int) $this->info['http_code'];
        }

        return 0;
    }

    /**
     * Getter for the response header size.
     *
     * @return int
     */
    public function getHeaderSize(): int
    {
        if (isset($this->info['header_size'])) {
            return (int) $this->info['header_size'];
        }

        return 0;
    }

    /**
     * Getter for the response content type
     *
     * @return string
     */
    public function getContentType(): string
    {
        if (isset($this->info['content_type'])) {
            return $this->info['content_type'];
        }

        return '';
    }

    /**
     * Checks if the response content type is JSON.
     *
     * @return bool
     */
    public function isJson(): bool
    {
        return strpos($this->getContentType(),  self::CONTENT_TYPE_JSON) === 0;
    }

    /**
     * Returns the cURL response as a JSON decoded array or object if possible.
     * Otherwise, it returns the original response.
     *
     * @param bool $assoc
     * @return array|bool|string|null
     */
    public function getResponse(bool $assoc = true): array|bool|string|null
    {
        $decoded = json_decode($this->response, $assoc);

        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        return $this->response;
    }

    /**
     * Returns the cURL response as a JSON decoded array if possible.
     * Otherwise, it returns the original response.
     *
     * @return array|null
     */
    public function getResponseArray(): ?array
    {
        return $this->getResponse(true);
    }

    /**
     *  Returns the cURL response as a JSON decoded object or array if possible.
     *  Otherwise, it returns the original response.
     *
     * @return object|array|null
     */
    public function getResponseObject(): object|array|null
    {
        return $this->getResponse(false);
    }

    /**
     * Returns the curl response excluding the header.
     *
     * @return string|bool
     */
    public function getRawResponseBody(): string|bool
    {
        return substr($this->getRawResponse(), $this->getHeaderSize());
    }

    /**
     * Returns the cURL response excluding the headers as a JSON decoded array if possible.
     * Otherwise, it returns the original response.
     *
     * @return array|null
     */
    public function getResponseBody(): ?array
    {
        $responseWithoutHeader = $this->getRawResponseBody();
        $decoded = json_decode($responseWithoutHeader, true);

        if (json_last_error() === JSON_ERROR_NONE) {
            return $decoded;
        }

        return $responseWithoutHeader;
    }

    /**
     * Returns the response header without the response body.
     *
     * @return string|bool
     */
    public function getRawHeader(): string|bool
    {
        return substr($this->getRawResponse(), 0, $this->getHeaderSize());
    }
}
