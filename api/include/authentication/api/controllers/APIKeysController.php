<?php

namespace SpiceCRM\includes\authentication\api\controllers;
use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\authentication\APIKeyAuthenticate\APIKeyAuthenticate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\DatabaseException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\SpiceUtils;

class APIKeysController
{
    /**
     * generate api key value and save the record to the database
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function generateKey(Request $request, Response $response, array $args): Response
    {
        $payload = $request->getParsedBody();
        $db = DBManagerFactory::getInstance();
        $value = SpiceUtils::createGuid();

        $key = [
            'id' => $args['key_id'],
            'api_key' => APIKeyAuthenticate::encrypt($value),
            'is_active' => 1,
            'date_entered' => TimeDate::getInstance()->nowDb(),
            'created_by_id' => AuthenticationController::getInstance()->getCurrentUser()->id,
            'expire_on' => $db->quote($payload['expire_on']),
            'user_id' => $payload['user_id']
        ];

        $db->insertQuery('api_keys', $key);

        unset($key['api_key']);
        $key['value'] = $value;
        $key['created_by_name'] = AuthenticationController::getInstance()->getCurrentUser()->user_name;

        return $response->withJson($key);
    }

    /**
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getUserKeys(Request $request, Response $response, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $keys = $db->fetchAll("SELECT id, is_active, created_by_id, date_entered, expire_on FROM api_keys WHERE user_id = {$args['user_id']}");

        foreach ($keys as &$key) {
            $key['created_by_name'] = $db->getOne("SELECT user_name FROM users WHERE id = {$key['created_by_id']} AND deleted = 0");
        }

        return $response->withJson($keys);
    }

    /**
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function deleteKey(Request $request, Response $response, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $keyId = $db->quote($args['key_id']);

        $db->query("DELETE FROM api_keys WHERE id = '$keyId'");

        return $response->withStatus(204);
    }

    /**
     * activate api key
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws DatabaseException
     */
    public function activateKey(Request $request, Response $response, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $keyId = $db->quote($args['key_id']);
        $db->query("UPDATE api_keys SET is_active = 1 WHERE id = '$keyId'");
        return $response->withStatus(204);
    }

    /**
     * deactivate api key
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return Response
     * @throws DatabaseException
     */
    public function deactivateKey(Request $request, Response $response, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $keyId = $db->quote($args['key_id']);
        $db->query("UPDATE api_keys SET is_active = 0 WHERE id = '$keyId'");
        return $response->withStatus(204);
    }
}