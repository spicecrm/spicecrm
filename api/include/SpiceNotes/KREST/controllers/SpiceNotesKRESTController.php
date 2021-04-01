<?php

namespace SpiceCRM\includes\SpiceNotes\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceNotes\SpiceNotes;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;

class SpiceNotesKRESTController{

    /**
     * get the quicknotes for the beans
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     */

    public function getQuickNotesForBean($req, $res, $args){
        return $res->withJson(SpiceNotes::getQuickNotesForBean($args['beanName'], $args['beanId']));
    }

    /**
     * saves the notes
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function saveQuickNote($req,$res,$args){
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $data = array_merge($postBody, $postParams);
        return $res->withJson(SpiceNotes::saveQuickNote($args['beanName'], $args['beanId'], $data));
    }
    /**
     * edits the quicknotes
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function editQuickNote($req,$res,$args){
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $data = array_merge($postBody, $postParams);
        return $res->withJson(SpiceNotes::editQuickNote($args['beanName'], $args['beanId'], $data));
    }

    /**
     * deletes the quick notes
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteQuickNote($req,$res,$args){
        return $res->withJson(SpiceNotes::deleteQuickNote($args['noteId']));
    }
}

