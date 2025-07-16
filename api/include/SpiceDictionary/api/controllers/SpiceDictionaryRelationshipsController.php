<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\relationships\RelationshipFactory;
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

        # when a global relationship is customized, remove the definition from the relationships cache table. The custom relationship will take place instead
        if ($body['relationship']['scope'] == 'c') {
            foreach (SpiceDictionaryRelationships::getInstance()->relationships as $globalRelationship) {
                $hasRelatedGlobalRelationship = $globalRelationship['scope'] == 'g' && $globalRelationship['relationship_name'] == $body['relationship']['relationship_name'];
                if (!$hasRelatedGlobalRelationship) continue;
                (new SpiceDictionaryRelationship($globalRelationship['id']))->deactivate(false);
                break;
            }
        }

        SpiceDictionaryRelationships::getInstance()->add($body['relationship'], $body['relationshippolymorphs']);
        SpiceDictionaryHandler::getInstance()->setDictionaryRelationshipFields($body['relationshipFields']);

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
        $relationship = new SpiceDictionaryRelationship($args['id']);

        $response = $res->withJson(['success' => (new SpiceDictionaryRelationship($args['id']))->delete()]);

        # after deleting a custom relationship, check if it has a related global relationship with the same name and repair the global one if the status is active
        if ($relationship->scope == 'c') {
            foreach (SpiceDictionaryRelationships::getInstance()->relationships as $globalRelationship) {
                $hasActiveRelatedGlobalRelationship = $globalRelationship['relationship_name'] == $relationship->relationship->relationship_name && $globalRelationship['scope'] == 'g' && $globalRelationship['status'] == 'a';
                if (!$hasActiveRelatedGlobalRelationship) continue;
                (new SpiceDictionaryRelationship($globalRelationship['id']))->activate(false);
                break;
            }
        }

        return $response;
    }
}