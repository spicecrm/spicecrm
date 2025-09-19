<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\relationships\RelationshipFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * manages the relationships
 */
class SpiceDictionaryRelationshipsController
{
    /**
     * posts a Dictionary relationship
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    public function postDictionaryRelationship(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryRelationships::getInstance()->add($body['relationship'], $body['relationshippolymorphs'] ?: [], $body['relationshipFields'] ?: []);

        return $res->withJson(['success' => true]);
    }

    /**
     * activates a Dictionary Relationship
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    public function activate(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryRelationship($args['id']))->activate();

        return $res->withJson(['success' => $success]);
    }

    /**
     * deactivates a Dictionary Relationship
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    public function deactivate(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryRelationship($args['id']))->deactivate();

        return $res->withJson(['success' => $success]);
    }

    /**
     * posts a Dictionary Relationship
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return mixed
     * @throws \Exception
     */
    public function deleteDictionaryRelationship(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryRelationship($args['id']))->delete();

        return $res->withJson(['success' => $success]);
    }
}