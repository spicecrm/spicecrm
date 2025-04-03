<?php

namespace SpiceCRM\includes\TXControlEditor\api\controllers;

use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\Logger\APILogEntryHandler;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TXControlEditor\TXControlHandler;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class TXControlEditorController
{
    /**
     * get the editor settings
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function getSettings(Request $req, Response $res, array $args): Response
    {
        $config = (object) SpiceConfig::getInstance()->get('DocXEditor');
        $result = TXControlHandler::getInstance()->getToken();

        return $res->withJson(['scriptUrl' => $config->scriptUrl,'token' => $result->access_token, 'serverUrl' => $config->serverUrl]);
    }

    /**
     * parse content
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws Exception
     */
    public function parseContent(Request $req, Response $res, array $args): Response
    {
        if (!SpiceACL::getInstance()->checkAccess($args['module'], 'edit', true)) {
            throw (new ForbiddenException("Forbidden to edit in module {$args['module']}."))->setErrorCode('noModuleEdit');
        }

        $bean = BeanFactory::getBean($args['module'], $args['beanId']);

        if (!$bean->ACLAccess('edit')) {
            throw (new ForbiddenException('Forbidden to edit record.'))->setErrorCode('noRecordEdit');
        }

        $payload = (object) $req->getParsedBody();
        $parsedContent = TXControlHandler::getInstance()->parse($payload->content, $payload->format, $bean);
        return $res->withJson(['content' => $parsedContent]);
    }
}