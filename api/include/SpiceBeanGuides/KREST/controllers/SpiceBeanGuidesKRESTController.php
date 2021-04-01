<?php
namespace SpiceCRM\includes\SpiceBeanGuides\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceBeanGuides\SpiceBeanGuideRestHandler;

class SpiceBeanGuidesKRESTController{

    function getStageDefs(){
        $db = DBManagerFactory::getInstance();

        $restHandler = new SpiceBeanGuideRestHandler();

        $retArray = [];

        $objects = $db->query("SELECT module, status_field FROM spicebeanguides");
        while($object = $db->fetchByAssoc($objects)){
            // ToDo .. add ACL Check
            $retArray[$object['module']] = ['stages' => $restHandler->getStages($object['module']), 'statusfield' => $object['status_field']];
        }

        //CR1000278 overwrite from custom
        $objects = $db->query("SELECT module, status_field FROM spicebeancustomguides");
        while($object = $db->fetchByAssoc($objects)){
            // ToDo .. add ACL Check
            $retArray[$object['module']] = ['stages' => $restHandler->getStages($object['module']), 'statusfield' => $object['status_field']];
        }

        return $retArray;
    }

    static function getStages($req, $res, $args) {
        $restHandler = new SpiceBeanGuideRestHandler();
        return $res->withJson($restHandler->getStages($args['module']));
    }

    static function getBeanStages($req, $res, $args) {
        $restHandler = new SpiceBeanGuideRestHandler();
        return $res->withJson($restHandler->getStages($args['module'], $args['beanid']));
    }


}