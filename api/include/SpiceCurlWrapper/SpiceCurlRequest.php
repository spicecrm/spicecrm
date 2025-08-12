<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

class SpiceCurlRequest
{
    /**
     * @var string target URL
     */
    private string $url;

    /**
     * @var string HTTP method
     */
    private string $method;

    /**
     * @var string|null an alias/name of the route to be used for logging. the actual URL is used if the alias is not set.
     */
    private ?string $routeAlias;

    /**
     * @var bool a flag for force setting the content length in the request header.
     */
    private bool $forceContentLength = false;

    /**
     * @var bool a flag for using the JSON_FORCE_OBJECT setting when json encoding the post fields.
     */
    private ?bool $forceJsonObject;

    /**
     * @var bool a flag for disabling logging.
     */
    private bool $forceDisableLogger = false;

    /**
     * @var array|null CURLOPT_POSTFIELDS the POST request payload.
     */
    private ?array $postFields;

    /**
     * @var array An array with the curl options stored. The keys are the curl constants e.g. CURLOPT_PORT
     */
    private array $rawOptions = [];

    /**
     * @var array An array with the request headers stored. Any string is allowed to be a header (due to custom headers in APIs).
     * The most common header names are stored in the HEADER_XYZ constants.
     */
    private array $rawHeaders = [];

    private array $allowedOptions = [
        'headerOut'      => CURLINFO_HEADER_OUT,
        'connectTimeout' => CURLOPT_CONNECTTIMEOUT,
        'encoding'       => CURLOPT_ENCODING,
        'failOnError'    => CURLOPT_FAILONERROR,
        'followLocation' => CURLOPT_FOLLOWLOCATION,
        'header'         => CURLOPT_HEADER,
        'httpAuth'       => CURLOPT_HTTPAUTH,
        'httpVersion'    => CURLOPT_HTTP_VERSION,
        'maxRedirects'   => CURLOPT_MAXREDIRS,
        'port'           => CURLOPT_PORT,
        'post'           => CURLOPT_POST,
        'postFields'     => CURLOPT_POSTFIELDS,
        'returnTransfer' => CURLOPT_RETURNTRANSFER,
        'sslVerifyHost'  => CURLOPT_SSL_VERIFYHOST,
        'sslVerifyPeer'  => CURLOPT_SSL_VERIFYPEER,
        'timeout'        => CURLOPT_TIMEOUT,
        'timeoutMs'      => CURLOPT_TIMEOUT_MS,
        'userAgent'      => CURLOPT_USERAGENT,
        'userPassword'   => CURLOPT_USERPWD,
        'verbose'        => CURLOPT_VERBOSE,
    ];


    /**
     * Most common headers.
     */
    public const HEADER_ACCEPT = 'Accept';

    public const HEADER_ACCEPT_ENCODING = 'Accept-Encoding';

    public const HEADER_ACCEPT_LANGUAGE = 'Accept-Language';

    public const HEADER_ALLOW = 'Allow';

    public const HEADER_AUTHORIZATION = 'Authorization';

    public const HEADER_CACHE_CONTROL = 'Cache-Control';

    public const HEADER_CONNECTION = 'Connection';

    public const HEADER_CONTENT_LENGTH = 'Content-Length';

    public const HEADER_CONTENT_TYPE = 'Content-Type';

    public const HEADER_COOKIE = 'Cookie';

    public const HEADER_OAUTH_TOKEN = 'OAuth-Token';

    public const HEADER_OAUTH_ISSUER = 'OAuth-Issuer';

    public const HEADER_PRAGMA = 'Pragma';

    public const HEADER_USER_AGENT = 'User-Agent';

    public const HEADER_X_ACCESS_TOKEN = 'X-Access-Token';

    public const HEADER_X_API_KEY = 'X-API-KEY';

    /**
     * REST method constants.
     */
    public const REQUEST_GET = 'GET';

    public const REQUEST_POST = 'POST';

    public const REQUEST_DELETE = 'DELETE';

    public const REQUEST_PATCH = 'PATCH';

    public const REQUEST_PUT = 'PUT';

    /**
     * Authorization type constants.
     */
    public const AUTHORIZATION_BASIC = 'Basic ';

    public const AUTHORIZATION_BEARER = 'Bearer ';

    public const AUTHORIZATION_TOKEN = 'Token ';

    public const AUTHORIZATION_RAW_KEY = '';

    /**
     * Content types constants for CURLOPT_CONTENT_TYPE.
     */
    public const CONTENT_TYPE_JSON = 'application/json';

    public const CONTENT_TYPE_FORM = 'application/x-www-form-urlencoded';

    public const CONTENT_TYPE_FORM_DATA = 'multipart/form-data';

    public const CONTENT_TYPE_XML = 'application/xml';

    public const CONTENT_RFC822 = 'message/rfc822';

    /**
     * Cache control constants for 'Cache-Control' header.
     */
    public const CACHE_CONTROL_NO_CACHE = 'no-cache';

    /**
     * Connection constants for 'Connection' header.
     */
    public const CONNECTION_KEEP_ALIVE = 'keep-alive';

    /**
     * Accept constants for 'Accept' header.
     */
    public const ACCEPT_ALL = '*/*';

    /**
     * Accept encoding constants for 'Accept-Encoding' header.
     */
    public const ACCEPT_ENCODING_GZIP = 'gzip, deflate';

    /**
     * Encoding constants for 'Encoding' header.
     */
    public const ENCODING_UTF8 = 'UTF-8';

    /**
     * Pragma constants for 'Pragma' header.
     */
    public const PRAGMA_NO_CACHE = 'no-cache';

    public function __construct(string $url, string $method)
    {
        $this->url    = $url;
        $this->method = $method;
    }

    public function setRouteAlias(string $routeAlias): self
    {
        $this->routeAlias = $routeAlias;

        return $this;
    }

    public function setOption(string $optionName, string $optionValue): self
    {
        if (array_key_exists($optionName, $this->allowedOptions)) {
            $this->rawOptions[$this->allowedOptions[$optionName]] = $optionValue;
        }

        return $this;
    }

    public function setRawOption(string $optionName, string $optionValue): self
    {
        $this->rawOptions[$optionName] = $optionValue;

        return $this;
    }

    public function setHeaderOption(string $optionName, string $optionValue): self
    {
        $this->rawHeaders[$optionName] = $optionValue;

        return $this;
    }

    public function setSsl(bool $ssl): self
    {
        $this->rawOptions[CURLOPT_SSL_VERIFYPEER] = $ssl;
        $this->rawOptions[CURLOPT_SSL_VERIFYHOST] = $ssl;

        return $this;
    }

    public function setAuthorization(string $method, string $value): self
    {
        $this->rawHeaders[self::HEADER_AUTHORIZATION] = $method . $value;

        return $this;
    }

    public function setContentType(string $contentType): self
    {
        $this->rawHeaders[self::HEADER_CONTENT_TYPE] = $contentType;

        return $this;
    }

    public function setCookie(string $cookie): self
    {
        $this->rawHeaders[self::HEADER_COOKIE] = $cookie;

        return $this;
    }

    public function setCacheControl(string $cacheControl): self
    {
        $this->rawHeaders[self::HEADER_CACHE_CONTROL] = $cacheControl;

        return $this;
    }

    public function setConnection(string $connection): self
    {
        $this->rawHeaders[self::HEADER_CONNECTION] = $connection;

        return $this;
    }

    public function setAccept(string $accept): self
    {
        $this->rawHeaders[self::HEADER_ACCEPT] = $accept;

        return $this;
    }

    public function setAcceptEncoding(string $encoding): self
    {
        $this->rawHeaders[self::HEADER_ACCEPT_ENCODING] = $encoding;

        return $this;
    }

    public function setPostFields(array $fields): self
    {
        $this->postFields = $fields;

        return $this;
    }

    public function getOptions(): array
    {
        $curlOptions = [];

        $curlOptions[CURLOPT_URL] = $this->url ?? $this->rawOptions[CURLOPT_URL];

        switch ($this->method) {
            case self::REQUEST_POST:
                $curlOptions[CURLOPT_POST]          = true;
                $curlOptions[CURLOPT_CUSTOMREQUEST] = self::REQUEST_POST;
                $curlOptions[CURLOPT_POSTFIELDS]    = $this->generatePostFields();
                break;
            case self::REQUEST_PUT:
                $curlOptions[CURLOPT_CUSTOMREQUEST] = self::REQUEST_PUT;
                $curlOptions[CURLOPT_POSTFIELDS]    = $this->generatePostFields();
                break;
            case self::REQUEST_PATCH:
                $curlOptions[CURLOPT_CUSTOMREQUEST] = self::REQUEST_PATCH;
                $curlOptions[CURLOPT_POSTFIELDS]    = $this->generatePostFields();
                break;
            case self::REQUEST_DELETE:
                $curlOptions[CURLOPT_CUSTOMREQUEST] = self::REQUEST_DELETE;
                break;
            case self::REQUEST_GET:
            default:
                $curlOptions[CURLOPT_CUSTOMREQUEST] = self::REQUEST_GET;
                break;
        }

        $curlOptions[CURLOPT_RETURNTRANSFER] = true;
        if (!empty($this->rawOptions[CURLOPT_RETURNTRANSFER])) {
            $curlOptions[CURLOPT_RETURNTRANSFER] = $this->rawOptions[CURLOPT_RETURNTRANSFER];
        }

        foreach ($this->rawOptions as $optionName => $optionValue) {
            if (!isset($curlOptions[$optionName])) {
                $curlOptions[$optionName] = $optionValue;
            }
        }

        $curlOptions[CURLOPT_HTTPHEADER] = $this->generateHeader();


        return $curlOptions;
    }

    public function getLoggedRoute(): string
    {
        if (!empty($this->routeAlias)) {
            return $this->routeAlias;
        }

        return $this->url;
    }

    public function forceContentLength(): self
    {
        $this->forceContentLength = true;

        return $this;
    }

    public function forceJsonObject(): self
    {
        $this->forceJsonObject = true;

        return $this;
    }

    public function disableLogger(): self
    {
        $this->forceDisableLogger = true;

        return $this;
    }

    public function loggingEnabled(): bool
    {
        return !$this->forceDisableLogger;
    }

    private function generatePostFields(): ?string
    {
        if (!empty($this->rawOptions[CURLOPT_POSTFIELDS])) {
            return $this->rawOptions[CURLOPT_POSTFIELDS];
        }

        switch ($this->rawHeaders[self::HEADER_CONTENT_TYPE]) {
            case self::CONTENT_TYPE_JSON:
                if ($this->forceJsonObject === true) {
                    return json_encode($this->postFields, JSON_FORCE_OBJECT);
                }
                return json_encode($this->postFields);
            case self::CONTENT_TYPE_FORM:
                return http_build_query($this->postFields);
        }

        return null;
    }

    private function generateHeader(): array
    {
        $headers = [];

        foreach ($this->rawHeaders as $header => $value) {
            $headers[$header] = $value;
        }

        if ($this->forceContentLength) {
            $headers['Content-Length'] = $this->generateContentLength();
        }

        return $headers;
    }

    private function generateContentLength(): int
    {
        if (empty($this->postFields) && empty($this->rawOptions[CURLOPT_POSTFIELDS])) {
            return 0;
        }

        return strlen($this->generatePostFields());
    }
}