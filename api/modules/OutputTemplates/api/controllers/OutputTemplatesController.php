<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\OutputTemplates\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ConflictException;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SpiceFTSManager\ElasticHandler;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SpiceSocket\SpiceSocket;
use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\modules\OutputTemplates\OutputTemplate;

class OutputTemplatesController
{
    /**
     * live compile html content
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function liveCompileHtml(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        /** @var OutputTemplate $outputTemplate */
        $outputTemplate = BeanFactory::getBean("OutputTemplates", $args['id']);
        $field = $params['field'] ?? 'body';
        $outputTemplate->$field = $params['html'];
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);

        return $res->withJson(['html' => $outputTemplate->parse($bean, $field)]);
    }

    public function compile(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        return $res->withJson(['content' => $bean->translateBody(), 'filename' => $bean->getFileName()]);

    }

    public function previewpdf(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $bean = BeanFactory::getBean('OutputTemplates');

        $bean->id = $body['id'];
        $bean->body = $body['body'];
        $bean->header = $body['header'];
        $bean->footer = $body['footer'];
        $bean->stylesheet_id = $body['stylesheet_id'];

        $bean->margin_left = $body['margin_left'];
        $bean->margin_top = $body['margin_top'];
        $bean->margin_right = $body['margin_right'];
        $bean->margin_bottom = $body['margin_bottom'];
        $bean->page_size = $body['page_size'];
        $bean->page_orientation = $body['page_orientation'];
        $bean->language = $body['language'];
        $bean->module_name = $body['parentype'];
        $bean->bean_id = $body['parentid'];
        $file = $bean->getPdfContent();

        $response = [ 'content' => base64_encode( $file ), 'filename' => $bean->getFileName() ];
        if ( SpiceConfig::getInstance()->config['outputtemplates']['debug_mode'] ) $response['htmlOfPdfCreation'] = $bean->getHtmlOfPdfCreation();
        return $res->withJson( $response );
    }

    public function previewhtml(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        /** @var OutputTemplate $bean */
        $bean = BeanFactory::getBean('OutputTemplates');

        $bean->id = $body['id'];
        $bean->body = $body['body'];
        $bean->header = $body['header'];
        $bean->footer = $body['footer'];
        $bean->stylesheet_id = $body['stylesheet_id'];
        $bean->module_name = $body['parentype'];
        $bean->bean_id = $body['parentid'];
        return $res->withJson(['content' => $bean->translateBody(), 'filename' => $bean->getFileName()]);

    }

    public function convertToFormat(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        $file = $bean->getPdfContent();
        $res->getBody()->write($file);
        return $res->withHeader('Content-Type', 'application/pdf');
    }

    public function convertToBase64(Request $req, Response $res, array $args): Response {

        $params = $req->getParsedBody();

        /** @var OutputTemplate $outputTemplate */
        $outputTemplate = BeanFactory::getBean('OutputTemplates', $args['id']);
        $outputTemplate->bean_id = $args['bean_id'];

        if (is_array($params['bean_data']) && count($params['bean_data']) > 0) {

            $params['bean_data']['id'] = $args['bean_id'];
            $content = $this->liveCompile($outputTemplate, $params['bean_data']);
        } else {
            $content = $outputTemplate->getPdfContent();
        }

        return $res->withJson(['content' => base64_encode($content), 'filename' => $outputTemplate->getFileName()]);
    }

    /**
     * returns the templates for the bean
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getModuleTemplates(Request $req, Response $res, array $args): Response {
        $bean = $args['id'] ? BeanFactory::getBean($args['module'], $args['id']) : BeanFactory::getBean($args['module']) ;
        return $res->withJson($bean->getOutputTemplates());
    }

    public function getTemplateFunctions( Request $req, Response $res, array $args ): Response
    {
        $db = DBManagerFactory::getInstance();
        $functions = [ 'pipe' => [], 'noPipe' => [] ];
        $dbResult = $db->query('SELECT name, no_pipe, param_configs FROM systemplatefunctions UNION SELECT name, no_pipe, param_configs FROM syscustomtemplatefunctions');
        while ( $function = $db->fetchByAssoc( $dbResult )) {
            if ( $function['no_pipe'] === '1' ) $functions['noPipe'][] = ['name'=>$function['name'],'paramConfigs'=>json_decode($function['param_configs'])];
            else $functions['pipe'][] = ['name'=>$function['name'],'paramConfigs'=>json_decode($function['param_configs'])];
        }
        return $res->withJson( $functions );
    }

    /**
     * save the bean data temporary to generate the template content from and rollback the changes
     * @param $outputTemplate
     * @param array $beanData
     * @return string
     * @throws ConflictException
     * @throws Exception
     * @throws NotFoundException
     */
    public function liveCompile($outputTemplate, array $beanData): string
    {

        $db = DBManagerFactory::getInstance();

        $moduleHandler = new SpiceBeanHandler();
        $moduleHandler->add_bean($outputTemplate->module_name, $beanData['id'], $beanData);

        $content = $outputTemplate->getPdfContent();

        // rollback all transactions to prevent saving the temporary data we got for the pdf content
        $db->transactionRollback();
        SpiceFTSHandler::getInstance()->rollbackTransaction();
        SpiceSocket::getInstance()->rollbackTransaction();

        // start new transactions again for further processing
        $db->transactionStart();
        SpiceFTSHandler::getInstance()->startTransaction();
        SpiceSocket::getInstance()->startTransaction();



        return $content;
    }
}
