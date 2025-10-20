<?php

namespace SpiceCRM\includes\SpiceGateway\api\controllers;
use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceGateway\SpiceGatewayServerHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceGatewayServerController
{
    /**
     * send email passed from a client system
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function sendEmail(Request $request, Response $response, array $args): Response
    {
        $payload = $request->getParsedBody();

        $resObject = SpiceGatewayServerHandler::sendEmail($payload);

        return $response->withJson($resObject);
    }

    /**
     * send email passed from a client system
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function sendTemplateTypeEmail(Request $request, Response $response, array $args): Response
    {
        $payload = $request->getParsedBody();

        $resObject = SpiceGatewayServerHandler::sendTemplateTypeEmail($payload);

        return $response->withJson($resObject);
    }

    /**
     * send email passed from a client system
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function sendSMS(Request $request, Response $response, array $args): Response
    {
        $payload = $request->getParsedBody();

        $resObject = SpiceGatewayServerHandler::sendSMS($payload['phoneNumber'], $payload['message']);

        return $response->withJson($resObject);
    }

    /**
     * send email passed from a client system
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function sendTemplateTypeSMS(Request $request, Response $response, array $args): Response
    {
        $payload = $request->getParsedBody();

        $resObject = SpiceGatewayServerHandler::sendTemplateTypeSMS($payload);

        return $response->withJson($resObject);
    }
}