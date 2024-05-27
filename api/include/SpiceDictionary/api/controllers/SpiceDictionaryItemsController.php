<?php

namespace SpiceCRM\includes\SpiceDictionary\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionary;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItem;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryItems;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceDictionaryItemsController
{
    /**
     * posts a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryItem(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        if (SpiceDictionaryItems::getInstance()->getItem($body['id'])) {
            SpiceDictionaryItems::getInstance()->setItem($body);
        } else {
            SpiceDictionaryItems::getInstance()->addItem($body);
        }

        return $res->withJson(['success' => true]);
    }

    /**
     * posts a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryItems(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        foreach ($body['items'] as $item) {
            SpiceDictionaryItems::getInstance()->addItem($item);
        }

        return $res->withJson(['success' => true]);
    }

    /**
     * posts a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function postDictionaryItemsSequence(Request $req, Response $res, array $args): Response
    {
        // get the body
        $body = $req->getParsedBody();

        $sequence = 0;
        foreach ($body['items'] as $item) {
            $item = new SpiceDictionaryItem($item);
            $item->itemDefinition->sequence = $sequence;
            SpiceDictionaryItems::getInstance()->setItem((array) $item->itemDefinition);
            $sequence++;
        }

        return $res->withJson(['success' => true]);
    }

    /**
     * posts a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteDictionaryItem(Request $req, Response $res, array $args): Response
    {
        return $res->withJson(['success' => (new SpiceDictionaryItem($args['id']))->delete()]);
    }

    /**
     * activates a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function activateDictionaryItem(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryItem($args['id']))->activate();
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
    }

    /**
     * deactivates a Dictionary Item
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deactivateDictionaryItem(Request $req, Response $res, array $args): Response
    {
        $success = (new SpiceDictionaryItem($args['id']))->deactivate();
        SpiceDictionary::getInstance()->loadDictionary();

        return $res->withJson(['success' => $success]);
    }
}