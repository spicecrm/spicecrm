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

namespace SpiceCRM\includes\SysModuleFilters;

use Cassandra\Time;
use DateTimeZone;
use Exception;
use SpiceCRM\data\BeanFactory;
use DateInterval;
use DateTime;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSUtils;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\TimeDate;

class SysModuleFilters
{

    /**
     * @var the id of the filter we currently naalyze
     */
    var $filterid;

    /**
     * @var the module of the filter we currently analyze
     */
    var $filtermodule;

    /**
     * static function used in the spiceui rest extension to load all module filters and return to the UI
     *
     * @return array
     */
    static function getAllModuleFilters()
    {
        $db = DBManagerFactory::getInstance();

        // load module filters list
        $moduleFilters = [];

        $filters = "SELECT 'global' As type, id, name, module, filterdefs FROM sysmodulefilters UNION ALL ";
        $filters .= "SELECT 'custom' As type, id, name, module, filterdefs FROM syscustommodulefilters";


        $filters = $db->query($filters);
        while ($filter = $db->fetchByAssoc($filters)) {
            $moduleFilters[$filter['id']] = [
                'id' => $filter['id'],
                'name' => $filter['name'],
                'module' => $filter['module'],
                'type' => $filter['type'],
                'filterdefs' => $filter['filterdefs'],
            ];
        }
        return $moduleFilters;
    }

    /**
     * returns teh number of beans matching a given filter id
     *
     * @param $filterId the filter id
     * @return int the numberof matched records
     */
    public function getCountForFilterId($filterId)
    {
        $db = DBManagerFactory::getInstance();

        $filter = $db->fetchByAssoc($db->query('SELECT * FROM sysmodulefilters WHERE id=\'' . $db->quote($filterId) . '\' UNION SELECT * FROM syscustommodulefilters WHERE id=\'' . $db->quote($filterId) . '\''));
        if (!$filter) return 0;

        $seed = BeanFactory::getBean($filter['module']);
        $whereClause = $this->generateWhereClauseForFilterId($filterId);
        $result = $db->fetchByAssoc($db->query("SELECT count(*) entry_count FROM {$seed->_tablename} WHERE deleted = 0 AND $whereClause"));
        return $result['entry_count'] ?: 0;

    }

    /**
     * extracts all fields used in a filter
     *
     * @param $filterId
     * @return string
     */
    public function getFilterFields($filterId)
    {
        $db = DBManagerFactory::getInstance();
        $filter = $db->fetchByAssoc($db->query('SELECT * FROM sysmodulefilters WHERE id=\'' . $db->quote($filterId) . '\' UNION SELECT * FROM syscustommodulefilters WHERE id=\'' . $db->quote($filterId) . '\''));
        if (!$filter) return '';

        $conditions = json_decode(html_entity_decode($filter['filterdefs']));

        return $this->getFilterFieldsForGroup($conditions);
    }

    /**
     * extracts the fields for the given group
     *
     * @param $group
     */
    public function getFilterFieldsForGroup($group)
    {
        $fields = [];

        foreach ($group->conditions as $condition) {
            if ($condition->conditions) {
                $fields = array_merge($fields, $this->getFilterFieldsForGroup($condition));
            } else {
                $fields[] = $condition->field;
            }
        }
        return array_unique($fields);
    }

    /**
     * generates a where clause of a given filter id
     *
     * @param $filterId the filter id
     * @param string $tablename the name of the table. this is optiopnal. if not set the table name from teh bean will be taken
     * @return string the filter where clause
     */
    public function generateWhereClauseForFilterId($filterId, $tablename = '', $bean = null)
    {
        $db = DBManagerFactory::getInstance();

        $filter = $db->fetchByAssoc($db->query("SELECT * FROM sysmodulefilters WHERE id='" . $db->quote($filterId) . "' UNION ALL SELECT * FROM syscustommodulefilters WHERE id='" . $db->quote($filterId) . "'"));
        if (!$filter) return '';

        // set id and module
        $this->filterid = $filterId;
        $this->filtermodule = $filter['module'];

        if (!$tablename) {
            $seed = BeanFactory::getBean($filter['module']);
            $tablename = $seed->_tablename;
        }

        $conditions = json_decode(html_entity_decode($filter['filterdefs']));

        $whereClause = $this->buildSQLWhereClauseForGroup($conditions, $tablename);

        // if we have a filter method, that method shoudl return an array of IDs
        if (!empty($filter['filtermethod'])) {
            $filterMethodArray = explode('->', $filter['filtermethod']);
            $class = $filterMethodArray[0];
            $method = $filterMethodArray[1];
            if (class_exists($class)) {
                $focus = new $class();
                if (method_exists($focus, $method)) {
                    $ids = $focus->$method($bean);
                    if (is_array($ids) && count($ids) > 0) {
                        $whereClause = (!empty($whereClause) ? "($whereClause) AND " : "") . " ($tablename.id IN ('" . implode("','", $ids) . "'))";
                    } else if($ids){
                        $whereClause = (!empty($whereClause) ? "($whereClause) AND " : "") . " ({$ids})";
                    }
                }
            }
        }

        return $whereClause;

    }

    /**
     * builds the filter query for one group in the vondition
     *
     * @param $group
     * @param $tablename
     * @return string
     */
    public function buildSQLWhereClauseForGroup($group, $tablename, $module = null)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $filterConditionArray = [];

        foreach ($group->conditions as $condition) {
            if ($condition->conditions) {
                $filterConditionArray[] = $this->buildSQLWhereClauseForGroup($condition, $tablename, $module);
            } else {
                $filterConditionArray[] = $this->bildSQLWhereStatementForCondition($condition, $tablename);
            }
        }

        // get also users we represent
        $absence = BeanFactory::getBean('UserAbsences');
        $userIds = array_merge([$current_user->id], $absence->getSubstituteIDs());
        $userIds = "'" . join("','", $userIds) . "'";


        $filterCondition = "";
        if (!empty($filterConditionArray)) {
            $filterCondition = '(' . implode(' ' . $group->logicaloperator . ' ', $filterConditionArray) . ')';
            if ($group->groupscope == 'own') {
                $userIds = array_merge([$current_user->id], $absence->getSubstituteIDs());
                $userIds = "'" . join("','", $userIds) . "'";
                $filterCondition = "({$tablename}.assigned_user_id IN ({$userIds}) AND ($filterCondition))";
            }

            if ($group->groupscope == 'ownorgunit') {
                $orgunitIds = array_merge([$current_user->orgunit_id], $absence->getSubstituteOrgUnitIDs());
                $orgunitIds = "'" . join("','", $orgunitIds) . "'";
                $filterCondition = "({$tablename}.assigned_orgunit_id IN ({$orgunitIds}) AND ($filterCondition))";
            }

            // added an option for the creator
            if ($group->groupscope == 'creator') {
                $userIds = array_merge([$current_user->id], $absence->getSubstituteIDs());
                $userIds = "'" . join("','", $userIds) . "'";
                $filterCondition = "({$tablename}.created_by IN ({$userIds}) AND ($filterCondition))";
            }
        }

        // handle geo Data
        if ($group->geography && $group->geography->radius && $module) {
            // ToDo: make the geo search nicer .. relying on the fts settings might not be the best approiach and lead to issues
            $settings = SpiceFTSUtils::getBeanIndexSettings($module);
            $geocondition = "(6371*acos(cos(radians( {$group->geography->lat}))*cos(radians({$tablename}.{$settings['geolat']}))*cos(radians({$tablename}.{$settings['geolng']})-radians({$group->geography->lng}))+sin(radians({$group->geography->lat}))*sin(radians({$tablename}.{$settings['geolat']})))) < {$group->geography->radius}";
            $filterCondition = "($filterCondition) AND ($geocondition)";
        }

        return $filterCondition;
    }

    /**
     * generates the SQL where statement for a single condition
     *
     * @param $condition
     * @param $tablename
     * @return string
     * @throws Exception
     */
    private function bildSQLWhereStatementForCondition($condition, $tablename)
    {
        switch ($condition->operator) {
            case 'empty':
                return "{$tablename}.{$condition->field} IS NULL";
            case 'emptyr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return "{$tablename}.{$relatedField} IS NULL";
                }
                break;
            case 'notempty':
                // specific treatment for Oracle
                if(DBManagerFactory::getInstance()->dbType == 'oci8') {
                    return "{$tablename}.{$condition->field} IS NOT NULL";
                } else {
                    return "({$tablename}.{$condition->field} IS NOT NULL AND {$tablename}.{$condition->field} <> '')";
                }
            case 'notemptyr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    // specific treatment for Oracle
                    if(DBManagerFactory::getInstance()->dbType == 'oci8') {
                        return "{$tablename}.{$relatedField} IS NOT NULL";
                    }else {
                        return "({$tablename}.{$relatedField} IS NOT NULL AND {$tablename}.{$relatedField} <> '')";
                    }
                }
                break;
            case 'equals':
                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    return "{$tablename}.{$condition->field} LIKE '%{$condition->filtervalue}%'";
                } else {
                    return "{$tablename}.{$condition->field} = '{$condition->filtervalue}'";
                }
            case 'notequals':
                return "{$tablename}.{$condition->field} <> '{$condition->filtervalue}'";
            case 'equalr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    $filtervalues = explode('::', $condition->filtervalue);
                    return "{$tablename}.{$relatedField} = '{$filtervalues['0']}'";
                }
                break;
            case 'notequalr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    $filtervalues = explode('::', $condition->filtervalue);
                    return "{$tablename}.{$relatedField} <> '{$filtervalues['0']}'";
                }
                break;
            case 'equalrcu':
                if ($this->filtermodule) {
                    $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return "{$tablename}.{$relatedField} = '{$currentUser->id}'";
                }
                break;
            case 'notequalrcu':
                if ($this->filtermodule) {
                    $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return "{$tablename}.{$relatedField} <> '{$currentUser->id}'";
                }
                break;
            case 'oneof':
                $valArray = is_array($condition->filtervalue) ? $condition->filtervalue : explode(',', $condition->filtervalue);
                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    $fieldEqual = "{$tablename}.{$condition->field}";
                    $conditionString = implode(" OR ", array_map(function ($item) use ($fieldEqual) {return "$fieldEqual LIKE '%$item%'";}, $valArray));
                    return "($conditionString)";
                } else {
                    return "{$tablename}.{$condition->field} IN ('" . implode("','", $valArray) . "')";
                }
            case 'notoneof':
                $valArray = is_array($condition->filtervalue) ? $condition->filtervalue : explode(',', $condition->filtervalue);
                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    $fieldEqual = "{$tablename}.{$condition->field}";
                    $conditionString = implode(" AND ", array_map(function ($item) use ($fieldEqual) {return "$fieldEqual NOT LIKE '%$item%'";}, $valArray));
                    return "($conditionString)";
                } else {
                    return "{$tablename}.{$condition->field} NOT IN ('" . implode("','", $valArray) . "')";
                }
            case 'true':
                return "{$tablename}.{$condition->field} = 1";
            case 'false':
                return "{$tablename}.{$condition->field} = 0";
            case 'starts':
                return "{$tablename}.{$condition->field} LIKE '{$condition->filtervalue}%'";
            case 'contains':
                return "{$tablename}.{$condition->field} LIKE '%{$condition->filtervalue}%'";
            case 'ncontains':
                return "{$tablename}.{$condition->field} NOT LIKE '%{$condition->filtervalue}%'";
            case 'greater':
                return "{$tablename}.{$condition->field} > '{$condition->filtervalue}'";
            case 'gequal':
                return "{$tablename}.{$condition->field} >= '{$condition->filtervalue}'";
            case 'less':
                return "{$tablename}.{$condition->field} < '{$condition->filtervalue}'";
            case 'lequal':
                return "{$tablename}.{$condition->field} <= '{$condition->filtervalue}'";
            case 'between':
                return "({$tablename}.{$condition->field} >= '{$condition->filtervalue}' AND {$tablename}.{$condition->field} <= '{$condition->filtervalueto}')";
            case 'betweend':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $start =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalue . ' 00:00:00', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $end =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalueto . ' 23:59:59', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$start}' AND {$tablename}.{$condition->field} <= '{$end}')";
            case 'today':
                $today = date_format(new DateTime(), 'Y-m-d');
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $start =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $today . ' 00:00:00', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $end =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $today . ' 23:59:59', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);

                return "({$tablename}.{$condition->field} >= '{$start}' AND {$tablename}.{$condition->field} <= '{$end}')";
            case 'past':
                $now = date_format(new DateTime('now', new DateTimeZone('UTC')), TimeDate::DB_DATETIME_FORMAT);
                return "{$tablename}.{$condition->field} < '$now'";
            case 'future':
                $now = date_format(new DateTime('now', new DateTimeZone('UTC')), TimeDate::DB_DATETIME_FORMAT);
                return "{$tablename}.{$condition->field} > '$now'";
            case 'thismonth':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format(new DateTime('now', new DateTimeZone($timeZone)), 'Y-m-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format(new DateTime('now', new DateTimeZone($timeZone)), 'Y-m-t 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} > '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'nextmonth':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval('P1M'));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-m-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-m-t 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'thisyear':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-01-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-12-31 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'nextyear':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval('P1Y'));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-01-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-12-31 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'inndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'thisday':
                $date = new DateTime(null, new DateTimeZone('UTC'));
                return "(DAY({$tablename}.{$condition->field}) = '{$date->format('d')}' AND MONTH({$tablename}.{$condition->field}) = '{$date->format('m')}')";
            case 'ndaysago':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
            case 'inlessthanndays':
            case 'inlessthandays':
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                return "{$tablename}.{$condition->field} <= '" . $date->format(TimeDate::DB_DATE_FORMAT) . " 23:59:59'";
            case 'inmorethanndays':
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                return "{$tablename}.{$condition->field} >= '" . $date->format(TimeDate::DB_DATE_FORMAT) . " 23:59:59'";
            case 'inlastndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "{$tablename}.{$condition->field} >= '{$to}'";
            case 'lastndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "{$tablename}.{$condition->field} >= '$to'";
            case 'lastnmonths':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}M"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "{$tablename}.{$condition->field} >= '$to'";
            case 'untilyesterday':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} < '$from')";
            case 'fromtomorrow':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return "({$tablename}.{$condition->field} > '$to')";
            case 'nyearsago':
                $seed = BeanFactory::getBean($this->filtermodule);
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $dateToday = new DateTime('now', new DateTimeZone($timeZone));
                $dateToday->sub(new DateInterval("P{$condition->filtervalue}Y"));
                if ( $seed->field_defs[$condition->field]['type'] === 'date') {
                    $sql = "({$tablename}.{$condition->field} = '{$dateToday->format( TimeDate::DB_DATE_FORMAT )}')";
                } else {
                    $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($dateToday, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($dateToday, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    $sql = "({$tablename}.{$condition->field} >= '{$from}' AND {$tablename}.{$condition->field} <= '{$to}')";
                }
                return $sql;
        }
    }

    /**
     * generates the elastic filter for a given filterid
     *
     * @param $filterId
     * @return array|string
     */
    public function generareElasticFilterForFilterId($filterId, $bean = null)
    {
        $db = DBManagerFactory::getInstance();

        $dbfilter = $db->fetchByAssoc($db->query('SELECT * FROM sysmodulefilters WHERE id=\'' . $db->quote($filterId) . '\' UNION SELECT * FROM syscustommodulefilters WHERE id=\'' . $db->quote($filterId) . '\''));
        if (!$dbfilter) return '';

        $conditions = json_decode(html_entity_decode($dbfilter['filterdefs']));

        // set id and module
        $this->filterid = $filterId;
        $this->filtermodule = $dbfilter['module'];

        $filter = $this->buildElasticFilterForGroup($conditions);

        // if we have a filter method, that method shoudl return an array of IDs
        if (!empty($dbfilter['filtermethod'])) {
            $filterMethodArray = explode('->', $dbfilter['filtermethod']);
            $class = $filterMethodArray[0];
            $method = $filterMethodArray[1];
            if (class_exists($class)) {
                $focus = new $class();
                if (method_exists($focus, $method)) {
                    $ids = $focus->$method($bean);
                    if (count($ids) > 0) {
                        $filter['bool']['must'][] = ["terms" => ['id' => $ids]];
                    }
                }
            }
        }

        return $filter;
    }


    /**
     * builds an elastic filter for a given group. Calls itself recursivley if a group has subgrups
     *
     * @param $group the group definition
     * @return array
     */
    public function buildElasticFilterForGroup($group)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $filterConditionArray = [];
        $filterCondition = [];
        if ($group->conditions) {
            foreach ($group->conditions as $condition) {
                if ($condition->conditions) {
                    $filterConditionArray[] = $this->buildElasticFilterForGroup($condition);
                } else {
                    $filterConditionArray[] = $this->buildElasticFilterForCondition($condition);
                }
            }

            switch ($group->logicaloperator) {
                case 'and':
                    $filterCondition['must'] = $filterConditionArray;
                    break;
                default:
                    $filterCondition['should'] = $filterConditionArray;
                    $filterCondition['minimum_should_match'] = 1;
                    break;
            }
        }

        // handle group scope
        if($group->groupscope == 'own' || $group->groupscope == 'ownorgunit' || $group->groupscope == 'creator') {
            // get also users we represent
            $absence = BeanFactory::getBean('UserAbsences');

            switch ($group->groupscope) {
                case 'own':
                    $filterCondition['must'][] = ["terms" => ["assigned_user_id" => array_merge([$current_user->id], $absence->getSubstituteIDs())]];
                    break;
                case 'ownorgunit':
                    $filterCondition['must'][] = ["terms" => ["assigned_orgunit_id" => array_merge([$current_user->orgunit_id], $absence->getSubstituteOrgUnitIDs())]];
                    break;
                case 'creator':
                    $filterCondition['must'][] = ["terms" => ["created_by" => array_merge([$current_user->id], $absence->getSubstituteIDs())]];
                    break;
            }
        }

        // handle geo Data
        if ($group->geography && $group->geography->radius) {
            $filterCondition['must'][] = [
                "geo_distance" => [
                    "distance" => $group->geography->radius . "km",
                    "_location" => [
                        "lat" => $group->geography->lat,
                        "lon" => $group->geography->lng,
                    ]
                ]
            ];
        }

        return count($filterCondition) > 0 ? ['bool' => $filterCondition] : [];
    }

    /**
     * builds the filter for a single condition
     *
     * @param $condition
     * @return array
     * @throws Exception
     */
    private function buildElasticFilterForCondition($condition)
    {
        switch ($condition->operator) {
            case 'empty':
                return ['bool' => ['must_not' => [['exists' => ["field" => $condition->field]]]]];
                break;
            case 'emptyr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return ['bool' => ['must_not' => [['exists' => ["field" => $relatedField]]]]];
                }
                break;
            case 'notempty':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return ['exists' => ["field" => $relatedField]];
                }
                break;
            case 'notemptyr':
                return ['exists' => ["field" => $condition->field]];
                break;
            case 'equals':
                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    return ['match' => [$condition->field => $condition->filtervalue]];
                } else {
                    return ['term' => [$condition->field . '.raw' => $condition->filtervalue]];
                }
                break;
            case 'notequals':
                return ['bool' => ['must_not' => ['term' => [$condition->field . '.raw' => $condition->filtervalue]]]];
                break;
            case 'equalr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    $filtervalues = explode('::', $condition->filtervalue);
                    return ['term' => [$relatedField => $filtervalues['0']]];
                }
                break;
            case 'notequalr':
                if ($this->filtermodule) {
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    $filtervalues = explode('::', $condition->filtervalue);
                    return ['bool' => ['must_not' => ['term' => [$relatedField . '.raw' => $filtervalues['0']]]]];
                }
                break;
            case 'equalrcu':
                if ($this->filtermodule) {
                    $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return ['term' => [$relatedField => $currentUser->id]];
                }
                break;
            case 'notequalrcu':
                if ($this->filtermodule) {
                    $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                    $seed = BeanFactory::getBean($this->filtermodule);
                    $relatedField = $seed->field_defs[$condition->field]['id_name'];
                    return ['bool' => ['must_not' => ['term' => [$relatedField . '.raw' => $currentUser->id]]]];
                }
                break;
            case 'oneof':
                if (is_array($condition->filtervalue)) {
                    $valArray = $condition->filtervalue;
                } else {
                    $valArray = explode(',', $condition->filtervalue);
                }

                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    $matchArray = array_map(function ($item) use ($condition) {return ['match' => [$condition->field => $item]]; }, $valArray);
                    return ['bool' => ['should' => $matchArray]];
                } else {
                    return ['terms' => [$condition->field . '.raw' => $valArray]];
                }
                break;
            case 'notoneof':
                if (is_array($condition->filtervalue)) {
                    $valArray = $condition->filtervalue;
                } else {
                    $valArray = explode(',', $condition->filtervalue);
                }

                $seed = BeanFactory::getBean($this->filtermodule);
                $isMultiEnum = $seed->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    $matchArray = array_map(function ($item) use ($condition) {return ['match' => [$condition->field => $item]]; }, $valArray);
                    return ['bool' => ['must_not' => $matchArray]];
                } else {
                    return ['terms' => [$condition->field . '.raw' => $valArray]];
                }
            case 'true':
                return ['term' => [$condition->field . '.raw' => 1]];
                break;
            case 'false':
                return ['term' => [$condition->field . '.raw' => 0]];
                break;
            case 'starts':
                return ['wildcard' => [$condition->field . '.raw' => $condition->filtervalue . '*']];
                break;
            case 'contains':
                return ['match' => [$condition->field => $condition->filtervalue]];
                break;
            case 'ncontains':
                return ['bool' => ['must_not' => [['match' => [$condition->field => $condition->filtervalue]]]]];
                break;
            case 'greater':
                return ['range' => [$condition->field . '.raw' => ['gt' => $condition->filtervalue]]];
                break;
            case 'gequal':
                return ['range' => [$condition->field . '.raw' => ['gte' => $condition->filtervalue]]];
                break;
            case 'less':
                return ['range' => [$condition->field . '.raw' => ['lt' => $condition->filtervalue]]];
                break;
            case 'lequal':
                return ['range' => [$condition->field . '.raw' => ['lte' => $condition->filtervalue]]];
                break;
            case 'between':
                return ['range' => [$condition->field . '.raw' => ['gte' => $condition->filtervalue, 'lte' => $condition->filtervalueto, "include_lower" => true, "include_upper" => true]]];
                break;
            case 'betweend':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $start =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalue . ' 00:00:00', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $end =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalueto . ' 23:59:59', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $start, 'lte' => $end, "include_lower" => true, "include_upper" => true]]];
                break;
            case 'today':
                $today = date_format(new DateTime(), 'Y-m-d');
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $start =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $today . ' 00:00:00', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $end =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $today . ' 23:59:59', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $start, "lte" => $end, "include_lower" => true, "include_upper" => true]]];
                break;
            case 'past':
                $now = date_format(new DateTime('now', new DateTimeZone('UTC')), TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["lt" => $now]]];
                break;
            case 'future':
                $now = date_format(new DateTime('now', new DateTimeZone('UTC')), TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gt" => $now]]];
            case 'thismonth':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format(new DateTime('now', new DateTimeZone($timeZone)), 'Y-m-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format(new DateTime('now', new DateTimeZone($timeZone)), 'Y-m-t 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'nextmonth':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval('P1M'));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-m-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-m-t 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'thisyear':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-01-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-12-31 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'nextyear':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval('P1Y'));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-01-01 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, 'Y-12-31 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'inndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'thisday':
                $today = new DateTime(null, new DateTimeZone('UTC'));
                return ['script' => ['script' => "doc.{$condition->field}.date.monthOfYear == {$today->format('m')} && doc.{$condition->field}.date.dayOfMonth  == {$today->format('d')}"]];
            case 'ndaysago':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
            case 'inlessthanndays':
            case 'inlessthandays':
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                return ['range' => [$condition->field => ["lte" => $date->format('Y-m-d') . ' 23:59:59']]];
            case 'inmorethanndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gte" => $from]]];
            case 'inlastndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gte" => $to]]];
            case 'lastndays':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gte" => $to]]];
            case 'lastnmonths':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $date->sub(new DateInterval("P{$condition->filtervalue}M"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gte" => $to]]];
            case 'untilyesterday':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["lt" => $from]]];
            case 'fromtomorrow':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $date = new DateTime('now', new DateTimeZone($timeZone));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return ['range' => [$condition->field => ["gt" => $to]]];
            case 'nyearsago':
                $seed = BeanFactory::getBean($this->filtermodule);
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $timeZone = $currentUser->getPreference('timezone');
                $dateToday = new DateTime('now', new DateTimeZone($timeZone));
                $dateToday->sub(new DateInterval("P{$condition->filtervalue}Y"));
                if ( $seed->field_defs[$condition->field]['type'] === 'date') {
                    return ['term' => [$condition->field . '.raw' => $dateToday->format( TimeDate::DB_DATE_FORMAT )]];
                } else {
                    $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($dateToday, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($dateToday, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    return ['range' => [$condition->field => ['gte' => $from, "lte" => $to, "include_lower" => true, "include_upper" => true]]];
                }
        }
    }


    /**
     * checks is a bean matches a filter
     *
     * @param $filterId the filter id
     * @param SpiceBean $bean the bean that shoudl be checked if the filter matches
     * @return boolean true if the criteria of the filter are matcehd
     */
    public function checkBeanForFilterIdMatch($filterId, $bean)
    {
        $db = DBManagerFactory::getInstance();

        $filter = $db->fetchByAssoc($db->query('SELECT * FROM sysmodulefilters WHERE id=\'' . $db->quote($filterId) . '\' UNION SELECT * FROM syscustommodulefilters WHERE id=\'' . $db->quote($filterId) . '\''));
        if (!$filter) return '';

        $conditions = json_decode(html_entity_decode($filter['filterdefs']));

        return $this->checkBeanForFilterMatchGroup($conditions, $bean);

    }

    public function checkBeanForFilterMatchGroup($group, $bean)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $filterConditionArray = [];

        // get also users we represent
        $absence = BeanFactory::getBean('UserAbsences');
        $userIds = array_merge([$current_user->id], $absence->getSubstituteIDs());

        // if the criteria is won and the user does not match return false
        if ($group->groupscope == 'own' && array_search($bean->assigned_user_id, $userIds) === false) return false;

        $conditionmet = false;

        foreach ($group->conditions as $condition) {
            if ( isset( $condition->conditions )) {
                $conditionmet = $this->checkBeanForFilterMatchGroup($condition, $bean);
            } else {
                $conditionmet = $this->checkBeanForFilterMatchCondition($condition, $bean);
            }
            // in case of AND .. one negative is all negative
            // in case of OR one positive is enough
            if (strtoupper($group->logicaloperator) == 'AND' && !$conditionmet) {
                return false;
            } else if (strtoupper($group->logicaloperator) == 'OR' && $conditionmet) {
                return true;
            }
        }

        return $conditionmet;
    }

    private function checkBeanForFilterMatchCondition($condition, $bean)
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $timeZone = $currentUser->getPreference('timezone');
        $date = new DateTime('now', new DateTimeZone($timeZone));

        switch ($condition->operator) {
            case 'empty':
                return empty($bean->{$condition->field});
            case 'emptyr':
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                return empty($bean->{$relatedField});
            case 'notempty':
                return !empty($bean->{$condition->field});
            case 'notemptyr':
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                return !empty($bean->{$relatedField});
            case 'equals':
                return $bean->{$condition->field} == $condition->filtervalue;
            case 'notequals':
                return $bean->{$condition->field} != $condition->filtervalue;
            case 'equalr':
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                $filtervalues = explode('::', $condition->filtervalue);
                return $bean->{$relatedField} == $filtervalues['0'];
            case 'notequalr':
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                $filtervalues = explode('::', $condition->filtervalue);
                return $bean->{$relatedField} != $filtervalues['0'];
            case 'equalrcu':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                $filtervalues = explode('::', $condition->filtervalue);
                return $bean->{$relatedField} == $currentUser->id;
            case 'notequalrcu':
                $currentUser = AuthenticationController::getInstance()->getCurrentUser();
                $relatedField = $bean->field_defs[$condition->field]['id_name'];
                $filtervalues = explode('::', $condition->filtervalue);
                return $bean->{$relatedField} != $currentUser->id;
            case 'oneof':
                $valArray = is_array($condition->filtervalue) ? $condition->filtervalue : explode(',', $condition->filtervalue);
                $isMultiEnum = $bean->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    foreach ($valArray as $val) if (strpos($bean->{$condition->field}, $val) !== false) return true;
                    return false;
                } else {
                    return array_search($bean->{$condition->field}, $valArray) !== false;
                }
            case 'notoneof':
                $valArray = is_array($condition->filtervalue) ? $condition->filtervalue : explode(',', $condition->filtervalue);
                $isMultiEnum = $bean->field_defs[$condition->field]['type'] == 'multienum';
                if ($isMultiEnum) {
                    foreach ($valArray as $val) if (strpos($bean->{$condition->field}, $val) === false) return true;
                    return false;
                } else {
                    return array_search($bean->{$condition->field}, $valArray) === false;
                }
            case 'true':
                return $bean->{$condition->field};
            case 'false':
                return !$bean->{$condition->field};
            case 'starts':
                return strpos($bean->{$condition->field}, $condition->filtervalue) === 0;
            case 'contains':
                return strpos($bean->{$condition->field}, $condition->filtervalue) !== false;
            case 'ncontains':
                return strpos($bean->{$condition->field}, $condition->filtervalue) === false;
            case 'greater':
                return $bean->{$condition->field} > $condition->filtervalue;
            case 'gequal':
                return $bean->{$condition->field} >= $condition->filtervalue;
            case 'less':
                return $bean->{$condition->field} < $condition->filtervalue;
            case 'lequal':
                return $bean->{$condition->field} <= $condition->filtervalue;
            case 'today':
                $today = date_format(new DateTime(), 'Y-m-d');
                return substr($bean->{$condition->field}, 0, 10) == $today;
            case 'past':
                $beanData = new DateTime($bean->{$condition->field});
                $now = new DateTime();
                return $beanData < $now;
            case 'future':
                $beanData = new DateTime($bean->{$condition->field});
                $now = new DateTime();
                return $beanData > $now;
            case 'thismonth':
                $month = date_format(new DateTime(), 'Y-m');
                return substr($bean->{$condition->field}, 0, 7) == $month;
            case 'nextmonth':
                $date = new DateTime();
                $date->add(new DateInterval('P1M'));
                $month = date_format($date, 'Y-m');
                return substr($bean->{$condition->field}, 0, 7) == $month;
            case 'thisyear':
                $year = date_format(new DateTime(), 'Y');
                return substr($bean->{$condition->field}, 0, 4) == $year;
            case 'nextyear':
                $date = new DateTime();
                $date->add(new DateInterval('P1Y'));
                $year = date_format($date, 'Y');
                return substr($bean->{$condition->field}, 0, 4) == $year;
            case 'inndays':
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $beanFieldValue = (TimeDate::getInstance()->fromDbDate($bean->{$condition->field}))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue >= $from && $beanFieldValue <= $to;
            case 'thisday':
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                return $beanFieldValue->format('d') == $date->format('d') && $beanFieldValue->format('m') == $date->format('m');
            case 'inlessthanndays':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) <= $date->format(TimeDate::DB_DATE_FORMAT) . ' 23:59:59';
            case 'inlastndays':
            case 'lastndays':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) >= $to;
            case 'lastnmonths':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $date->sub(new DateInterval("P{$condition->filtervalue}M"));
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) >= $to;
            case 'between':
                return $bean->{$condition->field} >= $condition->filtervalue && $bean->{$condition->field} <= $condition->filtervalueto;
            case 'betweend':
                $beanFieldValue = (TimeDate::getInstance()->fromDbDate($bean->{$condition->field}))->format(TimeDate::DB_DATETIME_FORMAT);
                $start =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalue . ' 00:00:00', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $end =  date_create_from_format(TimeDate::DB_DATETIME_FORMAT, $condition->filtervalueto . ' 23:59:59', new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue >= $start && $beanFieldValue <= $end;
            case 'ndaysago':
                $beanFieldValue = (TimeDate::getInstance()->fromDbDate($bean->{$condition->field}))->format(TimeDate::DB_DATETIME_FORMAT);
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue >= $from && $beanFieldValue <= $to;
            case 'inlessthandays':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->sub(new DateInterval("P{$condition->filtervalue}D"));
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) <= $date->format(TimeDate::DB_DATE_FORMAT) . " 23:59:59";
            case 'inmorethanndays':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $date = new DateTime(null, new DateTimeZone('UTC'));
                $date->add(new DateInterval("P{$condition->filtervalue}D"));
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) >= $date->format(TimeDate::DB_DATE_FORMAT) . " 23:59:59";
            case 'untilyesterday':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) < $from;
            case 'fromtomorrow':
                $beanFieldValue = TimeDate::getInstance()->fromDbDate($bean->{$condition->field});
                $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                return $beanFieldValue->format(TimeDate::DB_DATETIME_FORMAT) > $to;
            case 'nyearsago':
                $date->sub(new DateInterval("P{$condition->filtervalue}Y"));
                if ( $bean->field_defs[$condition->field]['type'] === 'date') {
                    return $bean->{$condition->field} === $date->format( TimeDate::DB_DATE_FORMAT );
                } else {
                    $from = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 00:00:00'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    $to = date_create_from_format(TimeDate::DB_DATETIME_FORMAT, date_format($date, TimeDate::DB_DATE_FORMAT . ' 23:59:59'), new DateTimeZone($timeZone))->setTimezone(new DateTimeZone('UTC'))->format(TimeDate::DB_DATETIME_FORMAT);
                    return ( $bean->{$condition->field} >= $from and $bean->{$condition->field} <= $to );
                }
            default:
                return false;
        }
    }
}
