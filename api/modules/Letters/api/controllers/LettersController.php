<?php

namespace SpiceCRM\modules\Letters\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\KREST\handlers\ModuleHandler;

class LettersController
{
    /**
     * set letter status to sent and save with the pdf as attachment
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function markAsSent(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();

        $outputTemplate = BeanFactory::getBean('OutputTemplates', $args['template_id']);
        $outputTemplate->bean_id = $args['bean_id'];
        $content = base64_encode(
            $outputTemplate->getPdfContent()
        );

        $moduleHandler = new ModuleHandler();
        $moduleHandler->add_bean($outputTemplate->module_name, $args['id'], $params);

        return $res->withJson(['success' => true]);
    }
}
