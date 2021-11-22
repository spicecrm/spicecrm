<?php

namespace SpiceCRM\modules\Letters\api\controllers;

use Exception;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SpiceAttachments\SpiceAttachments;
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
     * @throws Exception
     */
    public function markAsSent(Request $req, Response $res, array $args): Response
    {
        $beanData = $req->getParsedBody();
        $outputTemplate = BeanFactory::getBean('OutputTemplates', $args['template_id']);
        $outputTemplate->bean_id = $args['id'];
        $beanData['letter_status'] = 'sent';
        
        $moduleHandler = new ModuleHandler();
        $moduleHandler->add_bean($outputTemplate->module_name, $args['id'], $beanData);

        $attachment = [
            'filename' => $beanData['name'],
            'filemimetype' => 'application/pdf',
            'file' => base64_encode(
                $outputTemplate->getPdfContent()
            )
        ];

        SpiceAttachments::saveAttachmentHashFiles('Letters', $args['id'], $attachment);

        return $res->withJson(['success' => true]);
    }
}
