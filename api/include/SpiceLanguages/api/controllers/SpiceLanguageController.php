<?php

namespace SpiceCRM\includes\SpiceLanguages\api\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguagesRESTHandler;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use Slim\Routing\RouteCollectorProxy;
use Slim\Psr7\Request as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SpiceLanguageController
{

    /**
     * saves the labels
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageSaveLabel(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $labels = $req->getParsedBody();
        $result = $handler->saveLabels($labels);
        return $res->withJson($result);

    }

    /**
     * deletes a label name
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageDeleteLabel(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $result = $handler->deleteLabel($args['id'], $args['environment']);
        return $res->withJson($result);

    }

    /**
     * search for a label
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageSearchLabel(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $result = $handler->searchLabels($args['search_term']);
        return $res->withJson($result);
    }

    /**
     * gets a label by name
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageGetLabel(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $result = $handler->retrieveLabelDataByName($args['label_name']);
        return $res->withJson($result);
    }


    /**
     * loads the default language
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageLoadDefault(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $params = $req->getQueryParams();
        $params['language'] = $args['language'];
        $result = $handler->loadSysLanguages($params);
        return $res->withJson($result);

    }

    /**
     * sets a default language
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageSetDefault(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (!$current_user->is_admin) {
            return $res->withJson(['success' => false]);
        }

        $db->query("UPDATE syslangs SET is_default = 0 WHERE is_default = 1");
        $db->query("UPDATE syslangs SET is_default = 1 WHERE language_code = '{$args['language']}'");

        return $res->withJson(['success' => true]);

    }

    /**
     * transfers value from a file to a database
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageTransferToDB(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        if (!AuthenticationController::getInstance()->getCurrentUser()->is_dev)
            throw (new ForbiddenException('No development privileges.'))->setErrorCode('notDeveloper');

        if ($req->getParsedBody()['confirmed'] !== true)
            throw (new BadRequestException('Operation not confirmed.'))->setErrorCode('notConfirmed');

        $result = $handler->transferFromFilesToDB();
        if ($result === false) return $res->withJson(['success' => false]);
        else return $res->withJson($result);


    }

    /**
     * get the untranslated labels
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageGetRawLabels(Request $req, Response $res, array $args): Response
    {
        $handler = new SpiceLanguagesRESTHandler();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        }

        return $res->withJson($handler->getUntranslatedLabels($args['language'], $args['scope']));

    }

}