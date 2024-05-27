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

use Exception;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\modules\SystemDeploymentCRs\SystemDeploymentCR;
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
        $filtersObj = "SELECT 'global' filterscope, fltrs.* FROM sysmodulefilters fltrs  WHERE fltrs.module = '{$args['module']}' UNION ";
        $filtersObj .= "SELECT 'custom' filterscope, cfltrs.* FROM syscustommodulefilters cfltrs  WHERE cfltrs.module = '{$args['module']}'";
        $filtersObj = $db->query($filtersObj);
        while ($filter = $db->fetchByAssoc($filtersObj)) {
            $filter['scope'] = $filter['filterscope'];
            unset($filter['filterscope']);
            $filters[] = $filter;
        }

        return $res->withJson($filters);
    }

    /**
     * @throws ForbiddenException
     * @throws Exception
     */
    function saveFilter(Request $req, Response $res, array $args): Response
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $this->checkAdmin();
        $filterdata = $req->getParsedBody();

        if (isset($filterdata['scope'])) {
            $table = $filterdata['scope'] == 'custom' ? 'syscustommodulefilters' : 'sysmodulefilters';
        } elseif ($filterdata['type']) {
            $table = $filterdata['type'] == 'custom' ? 'syscustommodulefilters' : 'sysmodulefilters';
        }

        $data = [
            'id' => $args['filter'],
            'created_by_id' => $filterdata['created_by_id'] ?? $current_user->id,
            'module' => $args['module'],
            'name' => $filterdata['name'],
            'filterdefs' => json_encode($filterdata['filterdefs']),
            'filtermethod' => $filterdata['filtermethod'],
            'version' => $filterdata['version'],
            'package' => $filterdata['package'],
        ];

        SystemDeploymentCR::writeDBEntry($table, $data['id'], $data, "{$args['module']}/{$filterdata['name']}");

        return $res->withJson(['success' => true]);
    }

    /**
     * @throws ForbiddenException
     * @throws Exception
     */
    function deleteFilter(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $this->checkAdmin();
        $id = $db->quote($args['filter']);
        SystemDeploymentCR::deleteDBEntry('sysmodulefilters', $id, "sysmodulefilters/{$args['module']}");
        SystemDeploymentCR::deleteDBEntry('syscustommodulefilters', $id, "syscustommodulefilters/{$args['module']}");

        return $res->withJson(true);
    }
}

