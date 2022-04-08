<?php
namespace SpiceCRM\modules\Administration\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class DictionaryManagerController
{
    /**
     * get the dictionaryfields from the database
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function getDictionaryFields(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $return = ['fields' => [], 'items' => []];
        foreach(SpiceDictionaryHandler::getInstance()->dictionary[$args['table']]['fields'] as $field){
            $return['fields'][] = $field['name'];
        }
        $res = $db->query("SELECT ".implode(',',$return['fields'])." FROM ".SpiceDictionaryHandler::getInstance()->dictionary[$args['table']]['table']);
        while($row = $db->fetchByAssoc($res)){
            $return['items'][] = $row;
        }
        return $res->withJson($return);
    }
}