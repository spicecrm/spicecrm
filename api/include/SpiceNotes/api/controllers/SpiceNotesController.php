<?php
namespace SpiceCRM\includes\SpiceNotes\api\controllers;

use SpiceCRM\includes\SpiceNotes\SpiceNotes;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceNotesController
{
    /**
     * get the quicknotes for the beans
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getQuickNotesForBean(Request $req, Response $res, array $args): Response {
        return $res->withJson(SpiceNotes::getQuickNotesForBean($args['beanName'], $args['beanId']));
    }

    /**
     * saves the notes
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function saveQuickNote(Request $req, Response $res, array $args): Response {
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $data = array_merge($postBody, $postParams);
        return $res->withJson(SpiceNotes::saveQuickNote($args['beanName'], $args['beanId'], $data));
    }

    /**
     * edits the quicknotes
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function editQuickNote(Request $req, Response $res, array $args): Response {
        $postBody = $body = $req->getParsedBody();
        $postParams = $req->getQueryParams();
        $data = array_merge($postBody, $postParams);
        return $res->withJson(SpiceNotes::editQuickNote($args['beanName'], $args['beanId'], $args['noteId'], $data));
    }

    /**
     * deletes the quick notes
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function deleteQuickNote(Request $req, Response $res, array $args): Response {
        return $res->withJson(SpiceNotes::deleteQuickNote($args['noteId']));
    }
}

