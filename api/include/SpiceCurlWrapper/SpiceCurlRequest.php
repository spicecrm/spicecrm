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
    private ?bool $forceJsonObject = null;

    /**
     * @var bool a flag for disabling logging.
     */
    private bool $forceDisableLogger = false;

    /**
     * @var array|object CURLOPT_POSTFIELDS the POST request payload.
     */
    private array|object $postFields;

    /**
     * @var array|object the query params that are concatenated onto the URL.
     */
    private array|object $queryParams;

    /**
     * @var array An array with the curl options stored. The keys are the curl constants e.g. CURLOPT_PORT
     */
    private array $rawOptions = [];

    /**
     * @var array An array with the request headers stored. Any string is allowed to be a header (due to custom headers in APIs).
     * The most common header names are stored in the HEADER_XYZ constants.
     */
    private array $rawHeaders = [];

    /**
     * Default timeout values 600 seconds = 10 minutes.
     */
    private const DEFAULT_TIMEOUT = 600;


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

    public const CONTENT_TYPE_XML_UTF8 = 'text/xml;charset="utf-8"';

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

    public const ACCEPT_JSON = 'application/json';

    public const ACCEPT_XML = 'text/xml';


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

    /**
     * Setter for the route alias. The route alias is used for the API log. If no alias is present, the full url is used.
     *
     * @param string $routeAlias
     * @return $this
     */
    public function setRouteAlias(string $routeAlias): self
    {
        $this->routeAlias = $routeAlias;

        return $this;
    }

    /**
     * Sets the value of a curl option using an alias.
     * Supported aliases are in the $optionsAliases array.
     *
     * @param string $optionName
     * @param string $optionValue
     * @return $this
     * @deprecated
     */
    public function setOption(string $optionName, string $optionValue): self
    {
        return $this->setRawOption($optionName, $optionValue);
    }

    /**
     * Sets the value of a curl option using curl constants i.e. CURLOPT_SSL_VERIFYPEER
     *
     * @param string $optionName
     * @param string $optionValue
     * @return $this
     */
    public function setRawOption(string $optionName, string $optionValue): self
    {
        $this->rawOptions[$optionName] = $optionValue;

        return $this;
    }

    /**
     * Sets the value of a header curl option.
     * Any string is allowed as the option name due to custom headers.
     * These options end up in CURLOPT_HTTPHEADER.
     *
     * @param string $optionName
     * @param string $optionValue
     * @return $this
     */
    public function setHeaderOption(string $optionName, string $optionValue): self
    {
        $this->rawHeaders[$optionName] = $optionValue;

        return $this;
    }

    /**
     * A helper function to quickly set the values of CURLOPT_SSL_VERIFYPEER and CURLOPT_SSL_VERIFYHOST.
     *
     * @param bool $ssl
     * @return $this
     */
    public function setSsl(?bool $ssl): self
    {
        if ($ssl === null) {
            return $this;
        }

        $this->rawOptions[CURLOPT_SSL_VERIFYPEER] = $ssl;
        $this->rawOptions[CURLOPT_SSL_VERIFYHOST] = $ssl;

        return $this;
    }

    /**
     * A setter for the Authorization header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_AUTHORIZATION, $value)
     *
     * @param string $method
     * @param string $value
     * @return $this
     */
    public function setAuthorization(string $method, string $value): self
    {
        $this->rawHeaders[self::HEADER_AUTHORIZATION] = $method . $value;

        return $this;
    }

    /**
     * A helper function for setting the basic Authorization header Option.
     *
     * @param string $value
     * @return $this
     */
    public function setBasicAuthorization(string $value): self
    {
        $this->setAuthorization(self::AUTHORIZATION_BASIC, $value);

        return $this;
    }

    /**
     * A helper function for setting the basic Authorization with the standard base64 encoding.
     *
     * @param string $user
     * @param string $password
     * @return $this
     */
    public function setBasicBase64Authorization(string $user, string $password): self
    {
        return $this->setBasicAuthorization(base64_encode($user . ':' . $password));
    }

    /**
     * A helper function for setting the bearer Authorization header option.
     *
     * @param string $value
     * @return $this
     */
    public function setBearerAuthorization(string $value): self
    {
        $this->setAuthorization(self::AUTHORIZATION_BEARER, $value);

        return $this;
    }

    /**
     * A helper function for setting the token Authorization header option.
     *
     * @param string $value
     * @return $this
     */
    public function setTokenAuthorization(string $value): self
    {
        $this->setAuthorization(self::AUTHORIZATION_TOKEN, $value);

        return $this;
    }

    /**
     * A helper function for setting the raw key Authorization header option.
     *
     * @param string $value
     * @return $this
     */
    public function setRawKeyAuthorization(string $value): self
    {
        $this->setAuthorization(self::AUTHORIZATION_RAW_KEY, $value);

        return $this;
    }

    /**
     * A setter for the Content Type header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_CONTENT_TYPE, $value)
     *
     * @param string $contentType
     * @return $this
     */
    public function setContentType(string $contentType): self
    {
        $this->rawHeaders[self::HEADER_CONTENT_TYPE] = $contentType;

        return $this;
    }

    /**
     * A setter for the Cookie header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_COOKIE, $value)
     *
     * @param string $cookie
     * @return $this
     */
    public function setCookie(string $cookie): self
    {
        $this->rawHeaders[self::HEADER_COOKIE] = $cookie;

        return $this;
    }

    /**
     * A setter for the Cache Control header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_CACHE_CONTROL, $value)
     *
     * @param string $cacheControl
     * @return $this
     */
    public function setCacheControl(string $cacheControl): self
    {
        $this->rawHeaders[self::HEADER_CACHE_CONTROL] = $cacheControl;

        return $this;
    }

    /**
     * A setter for the Connection header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_CONNECTION, $value)
     *
     * @param string $connection
     * @return $this
     */
    public function setConnection(string $connection): self
    {
        $this->rawHeaders[self::HEADER_CONNECTION] = $connection;

        return $this;
    }

    /**
     * A setter for the Accept header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_ACCEPT, $value)
     *
     * @param string $accept
     * @return $this
     */
    public function setAccept(string $accept): self
    {
        $this->rawHeaders[self::HEADER_ACCEPT] = $accept;

        return $this;
    }

    /**
     * A setter for the Accept Encoding header option.
     * Equivalent to:
     * setHeaderOption(SpiceCurlRequest::HEADER_ACCEPT_ENCODING, $value)
     *
     * @param string $encoding
     * @return $this
     */
    public function setAcceptEncoding(string $encoding): self
    {
        $this->rawHeaders[self::HEADER_ACCEPT_ENCODING] = $encoding;

        return $this;
    }

    /**
     * A setter for the CURLOPT_POSTFIELDS option.
     * Accepts only arrays and allows for automatic conversion to the format saved in $this->rawHeaders[self::HEADER_CONTENT_TYPE]
     * i.e. into JSON or HTTP query string.
     *
     * Alternatively, for an already serialized string value the following should be used:
     * ->setRawOption(CURLOPT_POSTFIELDS, $serializedValue)
     *
     * @param array $fields
     * @return $this
     */
    public function setPostFields(array|object $fields): self
    {
        $this->postFields = $fields;

        return $this;
    }

    /**
     * A setter for the query params.
     *
     * @param array|object $params
     * @return $this
     */
    public function setQueryParams(array|object $params): self
    {
        $this->queryParams = $params;

        return $this;
    }

    /**
     * Returns an array of the curl options including the header options.
     *
     * @return array
     */
    public function getOptions(): array
    {
        $curlOptions = [];

        $curlOptions[CURLOPT_URL] = ($this->url ?? $this->rawOptions[CURLOPT_URL]) . $this->generateQueryParams();

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

        foreach ($this->rawOptions as $optionName => $optionValue) {
            if (!isset($curlOptions[$optionName])) {
                $curlOptions[$optionName] = $optionValue;
            }
        }

        if (!isset($curlOptions[CURLOPT_RETURNTRANSFER])) {
            $curlOptions[CURLOPT_RETURNTRANSFER] = true;
        }

        if (!isset($curlOptions[CURLOPT_TIMEOUT])) {
            $curlOptions[CURLOPT_TIMEOUT] = $this->getDefaultTimeout();
        }

        $curlOptions[CURLOPT_HTTPHEADER] = $this->generateHeader();


        return $curlOptions;
    }

    /**
     * Hand the request over to the connector for processing and returns the response
     *
     * @return SpiceCurlResponse
     * @throws \Exception
     */
    public function send(): SpiceCurlResponse
    {
        return (new SpiceCurlConnector($this))->process();
    }

    /**
     * Getter for the route being logged in the API log.
     * Either the routeAlias if available, otherwise the url.
     *
     * @return string
     */
    public function getLoggedRoute(): string
    {
        if (!empty($this->routeAlias)) {
            return $this->routeAlias;
        }

        return $this->url;
    }

    /**
     * A flag for forcing the calculation and setting of the Content-Length header option.
     *
     * @return $this
     */
    public function forceContentLength(): self
    {
        $this->forceContentLength = true;

        return $this;
    }

    /**
     * A flag for using the JSON_FORCE_OBJECT setting when json encoding the post fields.
     *
     * @return $this
     */
    public function forceJsonObject(): self
    {
        $this->forceJsonObject = true;

        return $this;
    }

    /**
     * A flag for disabling logging the request.
     *
     * @return $this
     */
    public function disableLogger(): self
    {
        $this->forceDisableLogger = true;

        return $this;
    }

    /**
     * A getter for the logger flag.
     *
     * @return bool
     */
    public function loggingEnabled(): bool
    {
        return !$this->forceDisableLogger;
    }

    /**
     * Generates a serialized string out of the post fields array.
     * The output format depends on the value of $this->rawHeaders[self::HEADER_CONTENT_TYPE].
     *
     * @return string|null
     */
    private function generatePostFields(): ?string
    {
        if (!empty($this->rawOptions[CURLOPT_POSTFIELDS])) {
            return $this->rawOptions[CURLOPT_POSTFIELDS];
        }

        switch ($this->rawHeaders[self::HEADER_CONTENT_TYPE]) {
            case self::CONTENT_TYPE_FORM:
                return http_build_query($this->postFields);
            case self::CONTENT_TYPE_JSON:
            default:
                if ($this->forceJsonObject === true) {
                    return json_encode($this->postFields, JSON_FORCE_OBJECT);
                }
                return json_encode($this->postFields);
        }
    }

    /**
     * Generates a query params string to be added onto the URL.
     *
     * @return string
     */
    private function generateQueryParams(): string
    {
        if (!empty($this->queryParams)) {
            return http_build_query($this->queryParams);
        }

        return '';
    }

    /**
     * Generates an array of header options values.
     *
     * @return array
     */
    private function generateHeader(): array
    {
        $headers = [];

        if (empty($this->rawHeaders[self::HEADER_CONTENT_TYPE])) {
            $this->rawHeaders[self::HEADER_CONTENT_TYPE] = self::CONTENT_TYPE_JSON;
        }

        foreach ($this->rawHeaders as $header => $value) {
            $headers[] = $header . ': ' . $value;
        }

        if ($this->forceContentLength) {
            $headers['Content-Length'] = $this->generateContentLength();
        }

        return $headers;
    }

    /**
     * Calculates the length of the serialized post fields (CURLOPT_POSTFIELDS).
     * Is triggered when the forceContentLength flag is set.
     *
     * @return int
     */
    private function generateContentLength(): int
    {
        if (empty($this->postFields) && empty($this->rawOptions[CURLOPT_POSTFIELDS])) {
            return 0;
        }

        return strlen($this->generatePostFields());
    }


    /**
     * A getter for the default timeout value.
     * Uses the hardcoded constant for now.
     * Might be used to read it from config if necessary.
     *
     * @return int
     */
    private function getDefaultTimeout(): int
    {
        return self::DEFAULT_TIMEOUT;
    }
}