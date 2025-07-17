<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

class SpiceCurlResponse
{
    private string|bool $response;

    private string $errors;

    private mixed $info;

    public function __construct(string|bool $response, string $errors, mixed $info)
    {
        $this->response = $response;
        $this->errors   = $errors;
        $this->info     = $info;
    }

    public function getResponse(): string|bool
    {
        return $this->response;
    }

    public function getErrors(): string
    {
        return $this->errors;
    }

    public function getInfo(): mixed
    {
        return $this->info;
    }

    public function getHttpCode(): int
    {
        if (isset($this->info['http_code'])) {
            return (int) $this->info['http_code'];
        }

        return 0;
    }

    public function getHeaderSize(): int
    {
        if (isset($this->info['header_size'])) {
            return (int) $this->info['header_size'];
        }

        return 0;
    }

    public function getContentType(): string
    {
        if (isset($this->info['content_type'])) {
            return $this->info['content_type'];
        }

        return '';
    }
}