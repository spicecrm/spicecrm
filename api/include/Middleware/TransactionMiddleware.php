<?php
namespace SpiceCRM\includes\Middleware;

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Response;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceSocket\SpiceSocket;
use SpiceCRM\includes\WebHook\WebHook;

class TransactionMiddleware
{
    public function __invoke(Request $request, RequestHandler $handler): Response {
        // start the DB Transaction
        $this->startTransaction();
        // start the FTS Transaction
        SpiceFTSHandler::getInstance()->startTransaction();
        // start the Webhook Transaction
        WebHook::getInstance()->startTransaction();
        // if we have a socket start the Socket Transaction
        if (class_exists(SpiceSocket::class)) {
            SpiceSocket::getInstance()->startTransaction();
        }

        try {
            $response = $handler->handle($request);
            $this->commitTransaction();
            $this->commitFts();
            WebHook::getInstance()->commitTransaction();
            if (class_exists(SpiceSocket::class)) {
                SpiceSocket::getInstance()->commitTransaction();
            }

            return $response;
        } catch (DatabaseException $e) {
            $this->rollbackTransaction();
            throw $e;
        }
    }

    /**
     * Starts the DB transaction before the script is executed.
     */
    public function startTransaction() {
        DBManagerFactory::getInstance()->transactionStart();
    }

    /**
     * Commits the DB transaction after successfully executing the script.
     */
    public function commitTransaction() {
        DBManagerFactory::getInstance()->transactionCommit();
    }

    /**
     * Rolls back the DB transaction in case of DB errors during the execution of the script.
     */
    public function rollbackTransaction() {
        DBManagerFactory::getInstance()->transactionRollback();
    }

    /**
     * Commits FTS after successfully executing the script.
     */
    private function commitFts() {
        SpiceFTSHandler::getInstance()->commitTransaction();
    }


}