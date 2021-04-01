<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;

abstract class FailureMiddleware
{
    abstract public function __invoke(Request $request, RequestHandler $handler): ResponseInterface;

    /**
     * Generates the Slim response object.
     *
     * @param array $payload
     * @param string $httpCode
     * @param array|null $specialResponseHeaders
     * @return ResponseInterface
     */
    protected function generateResponse($payload, $httpCode, $specialResponseHeaders = null): ResponseInterface {
        $response = (new Response())->withStatus($httpCode?:500);
        $response->withHeader('Content-Type', 'application/json');
        if (!empty($specialResponseHeaders)) {
            foreach ($specialResponseHeaders as $k => $v) {
                $response = $response->withHeader($k, $v);
            }
        }
        $response->getBody()->write(json_encode(['error' => $payload]));
        // todo JSON_PARTIAL_OUTPUT_ON_ERROR is missing
        return $response;
    }
}
