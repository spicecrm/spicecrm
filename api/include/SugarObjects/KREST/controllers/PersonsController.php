<?php
namespace SpiceCRM\includes\SugarObjects\KREST\controllers;

use SpiceCRM\data\BeanFactory;

class PersonsController
{
    /**
     * @param $req
     * @param $res
     * @param $args
     * @return bool | $content: text/bin
     */
    public function convertToVCARD($req, $res, $args){
        $bean = BeanFactory::getBean($args['module'], $args['id']);
        if (!$bean) return false;
        $content = $bean->getVCardContent();
        return $res->withHeader('Content-Type', 'text/x-vcard', 'charset=utf-8')->write($content);
    }
}
