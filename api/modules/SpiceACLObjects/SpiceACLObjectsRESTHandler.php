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
namespace SpiceCRM\modules\SpiceACLObjects;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\KREST\handlers\ModuleHandler;
use SpiceCRM\modules\SpiceACLObjects\SpiceACLObject;
use stdClass;

class SpiceACLObjectsRESTHandler
{
    /**
     * get usage count of SpiceACLObjects for all modules
     * @return mixed
     */
    public function getAuthTypes(){
        $seed = BeanFactory::getBean('SpiceACLObjects');
        return $seed->generateTypes();
    }

    /**
     * @param string $id sysmoduleid
     * @return array
     * @throws \Exception
     */
    public function getACLModule($id) {
        $db = DBManagerFactory::getInstance();

        $retArray = [
            'type' => $db->fetchByAssoc($db->query("SELECT sysmodules.id, sysmodules.module FROM sysmodules WHERE id = '$id' UNION SELECT syscustommodules.id, syscustommodules.module FROM syscustommodules WHERE id = '$id'")),
            'authtypefields' => [],
            'authtypeactions' => []
        ];

        // get field values
        $authTypeFields = $db->query("SELECT id, name FROM spiceaclmodulefields WHERE sysmodule_id = '$id'");
        while ($authTypeField = $db->fetchByAssoc($authTypeFields)) {
            $retArray['authtypefields'][] = $authTypeField;
        }

        // get action values
        $authTypeFields = $db->query("SELECT id, action FROM spiceaclmoduleactions WHERE sysmodule_id = '$id'");
        while ($authTypeField = $db->fetchByAssoc($authTypeFields)) {
            $retArray['authtypeactions'][] = $authTypeField;
        }

        return $retArray;
    }

    /**
     * @param $typeId
     * @param $field
     * @return array
     * @throws \Exception
     */
    public function addACLModuleField($typeId, $field)
    {
        $db = DBManagerFactory::getInstance();
        $newId = create_guid();
        $db->query("INSERT INTO spiceaclmodulefields (id, sysmodule_id, name) VALUES('$newId','$typeId','$field')");

        return [
            'id' => $newId,
            'name' => $field
        ];
    }

    /**
     * delete record in table spiceaclmodulefields
     *
     * @param $id
     * @return bool[]
     * @throws \Exception
     */
    public function deleteACLModuleField($id)
    {
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM spiceaclmodulefields WHERE id = '$id'");
        return ['success' => true];
    }

    /**
     * get actions defined for module
     *
     * @param $sysmoduleid
     * @return array
     * @throws \Exception
     */
    public function getACLModuleActions($sysmoduleid) {
        $db = DBManagerFactory::getInstance();
        $actions = [];
        $actionsObj = $db->query("SELECT * FROM spiceaclmoduleactions WHERE sysmodule_id ='$sysmoduleid'");
        while($action = $db->fetchByassoc($actionsObj)){
            $actions[] = [
                'id' => $action['id'],
                'action' => $action['action']
            ];
        }
        return $actions;
    }

    /**
     * @param $sysmoduleid
     * @param $action
     * @return array
     * @throws \Exception
     */
    public function addACLModuleAction($sysmoduleid, $action)
    {
        $db = DBManagerFactory::getInstance();
        $actionId = create_guid();
        $db->query("INSERT INTO spiceaclmoduleactions (id, sysmodule_id, action) VALUES('$actionId', '$sysmoduleid', '$action')");
        return [
            'id' => $actionId,
            'action' => $action
        ];
    }

    /**
     * @param $id
     * @return bool[]
     * @throws \Exception
     */
    public function deleteACLModuleAction($id)
    {
        $db = DBManagerFactory::getInstance();
        $db->query("DELETE FROM spiceaclmoduleactions WHERE id = '$id'");
        return ['success' => true];
    }

    /**
     * get SpiceACLObjects all | by module | by search term
     * @param $params
     * @return array
     */
    public function getSpiceACLObjects($params)
    {
        $addFilter = '';

        if (isset($params['moduleid'])){
            $addFilter= "spiceaclobjects.sysmodule_id = '" . $params['moduleid'] . "'";
        }

        if (isset($params['searchterm'])) {
            if($addFilter != '') $addFilter .= ' AND ';
            $addFilter .= "spiceaclobjects.name like '%" . $params['searchterm'] . "%'";
        }

        $seed = BeanFactory::getBean('SpiceACLObjects');
        $list = $seed->get_full_list('name', $addFilter);

        $retArray = [];
        $resthandler = new ModuleHandler();
        foreach($list as $aclObject){
            $retArray[] = $resthandler->mapBeanToArray('SpiceACLObjects', $aclObject);
        }

        return $retArray;
    }

    /**
     * activate SpiceACLObject
     *
     * @param $id
     * @return mixed
     */
    public function activateObject($id)
    {
        $object = BeanFactory::getBean('SpiceACLObjects', $id);
        return $object->activate();
    }

    /**
     * deactivate SpiceACLObject
     *
     * @param $id
     * @return mixed
     */
    public function deactivateObject($id)
    {
        $object = BeanFactory::getBean('SpiceACLObjects', $id);
        return $object->deactivate();
    }

    /**
     * function to set default ACLObjects for module
     *
     * @param $app
     * @param $module_params
     * @return array|null
     * @throws \SpiceCRM\includes\ErrorHandlers\ConflictException
     * @throws \SpiceCRM\includes\ErrorHandlers\Exception
     * @throws \SpiceCRM\includes\ErrorHandlers\NotFoundException
     */
    public function createDefaultACLObjectsForModule($app, $module_params)
    {
        //get the module name
        //get all objects for the module
        $module = $module_params["moduleid"];
        $module_name = $module_params["modulename"];

        $objects = json_encode($this->getSpiceACLObjects($module));

        // check if the module has no objects and the module supports acl
        if(empty($objects)){
            return null;
        }

        //Actions
        $list = new stdClass();
        $list->spiceaclaction_id = "list";

        $listrelated = new stdClass();
        $listrelated->spiceaclaction_id = "listrelated";

        $view = new stdClass();
        $view->spiceaclaction_id = "view";

        $edit = new stdClass();
        $edit->spiceaclaction_id = "edit";

        $editrelated = new stdClass();
        $editrelated->spiceaclaction_id = "editrelated";

        $create = new stdClass();
        $create->spiceaclaction_id = "create";

        $deleterelated = new stdClass();
        $deleterelated->spiceaclaction_id = "deleterelated";

        $delete = new stdClass();
        $delete->spiceaclaction_id = "delete";

        $export = new stdClass();
        $export->spiceaclaction_id = "export";

        $import = new stdClass();
        $import->spiceaclaction_id = "import";



        // default objects
        $accounts_manage_own = new SpiceACLObject();
        $accounts_manage_own->name = $module_name . ' manage own';
        $accounts_manage_own->spiceaclowner = '1';
        $accounts_manage_own->objectactions = [$list, $listrelated, $view, $edit, $editrelated, $create, $deleterelated];

        $accounts_access_all = new SpiceACLObject();
        $accounts_access_all->name = $module_name . ' access all';
        $accounts_access_all->spiceaclowner = '0';
        $accounts_access_all->objectactions = [$list, $listrelated, $view];

        $accounts_manage_all = new SpiceACLObject();
        $accounts_manage_all->name = $module_name . ' manage all';
        $accounts_manage_all->spiceaclowner = '0';
        $accounts_manage_all->objectactions = [$list, $listrelated, $view, $edit, $editrelated, $create, $deleterelated];

        $accounts_import_all = new SpiceACLObject();
        $accounts_import_all->name = $module_name . ' import all';
        $accounts_import_all->spiceaclowner = '0';
        $accounts_import_all->objectactions = [$list, $listrelated, $view, $edit, $editrelated, $create, $import];

        $accounts_export_own = new SpiceACLObject();
        $accounts_export_own->name = $module_name . ' export own';
        $accounts_export_own->spiceaclowner = '1';
        $accounts_export_own->objectactions = [$list, $listrelated, $view, $export];

        $accounts_export_all = new SpiceACLObject();
        $accounts_export_all->name = $module_name . ' export all';
        $accounts_export_all->spiceaclowner = '0';
        $accounts_export_all->objectactions = [$list, $listrelated, $view, $export];

        $accounts_delete_own = new SpiceACLObject();
        $accounts_delete_own->name = $module_name . ' manage+delete own';
        $accounts_delete_own->spiceaclowner = '1';
        $accounts_delete_own->objectactions = [$list, $listrelated, $view, $edit, $editrelated, $create, $deleterelated, $delete];

        $accounts_delete_all = new SpiceACLObject();
        $accounts_delete_all->name = $module_name . ' manage+delete all';
        $accounts_delete_all->spiceaclowner = '0';
        $accounts_delete_all->objectactions = [$list, $listrelated, $view, $edit, $editrelated, $create, $deleterelated, $delete];

        $allObjects = [];
        array_push($allObjects, $accounts_manage_own);
        array_push($allObjects, $accounts_delete_own);
        array_push($allObjects, $accounts_import_all);
        array_push($allObjects, $accounts_delete_all);
        array_push($allObjects, $accounts_access_all);
        array_push($allObjects, $accounts_export_own);
        array_push($allObjects, $accounts_manage_all);
        array_push($allObjects, $accounts_export_all);

        $returnArray = [];
        // go through the objects and set the data, which are equal to all objects && save the objects
        foreach ($allObjects as $object) {

            $object->id = create_guid();
            $object->status = "d";
            $object->spiceaclobjecttype = "0";
            $object->sysmodule_id = $module;
            $object->spiceacltype_module = $module_name;

            //set description text
            if($object->spiceaclowner == '1') {
                $object->description = 'This object is limited to its own records! Following actions are allowed: ';
            } else {
                $object->description = 'Following actions are allowed for ALL entries: ';
            }

            // set object ids for actions && write actions to description
            foreach ($object->objectactions as $action) {
                $action->spiceaclobject_id = $object->id;
                $object->description .= $action->spiceaclaction_id . ", ";
            }

            $object->objectactions = json_encode($object->objectactions);
            $KRESTModuleHandler = new ModuleHandler($app);
            // save the object
            array_push($returnArray, $KRESTModuleHandler->add_bean('SpiceACLObjects', $object->id, (array)$object));
        }
        return $returnArray;
    }

///////////////////////////////////////////////////////////////////////////////////////
//    public function deleteAuthType($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("DELETE FROM kauthtypes WHERE id = '$id'");
//
//        return true;
//    }
//
//    public function getAuthObject($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [
//            'object' => $db->fetchByAssoc($db->query("SELECT * FROM kauthobjects WHERE id = '$id'"))
//        ];
//
//        $orgValues = $db->query("SELECT value, korgobjectelement_id FROM kauthobjectorgelementvalues WHERE kauthobject_id = '$id'");
//        while ($orgValue = $db->fetchByAssoc($orgValues)) {
//            $orgValue['displayvalue'] = implode(', ', json_decode(html_entity_decode($orgValue['value']), true));
//            $retArray['orgvalues'][] = $orgValue;
//        }
//
//        $fieldValues = $db->query("SELECT kauthtypefield_id, operator, value1, value2 FROM kauthobjectvalues WHERE kauthobject_id = '$id'");
//        while ($fieldValue = $db->fetchByAssoc($fieldValues))
//            $retArray['fieldvalues'][] = $fieldValue;
//
//        $fieldControls = $db->query("SELECT kauthobject_id, field, control FROM kauthobjectfields WHERE kauthobject_id = '$id'");
//        while ($fieldControl = $db->fetchByAssoc($fieldControls)) {
//            $retArray['fieldcontrols'][] = $fieldControl;
//        }
//
//        return $retArray;
//    }

//    public function addAuthObject($id, $params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("INSERT INTO kauthobjects (id, kauthtype_id, kauthobjecttype, name, status, kauthorgassignment, kauthowner, allorgobjects, activity) values ('$id', '" . $params['kauthtype_id'] . "', '0', '" . $params['name'] . "', 'd', '0', '0', '0', '0' )");
//
//        return true;
//    }

//    public function setAuthObject($id, $params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $setarray = [];
//        foreach ($params as $name => $value) {
//            if ($name != 'id')
//                $setarray[] = $name . "='" . $value . "'";
//        }
//
//        $db->query("UPDATE kauthobjects SET " . implode(',', $setarray) . " WHERE id = '$id'");
//
//        return true;
//    }
//
//
//    public function getAuthObjectOrgValues($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $records = $db->query("SELECT * FROM kauthobjects WHERE kauthtype_id = '" . $id . "'");
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//        return $retArray;
//    }
//
//    public function setAuthObjectOrgValues($id, $params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        // delete all current records;
//        $db->query("DELETE FROM kauthobjectorgelementvalues WHERE kauthobject_id = '$id'");
//
//        foreach ($params as $objectvalue) {
//            if ($objectvalue !== '') {
//                $valueArray = explode(',', $objectvalue['displayvalue']);
//                $db->query("INSERT INTO kauthobjectorgelementvalues (kauthobject_id, korgobjectelement_id, value) VALUES ('$id', '" . $objectvalue['id'] . "', '" . json_encode($valueArray) . "')");
//            }
//        }
//
//        return true;
//    }
//
//    public function addAuthObjectFieldControl($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("INSERT INTO kauthobjectfields (kauthobject_id, field, control) VALUES('" . $params['kauthobject_id'] . "', '" . $params['field'] . "', '" . $params['control'] . "')");
//
//        return true;
//    }
//
//    public function setAuthObjectFieldControl($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("UPDATE kauthobjectfields SET control = '" . $params['control'] . "' WHERE field = '" . $params['field'] . "' AND kauthobject_id = '" . $params['kauthobject_id'] . "'");
//
//        return true;
//    }
//
//    public function deleteAuthObjectFieldControl($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("DELETE FROM kauthobjectfields WHERE field = '" . $params['field'] . "' AND kauthobject_id = '" . $params['kauthobject_id'] . "'");
//
//        return true;
//    }
//
//    public function getAuthObjectFieldControlFields($params)
//    {
//        global $beanList;
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        // determine the object we are on
//        $object = $db->fetchByAssoc($db->query("SELECT kauthobjects.*, kauthtypes.bean FROM kauthobjects, kauthtypes WHERE kauthobjects.kauthtype_id = kauthtypes.id AND kauthobjects.id = '" . $params['authobjectid'] . "'"));
//
//        // get all modules for which definitons exist
//        $fArray = [];
//        $records = $db->query("SELECT field FROM kauthobjectfields WHERE kauthobject_id = '" . $params['authtypeid'] . "'");
//        while ($record = $db->fetchByAssoc($records)) {
//            $fArray[] = $record['name'];
//        }
//
//
//        $module = array_search($object['bean'], $beanList);
//        $seed = BeanFactory::getBean($module);
//        foreach ($seed->field_name_map as $fieldname => $fielddata) {
//            if (array_search($fieldname, $fArray) === false)
//                $retArray[] = ['name' => $fieldname];
//        }
//
//        return $retArray;
//    }

//    public function getAuthProfiles($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $addFilter = '';
//        if ($params['searchterm'])
//            $addFilter .= " AND kauthprofiles.name like '%" . $params['searchterm'] . "%'";
//
//        if ($params['authuserid'])
//            $addFilter .= " AND NOT EXISTS (SELECT * FROM kauthprofiles_users WHERE user_id = '" . $params['authuserid'] . "' AND kauthprofile_id = kauthprofiles.id)";
//
//        $records = $db->limitQuery("SELECT * FROM kauthprofiles WHERE deleted = 0 $addFilter ORDER BY NAME", $params['start'], $params['limit']);
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//        $count = $db->fetchByAssoc($db->query("SELECT count(*) totalcount FROM kauthprofiles WHERE deleted = 0 $addFilter"));
//
//        return [
//            'records' => $retArray,
//            'totalcount' => $count['totalcount']
//        ];
//    }
//
//
//    public function addAuthProfile($id, $params)
//    {
//        $authProfile = BeanFactory::getBean('KAuthProfiles');
//        $authProfile->name = $params['name'];
//        $authProfile->id = $id;
//        $authProfile->status = $params['status'];
//        $authProfile->new_with_id = true;
//        $authProfile->save();
//        return true;
//    }
//
//    public function setAuthProfile($id, $params)
//    {
//        $authProfile = BeanFactory::getBean('KAuthProfiles', $id);
//        $authProfile->name = $params['name'];
//        $authProfile->save();
//        return true;
//    }
//
//    public function deleteAuthProfile($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("UPDATE kauthprofiles SET deleted = 1 WHERE id='$id'");
//        $db->query("DELETE FROM  kauthprofiles_kauthobjects WHERE kauthprofile_id='$id'");
//
//        return true;
//    }
//
//
//    public function getAuthProfileObjects($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $records = $db->query("SELECT kauthobjects.id, kauthobjects.name, kauthobjects.status, kauthtypes.bean  FROM kauthobjects, kauthprofiles_kauthobjects, kauthtypes WHERE kauthobjects.id = kauthprofiles_kauthobjects.kauthobject_id AND kauthtypes.id = kauthobjects.kauthtype_id AND kauthprofiles_kauthobjects.kauthprofile_id = '$id' ORDER BY kauthtypes.bean, kauthobjects.name");
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//        return $retArray;
//    }
//
//    public function addAuthProfileObject($id, $objectid)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("INSERT INTO kauthprofiles_kauthobjects (kauthprofile_id, kauthobject_id) VALUES('$id', '$objectid')");
//        return true;
//    }
//
//    public function deleteAuthProfileObject($id, $objectid)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("DELETE FROM  kauthprofiles_kauthobjects WHERE kauthprofile_id = '$id'AND kauthobject_id = '$objectid'");
//
//        return true;
//    }
//
//    public function activateAuthProfile($id)
//    {
//        $authProfile = BeanFactory::getBean('KAuthProfiles', $id);
//        $authProfile->activate();
//        $authProfile->save();
//        return true;
//    }
//
//    public function deactivateAuthProfile($id)
//    {
//        $authProfile = BeanFactory::getBean('KAuthProfiles', $id);
//        $authProfile->deactivate();
//        $authProfile->save();
//        return true;
//    }
//
//    public function getAuthUsers($params)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $addFilter = '';
//        if (isset($params['searchterm'])){
//            $addFilter = " AND (users.user_name like '%" . $params['searchterm'] . "%' OR users.last_name like '%" . $params['searchterm'] . "%' OR users.first_name like '%" . $params['searchterm'] . "%') ";
//        }
//
//        $records = $db->limitQuery("SELECT * FROM users WHERE deleted = 0 $addFilter ORDER BY user_name", $params['start'], $params['limit']);
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//        $count = $db->fetchByAssoc($db->query("SELECT count(*) totalcount FROM users WHERE deleted = 0 $addFilter"));
//
//        return [
//            'records' => $retArray,
//            'totalcount' => $count['totalcount']
//        ];
//    }
//
//    public function getAuthUserProfiles($id)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $retArray = [];
//
//        $records = $db->query("SELECT kauthprofiles.id, kauthprofiles.name, kauthprofiles.status FROM kauthprofiles,  kauthprofiles_users WHERE kauthprofiles_users.kauthprofile_id = kauthprofiles.id AND kauthprofiles_users.user_id = '$id' ORDER BY kauthprofiles.name");
//        while ($record = $db->fetchByAssoc($records))
//            $retArray[] = $record;
//
//
//        return $retArray;
//    }
//
//    public function addAuthUserProfile($id, $profileid)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("INSERT INTO kauthprofiles_users (user_id, kauthprofile_id, deleted) VALUES('$id', '$profileid', 0)");
//
//        return true;
//    }
//
//    public function deleteAuthUserProfile($id, $profileid)
//    {
//        $db = DBManagerFactory::getInstance();
//
//        $db->query("DELETE FROM kauthprofiles_users WHERE user_id = '$id' AND kauthprofile_id = '$profileid'");
//
//        return true;
//    }

}
