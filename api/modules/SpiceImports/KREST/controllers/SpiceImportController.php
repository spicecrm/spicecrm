<?php

namespace SpiceCRM\modules\SpiceImports\KREST\controllers;

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SpiceACL\SpiceACL;


class SpiceImportController{

    /**
     * get the saved spice imports
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SpiceImportGetSaves($req, $res, $args){
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'list', true))
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))->setErrorCode('noModuleDetails');

        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->getSavedImports($args['beanName']));

    }

    /**
     * get the file previews
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SpiceImportGetFilePreview($req, $res, $args){
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'edit', true))
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))->setErrorCode('noModuleDetails');
        $params = $req->getQueryParams();
        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->getFilePreview($params));

    }

    /**
     * delete the import files
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SpiceImportDeleteFile($req, $res, $args){
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'delete', true))
            throw (new ForbiddenException("Forbidden to delete in module SpiceImports."))->setErrorCode('noModuleDelete');

        $filemd5 = $req->getParams()['filemd5'];
        $bean = BeanFactory::getBean('SpiceImports');
        return $res->withJson($bean->deleteImportFile($filemd5));

    }

    /**
     * saves data from an import
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SpiceImportSave($req, $res, $args){
            if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'edit', true))
                throw (new ForbiddenException("Forbidden for details in module SpiceImports."))->setErrorCode('noModuleDetails');

            $postParams = $req->getParams() ?: [];
            $bean = BeanFactory::getBean('SpiceImports');
            return $res->withJson($bean->saveFromImport($postParams));
    }

    /**
     * get the spice import log entries
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws ForbiddenException
     */

    public function SpiceImportGetLog($req, $res, $args){
        if (!SpiceACL::getInstance()->checkAccess('SpiceImports', 'detail', true))
            throw (new ForbiddenException("Forbidden for details in module SpiceImports."))->setErrorCode('noModuleDetails');

        $id = $args['importId'];
        $db = DBManagerFactory::getInstance();
        $logs = [];

        $res = $db->query("SELECT * FROM spiceimportlogs WHERE import_id = '$id'");
        while ($log = $db->fetchByAssoc($res))
            $logs[] = $log;

        return $res->withJson($logs);
    }


}