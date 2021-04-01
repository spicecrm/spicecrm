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

namespace SpiceCRM\includes\SpiceFTSManager\KREST\controllers;

use SpiceCRM\includes\SpiceFTSManager\SpiceFTSRESTManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;

class FTSManagerRESTController {



    /**
     * SpiceFTSRESTController constructor.
     * initialize ftsHandler
     */
/*    public function __construct()
    {
        $this->ftsManager = new SpiceFTSRESTManager;
    }*/

    /**
     * get modules list
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getModules($req, $res, $args)
    {
        $spiceFtsRestManager = new SpiceFTSRESTManager();
        return $res->withJson($spiceFtsRestManager->getModules());
    }


    public function export($req, $res, $args) {
        $postBody = $req->getParsedBody();
        $charsetTo=SpiceFTSHandler::getInstance()->export($postBody);
        return $res->withHeader('Content-Type', 'text/csv; charset=' . $charsetTo);
    }

    /**
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
public function searchPhone($req, $res, $args) {
    // get post body or get Request param
    $postBody = $req->getParsedBody();
    $getParams = $req->getQueryParams();

    // replace leading 00 with +
    $phonenumber = $postBody['searchterm'] ?: $getParams['searchterm'];
    return $res->withJson(SpiceFTSHandler::getInstance()->searchPhone($phonenumber));
}


    public function search($req, $res, $args) {
        $postBody = $req->getParsedBody();
        return $res->withJson(SpiceFTSHandler::getInstance()->search($postBody));
    }
    /**
     * get index
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getIndex($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->getIndex());
    }

    /**
     * get nodes
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getNodes($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->getNodes());
    }

    /**
     * get fields
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getFields($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        $getParams = $req->getQueryParams();
        return $res->withJson($this->ftsManager->getFields($getParams['nodeid']));
    }

    /**
     * get analyzers
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getAnalyzers($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->getAnalyzers());
    }

    /**
     * initialize (create all indexes)
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     * @throws \SpiceCRM\includes\ErrorHandlers\ForbiddenException
     */
    public function initialize($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->initialize());
    }

    /**
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getFTSFields($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->getFTSFields($args['module']));
    }


    /**
     * get FTS index settings
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function getFTSSettings($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->getFTSSettings($args['module']));
    }

    /**
     * delete FTS index settings
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteIndexSettings($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->deleteIndexSettings($args['module']));
    }

    /**
     * set FTS fields
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function setFTSFields($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        $items = $req->getParsedBody();

        // clear any session cached data for the module
        unset($_SESSION['SpiceFTS']['indexes'][$args['module']]);

        return $res->withJson($this->ftsManager->setFTSFields($args['module'], $items));
    }

    /**
     * index data
     * @param $req
     * @param $res
     * @param $args
     */
    public function index($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        set_time_limit(300);


        $params = $req->getQueryParams();
        if ($params['resetIndexDates']) {
            SpiceFTSHandler::getInstance()->resetIndexModule($args['module']);
        }

        if ($params['bulkAmount'] != 0) {
            ob_start();
            SpiceFTSHandler::getInstance()->indexModuleBulk($args['module'], $params['bulkAmount']); //CR1000257
            $message = ob_get_clean();
        }

        return $res->withJson(['status' => 'success', 'message' => $message]);
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function deleteIndex($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();
        return $res->withJson($this->ftsManager->deleteIndex($args['module']));
    }

    /**
     *
     * @param $req
     * @param $res
     * @param $args
     * @return mixed
     */
    public function resetIndex($req, $res, $args)
    {
        $this->ftsManager = new SpiceFTSRESTManager();

        // delete and recreate the index
        $this->ftsManager->deleteIndex($args['module']);
        $mapResults =  $this->ftsManager->mapModule($args['module']);

        if(!$mapResults->acknowledged){
            return $res->withJson([
                'status' => 'error',
                'type' => $mapResults->error->type,
                'message' => $mapResults->error->reason,
            ]);
        }

        // index the beans
        SpiceFTSHandler::getInstance()->resetIndexModule($args['module']);

        return $res->withJson(['status' => 'success']);
    }
}
