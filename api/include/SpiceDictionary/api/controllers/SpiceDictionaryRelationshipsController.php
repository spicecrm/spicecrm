<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationship;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryRelationships;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

/**
 * manages the relationships
 */
class SpiceDictionaryRelationshipsController
{
    /**
     * posts a Dictionary Relötionship
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryRelationship(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryRelationships::getInstance()->add($body);

        return $res->withJson(['success' => true]);
    }

    /**
     * activates a Dictionary Relationship
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function activate(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryRelationship($args['id']))->activate()]);
    }
    /**
     * deactivates a Dictionary Relationship
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deactivate(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryRelationship($args['id']))->deactivate()]);
    }
    /**
     * posts a Dictionary Relationship
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteDictionaryRelationship(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryRelationship($args['id']))->delete()]);
    }
}