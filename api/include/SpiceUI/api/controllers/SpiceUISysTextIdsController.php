<?php

namespace SpiceCRM\includes\SpiceUI\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;

class SpiceUISysTextIdsController {

    static function loadSysTextIds()
    {
        $db = DBManagerFactory::getInstance();
        $list = [];

        $queryRes = $db->query("SELECT ids.*, idsm.module FROM systextids ids LEFT JOIN systextids_modules idsm ON ids.id = idsm.text_id WHERE idsm.module IS NOT NULL ORDER BY idsm.module");
        while ($row = $db->fetchByAssoc($queryRes)) $list[$row['text_id']] = $row;

        $queryRes = $db->query("SELECT ids.*, idsm.module  FROM syscustomtextids ids LEFT JOIN syscustomtextids_modules idsm ON ids.id = idsm.text_id WHERE idsm.module IS NOT NULL ORDER BY idsm.module");
        while ($row = $db->fetchByAssoc($queryRes)) $list[$row['text_id']] = $row;

        return $list;
    }

    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response array with systext id and status
     */
    function addSysText(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $db = DBManagerFactory::getInstance();

        // id of the entry in the systextids table
        $sysTextId =  SpiceUtils::createGuid();

        // prepare data & inserting it to systextids table
        $sysTextData = [
            'id' => $sysTextId,
            'text_id' => $body['textId'],
            'name' => $body['name'],
            'label' => $body['label']
        ];
        $sysTextQuer = $db->insertQuery('systextids', $sysTextData, true);

        // if successful add the module and text_id
        if($sysTextQuer) {
            $sysTextModulesId =  SpiceUtils::createGuid();
            $sysTextData = [
                'id' => $sysTextModulesId,
                'text_id' => $body['textId'],
                'module' => $body['module']
            ];
            $db->insertQuery('systextids_modules', $sysTextData, true);
        }

        return $res->withJson(['success' => true, 'textId' => $body['textId']]);
    }
}
