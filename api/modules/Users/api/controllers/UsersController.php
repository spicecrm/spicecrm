<?php

namespace SpiceCRM\modules\Users\api\controllers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\BadRequestException;
use SpiceCRM\includes\ErrorHandlers\ForbiddenException;
use SpiceCRM\includes\ErrorHandlers\NotFoundException;
use SpiceCRM\includes\SysModuleFilters\SysModuleFilters;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\includes\SpiceUI\api\controllers\SpiceUIModulesController;
use SpiceCRM\modules\SpiceACL\SpiceACL;
use Psr\Http\Message\ServerRequestInterface as Request;
use SpiceCRM\includes\SpiceSlim\SpiceResponse as Response;

class UsersController
{
    /**
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws NotFoundException
     * @throws \SpiceCRM\includes\ErrorHandlers\ConflictException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     */
    public function saveUser(Request $req, Response $res, array $args): Response {
        $db = DBManagerFactory::getInstance();
        $params = $req->getParsedBody();

        $email1 = $params['email1'];
        if (!empty($email1)) {
            $q = "select id from users where id in ( SELECT  er.bean_id AS id FROM email_addr_bean_rel er,
                email_addresses ea WHERE ea.id = er.email_address_id
                AND ea.deleted = 0 AND er.deleted = 0 AND er.bean_module = 'Users' AND email_address_caps IN ('{$db->quote($email1)}') )";

            $row = $db->fetchByAssoc($db->query($q));

            if ($row && $row['id'] != $params['id'])
                throw (new BadRequestException("Email already exists."))->setErrorCode('duplicateEmail1');

            $email1 = htmlspecialchars(stripslashes(trim($params['email1'])));
            if (!filter_var($email1, FILTER_VALIDATE_EMAIL))
                throw (new BadRequestException("Invalid email format."))->setErrorCode('invalidEmailFormat');
        }

        $KRESTModuleHandler = new ModuleHandler();
        $beanResponse = $KRESTModuleHandler->add_bean("Users", $args['id'], $params);

        return $res->withJson($beanResponse);
    }

    /**
     * setUserInactive
     *
     * Sets a user inactive.
     * You should know: Normally a user should not be deleted. Instead: Set to inactive.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function setUserInactive(Request $req, Response $res, array $args): Response {
        if (!SpiceACL::getInstance()->checkAccess('Users', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module Users."))->setErrorCode('noModuleEdit');

        $user = BeanFactory::getBean('Users');
        $user->retrieve($args['id']);
        if (!isset($user->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $args['id'], 'module' => 'Users']);

        if (!$user->ACLAccess('edit'))
            throw (new ForbiddenException('Forbidden to edit record.'))->setErrorCode('noRecordEdit');

        $user->status = 'Inactive';
        $user->save();

        return $res->withJson(['success' => true]);

    }


    /**
     * get modules and records count information before deactivating user
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     */
    public function getDeactivateUserStats(Request $req, Response $res, array $args): Response {
        $params = [];
        $params['userid'] = $args['id'];
        $list = $this->getReassignModuleData($params);
        return $res->withJson($list);
    }

    /**
     * CR1000453
     * get information about modules and records counts to reassign
     * @param $params
     * @param false $return_record_ids
     * @return array
     */
    public function getReassignModuleData($params, $get_records = false)
    {
        $list = [];

        // for deactivatesuser GET
        if (!isset($params['modules'])) {
            $params['modules'] = [];
        }

        // get modules
        $sysmoduleCtrl = new SpiceUIModulesController;
        $modules = $sysmoduleCtrl->getReassignModules($params['modules']);

        // build list
        foreach ($modules as $moduleid => $moduledata) {
            $list[$moduleid] = [
                'id' => $moduleid,
                'module' => $moduledata['module'],
                'totalcount' => $this->getRecordsCountForUser($moduledata['module'], $params['userid'], $moduledata['filterid'])
            ];
            // check on totalcount is null
            if (is_null($list[$moduleid]['totalcount'])) {
                unset($list[$moduleid]);
            }

            // get records count for user for deactivatesuser POST
            if ($get_records && $list[$moduleid]['totalcount'] > 0) {
                $list[$moduleid]['records'] = $this->getRecordsIdsForUser($moduledata['module'], $params['userid'], $moduledata['filterid']);
            }
        }
        return $list;
    }

    /**
     * CR1000453
     * get records count for user. consider module filter
     * @param $module
     * @param $userid
     * @param null $filterid
     */
    public function getRecordsCountForUser($module, $userid, $filterid = null)
    {
        $count = null;
        if ($tmpBean = BeanFactory::getBean($module)) {
            $addWhere = "";
            // check if assigned_user_id is defined
            if (isset($tmpBean->field_defs['assigned_user_id'])) {
                $q = "SELECT count(0) totalcount from {$tmpBean->table_name} WHERE assigned_user_id = '{$userid}' AND deleted=0";
                if (!empty($filterid)) {
                    $filter = new SysModuleFilters();
                    $addWhere .= " " . $filter->generateWhereClauseForFilterId($filterid);
                    if (!empty($addWhere)) {
                        $q .= ' AND ' . $addWhere;
                    }
                }
                if ($results = DBManagerFactory::getInstance()->query($q)) {
                    while ($row = DBManagerFactory::getInstance()->fetchByAssoc($results)) {
                        $count = $row['totalcount'];
                    }
                }

            }

            unset($tmpBean);
        }

        return $count;
    }

    /**
     * CR1000453
     * get records ids for user. consider module filter.
     * @param $module
     * @param $userid
     * @param null $filterid
     */
    public function getRecordsIdsForUser($module, $userid, $filterid = null)
    {
        $records = [];
        if ($tmpBean = BeanFactory::getBean($module)) {
            $addWhere = "";
            $q = "SELECT id from {$tmpBean->table_name} WHERE assigned_user_id = '{$userid}' AND deleted=0";
            if (!empty($filterid)) {
                $filter = new SysModuleFilters();
                $addWhere .= " " . $filter->generateWhereClauseForFilterId($filterid);
                if (!empty($addWhere)) {
                    $q .= ' AND ' . $addWhere;
                }
            }
            if ($results = DBManagerFactory::getInstance()->query($q)) {
                while ($row = DBManagerFactory::getInstance()->fetchByAssoc($results)) {
                    $records[] = $row['id'];
                }
            }
            unset($tmpBean);
        }

        return $records;
    }


    /**
     * CR1000453
     * getReassignModules
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws BadRequestException
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function deactivateUser(Request $req, Response $res, array $args): Response {
        $success = false;

        // grab post params
        $params = $req->getParsedBody();
        $params['userid'] = $args['id'];

        // check permissions
        if (!SpiceACL::getInstance()->checkAccess('Users', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module Users."))->setErrorCode('noModuleEdit');

        $user = BeanFactory::getBean('Users', $args['id']);
        if (!isset($user->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $args['id'], 'module' => 'Users']);

        if (isset($params['newuserid'])) {
            $newuser = BeanFactory::getBean('Users', $params['newuserid']);
            if (!isset($newuser->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $params['newuserid'], 'module' => 'Users']);

            if (!$user->ACLAccess('edit'))
                throw (new ForbiddenException('Forbidden to edit record.'))->setErrorCode('noRecordEdit');

            // get reassign data
            $reassigndata = $this->getReassignModuleData($params, true);

            // prepare queries to reassign user.
            // -> Update Query assigned_user_id, date_modified, modified_user_id
            // -> Audit entry
            foreach ($reassigndata as $moduleid => $data) {
                $tmpBean = BeanFactory::getBean($data['module']);
                // update query
                $q = "UPDATE {$tmpBean->table_name} SET assigned_user_id = '{$params['newuserid']}', modified_user_id='{\SpiceCRM\includes\authentication\AuthenticationController::getInstance()->getCurrentUser()->id}', date_modified='" . gmdate(TimeDate::getInstance()->nowDb()) . "'
                WHERE assigned_user_id='{$params['userid']}' AND  deleted=0";
                if (!empty($data['filterid'])) {
                    $filter = new SysModuleFilters();
                    $q .= " AND " . $filter->generateWhereClauseForFilterId($data['filterid']);
                }
                if (!$tmpBean->db->query($q)) {
                    throw (new BadRequestException("Update Query error: " . $q))->setErrorCode('400');
                }

                // audit query
                if ($tmpBean->get_audit_table_name()) {
                    foreach ($data['records'] as $record) {
                        $tmpBean->id = $record;
                        $changes = ['field_name' => 'assigned_user_id', 'data_type' => 'id', 'before' => $params['userid'], 'after' => $params['newuserid']];
                        $tmpBean->db->save_audit_records($tmpBean, $changes);
                    }
                }
                unset($tmpBean);
            }
        }

        // set user inactive
        $success = $this->setUserStatus($params['userid'], 'Inactive');

        // return
        return $res->withJson(['success' => $success]);
    }

    /**
     * CR1000453
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     * @return Response
     * @throws ForbiddenException
     * @throws NotFoundException
     */
    public function activateUser(Request $req, Response $res, array $args): Response {

        // check permissions
        if (!SpiceACL::getInstance()->checkAccess('Users', 'edit', true))
            throw (new ForbiddenException("Forbidden to edit in module Users."))->setErrorCode('noModuleEdit');

        $user = BeanFactory::getBean('Users', $args['id']);
        if (!isset($user->id)) throw (new NotFoundException('Record not found.'))->setLookedFor(['id' => $args['id'], 'module' => 'Users']);

        // return
        return $res->withJson(['success' => $this->setUserStatus($args['id'], 'Active')]);
    }


    /**
     * CR1000453
     * @param $userid
     * @param $status
     * @param null $employeestatus
     * @return bool
     */
    public function setUserStatus($userid, $status, $employeestatus = null)
    {
        $success = false;
        $user = BeanFactory::getBean('Users', $userid);
        $user->status = $status;

        // BWC
        if (empty($employeestatus)) {
            $user->employee_status = $user->status;
        }

        if ($user->save()) {
            $success = true;
        }
        return $success;
    }

}
