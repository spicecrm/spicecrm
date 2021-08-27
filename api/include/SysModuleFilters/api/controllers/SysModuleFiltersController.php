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

namespace SpiceCRM\includes\SysModuleFilters\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\authentication\AuthenticationController;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class SysModuleFiltersController
{

    function __construct()
    {

    }

    private function checkAdmin()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        if (!$current_user->is_admin) {
            throw (new ForbiddenException('No administration privileges.'))->setErrorCode('notAdmin');

        }
    }

    function getFilters(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();

        $this->checkAdmin();

        $filters = [];
        $filtersObj = "SELECT 'global' As `scope`, fltrs.* FROM sysmodulefilters fltrs  WHERE fltrs.module = '{$args['module']}' UNION ";
        $filtersObj .= "SELECT 'custom' As `scope`, cfltrs.* FROM syscustommodulefilters cfltrs  WHERE cfltrs.module = '{$args['module']}'";
        $filtersObj = $db->query($filtersObj);
        while ($filter = $db->fetchByAssoc($filtersObj))
            $filters[] = $filter;

        return $res->withJson($filters);
    }

    function saveFilter(Request $req, Response $res, array $args): Response {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();
        $this->checkAdmin();
        $filterdata = $req->getParsedBody();
        // check if filter exists
        if (isset($filterdata['scope'])) {
            $table = $filterdata['scope'] == 'custom' ? 'syscustommodulefilters' : 'sysmodulefilters';
        } elseif ($filterdata['type']) {
            $table = $filterdata['type'] == 'custom' ? 'syscustommodulefilters' : 'sysmodulefilters';
        }
        $filter = $db->fetchByAssoc($db->query("SELECT * FROM $table WHERE id='{$args['filter']}'"));
        if ($filter) {
            $filterdefs = json_encode($filterdata['filterdefs']);
            $db->query("UPDATE $table SET name='{$filterdata['name']}', filterdefs='$filterdefs', filtermethod='".$db->quote($filterdata['filtermethod'])."', version='{$filterdata['version']}', package='{$filterdata['package']}' WHERE id = '{$args['filter']}'");

            $this->setCR('I', $args['filter'], "{$args['module']}/{$filterdata['name']}");
        } else {
            $filterdefs = json_encode($filterdata['filterdefs']);
            $db->query("INSERT INTO $table (id, created_by_id, module, name, filterdefs, filtermethod, version, package) VALUES('{$args['filter']}', '$current_user->id', '{$args['module']}', '{$filterdata['name']}', '$filterdefs', '".$db->quote($filterdata['filtermethod'])."', '{$filterdata['version']}', '{$filterdata['package']}')");

            $this->setCR('I', $args['filter'], "{$args['module']}/{$filterdata['name']}");
        }

        return $res->withJson(['success' => true]);
    }

    function deleteFilter(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $this->checkAdmin();
        $id = $db->quote($args['filter']);
        $resultGlobal = $db->query("DELETE FROM sysmodulefilters WHERE id = '$id'");
        $resultCustom = $db->query("DELETE FROM syscustommodulefilters WHERE id = '$id'");
        $this->setCR('D', $id);

        return $res->withJson($resultCustom && $resultGlobal);
    }

    /**
     * adds the filter to the CR if a CR is active
     *
     * @param $action
     * @param $id
     * @param $name
     */
    private function setCR($action, $id, $name = '')
    {
        // check if we have a CR set
        if ($_SESSION['SystemDeploymentCRsActiveCR'])
            $cr = BeanFactory::getBean('SystemDeploymentCRs', $_SESSION['SystemDeploymentCRsActiveCR']);

        if ($cr) {
            $cr->addDBEntry('sysmodulefilters', $id, $action, $name);
        }
    }
}

