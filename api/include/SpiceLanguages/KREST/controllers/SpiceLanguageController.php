<?php

namespace SpiceCRM\includes\SpiceLanguages\KREST\controllers;

use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceLanguages\SpiceLanguagesRESTHandler;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use Slim\Routing\RouteCollectorProxy;

class SpiceLanguageController{

    /**
     * saves the labels
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws BadRequestException
     * @throws ForbiddenException
     */

    public function LanguageSaveLabel($req, $res, $args){
        $handler = new SpiceLanguagesRESTHandler();
        $result = $handler->saveLabels($req->getParsedBody());
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

    public function LanguageDeleteLabel($req, $res, $args){
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

    public function LanguageSearchLabel($req, $res, $args){
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

    public function LanguageGetLabel($req, $res, $args){
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

    public function LanguageLoadDefault($req, $res, $args){
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

    public function LanguageSetDefault($req, $res, $args){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if(!$current_user->is_admin){
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

    public function LanguageTransferToDB($req, $res, $args){
        $handler = new SpiceLanguagesRESTHandler();
        if ( !AuthenticationController::getInstance()->getCurrentUser()->is_dev )
            throw (new ForbiddenException('No development privileges.'))->setErrorCode('notDeveloper');

        if ( $req->getParsedBody()['confirmed'] !== true )
            throw (new BadRequestException('Operation not confirmed.'))->setErrorCode('notConfirmed');

        $result = $handler->transferFromFilesToDB( $args );
        if ( $result === false ) return $res->withJson(['success' => false]);
        else return $res->withJson( $result );


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

    public function LanguageGetRawLabels($req, $res, $args){
        $handler = new SpiceLanguagesRESTHandler();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');
        }

        return $res->withJson($handler->getUntranslatedLabels($args['language'], $args['scope']));

    }

}