<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;

use SpiceCRM\data\Relationships\RelationshipFactory;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
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

        SpiceDictionaryRelationships::getInstance()->add($body['relationship'], $body['relationshippolymorphs']);
        SpiceDictionaryHandler::getInstance()->setDictionaryRelationshipFields($body['relationshipFields']);

        return $res->withJson(['success' => true]);
    }

    /**
     * posts a Dictionary Relötionship
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryRelationshipPolymorh(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryRelationships::getInstance()->addPolymorphs($body);

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
        $success = (new SpiceDictionaryRelationship($args['id']))->activate();
        RelationshipFactory::getInstance()->loadRelationships(true);
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
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
        $success = (new SpiceDictionaryRelationship($args['id']))->deactivate();
        RelationshipFactory::getInstance()->loadRelationships(true);
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
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