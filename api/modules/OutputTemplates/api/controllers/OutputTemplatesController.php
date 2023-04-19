<?php
/*********************************************************************************
 * This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition
 * and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.
 * You can contact us at info@spicecrm.io
 * 
 * SpiceCRM is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version
 * 
 * The interactive user interfaces in modified source and object code versions
 * of this program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU Affero General Public License version 3.
 * 
 * In accordance with Section 7(b) of the GNU Affero General Public License version 3,
 * these Appropriate Legal Notices must retain the display of the "Powered by
 * SugarCRM" logo. If the display of the logo is not reasonably feasible for
 * technical reasons, the Appropriate Legal Notices must display the words
 * "Powered by SugarCRM".
 * 
 * SpiceCRM is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/


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

class OutputTemplatesController
{
    public function compile(Request $req, Response $res, array $args): Response {
        $bean = BeanFactory::getBean('OutputTemplates', $args['id']);
        $bean->bean_id = $args['bean_id'];
        return $res->withJson(['content' => $bean->translateBody()]);

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

        $response = [ 'content' => base64_encode( $file ) ];
        if ( SpiceConfig::getInstance()->config['outputtemplates']['debug_mode'] ) $response['htmlOfPdfCreation'] = $bean->getHtmlOfPdfCreation();
        return $res->withJson( $response );
    }

    public function previewhtml(Request $req, Response $res, array $args): Response {
        $body = $req->getParsedBody();
        $bean = BeanFactory::getBean('OutputTemplates');

        $bean->id = $body['id'];
        $bean->body = $body['body'];
        $bean->header = $body['header'];
        $bean->footer = $body['footer'];
        $bean->stylesheet_id = $body['stylesheet_id'];
        $bean->module_name = $body['parentype'];
        $bean->bean_id = $body['parentid'];
        return $res->withJson(['content' => $bean->translateBody()]);

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

        $outputTemplate = BeanFactory::getBean('OutputTemplates', $args['id']);
        $outputTemplate->bean_id = $args['bean_id'];

        if (is_array($params['bean_data']) && count($params['bean_data']) > 0) {

            $params['bean_data']['id'] = $args['bean_id'];
            $content = $this->liveCompile($outputTemplate, $params['bean_data']);
        } else {
            $content = $outputTemplate->getPdfContent();
        }

        return $res->withJson(['content' => base64_encode($content)]);
    }

    public function getModuleTemplates(Request $req, Response $res, array $args): Response {
        $templates = [];
        $bean = BeanFactory::getBean('OutputTemplates');
        $beans = $bean->get_full_list('name', "module_name='{$args['module']}'");
        foreach ($beans as $bean) {
            $templates[] = [
                'id' => $bean->id,
                'name' => $bean->name,
                'language' => $bean->language
            ];
        };
        return $res->withJson($templates);
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
