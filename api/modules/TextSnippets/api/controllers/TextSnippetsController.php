<?php

namespace SpiceCRM\modules\TextSnippets\api\controllers;

use Exception;
use SpiceCRM\data\BeanFactory;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\utils\SpiceUtils;
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
        $params = $req->getQueryParams();
        /** @var TextSnippet $textSnippet */
        $textSnippet = BeanFactory::getBean("TextSnippets", $args['id']);
        $modelData = json_decode($params['bean_data']);

        $bean = BeanFactory::getBean($params['module']);
        $bean->id = SpiceUtils::createGuid();

        foreach ($modelData as $field => $value) {
            $bean->$field = $value;
        }

        return $res->withJson(['html' => $textSnippet->parse($bean)]);
    }
}