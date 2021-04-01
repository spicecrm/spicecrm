<?php
namespace SpiceCRM\modules\Administration\KREST\controllers;
use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\database\DBManagerFactory;

class DictionaryManagerController{

    /**
     * get the dictionaryfields from the database
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     * @throws \Exception
     */

    public function GetDictionaryFields($req,$res,$args){
        global $dictionary;
        $db = DBManagerFactory::getInstance();

        $return = ['fields' => [], 'items' => []];
        foreach($dictionary[$args['table']]['fields'] as $field){
            $return['fields'][] = $field['name'];
        }
        $res = $db->query("SELECT ".implode(',',$return['fields'])." FROM ".$dictionary[$args['table']]['table']);
        while($row = $db->fetchByAssoc($res)){
            $return['items'][] = $row;
        }
        return $res->withJson($return);
    }
}