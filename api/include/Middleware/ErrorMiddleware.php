<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;

class ErrorMiddleware extends FailureMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): ResponseInterface {
        $errorTypes = E_ALL;

        set_error_handler(function ($errno, $errstr, $errfile, $errline) {
            return $this->handleErrorResponse($errno, $errstr, $errfile, $errline);
        }, $errorTypes);

        return $handler->handle($request);
    }

    /**
     * Handles errors that are not exceptions.
     * Returns the error info only if the developer mode is enabled.
     * todo figure out how to make it work
     *
     * @param $exception
     * @return ResponseInterface
     */
    private function handleErrorResponse($errno, $errstr, $errfile, $errline): ?ResponseInterface {
        if ($errno == E_USER_ERROR) {
            $inDevMode = SpiceConfig::getInstance()->config['developerMode'];
            $errorMessage = "Error number[{$errno}] {$errstr} on line {$errline} in file {$errfile}";

            LoggerManager::getLogger()->fatal($errorMessage);
            $responseData['error'] = [ 'message' => $inDevMode ? 'Application Error.' : $errorMessage ];
            $httpCode = 500;

            DBManagerFactory::getInstance()->transactionRollback();
            return $this->generateResponse($responseData, $httpCode);
        }
        return null;
    }
}
