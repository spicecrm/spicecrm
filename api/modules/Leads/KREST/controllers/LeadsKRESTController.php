<?php


namespace SpiceCRM\modules\Leads\KREST\controllers;


use SpiceCRM\data\BeanFactory;

class LeadsKRESTController
{
    public function createFromForm($req, $res, $args){
        $seed = BeanFactory::getBean('Leads');

        $post = $req->getParsedBody();
        foreach($post as $fieldname => $fieldvalue){
            if(isset($seed->field_name_map[$fieldname])){
                $seed->{$fieldname} = $fieldvalue;
            }
        }
        $seed->save();
        return $res->withJson(['success' => true, 'id' => $seed->id]);
    }
}
