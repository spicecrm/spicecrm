<?php

namespace SpiceCRM\modules\TextSnippets\api\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\includes\utils\SpiceUtils;

class TextSnippetsController
{

    /**
     * loads an text snippets for a modul
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function loadTextSnippets(Request $req, Response $res, array $args): Response
    {
        $db = DBManagerFactory::getInstance();
        $template_list = [];

        $res = $db->query("
            SELECT 
                id, 
                name 
            FROM 
                text_snippets
            WHERE 
                deleted=0 AND 
                type = 'bean2mail' AND 
                (
                    for_bean = '{$args['parentmodule']}' OR 
                    for_bean = '*' 
                )
        ");

        while ($row = $db->fetchByAssoc($res)) $template_list[] = $row;

        return $res->withJson($template_list);
    }

    /**
     * formats the text snippet
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws \Exception
     */
    public function formatTextSnippet(Request $req, Response $res, array $args): Response
    {
        global $app_list_strings, $current_language;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $app_list_strings = SpiceUtils::returnAppListStringsLanguage($current_language);

        $tpl = BeanFactory::getBean("TextSnippets", $args['id']);
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);
        $parsedTpl = $tpl->parse($bean);

        return $res->withJson([
            'body' => $parsedTpl['body'],
        ]);
    }

    /**
     * gets the parsed text snippet
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getTextSnippet(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        $textSnippet = BeanFactory::getBean("TextSnippets", $args['id']);
        $textSnippet->body = $params['html'];
        $bean = BeanFactory::getBean($args['parentmodule'], $args['parentid']);
        $parsedTpl = $textSnippet->parse($bean);

        return $res->withJson(['html' => $parsedTpl['html']]);
    }

}