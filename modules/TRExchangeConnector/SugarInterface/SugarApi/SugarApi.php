<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarApi;

class SugarApi {

    public function call($sugarMethod, $parameters) {

        if (in_array($sugarMethod, get_class_methods($this))) {
            return $this->$sugarMethod($parameters);
        }
    }

    protected function getBean($parameters) {

        $bean = new $parameters['bean'];
        $bean->retrieve($parameters['id']);
        return $bean;
    }

    protected function getBeanList($parameters) {

        global $db;

        $bean = new $parameters['bean'];

        $rowCount = 0;
        $mainQuery = $bean->create_new_list_query($parameters['orderBy'], $parameters['where'], array(), array(), 0, '', false, null, false);
        $countQuery = $bean->create_list_count_query($mainQuery);
        if (!empty($countQuery)) {
            $result = $db->query($countQuery, true, "Error running count query for {$parameters['bean']} List: ");
            $assoc = $db->fetchByAssoc($result);
            if (!empty($assoc['c'])) {
                $rowCount = $assoc['c'];
            }
        }

        $list = $bean->get_list($parameters['orderBy'], $parameters['where'], $parameters['offset'], $parameters['pageSize'], $parameters['pageSize']);
        $list['row_count'] = intval($rowCount);
        return $list;
    }

    protected function saveBeanList($parameters) {

        /* @var $bean \SugarBean */
        foreach ($parameters['list'] as $bean) {
            if (is_a($bean, 'SugarBean')) {
                $bean->save(false);
            }
        }
    }

    protected function getBeanIdList($parameters) {

        global $db;

        $bean = new $parameters['bean'];

        $whereClause = ($parameters['where'] ? "WHERE ({$parameters['where']}) AND deleted=0" : "WHERE deleted = 0");
        $orderByClause = ($parameters['orderBy'] ? "ORDER BY  {$parameters['orderBy']}" : "");

        $query = "SELECT id FROM {$bean->table_name} " . $whereClause . " " . $orderByClause;
        $result = $db->limitQuery($query, $parameters['offset'], $parameters['pageSize']);

        $ids = array();
        while ($row = $db->fetchByAssoc($result)) {
            $ids[] = $row['id'];
        }

        return $ids;
    }

    protected function getBeansForUser($parameters) {

        $beanList = array();
        $idsToRetrieve = $parameters['idsToRetrieve'];

        foreach ($idsToRetrieve as $id) {
            $bean = new $parameters['bean']();
            $bean->retrieve($id);
            if (!empty($bean->id)) {
                $beanList[$id]['exists'] = true;
                $beanList[$id]['accessAllowed'] = true;
                $beanList[$id]['bean'] = $bean;
            } else {
                $beanList[$id]['exists'] = false;
                $beanList[$id]['accessAllowed'] = false;
                $beanList[$id]['bean'] = NULL;
            }
        }

        return $beanList;
    }

    protected function getBeansByIdBeanPairForUser($parameters) {
        
        global $current_user;

        $beanList = array();
        $idBeanPairsToRetrieve = $parameters['idBeanPairsToRetrieve'];
        
        $impersonatedCurrentUser = $parameters['user'];
        $actualCurrentUser = $current_user;
        $current_user = $impersonatedCurrentUser;

        foreach ($idBeanPairsToRetrieve as $idBeanPairToRetrieve) {
            list($id, $beanClass) = $idBeanPairToRetrieve;
            $bean = new $beanClass();
            $bean->retrieve($id);
            if (!empty($bean->id)) {
                if (isset($parameters['afterRetrieve'][$beanClass]) && is_array($parameters['afterRetrieve'][$beanClass])) {
                    foreach($parameters['afterRetrieve'][$beanClass] as $callBack) {
                        if(is_callable($callBack)) {
                            $callBack($bean);
                        }
                    }
                }
                if($bean->ACLAccess('list')) {
                    $beanList[$id]['exists'] = true;
                    $beanList[$id]['accessAllowed'] = true;
                    $beanList[$id]['bean'] = $bean;
                } else {
                    $beanList[$id]['exists'] = true;
                    $beanList[$id]['accessAllowed'] = false;
                    $beanList[$id]['bean'] = null;                    
                }
            } else {
                $beanList[$id]['exists'] = false;
                $beanList[$id]['accessAllowed'] = false;
                $beanList[$id]['bean'] = NULL;
            }
        }
        
        $current_user = $actualCurrentUser;
        return $beanList;
    }

    protected function getContactsToSyncForUser($parameters) {

        global $db, $current_user;

        $impersonatedCurrentUser = $parameters['user'];

        $parameters['from'] .= " LEFT JOIN contacts_users cu ON contacts.id = cu.contact_id AND cu.deleted = 0 ";
        $parameters['additionalWhere'] .= " AND cu.user_id='" . $impersonatedCurrentUser->id . "'";

        if ($parameters['lastSyncDate']) {
            $where = "contacts.date_modified >= " . $db->convert($db->quoted($parameters['lastSyncDate']->asDb()), 'datetime') . " ";
        }
        if ($parameters['where']) {
            $parameters['where'] .= ' AND ' . $where;
        } else {
            $parameters['where'] = $where;
        }
        $parameters['bean'] = 'Contact';
        $parameters['orderBy'] = "date_modified";

        $listRegular = $this->getBeansToSyncForUser($parameters, 0);
        foreach ($listRegular['list'] as &$contact) {
            $contact->emailAddress->handleLegacyRetrieve($contact);
        }
        $parametersDeleted = $parameters;
//        $parametersDeleted['fieldList'] = array('id', 'name');
//        $parametersDeleted['distinct'] = array('distinct' => 'DISTINCT');
        $listDeleted = $this->getBeansToSyncForUser($parametersDeleted, 1);

        $fullList = array();
        $fullList['list'] = array_merge($listRegular['list'], $listDeleted['list']);
        $fullList['row_count'] = max($listRegular['row_count'], $listDeleted['row_count']);
        $fullList['next_offset'] = max($listRegular['next_offset'], $listDeleted['next_offset']);

        return $fullList;
    }

    protected function getTasksToSyncForUser($parameters) {

        global $db, $current_user;

        $impersonatedCurrentUser = $parameters['user'];
//        $where = "tasks.assigned_user_id = '" . $impersonatedCurrentUser->id . "' AND tasks.status <> 'Completed'";
        $where = "tasks.assigned_user_id = '" . $impersonatedCurrentUser->id . "'";
        if ($parameters['lastSyncDate']) {
            $where .= " AND tasks.date_modified >= " . $db->convert($db->quoted($parameters['lastSyncDate']->asDb()), 'datetime') . " ";
        }
        if (isset($parameters['where']) && $parameters['where']) {
            $parameters['where'] .= ' AND ' . $where;
        } else {
            $parameters['where'] = $where;
        }
        $parameters['bean'] = 'Task';
        $parameters['orderBy'] = "date_modified";

        $listRegular = $this->getBeansToSyncForUser($parameters, 0);
        
        $parametersDeleted = $parameters;
//        $parametersDeleted['fieldList'] = array('id');
//        $parametersDeleted['distinct'] = array('distinct' => 'DISTINCT');
        $listDeleted = $this->getBeansToSyncForUser($parametersDeleted, 1);

        $fullList = array();
        $fullList['list'] = array_merge($listRegular['list'], $listDeleted['list']);
        $fullList['row_count'] = max($listRegular['row_count'], $listDeleted['row_count']);
        $fullList['next_offset'] = max($listRegular['next_offset'], $listDeleted['next_offset']);

        return $fullList;
    }

    protected function getCalendarItemsToSyncForUser($parameters) {

        global $timedate;

        $callsParameters = $parameters;
        $callsParameters['fieldList'] = array_keys($parameters['mappings']['Call']);
        if(isset($parameters['afterRetrieve']['Call'])) {
            $callsParameters['afterRetrieve'] = $parameters['afterRetrieve']['Call'];
        } else {
            $callsParameters['afterRetrieve'] = null;
        }
        $calls = $this->getCallsToSyncForUser($callsParameters);

        $meetingsParameters = $parameters;
        $meetingsParameters['fieldList'] = array_keys($parameters['mappings']['Meeting']);
        if(isset($parameters['afterRetrieve']['Meeting'])) {
            $meetingsParameters['afterRetrieve'] = $parameters['afterRetrieve']['Meeting'];
        } else {
            $meetingsParameters['afterRetrieve'] = null;
        }        
        $meetings = $this->getMeetingsToSyncForUser($meetingsParameters);

        return array(
            'calls' => $calls,
            'meetings' => $meetings,
        );
    }

    protected function getCallsToSyncForUser($parameters) {
        
        global $db;

        $parameters['bean'] = 'Call';

        $whereClauses = array();
        if ($parameters['where']) {
            $whereClauses[] = $parameters['where'];
        }
        if ($parameters['startAfter']) {
            $whereClauses[] .= "calls.date_start > " . $db->convert($db->quoted($parameters['startAfter']->asDb()), 'datetime');
        }
        $parameters['where'] = implode(' AND ', $whereClauses);

        $impersonatedCurrentUser = $parameters['user'];
        $parameters['from'] = " LEFT JOIN calls_users cu ON calls.id = cu.call_id AND cu.deleted = 0 AND cu.accept_status = 'accept' ";
        $parameters['additionalWhere'] = " AND cu.user_id='" . $impersonatedCurrentUser->id . "'";

        if ($parameters['lastSyncDate']) {
            $lastSyncDate = $db->convert($db->quoted($parameters['lastSyncDate']->asDb()), 'datetime');
            $parameters['additionalWhere'] .= " AND (calls.date_modified >= " . $lastSyncDate . " OR cu.date_modified >= " . $lastSyncDate . ") ";
        }

        $parameters['orderBy'] = "date_modified";

        $listRegular = $this->getBeansToSyncForUser($parameters);

        $parametersDeleted = $parameters;
//        $parametersDeleted['fieldList'] = array('id');
//        $parametersDeleted['distinct'] = array('distinct' => 'DISTINCT');
        $parametersDeleted['from'] = " LEFT JOIN calls_users cu ON calls.id = cu.call_id ";
        $listDeleted = $this->getBeansToSyncForUser($parametersDeleted, 1);

        $fullList = array();
        $fullList['list'] = array_merge($listRegular['list'], $listDeleted['list']);
        $fullList['row_count'] = max($listRegular['row_count'], $listDeleted['row_count']);
        $fullList['next_offset'] = max($listRegular['next_offset'], $listDeleted['next_offset']);

        return $fullList;
    }

    protected function getMeetingsToSyncForUser($parameters) {
        
        global $db;

        $parameters['bean'] = 'Meeting';

        $whereClauses = array();
        if ($parameters['where']) {
            $whereClauses[] = $parameters['where'];
        }
        if ($parameters['startAfter']) {
            $whereClauses[] = "meetings.date_start > " . $db->convert($db->quoted($parameters['startAfter']->asDb()), 'datetime');
        }
        $parameters['where'] = implode(' AND ', $whereClauses);

        $impersonatedCurrentUser = $parameters['user'];
        $parameters['from'] = " LEFT JOIN meetings_users mu ON meetings.id = mu.meeting_id AND mu.deleted = 0 AND mu.accept_status = 'accept' ";
        $parameters['additionalWhere'] = " AND mu.user_id='" . $impersonatedCurrentUser->id . "'";

        if ($parameters['lastSyncDate']) {
            $lastSyncDate = $db->convert($db->quoted($parameters['lastSyncDate']->asDb()), 'datetime');
            $parameters['additionalWhere'] .= " AND (meetings.date_modified >= " . $lastSyncDate . " OR mu.date_modified >= " . $lastSyncDate . ") ";
        }

        $parameters['orderBy'] = "date_modified";

        $listRegular = $this->getBeansToSyncForUser($parameters);

        $parametersDeleted = $parameters;
//        $parametersDeleted['fieldList'] = array('id');
//        $parametersDeleted['distinct'] = array('distinct' => 'DISTINCT');        
        $parametersDeleted['from'] = " LEFT JOIN meetings_users mu ON meetings.id = mu.meeting_id ";
        $listDeleted = $this->getBeansToSyncForUser($parametersDeleted, 1);

        $fullList = array();
        $fullList['list'] = array_merge($listRegular['list'], $listDeleted['list']);
        $fullList['row_count'] = max($listRegular['row_count'], $listDeleted['row_count']);
        $fullList['next_offset'] = max($listRegular['next_offset'], $listDeleted['next_offset']);

        return $fullList;
    }

    protected function getBeansToSyncForUser($parameters, $deleted = 0) {

        global $db, $current_user;

        $sugarBeanClass = $parameters['bean'];
        $bean = new $sugarBeanClass();

        $impersonatedCurrentUser = $parameters['user'];
        $actualCurrentUser = $current_user;
        $current_user = $impersonatedCurrentUser;

        $buildMainQuery = function($bean, $parameters, $deleted) {

            $additionalFrom = isset($parameters['from']) ? $parameters['from'] : '';
            $additionalWhere = isset($parameters['additionalWhere']) ? $parameters['additionalWhere'] : '';
            if (isset($parameters['fieldList'])) {
                $fieldList = $parameters['fieldList'];
            } else {
                $fieldList = array();
            }          
            $distinct = isset($parameters['distinct']) ? $parameters['distinct'] : array();
            
            // $mainQueryArray = $bean->create_new_list_query($parameters['orderBy'], $parameters['where'], $fieldList, array('distinct' => 'DISTINCT'), $deleted, '', true, $bean, true);
            $mainQueryArray = $bean->create_new_list_query($parameters['orderBy'], $parameters['where'], $fieldList, $distinct, $deleted, '', true, $bean, true);
            $mainQueryArray['from'] .= $additionalFrom;
            $mainQueryArray['where'] .= $additionalWhere;
            $mainQuery = $mainQueryArray['select'] . $mainQueryArray['from'] . $mainQueryArray['where'] . $mainQueryArray['order_by'];
            return $mainQuery;
        };

        $executeMainQuery = function($bean, $mainQuery) use ($parameters) {

            global $db;

            $rowCount = 0;
            $countQuery = $bean->create_list_count_query($mainQuery);

            if (!empty($countQuery)) {
                $result = $db->query($countQuery, true, "Error running count query for {$parameters['bean']} List: ");
                $assoc = $db->fetchByAssoc($result);
                if (!empty($assoc['c'])) {
                    $rowCount = $assoc['c'];
                }
            }
            $list = $bean->process_list_query($mainQuery, $parameters['offset'], $parameters['pageSize'], $parameters['pageSize']);
            $list['row_count'] = intval($rowCount);
            return $list;
        };

        $mainQuery = $buildMainQuery($bean, $parameters, $deleted);
        $list = $executeMainQuery($bean, $mainQuery);
        
        if(isset($parameters['afterRetrieve']) && is_array($parameters['afterRetrieve'])) {
            foreach($list['list'] as &$bean) {
                foreach($parameters['afterRetrieve'] as $callback) {
                    if(is_callable($callback)) {
                        $callback($bean);
                    }
                }
            }
        }

        $current_user = $actualCurrentUser;

        return $list;
    }

    protected function saveBeanListForUser($parameters) {

        global $current_user;

        $actualCurrentUser = $current_user;
        $user = $parameters['user'];
        $beanClass = $parameters['bean'];
        $propertyValueLists = $parameters['list'];
        $saveResults = array();
        $current_user = $user;
        /* @var $bean \SugarBean */
        foreach ($propertyValueLists as $propertyValueList) {
            $saveResult = array();
            $bean = new $beanClass();
            if ($propertyValueList['id']) {
                $bean->retrieve($propertyValueList['id']);
            }
            if ($bean->ACLAccess('edit')) {
                foreach ($propertyValueList as $field => $value) {
                    $bean->$field = $value;
                }
                $id = $bean->save(false);
                $saveResult['responseClass'] = 'Success';
                $saveResult['responseCode'] = 'Bean saved';
                $saveResult['id'] = $id;
            } else {
                $saveResult['responseClass'] = 'Error';
                $saveResult['responseCode'] = 'Not authorized for update';
                $saveResult['id'] = $id;
            }
            $saveResults[] = $saveResult;
            unset($bean);
        }
        $current_user = $actualCurrentUser;
        return $saveResults;
    }

    protected function saveBeanBeanClassPairListForUser($parameters) {

        global $current_user;

        $actualCurrentUser = $current_user;
        $user = $parameters['user'];
        $beanBeanClassPairList = $parameters['list'];
        $saveResults = array();
        $current_user = $user;
        /* @var $bean \SugarBean */
        foreach ($beanBeanClassPairList as $beanBeanClassPair) {
            list($propertyValueList, $beanClass) = $beanBeanClassPair;
            $saveResult = array();
            $bean = new $beanClass();
            if ($propertyValueList['id']) {
                $bean->retrieve($propertyValueList['id']);
            }
            if ($bean->ACLAccess('edit')) {

                foreach ($propertyValueList as $field => $value) {
                    $bean->$field = $value;
                }                
                
                // before save callbacks
                switch($beanClass) {
                    case 'Call':
                        $this->processCallFromExchangeBeforeSave($bean);
                        break;
                    case 'Meeting':
                        $this->processMeetingFromExchangeBeforeSave($bean);
                        break;
                    default:
                        break;
                }
                
                $id = $bean->save(false);
                $saveResult['responseClass'] = 'Success';
                $saveResult['responseCode'] = 'Bean saved';
                $saveResult['id'] = $id;
            } else {
                $saveResult['responseClass'] = 'Error';
                $saveResult['responseCode'] = 'Not authorized for update';
                $saveResult['id'] = $id;
            }
            $saveResults[] = $saveResult;
            unset($bean);
        }
        $current_user = $actualCurrentUser;
        return $saveResults;
    }

    protected function processCallFromExchangeBeforeSave(&$thisCall) {

    }

    protected function processMeetingFromExchangeBeforeSave(&$thisMeeting) {

    }

}
