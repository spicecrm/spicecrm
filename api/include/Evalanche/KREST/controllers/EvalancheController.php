<?php
namespace SpiceCRM\includes\Evalanche\KREST\controllers;

use SpiceCRM\includes\Evalanche\Evalanche;

class EvalancheController
{
    public function getMailingStats($req, $res, $args)
    {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->getMailingStats($args['id']));
    }

    public function getTemplates($req, $res, $args)
    {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->getTemplates($args['id']));
    }

    public function sendMailing($req, $res, $args)
    {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->sendMailing($args['id'], $req));
    }
    public function getProspectListStatistic($req, $res, $args) {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->getProspectListStatistic($args['id']));
    }

    public function synchronizeTargetLists($req, $res, $args) {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->synchronizeTargetLists($args['id'], $req));
    }

    public function campaignTaskToEvalanche($req, $res, $args) {
        $evalanche = new Evalanche();
        return $res->withJson($evalanche->campaignTaskToEvalanche($args['id']));
    }



}
