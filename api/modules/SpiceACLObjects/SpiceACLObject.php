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
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\SugarObjects\SpiceModules;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\modules\SpiceACL\SpiceACLUsers;
use SpiceCRM\includes\authentication\AuthenticationController;

/**
 * @property array authObjects
 * @property  relationShip
 */
class SpiceACLObject extends SugarBean
{

    public $table_name = 'spiceaclobjects';
    public $object_name = 'SpiceACLObject';
    public $module_dir = 'SpiceACLObjects';


    private $aclobjects = [];

    /*
    public function __construct($id = '')
    {
        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        if ($id != '') {
            $this->id = $id;

            if (!isset($_SESSION['korgmanagement']['objDetail'][$id])) {
                $this->objDetail = $db->fetchByAssoc($db->query("SELECT * FROM kauthobjects WHERE id='$id'"));
                $_SESSION['korgmanagement']['objDetail'][$id] = $this->objDetail;
            } else
                $this->objDetail = $_SESSION['korgmanagement']['objDetail'][$id];

            $this->getKauthObjectRelationship();
        }
    }
    */


    public function get_summary_text()
    {
        return $this->name;
    }

    /**
     * get usage count of SpiceACLObjects for all modules
     * @return array
     */
    public function generateTypes()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $typeRecords = [];
        if (is_admin($current_user)) {
            foreach (SpiceModules::getInstance()->getBeanList() as $module => $class) {
                $seed = BeanFactory::getBean($module);
                if ($seed && method_exists($seed, 'bean_implements') && $seed->bean_implements('ACL')) {
                    $typeRecord = $this->db->fetchByAssoc($this->db->query("SELECT sysmodules.id, sysmodules.module, (SELECT count(id) FROM spiceaclobjects WHERE sysmodule_id = sysmodules.id AND deleted = 0) usagecount FROM sysmodules WHERE module = '$module' AND acl = 1 UNION SELECT syscustommodules.id, syscustommodules.module, (SELECT count(id) FROM spiceaclobjects WHERE sysmodule_id = syscustommodules.id AND deleted = 0) usagecount FROM syscustommodules WHERE module = '$module' AND acl = 1"));
                    if (!$typeRecord) {
                        /*
                        $newId = create_guid();
                        $this->db->query("INSERT INTO spiceacltypes (id, module, status) VALUES('$newId', '$module', 'd')");
                        $typeRecords[] = [
                            'id' => $newId,
                            'module' => $module,
                            'status' => 'd',
                            'usagecount' => 0
                        ];
                        */
                    } else {
                        $typeRecords[] = $typeRecord;
                    }
                }
            }
        }
        return $typeRecords;
    }

    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $db = DBManagerFactory::getInstance();
        // $this->id = $id;
        $result = parent::retrieve($id, $encode, $deleted, $relationships);

        // ToDo: not sure what this is for ??
        // $this->getKauthObjectRelationship();

        // get the module
        $moduleRecord = $this->db->fetchByAssoc($this->db->query("SELECT module FROM sysmodules WHERE id = '$this->sysmodule_id'  UNION SELECT module FROM syscustommodules WHERE id = '$this->sysmodule_id'"));
        $this->spiceacltype_module = $moduleRecord['module'];

        // get the fieldvalues
        $this->fieldvalues = [];
        $fieldvalues = $this->db->query("SELECT * FROM spiceaclobjectvalues WHERE spiceaclobject_id='$this->id'");
        while ($fieldvalue = $this->db->fetchByAssoc($fieldvalues)) {
            $this->fieldvalues[] = $fieldvalue;
        }
        $this->fieldvalues = json_encode($this->fieldvalues);

        // get the fieldvalues
        $this->fieldcontrols = [];
        $fieldcontrols = $this->db->query("SELECT * FROM spiceaclobjectfields WHERE spiceaclobject_id='$this->id'");
        while ($fieldcontrol = $this->db->fetchByAssoc($fieldcontrols)) {
            $this->fieldcontrols[] = $fieldcontrol;
        }
        $this->fieldcontrols = json_encode($this->fieldcontrols);

        // get the actions
        $this->objectactions = [];
        $objectactions = $this->db->query("SELECT * FROM spiceaclobjectactions WHERE spiceaclobject_id='$this->id'");
        while ($objectaction = $this->db->fetchByAssoc($objectactions)) {
            $this->objectactions[] = $objectaction;
        }
        $this->objectactions = json_encode($this->objectactions);

        // check for territory values
        $this->territoryelementvalues = [];
        $territory = BeanFactory::getBean('SpiceACLTerritories');
        if ($territory) {
            $territoryelementvalues = $this->db->query("SELECT * FROM spiceaclobjectsterritoryelementvalues WHERE spiceaclobject_id='$this->id'");
            while ($territoryelementvalue = $this->db->fetchByAssoc($territoryelementvalues)) {
                $this->territoryelementvalues[] = $territoryelementvalue;
            }
        }
        $this->territoryelementvalues = json_encode($this->territoryelementvalues);

        return $result;
    }

    public function save($check_notify = FALSE, $fts_index_bean = TRUE)
    {
        $retValue = parent::save($check_notify, $fts_index_bean);

        $fieldValues = json_decode($this->fieldvalues);
        $this->db->query("DELETE FROM spiceaclobjectvalues WHERE spiceaclobject_id = '$this->id'");
        foreach ($fieldValues as $fieldValue) {
            // check that the id matches
            if ($fieldValue->spiceaclobject_id == $this->id) {
                $this->db->query("INSERT INTO spiceaclobjectvalues (id, spiceaclobject_id, spiceaclmodulefield_id, operator, value1, value2) VALUES('".SpiceUtils::createGuid()."', '$fieldValue->spiceaclobject_id', '$fieldValue->spiceaclmodulefield_id', '$fieldValue->operator', '$fieldValue->value1', '$fieldValue->value2')");
            }
        }

        $fieldControls = json_decode($this->fieldcontrols);
        $this->db->query("DELETE FROM spiceaclobjectfields WHERE spiceaclobject_id = '$this->id'");
        foreach ($fieldControls as $fieldControl) {
            // check that the id matches
            if ($fieldControl->spiceaclobject_id == $this->id) {
                $this->db->query("INSERT INTO spiceaclobjectfields (id, spiceaclobject_id, field, control) VALUES('".SpiceUtils::createGuid()."', '$fieldControl->spiceaclobject_id', '$fieldControl->field', '$fieldControl->control')");
            }
        }

        $objectactions = json_decode($this->objectactions);
        $this->db->query("DELETE FROM spiceaclobjectactions WHERE spiceaclobject_id = '$this->id'");
        foreach ($objectactions as $objectaction) {
            // check that the id matches
            if ($objectaction->spiceaclobject_id == $this->id) {
                $this->db->query("INSERT INTO spiceaclobjectactions (id, spiceaclobject_id, spiceaclaction_id) VALUES('".SpiceUtils::createGuid()."', '$objectaction->spiceaclobject_id', '$objectaction->spiceaclaction_id')");
            }
        }

        if ($this->status != 'r') {
            $territoryelementvalues = json_decode($this->territoryelementvalues);
            $this->db->query("DELETE FROM spiceaclobjectsterritoryelementvalues WHERE spiceaclobject_id = '$this->id'");
            foreach ($territoryelementvalues as $territoryelementvalue) {
                // check that the id matches
                if ($territoryelementvalue->spiceaclobject_id == $this->id) {
                    $this->db->query("INSERT INTO spiceaclobjectsterritoryelementvalues (spiceaclobject_id, spiceaclterritoryelement_id, value) VALUES('$territoryelementvalue->spiceaclobject_id', '$territoryelementvalue->spiceaclterritoryelement_id', '$territoryelementvalue->value')");
                }
            }
        }

        return $retValue;
    }

    public function getObjectTypeId()
    {
        $db = DBManagerFactory::getInstance();
        $thisObj = $db->fetchByAssoc($db->query("SELECT ktm.korgobjecttype_id FROM korgobjecttypes_modules ktm INNER JOIN kauthtypes kat ON kat.bean = ktm.module WHERE kat.id='" . $this->objDetail['kauthtype_id'] . "'"));
        return $thisObj['korgobjecttype_id'];
    }

    /*
    * get all auth objects for the current user
    * checked and needed
    */
    public function getUserACLObjects($module = null)
    {
        global  $timedate;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $db = DBManagerFactory::getInstance();

        if (SpiceConfig::getInstance()->config['acl']['disable_cache'] || empty($_SESSION['spiceaclaccess']['aclobjects'])) {
            $this->aclobjects = [];

            $absences = BeanFactory::getBean('UserAbsences');
            $substituteIds = $absences->getSubstituteIDs();
            $userIDs = array_merge([$current_user->id], $substituteIds);
            $userIDs = "'" . join("','", $userIDs) . "'";

            $aclobjects = $db->query("SELECT so.id, so.activity, so.spiceaclorgassignment, so.spiceaclobjecttype, st.module, so.spiceaclowner, so.allorgobjects FROM spiceaclobjects so
				INNER JOIN spiceaclprofiles_spiceaclobjects spso ON spso.spiceaclobject_id = so.id AND spso.deleted = 0
				INNER JOIN spiceaclprofiles sp ON sp.id = spso.spiceaclprofile_id
				INNER JOIN spiceaclprofiles_users spu ON sp.id = spu.spiceaclprofile_id AND spu.deleted = 0
				INNER JOIN sysmodules st ON st.id = so.sysmodule_id
				WHERE so.status='r' AND sp.status='r' and (spu.user_id in ($userIDs) or spu.user_id='*')
				UNION
				SELECT so.id, so.activity, so.spiceaclorgassignment, so.spiceaclobjecttype, st.module, so.spiceaclowner, so.allorgobjects FROM spiceaclobjects so
				INNER JOIN spiceaclprofiles_spiceaclobjects spso ON spso.spiceaclobject_id = so.id AND spso.deleted = 0
				INNER JOIN spiceaclprofiles sp ON sp.id = spso.spiceaclprofile_id
				INNER JOIN spiceaclprofiles_users spu ON sp.id = spu.spiceaclprofile_id AND spu.deleted = 0
				INNER JOIN syscustommodules st ON st.id = so.sysmodule_id
				WHERE so.status='r' AND sp.status='r' and (spu.user_id in ($userIDs) or spu.user_id='*')");

            // get a territory object if it exists
            $territory = BeanFactory::getBean('SpiceACLTerritories');

            while ($aclobject = $db->fetchByAssoc($aclobjects)) {
                $this->authObjects[$aclobject['id']] = $aclobject;

                // read the org values - check on method_exists because of SpiceCRM core edition
                if ($territory && method_exists($territory, 'getAclObjectTerritoryValues')) {
                    $this->authObjects[$aclobject['id']]['objectterritoryvalues'] = $territory->getAclObjectTerritoryValues($aclobject['id']);
                }

                // get the actions
                $objectActions = $db->query("SELECT spiceaclaction_id FROM spiceaclobjectactions WHERE spiceaclobject_id='{$aclobject['id']}'");
                while ($objectAction = $db->fetchByAssoc($objectActions))
                    $this->authObjects[$aclobject['id']]['objectactions'][] = $objectAction['spiceaclaction_id'];

                // read the field values
                $objectValues = $db->query("SELECT spiceaclobjectvalues.*, spiceaclmodulefields.name FROM spiceaclobjectvalues INNER JOIN spiceaclmodulefields ON spiceaclmodulefields.id = spiceaclobjectvalues.spiceaclmodulefield_id WHERE spiceaclobject_id='{$aclobject['id']}'");
                while ($thisObjectValue = $db->fetchByAssoc($objectValues))
                    $this->authObjects[$aclobject['id']]['objectelementvalues'][$thisObjectValue['name']] = [
                        'operator' => $thisObjectValue['operator'],
                        'value1' => $thisObjectValue['value1'],
                        'value2' => $thisObjectValue['value2']];


                // get the field control
                $objectFieldControls = $db->query("SELECT field, control FROM spiceaclobjectfields WHERE spiceaclobject_id='{$aclobject['id']}'");
                while ($objectFieldControl = $db->fetchByAssoc($objectFieldControls)) {
                    $this->authObjects[$aclobject['id']]['objectfieldcontrols'][$objectFieldControl['field']] = $objectFieldControl['control'];
                }

            }
            $_SESSION['spiceaclaccess']['aclobjects'] = $this->authObjects;
        }

        if ($module) {
            $retObjects = [];
            foreach ($_SESSION['spiceaclaccess']['aclobjects'] as $objectId => $objectData) {
                if ($objectData['module'] == $module)
                    $retObjects[$objectId] = $objectData;
            }
            return $retObjects;
        } else {
            return $_SESSION['spiceaclaccess']['aclobjects'];
        }
    }

    /*
     * function t check if an object matches a bean
     */
    public function matchBean2Object($bean, $activity = '', $objectData)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $territory = BeanFactory::getBean('SpiceACLTerritories');

        // check the activity .. if it is noit found .. cointinue
        if ($activity != '' && $this->matchObject2Activity($activity, $objectData) === false)
            return false;

        // check the obejctfield values if this profile qualifies
        if (!$this->checkBeanObjectFieldAccess($bean, $objectData['objectelementvalues']))
            return false;

        // workaround for module Users (table has no assigned_user_id field)
        // simulate assigned_user_id by allocating id
        if ($bean->module_name == 'Users') {
            $bean->assigned_user_id = $bean->id;
        }

        // check assigned user Or creator
        if ((($objectData['spiceaclowner'] && !$objectData['spiceaclcreator']) && !SpiceACLUsers::checkCurrentUserIsOwner($bean)) ||
            ((!$objectData['spiceaclowner'] && $objectData['spiceaclcreator']) && !SpiceACLUsers::checkCurrentUserIsCreator($bean)) ||
            (($objectData['spiceaclowner'] && $objectData['spiceaclcreator']) && (!SpiceACLUsers::checkCurrentUserIsOwner($bean) || !SpiceACLUsers::checkCurrentUserIsCreator($bean))))
            return false;

        // check that the territory matches
        if ($territory && !$objectData['allorgobjects'] && !$territory->checkBeanAccessforACLObject($bean, $objectData['id']))
            return false;

        return true;
    }

    /*
     * get all objects for a Bean if the access requirements are matched
     */
    public function getObjectActivities($bean, $objectData)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $territory = BeanFactory::getBean('SpiceACLTerritories');

        // check the obejctfield values if this profile qualifies
        if (!$this->checkBeanObjectFieldAccess($bean, $objectData['objectelementvalues']))
            return [];

        // workaround for module Users (table has no assigned_user_id field)
        // simulate assigned_user_id by allocating id
        if ($bean->module_name == 'Users') {
            $bean->assigned_user_id = $bean->id;
        }

        // check assigned user Or creator
        if ((($objectData['spiceaclowner'] && !$objectData['spiceaclcreator']) && !SpiceACLUsers::checkCurrentUserIsOwner($bean)) ||
            ((!$objectData['spiceaclowner'] && $objectData['spiceaclcreator']) && !SpiceACLUsers::checkCurrentUserIsCreator($bean)) ||
            (($objectData['spiceaclowner'] && $objectData['spiceaclcreator']) && (!SpiceACLUsers::checkCurrentUserIsOwner($bean) || !SpiceACLUsers::checkCurrentUserIsCreator($bean))))
            return [];

        // check that the territory matches
        if ($territory && !$objectData['allorgobjects'] && !$territory->checkBeanAccessforACLObject($bean, $objectData['id']))
            return [];

        return $objectData['objectactions'];
    }

    public function matchObject2Activity($activity, $objectData)
    {
        // check the activity .. if it is noit found .. cointinue
        if (array_search($activity, $objectData['objectactions']) === false)
            return false;

        return true;
    }

    /*
     * function to get the fts query paramaters for the object
     */
    public function getFTSObjectQuery()
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();


        $filters = [];

        // owner Query
        if ($this->spiceaclowner || $this->spiceaclcreator) {
            // check absence substitutes
            $absences = BeanFactory::getBean('UserAbsences');
            $substituteIds = $absences->getSubstituteIDs();
            $userIds = array_merge([$current_user->id], $substituteIds);

            if ($this->spiceaclowner && $this->spiceaclcreator) {
                $filters['must'][] = [
                    'bool' => [
                        'should' => [
                            [
                                'terms' => [
                                    'assigned_user_id' => $userIds
                                ]
                            ],
                            [
                                'terms' => [
                                    'assigned_user_ids' => $userIds
                                ]
                            ],
                            [
                                'terms' => [
                                    'created_by' => $userIds
                                ]
                            ]
                        ],
                        'minimum_should_match' => '1'
                    ]
                ];
            } elseif ($this->spiceaclowner) {
                $filters['must'][] = [
                    'bool' => [
                        'should' => [
                            [
                                'terms' => [
                                    'assigned_user_id' => $userIds
                                ]
                            ],
                            [
                                'terms' => [
                                    'assigned_user_ids' => $userIds
                                ]
                            ]
                        ],
                        'minimum_should_match' => '1'
                    ]
                ];
            } elseif ($this->spiceaclcreator) {
                $filters['must'][] = [
                    'terms' => [
                        'created_by' => $userIds
                    ]
                ];
            }
        }

        // add Values
        $fieldvalues = $this->db->query("SELECT spiceaclobjectvalues.*, spiceaclmodulefields.name FROM spiceaclobjectvalues, spiceaclmodulefields WHERE spiceaclobjectvalues.spiceaclmodulefield_id = spiceaclmodulefields.id AND spiceaclobject_id='$this->id'");
        while ($fieldvalue = $this->db->fetchByAssoc($fieldvalues)) {
            switch ($fieldvalue['operator']) {
                case 'EQ':
                    $filters['must'][] = [
                        'term' => [
                            $fieldvalue['name'] . '.raw' => $fieldvalue['value1']
                        ]
                    ];
                    break;
                case 'ISNEMPTY':
                    $filters['must'][] = [
                        'exits' => [
                            'field' => $fieldvalue['name']
                        ]
                    ];
                    break;
                case 'ISEMPTY':
                    $filters['must_not'][] = [
                        'exits' => [
                            'field' => $fieldvalue['name']
                        ]
                    ];
                    break;
                case 'CU':
                    if (!empty($fieldvalue['value1'])) {
                        $filters['must'][] = [
                            'term' => [
                                $fieldvalue['name'] . '.raw' => $current_user->{$fieldvalue['value1']}
                            ]
                        ];
                    }
                    break;
                case 'NE':
                    $filters['must_not'][] = [
                        'term' => [
                            $fieldvalue['name'] . '.raw' => $fieldvalue['value1']
                        ]
                    ];
                    break;
                case 'LK':
                    $filters['must'][] = [
                        'wildcard' => [
                            $fieldvalue['name'] => '*' . $fieldvalue['value1'] . '*'
                        ]
                    ];
                    break;
                case 'SW':
                    $filters['must'][] = [
                        'wildcard' => [
                            $fieldvalue['name'] . '.raw' => $fieldvalue['value1'] . '*'
                        ]
                    ];
                    break;
                case 'SN':
                    $filters['must_not'][] = [
                        'wildcard' => [
                            $fieldvalue['name'] . '.raw' => $fieldvalue['value1'] . '*'
                        ]
                    ];
                    break;
                case 'GT':
                case 'GTE':
                case 'LT':
                case 'LTE':
                    $filters['must'][] = [
                        'range' => [
                            $fieldvalue['name'] => [
                                strtolower($fieldvalue['operator']) => $fieldvalue['value1']
                            ]
                        ]
                    ];
                    break;
                case 'IN':
                    $valArray = explode(',', $fieldvalue['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    $filters['must'][] = [
                        'terms' => [
                            $fieldvalue['name'] . '.raw' => $valArray
                        ]
                    ];
                    break;
                case 'NI':
                    $valArray = explode(',', $fieldvalue['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    $filters['must_not'][] = [
                        'terms' => [
                            $fieldvalue['name'] . '.raw' => $valArray
                        ]
                    ];
                    break;
            }
        }

        // territories
        if (!$this->allorgobjects) {
            $territory = BeanFactory::getBean('SpiceACLTerritories');
            if ($territory) {
                $hashes = $territory->getTerritoryHashesForObject($this->id, $this->sysmodule_id);
                if ($hashes !== false) {
                    if (count($hashes) > 0) {
                        $filters['must'][] = [
                            'terms' => [
                                'spiceacl_territories_hash' => $hashes
                            ]
                        ];
                    } else {
                        $filters['must'][] = [
                            'term' => [
                                'spiceacl_territories_hash' => 'nohashfound'
                            ]
                        ];
                    }
                }
            }
        }

        //only one filter
        $retFilters = [];
        if (count($filters) > 0) {
            $retFilters = [
                'bool' => $filters
            ];
        }

        return $retFilters;

    }

    /*
     * function to get the SQL query paramaters for the object
     */
    public function getListObjectQuery($table_name, $bean)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $whereClauses = [];

        // owner Query
        if ($this->spiceaclowner || $this->spiceaclcreator) {
            if ($this->spiceaclowner && $this->spiceaclcreator) {
                $whereClauses[] = "((" . SpiceACLUsers::generateCurrentUserWhereClause($table_name, $bean) . ") OR (" . SpiceACLUsers::generateCreatedByWhereClause($table_name, $bean) . "))";
            } elseif ($this->spiceaclowner) {
                $whereClauses[] = SpiceACLUsers::generateCurrentUserWhereClause($table_name, $bean);
            } elseif ($this->spiceaclcreator) {
                $whereClauses[] = SpiceACLUsers::generateCreatedByWhereClause($table_name, $bean);
            }
        }

        // add Values
        $fieldvalues = $this->db->query("SELECT spiceaclobjectvalues.*, spiceaclmodulefields.name FROM spiceaclobjectvalues, spiceaclmodulefields WHERE spiceaclobjectvalues.spiceaclmodulefield_id = spiceaclmodulefields.id AND spiceaclobject_id='$this->id'");
        while ($fieldvalue = $this->db->fetchByAssoc($fieldvalues)) {
            switch ($fieldvalue['operator']) {
                case 'EQ':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} = '{$fieldvalue['value1']}'";
                    break;
                case 'ISEMPTY':
                    $whereClauses[] = "($table_name.{$fieldvalue['name']} = '' OR $table_name.{$fieldvalue['name']} IS NULL";
                    break;
                case 'ISNEMPTY':
                    $whereClauses[] = "($table_name.{$fieldvalue['name']} != '' AND $table_name.{$fieldvalue['name']} IS NOT NULL";
                    break;
                case 'CU':
                    if (!empty($fieldvalue['value1'])) {
                        $whereClauses[] = "$table_name.{$fieldvalue['name']} = '" . $current_user->{$fieldvalue['value1']} . "'";
                    }
                    break;

                case 'NE':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} <> '{$fieldvalue['value1']}'";
                    break;
                case 'LK':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} LIKE '%{$fieldvalue['value1']}%'";
                    break;
                case 'SW':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} LIKE '{$fieldvalue['value1']}%'";
                    break;
                case 'SN':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} NOT LIKE '{$fieldvalue['value1']}%'";
                    break;
                case 'GT':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} > '{$fieldvalue['value1']}'";
                    break;
                case 'GTE':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} >= '{$fieldvalue['value1']}'";
                    break;
                case 'LT':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} < '{$fieldvalue['value1']}'";
                    break;
                case 'LTE':
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} <= '{$fieldvalue['value1']}'";
                    break;
                case 'IN':
                    $valArray = explode(',', $fieldvalue['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} IN ('" . implode("','", $valArray) . "')";
                    break;
                case 'NI':
                    $valArray = explode(',', $fieldvalue['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    $whereClauses[] = "$table_name.{$fieldvalue['name']} NOT IN ('" . implode("','", $valArray) . "')";
                    break;
            }
        }

        // territories
        $territory = BeanFactory::getBean('SpiceACLTerritories');
        if ($territory && $this->allorgobjects != 1) {
            $hashes = $territory->getTerritoryHashesForObject($this->id, $this->sysmodule_id);
            if ($hashes !== false) {
                if (count($hashes) > 0) {
                    $whereClauses[] = "$table_name.spiceacl_territories_hash IN ('" . implode("','", $hashes) . "')";
                } else {
                    // if we have no hash found .. we need to make sure this query does not return anything
                    $whereClauses[] = "$table_name.spiceacl_territories_hash = 'nohashfound'";
                }
            }
        }


        return implode(' AND ', $whereClauses) ?: '1=1';
    }

    /*
     * checks a bean against objectfields
     */
    public function checkBeanObjectFieldAccess($bean, $objectelementvalues)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        //Coming from list view, bean is empty  and no territory_hash
        //therefore return true
        if (empty($bean->id))
            return true;

        // if we have none ... return true
        if (empty($objectelementvalues)) {
            return true;
        }

        // go through all creiteria and see if they match
        foreach ($objectelementvalues as $fieldname => $fieldvalues) {
            $authObjectAccess = false;

            switch ($fieldvalues['operator']) {
                case 'EQ':
                    if ($bean->{$fieldname} == $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'ISEMPTY':
                    if (empty($bean->{$fieldname})) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'ISNEMPTY':
                    if (!empty($bean->{$fieldname})) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'CU':
                    if (!empty($fieldvalues['value1']) && $bean->{$fieldname} == $current_user->{$fieldvalues['value1']}) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'NE':
                    if ($bean->{$fieldname} != $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'IN':
                    $valArray = explode(',', $fieldvalues['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    if (array_search($bean->{$fieldname}, $valArray) !== false) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'NI':
                    $valArray = explode(',', $fieldvalues['value1']);
                    foreach ($valArray as $valIndex => $valValue)
                        $valArray[$valIndex] = trim($valValue);
                    if (array_search($bean->{$fieldname}, $valArray) === false) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'GT':
                    if ($bean->{$fieldname} > $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'GTE':
                    if ($bean->{$fieldname} >= $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'LT':
                    if ($bean->{$fieldname} < $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'LTE':
                    if ($bean->{$fieldname} <= $fieldvalues['value1']) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'LK':
                    if (strpos($bean->{$fieldname}, $fieldvalues['value1']) !== false) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'SW':
                    if (preg_match('/^' . $fieldvalues['value1'] . '/', $bean->{$fieldname}) !== false) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'SN':
                    if (preg_match('/^' . $fieldvalues['value1'] . '/', $bean->{$fieldname}) !== true) {
                        $authObjectAccess = true;
                    };
                    break;
                case 'ig':
                case '':
                    $authObjectAccess = true;
                    break;
            }

            // if we did not get a match .. return false -> no access
            if (!$authObjectAccess)
                return false;
        }

        return true;
    }

    /*
     * ===
     */


    /*
    private function getKauthObjectRelationship()
    {
        $db = \SpiceCRM\includes\database\DBManagerFactory::getInstance();

        if ($this->relationShip != '')
            return;

        $link = $db->fetchByAssoc($db->query("SELECT kom.* FROM korgobjecttypes_modules kom INNER JOIN kauthtypes kt ON kt.bean = kom.module WHERE kt.id='" . $this->objDetail['kauthtype_id'] . "'"));
        $thisBean = \SpiceCRM\data\BeanFactory::getBean(array_search($link['module'], SpiceModules::getInstance()->getBeanList()));
        $this->relationShip = $db->fetchByAssoc($db->query("SELECT * FROM relationships WHERE relationship_name ='" . $thisBean->field_name_map[$link['relatefrom']]['relationship'] . "'"));


        $this->beanRelRight = true;
        if (isset($this->relationShip['rhs_module'])) {
            if ($this->relationShip['rhs_module'] != $thisBean->module_name && $this->relationShip['lhs_module'] == $thisBean->module_name)
                $this->beanRelRight = false;
        }
    }
    */

    /*
     * write the hashes for a Object to the DB ... including Profile Information
     */
    public function activate()
    {
        $db = DBManagerFactory::getInstance();

        // check if we have a profile that has no specific org objects assigned
        $objectValuesArray = [];
        $objectValues = $db->query("SELECT * FROM spiceaclobjectsterritoryelementvalues WHERE spiceaclobject_id ='$this->id'");
        $allorgObject = true;
        while ($objectValue = $db->fetchByAssoc($objectValues)) {
            $values = json_decode(html_entity_decode($objectValue['value']));
            if (array_search('*', $values) === false)
                $allorgObject = false;

            $objectValuesArray[$objectValue['spiceaclterritoryelement_id']] = $values;
        }

        if (!$allorgObject) {
            $territory = BeanFactory::getBean('SpiceACLTerritories');
            if ($territory) {
                $territory->activateACLObject($this->spiceacltype_module, $this->id, $objectValuesArray);
            }

            $this->status = 'r';
            $this->allorgobjects = 0;
            $this->save();
        } else {
            $this->status = 'r';
            $this->allorgobjects = 1;
            $this->save();
        }

        return ['status' => 'success'];
    }

    public function deactivate()
    {
        $territory = BeanFactory::getBean('SpiceACLTerritories');
        if ($territory) {
            $territory->deactivateACLObject($this->id);
        }

        // set the status
        $this->status = 'd';
        $this->save();

        return ['status' => 'success'];
    }

}
