<?php
namespace SpiceCRM\modules\EmailTemplates\KREST\controllers;

use Psr\Http\Message\RequestInterface;
use SpiceCRM\includes\SpiceSlim\SpiceResponse;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use Slim\Routing\RouteCollectorProxy;

class EmailTemplatesController{

    /**
     * loads an email template
     * @param $req RequestInterface
     * @param $res SpiceResponse
     * @param $args
     * @return mixed
     */

    public function LoadEmailTemplate($req,$res,$args){
        $db = DBManagerFactory::getInstance();
        $template_list = [];

        $res = $db->query("SELECT id, name FROM email_templates
                WHERE type = 'bean2mail' AND (for_bean = '{$args['module']}' OR for_bean = '*' )");
        while($row = $db->fetchByAssoc($res)) $template_list[] = $row;

        return $res->withJson($template_list);
    }

    /**
     * formats the email
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function FormatEmail($req,$res,$args){
        global $app_list_strings, $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $app_list_strings = return_app_list_strings_language($current_language);

        $return = [
            'name' => '',
            'description_html' => ''
        ];
        $tpl = BeanFactory::getBean("EmailTemplates",$args['id']);
        $bean = BeanFactory::getBean($args['module'], $args['parent']);
        $parsedTpl = $tpl->parse($bean);

        return $res->withJson([
            'subject' => $parsedTpl['subject'],
            'body_html' => from_html(wordwrap($parsedTpl['body_html'], true)),
            'body' => $parsedTpl['body'],
        ]);
    }

    /**
     * gets the body of an email
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */

    public function GetEmailBody($req,$res,$args){
        $params = $req->getParsedBody();
        $emailTemplate = BeanFactory::getBean("EmailTemplates");
        $emailTemplate->body_html = $params['html'];
        $bean = BeanFactory::getBean($args['module'], $args['parent']);
        $parsedTpl = $emailTemplate->parse($bean);

        return $res->withJson(['html' => from_html(wordwrap($parsedTpl['body_html'], true))]);
    }

}