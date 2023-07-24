<?php

namespace SpiceCRM\includes\WebHook\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\WebHook\WebHook;

class WebHookController{

    /** retrieves a specific report and delivers an array of records containing their merchant id, merchant name and email address
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function mapWebHooks($req, $res, $args)
    {
        $parsedBody = $req->getParsedBody();

        $module = $parsedBody['webHook']['module'];
        $dataId = $parsedBody['id'];
        /*
        $url = $parsedBody['url'];
        $ssl_verifypeer = ($parsedBody['ssl_verifypeer'] == 1) ? true : false;
        $ssl_verifyhost = ($parsedBody['ssl_verifyhost'] == 1) ? true : false;
        $customHeader = $parsedBody['custom_headers'];


        $body = [
            'id' =>$parsedBody['id'],
            'module' =>$parsedBody['module'],
            'event' => $parsedBody['event'],
            'sent_data' =>$parsedBody['sent_data'],
            'modulefilter_id' =>$parsedBody['modulefilter_id'],
            'fieldset_id' =>$parsedBody['fieldset_id'],

        ];
        $payload = json_encode($body);
        */
       $seed = BeanFactory::getBean($module, $dataId);

       return $res->withJson(['result' => WebHook::getInstance()->makeCall($parsedBody, $seed)]);
    }
}