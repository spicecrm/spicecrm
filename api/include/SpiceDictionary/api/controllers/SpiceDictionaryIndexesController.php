<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndex;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryIndexes;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceDictionaryIndexesController
{
    /**
     * posts a Dictionary Index
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryIndex(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        SpiceDictionaryIndexes::getInstance()->addIndex($body['index'], $body['items']);

        return $res->withJson((new SpiceDictionaryIndex($args['id']))->getIndexDefinition());
    }

    /**
     * posts a Dictionary Index
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteDictionaryIndex(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryIndex($args['id']))->delete()]);
    }

    /**
     * activates a Dictionary Index
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function activateDictionaryIndex(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryIndex($args['id']))->activate();
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
    }

    /**
     * drops a Dictionary Index
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function dropDictionaryIndex(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryIndex($args['id']))->deactivate();
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
    }
}