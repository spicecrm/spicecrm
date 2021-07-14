<?php
namespace SpiceCRM\includes\SpiceSwagger\api\middleware;

use SpiceCRM\includes\ErrorHandlers\ValidationException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use Exception;

class CustomMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response {
        try {
            return $handler->handle($request);
        } catch (ValidationException $exception) {
            return $this->handleException($exception->getValidationErrors());
        } catch (Exception $exception) {
            return $this->handleException($exception->getMessage());
        }
    }

    private function handleException(string $message): Response {
        $response = (new SpiceResponse())->withStatus(400);
        $response->withHeader('Content-Type', 'application/json');
        $response->withJson([
            'Status' => 'Error',
            'Error'  => $message,
        ]);
        return $response;
    }
}