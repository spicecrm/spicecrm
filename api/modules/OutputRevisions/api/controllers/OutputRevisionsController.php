<?php

namespace SpiceCRM\modules\OutputRevisions\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\DataStreams\StreamFactory;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\OutputTemplates\OutputTemplate;

class OutputRevisionsController
{

    /**
     * crteates a new salesdoc output
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function previewOutput(Request $req, Response $res, array $args): Response
    {
        // check if we find the salesodc
        $seed = BeanFactory::getBean($args['parenttype'], $args['parentid']);
        if(!$seed){
            throw new NotFoundException("Bean {$args['parenttype']} with id {$args['id']} not found");
        }

        // check that the template is allowed
        $templates = $seed->getOutputTemplates();
        $templateFound = false;
        foreach ($templates as $t){
            if($t['id'] == $args['template']){
                $templateFound = true;
                break;
            }
        }

        if(!$templateFound){
            throw new NotFoundException("Template {$args['template']} not allowed");
        }

        /** @var OutputTemplate $template */
        $template = BeanFactory::getBean('OutputTemplates', $args['template']);

        if(!$template){
            throw new NotFoundException("Template {$args['template']} not found");
        }

        // set and parse the template
        $template->bean = $seed;
        $file = $template->getPdfContent();

        // return the response
        return $res->withJson([
            'filename' => $template->getFileName(),
            'filemd5' => md5($file),
            'filesize' => strlen($file),
            'file_mime_type' => "application/pdf",
            'file' => base64_encode($file)
        ]);

    }

    /**
     * crteates a new salesdoc output
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function createOutput(Request $req, Response $res, array $args): Response
    {
        // check if we find the salesodc
        // check if we find the salesodc
        $seed = BeanFactory::getBean($args['parenttype'], $args['parentid']);
        if(!$seed){
            throw new NotFoundException("Bean {$args['parenttype']} with id {$args['id']} not found");
        }

        $body = $req->getParsedBody();


        // check that the template is allowed
        $templates = $seed->getOutputTemplates();
        $templateFound = false;
        foreach ($templates as $t){
            if($t['id'] == $args['template']){
                $templateFound = true;
                break;
            }
        }

        if(!$templateFound){
            throw new NotFoundException("Template {$args['template']} not allowed");
        }

        /** @var OutputTemplate $template */
        $template = BeanFactory::getBean('OutputTemplates', $args['template']);

        if(!$template){
            throw new NotFoundException("Template {$args['template']} not found");
        }

        $template->bean = $seed;
        $file = $template->getPdfContent();

        // save the file
        $md5 = md5($file);
        $filepath = StreamFactory::getPathPrefix('upload') . $md5;
        touch($filepath);
        file_put_contents($filepath, $file);

        // add the info to the salesdoc
        $Output = BeanFactory::getBean('OutputRevisions');
        $Output->parent_id = $args['parentid'];
        $Output->parent_type = $args['parenttype'];
        $Output->file_md5 = $md5;
        $Output->file_name = $template->getFileName();
        $Output->file_mime_type = 'application/pdf';
        $Output->description = $body['description'];
        $Output->save();
        // return the response
        return $res->withJson((new SpiceBeanHandler())->mapBean($Output) );

    }
}