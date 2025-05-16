<?php

namespace SpiceCRM\includes\WebHook\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\WebHook\WebHook;

class WebHookController
{

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

        if (!$module || !$dataId) {
            throw new BadRequestException('Bean Data missing');
        }

        // try to get the seed
        $seed = BeanFactory::getBean($module, $dataId);

        if (!$seed) {
            throw new NotFoundException('Bean not found');
        }

        // call the webhook
        return $res->withJson(['result' => WebHook::getInstance()->makeCall($parsedBody['webHook'], $seed)]);
    }
}