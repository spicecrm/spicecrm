<?php
namespace SpiceCRM\modules\EmailTemplates\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class EmailTemplatesController{

    /**
     * loads an email template
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function loadEmailTemplate(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $template_list = [];

        $res = $db->query("SELECT id, name FROM email_templates
                WHERE deleted=0 AND type = 'bean2mail' AND (for_bean = '{$args['parentmodule']}' OR for_bean = '*' )");
        while($row = $db->fetchByAssoc($res)) $template_list[] = $row;

        return $res->withJson($template_list);
    }

    /**
     * formats the email
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function formatEmail(Request $req, Response $res, array $args): Response {
        global $app_list_strings, $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $app_list_strings = return_app_list_strings_language($current_language);

        $return = [
            'name' => '',
            'description_html' => ''
        ];
        $tpl = BeanFactory::getBean("EmailTemplates",$args['id']);
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);
        $parsedTpl = $tpl->parse($bean);

        return $res->withJson([
            'subject' => $parsedTpl['subject'],
            'body_html' => from_html(wordwrap($parsedTpl['body_html'], true)),
            'body' => $parsedTpl['body'],
        ]);
    }

    /**
     * gets the body of an email
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getEmailBody(Request $req, Response $res, array $args): Response {
        $params = $req->getParsedBody();
        $emailTemplate = BeanFactory::getBean("EmailTemplates", $args['id']);
        $emailTemplate->body_html = $params['html'];
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);
        $parsedTpl = $emailTemplate->parse($bean);

        return $res->withJson(['html' => from_html(wordwrap($parsedTpl['body_html'], true))]);
    }

}