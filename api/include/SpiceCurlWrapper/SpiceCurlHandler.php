<?php

namespace SpiceCRM\includes\SpiceCurlWrapper;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class SpiceCurlHandler implements RequestHandlerInterface
{
    private array $middlewares = [];
    private int $index = 0;

    public function __construct(array $middlewares)
    {
        $this->middlewares = $middlewares;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        if (!isset($this->middlewares[$this->index])) {
            $connector = new SpiceCurlConnector();
            return $connector->process($request);
        }

        // Get current middleware
        $middleware = $this->middlewares[$this->index];
        $this->index++;

        // Call the current middleware's process() method
        return $middleware->process($request, $this);
    }
}