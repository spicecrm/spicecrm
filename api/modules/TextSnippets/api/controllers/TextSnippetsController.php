<?php

namespace SpiceCRM\modules\TextSnippets\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\modules\TextSnippets\TextSnippet;

class TextSnippetsController
{
    /**
     * live compile text snippet
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function liveCompile(Request $req, Response $res, array $args): Response
    {
        $params = $req->getParsedBody();
        /** @var TextSnippet $textSnippet */
        $textSnippet = BeanFactory::getBean("TextSnippets", $args['id']);

        $bean = null;

        if (!empty($params['bean_data'])) {

            $bean = BeanFactory::getBean($params['module']);

            foreach ($params['bean_data'] as $field => $value) {
                $bean->$field = $value;
            }
        }

        return $res->withJson(['html' => $textSnippet->parse($bean)]);
    }
}