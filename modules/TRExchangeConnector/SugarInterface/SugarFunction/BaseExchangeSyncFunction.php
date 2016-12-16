<?php

/*
 * Copyright notice
 * 
 * (c) 2015 twentyreasons business solutions GmbH <office@twentyreasons.com>
 * 
 * All rights reserved
 */

namespace TRBusinessConnector\SugarInterface\SugarFunction;

class BaseExchangeSyncFunction extends \TRBusinessConnector\SugarInterface\SugarFunction\AbstractSugarFunction {

    protected $sugarMethod = '';
    protected $bean = '';
    protected $jobUser;
    protected $impersonatedUser;

    protected function createParameters($callParameters) {

        return array();
    }

    protected function retrieveErrors($result) {

        return array();
    }

    protected function retrieveResults($result) {

        return array();
    }

    protected function getContactRetrieveMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'assigned_user_id' => 'assignedUserId',
            'assigned_user_name' => 'assignedUserName',
            'date_modified' => 'dateModified',
            'first_name' => 'firstName',
            'last_name' => 'lastName',
//            'salutation' => 'titleKey',
            'description' => 'description',
            'email1' => 'email',
            'email2' => 'email2',
            'account_id' => 'accountId',
            'account_name' => 'accountName',
            'phone_work' => 'phoneWork',
            'phone_mobile' => 'phoneMobile',
            'phone_home' => 'phoneHome',
            'phone_other' => 'phoneOther',
            'phone_fax' => 'phoneFax',
            'primary_address_street' => 'primaryAddressStreet',
            'primary_address_city' => 'primaryAddressCity',
            'primary_address_state' => 'primaryAddressState',
            'primary_address_postalcode' => 'primaryAddressPostalcode',
            'primary_address_country' => 'primaryAddressCountry',
            'alt_address_street' => 'altAddressStreet',
            'alt_address_city' => 'altAddressCity',
            'alt_address_state' => 'altAddressState',
            'alt_address_postalcode' => 'altAddressPostalcode',
            'alt_address_country' => 'altAddressCountry',
            'deleted' => 'deleted'
        );
        return $mapping;
    }

    protected function getContactUpdateMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'assigned_user_id' => 'assignedUserId',
            'first_name' => 'firstName',
            'last_name' => 'lastName',
//            'salutation' => 'titleKey',
            'description' => 'description',
            'email1' => 'email',
            'email2' => 'email2',
            'account_id' => 'accountId',
            'phone_work' => 'phoneWork',
            'phone_mobile' => 'phoneMobile',
            'phone_home' => 'phoneHome',
            'phone_other' => 'phoneOther',
            'phone_fax' => 'phoneFax',
            'primary_address_street' => 'primaryAddressStreet',
            'primary_address_city' => 'primaryAddressCity',
            'primary_address_state' => 'primaryAddressState',
            'primary_address_postalcode' => 'primaryAddressPostalcode',
            'primary_address_country' => 'primaryAddressCountry',
            'alt_address_street' => 'altAddressStreet',
            'alt_address_city' => 'altAddressCity',
            'alt_address_state' => 'altAddressState',
            'alt_address_postalcode' => 'altAddressPostalcode',
            'alt_address_country' => 'altAddressCountry',
        );
        return $mapping;
    }

    protected function getTaskRetrieveMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
//            'assigned_user_id' => 'assignedUserId',
//            'assigned_user_name' => 'assignedUserName',            
            'name' => 'name',
            'description' => 'description',
            'date_start' => 'dateStart',
            'date_start_flag' => 'dateStartFlag',
            'date_due' => 'dateDue',
            'date_due_flag' => 'dateDueFlag',
            'status' => 'status',
            'priority' => 'priority',
            'deleted' => 'deleted',
            'date_modified' => 'dateModified'
        );
        return $mapping;
    }

    protected function getTaskUpdateMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
//            'assigned_user_id' => 'assignedUserId',
            'name' => 'name',
            'description' => 'description',
            'date_start' => 'dateStart',
            'date_start_flag' => 'dateStartFlag',
            'date_due' => 'dateDue',
            'date_due_flag' => 'dateDueFlag',
            'status' => 'status',
            'priority' => 'priority',
        );
        return $mapping;
    }

    protected function getCallRetrieveMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'parent_id' => 'parentId',
            'parent_name' => 'parentName',
            'parent_type' => 'parentType',
            'assigned_user_id' => 'assignedUserId',
            'assigned_user_name' => 'assignedUserName',
            'date_modified' => 'dateModified',
            'name' => 'name',
            'description' => 'description',
            'status' => 'sugarStatus',
            'date_start' => 'dateStart',
            'date_end' => 'dateEnd',
            'duration_hours' => 'durationHours',
            'duration_minutes' => 'durationMinutes',
            'deleted' => 'deleted'
        );
        return $mapping;
    }

    protected function getMeetingRetrieveMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'parent_id' => 'parentId',
            'parent_name' => 'parentName',
            'parent_type' => 'parentType',
            'assigned_user_id' => 'assignedUserId',
            'assigned_user_name' => 'assignedUserName',
            'date_modified' => 'dateModified',
            'name' => 'name',
            'description' => 'description',
            'location' => 'location',
            'status' => 'sugarStatus',
            'date_start' => 'dateStart',
            'date_end' => 'dateEnd',
            'duration_hours' => 'durationHours',
            'duration_minutes' => 'durationMinutes',
            'deleted' => 'deleted'
        );
        return $mapping;
    }

    protected function getCallUpdateMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'assigned_user_id' => 'assignedUserId',
            'parent_id' => 'parentId',
            'parent_type' => 'parentType',
            'name' => 'name',
            'status' => 'sugarStatus',
            'description' => 'description',
            'date_start' => 'dateStart',
            'date_end' => 'dateEnd',
            'duration_hours' => 'durationHours',
            'duration_minutes' => 'durationMinutes',
        );
        return $mapping;
    }

    protected function getMeetingUpdateMapping() {
        $mapping = array(
            // Sugar field => contact property
            'id' => 'sugarId',
            'assigned_user_id' => 'assignedUserId',
            'parent_id' => 'parentId',
            'parent_type' => 'parentType',
            'name' => 'name',
            'status' => 'sugarStatus',
            'description' => 'description',
            'location' => 'location',
            'date_start' => 'dateStart',
            'date_end' => 'dateEnd',
            'duration_hours' => 'durationHours',
            'duration_minutes' => 'durationMinutes',
        );
        return $mapping;
    }

    protected function createBeanFromModel($model) {

        $bean = new $this->$bean();
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $interfaceDataMap = $mappings[get_class($model)];
        foreach ($interfaceDataMap as $interfaceField => $mapping) {
            $getter = "get" . ucfirst($mapping);
            $bean->interfaceField = $this->convertValueToInterface($model->getter(), $modelVardefs[$mapping]['type']);
        }
        return $bean;
    }

    protected function createPropertyValueListFromModel($model) {

        $propertyValueList = array();
        $modelVardefs = $model->getVardefs();
        $mappings = $this->getModelMappings();
        $interfaceDataMap = $mappings[get_class($model)];
        foreach ($interfaceDataMap as $interfaceField => $mapping) {
            $getter = "get" . ucfirst($mapping);
            $propertyValueList[$interfaceField] = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
        }
        return $propertyValueList;
    }

    protected function createPropertyValueListFromModelMappingPair($modelMappingPair) {

        $propertyValueList = array();
        list($model, $interfaceDataMap) = $modelMappingPair;
        $modelVardefs = $model->getVardefs();
        foreach ($interfaceDataMap as $interfaceField => $mapping) {
            $getter = "get" . ucfirst($mapping);
            $propertyValueList[$interfaceField] = $this->convertValueToInterface($model->$getter(), $modelVardefs[$mapping]['type']);
        }
        return $propertyValueList;
    }
    
    protected function impersonate(\User $impersonatedUser) {
        
        global $current_user;
        
        $this->jobUser = $current_user;
        $current_user = $impersonatedUser;
    }
    
    protected function cancelImpersonation() {
        
        global $current_user;
        
        if($this->jobUser && is_a($this->jobUser, 'User')) {
            $current_user = $this->jobUser;
        }
    }

    protected function getMeetingRetrieveCallback() {

        $prepareMeetingForExchangeSync = function (&$currentMeeting) {

            global $current_language, $app_list_strings, $sugar_config;

            $mod_strings = return_module_language($current_language, "Meetings");
            $mod_strings_accounts = return_module_language($current_language, "Accounts");

            $accountCols = "%30s %s";

            $account = new \Account();
            if ($account->retrieve($currentMeeting->account_id)) {
                $company = sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_SAP_CUSTOMERID'], ':') . ":", $account->k_sap_customerid) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_NAME'], ':') . ":", $account->name) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_NAME2'], ':') . ":", $account->k_name2) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_STREET'], ':') . ":", $account->billing_address_street) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_HSNM'], ':') . ":", $account->billing_address_hsnm) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_POSTALCODE'], ':') . ":", $account->billing_address_postalcode) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_CITY'], ':') . ":", $account->billing_address_city) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_PHONE_OFFICE'], ':') . ":", $account->phone_office) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_FAX'], ':') . ":", $account->phone_fax) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_WEBSITE'], ':') . ":", $account->website) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_INDUSTRY1'], ':') . ":", $account->k_industry1) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_INDUSTRY2'], ':') . ":", $account->k_industry2) . "\n";
            }
            $company = rtrim($company);

            $nameFormat = str_replace("l", '%3$s', str_replace("f", '%2$s', str_replace("s", '%1$s', $sugar_config['default_locale_name_format'])));

            $mod_strings_contact = return_module_language($current_language, "Contacts");

            $contactCols = "%-30s  %20s  %20s  %s";

            $contacts = "";
            $contactList = $currentMeeting->get_linked_beans('contacts', 'Contact');
            foreach ($contactList as $contact) {
                $fullName = trim(sprintf($nameFormat, $app_list_strings['sap_salutations'][$contact->salutation], $contact->first_name, $contact->last_name));
                $contacts .= sprintf($contactCols, $fullName, $contact->phone_work, $contact->phone_mobile, $contact->email1) . "\n";
                $contacts .= sprintf($contactCols, rtrim($mod_strings_contact['LBL_TITLE'], ':') . ":", $app_list_strings['sap_contact_functions'][$contact->title], rtrim($mod_strings_contact['LBL_K_AREA'], ':') . ":", $app_list_strings['sap_contact_departments'][$contact->k_area]) . "\n\n";
            }
            $contacts = rtrim($contacts);

            $mod_strings_potentials = return_module_language($current_language, "TRPotentials");

            $potentialCols = "%15s  %-30s  %20s  %20s  %s";
            // headline
            $potentials = sprintf($potentialCols, trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_MATERIALGROUP_ID']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_MATERIALGROUP']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_SELFPOTENTIAL']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_COMPETITOR_POTENTIAL']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_ASSIGNED_CONTACTS'])) . "\n";

            $sql = "SELECT trp.id, trp.currency_id, trp.self_potential_value, trp.competitor_potential, km.name AS wgrname, km.sap_materialgroup_id AS wgrid
              FROM trpotentials_activities AS trpa
              JOIN trpotentials AS trp ON trp.id = trpa.trpotential_id AND trp.deleted = 0
              JOIN kmaterialgroups AS km ON km.id = trp.kmaterialgroup_id AND km.deleted = 0
             WHERE bean_id = '" . $currentMeeting->id . "' AND bean_module = '" . $currentMeeting->module_dir . "'";

            $resultSet = $GLOBALS['db']->query($sql);
            while ($row = $GLOBALS['db']->fetchByAssoc($resultSet)) {

                // read the contacts of the potential
                $sql = "SELECT c.salutation, c.first_name, c.last_name
                  FROM kpartners AS kp
                  JOIN contacts AS c ON c.id = kp.partner_id AND c.deleted = 0
                 WHERE kp.owner_id = '" . $row['id'] . "' AND kp.ref_type = 'TRPotential' AND kp.partner_role = 'AP' AND kp.deleted = 0";

                $resultSetContacts = $GLOBALS['db']->query($sql);
                $contactList = array();
                while ($contactRow = $GLOBALS['db']->fetchByAssoc($resultSetContacts)) {
                    $contactList[] = trim(sprintf($nameFormat, $app_list_strings['sap_salutations'][$contactRow['salutation']], $contactRow['first_name'], $contactRow['last_name']));
                }

                $currency_format_params = array(
                    'currency_symbol' => false,
                    'currency_id' => $row['currency_id']
                );
                $potentials .= sprintf($potentialCols, $row['wgrid'], $row['wgrname'], currency_format_number($row['self_potential_value'], $currency_format_params), currency_format_number($row['competitor_potential'], $currency_format_params), implode(', ', $contactList)) . "\n";
            }
            $potentials = rtrim($potentials);

            $intentions = unencodeMultienum($currentMeeting->k_intention);
            if (!is_array($intentions)) {
                $intentions = array();
            }
            $intentionDecorated = "";
            foreach ($intentions as $intention) {
                if (strlen($app_list_strings['k_intention_dom'][$intention]) > 0) {
                    $intentionDecorated .= "- " . $app_list_strings['k_intention_dom'][$intention] . "\n";
                }
            }
            $intentionDecorated = trim($intentionDecorated);

            $divider = "\n" . str_repeat("=", 70) . " \n";
            $currentMeeting->description = strtoupper(rtrim($mod_strings_accounts['LBL_ACCOUNT'], ':')) . ':' . $divider . $company . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_INTENTION'], ':')) . ':' . $divider . $intentionDecorated . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_TARGET'], ':')) . ':' . $divider . $currentMeeting->k_target . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_RESULT'], ':')) . ':' . $divider . $currentMeeting->k_result . "\n\n" .
                    strtoupper(rtrim($mod_strings_contact['LBL_DEFAULT_SUBPANEL_TITLE'], ':')) . ':' . $divider . $contacts . "\n\n" .
                    strtoupper(rtrim($mod_strings_potentials['LBL_DEFAULT_SUBPANEL_TITLE'], ':')) . ':' . $divider . $potentials . "\n\n";
        };
        return $prepareMeetingForExchangeSync;
    }

    protected function getCallRetrieveCallback() {

        $prepareCallForExchangeSync = function(&$currentCall) {

            global $current_language, $app_list_strings, $sugar_config;

            $mod_strings = return_module_language($current_language, "Calls");

            $mod_strings_accounts = return_module_language($current_language, "Accounts");

            $accountCols = "%30s %s";

            $account = new \Account();
            if ($account->retrieve($currentCall->account_id)) {
                $company = sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_SAP_CUSTOMERID'], ':') . ":", $account->k_sap_customerid) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_NAME'], ':') . ":", $account->name) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_NAME2'], ':') . ":", $account->k_name2) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_STREET'], ':') . ":", $account->billing_address_street) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_HSNM'], ':') . ":", $account->billing_address_hsnm) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_POSTALCODE'], ':') . ":", $account->billing_address_postalcode) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_BILLING_ADDRESS_CITY'], ':') . ":", $account->billing_address_city) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_PHONE_OFFICE'], ':') . ":", $account->phone_office) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_FAX'], ':') . ":", $account->phone_fax) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_WEBSITE'], ':') . ":", $account->website) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_INDUSTRY1'], ':') . ":", $account->k_industry1) . "\n";
                $company .= sprintf($accountCols, rtrim($mod_strings_accounts['LBL_K_INDUSTRY2'], ':') . ":", $account->k_industry2) . "\n";
            }
            $company = rtrim($company);

            $nameFormat = str_replace("l", '%3$s', str_replace("f", '%2$s', str_replace("s", '%1$s', $sugar_config['default_locale_name_format'])));

            $mod_strings_contact = return_module_language($current_language, "Contacts");

            $contactCols = "%-30s  %20s  %20s  %s";

            $contacts = "";
            $contactList = $currentCall->get_linked_beans('contacts', 'Contact');
            foreach ($contactList as $contact) {
                $fullName = trim(sprintf($nameFormat, $app_list_strings['sap_salutations'][$contact->salutation], $contact->first_name, $contact->last_name));
                $contacts .= sprintf($contactCols, $fullName, $contact->phone_work, $contact->phone_mobile, $contact->email1) . "\n";
                $contacts .= sprintf($contactCols, rtrim($mod_strings_contact['LBL_TITLE'], ':') . ":", $app_list_strings['sap_contact_functions'][$contact->title], rtrim($mod_strings_contact['LBL_K_AREA'], ':') . ":", $app_list_strings['sap_contact_departments'][$contact->k_area]) . "\n\n";
            }
            $contacts = rtrim($contacts);

            //BEGIN MODIFICATION MARETVAL 2014-01-21: kpotentialsheetitems replaced by trpotentials
            $mod_strings_potentials = return_module_language($current_language, "TRPotentials");
            $potentialCols = "%15s  %-30s  %20s  %20s  %s";
            // headline
            $potentials = sprintf($potentialCols, trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_MATERIALGROUP_ID']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_MATERIALGROUP']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_SELFPOTENTIAL']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_COMPETITOR_POTENTIAL']), trim($mod_strings_potentials['LBL_TRPOTENTIAL_LIST_ASSIGNED_CONTACTS'])) . "\n";

            // read the potentials
            $sql = "SELECT trp.id, trp.currency_id, trp.self_potential_value, trp.competitor_potential, km.name AS wgrname, km.sap_materialgroup_id AS wgrid
              FROM trpotentials_activities AS trpa
              JOIN trpotentials AS trp ON trp.id = trpa.trpotential_id AND trp.deleted = 0
              JOIN kmaterialgroups AS km ON km.id = trp.kmaterialgroup_id AND km.deleted = 0
             WHERE bean_id = '" . $currentCall->id . "' AND bean_module = '" . $currentCall->module_dir . "'";

            $resultSet = $GLOBALS['db']->query($sql);
            while ($row = $GLOBALS['db']->fetchByAssoc($resultSet)) {

                // read the contacts of the potentialsheetitem
                $sql = "SELECT c.salutation, c.first_name, c.last_name
                  FROM kpartners AS kp
                  JOIN contacts AS c ON c.id = kp.partner_id AND c.deleted = 0
                 WHERE kp.owner_id = '" . $row['id'] . "' AND kp.ref_type = 'TRPotential' AND kp.partner_role = 'AP' AND kp.deleted = 0";

                //END

                $resultSetContacts = $GLOBALS['db']->query($sql);
                $contactList = array();
                while ($contactRow = $GLOBALS['db']->fetchByAssoc($resultSetContacts)) {
                    $contactList[] = trim(sprintf($nameFormat, $app_list_strings['sap_salutations'][$contactRow['salutation']], $contactRow['first_name'], $contactRow['last_name']));
                }

                $currency_format_params = array(
                    'currency_symbol' => false,
                    'currency_id' => $row['currency_id']
                );
                $potentials .= sprintf($potentialCols, $row['wgrid'], $row['wgrname'], currency_format_number($row['self_potential_value'], $currency_format_params), currency_format_number($row['competitor_potential'], $currency_format_params), implode(', ', $contactList)) . "\n";
            }
            $potentials = rtrim($potentials);

            $intentions = unencodeMultienum($currentCall->k_intention);
            if (!is_array($intentions)) {
                $intentions = array();
            }
            $intentionDecorated = "";
            foreach ($intentions as $intention) {
                if (strlen($app_list_strings['k_intention_dom'][$intention]) > 0) {
                    $intentionDecorated .= "- " . $app_list_strings['k_intention_dom'][$intention] . "\n";
                }
            }
            $intentionDecorated = trim($intentionDecorated);

            $divider = "\n" . str_repeat("=", 70) . " \n";
            $currentCall->description = strtoupper(rtrim($mod_strings_accounts['LBL_ACCOUNT'], ':')) . ':' . $divider . $company . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_INTENTION'], ':')) . ':' . $divider . $intentionDecorated . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_TARGET'], ':')) . ':' . $divider . $currentCall->k_target . "\n\n" .
                    strtoupper(rtrim($mod_strings['LBL_K_RESULT'], ':')) . ':' . $divider . $currentCall->k_result . "\n\n" .
                    strtoupper(rtrim($mod_strings_contact['LBL_DEFAULT_SUBPANEL_TITLE'], ':')) . ':' . $divider . $contacts . "\n\n" .
                    strtoupper(rtrim($mod_strings_potentials['LBL_DEFAULT_SUBPANEL_TITLE'], ':')) . ':' . $divider . $potentials . "\n\n";
        };
        return $prepareCallForExchangeSync;
    }
    
    protected function getCallMeetingCorrectDateEndCallback() {
        
        global $timedate;
        
        $correctDateEnd = function(&$callOrMeeting) use($timedate) {
            $dateEnd = $timedate->fromUser($callOrMeeting->date_start);
            $dateEnd->modify('+' . $callOrMeeting->duration_hours . ' hour +' . $callOrMeeting->duration_minutes . ' minute');
            $callOrMeeting->date_end = $timedate->to_display_date_time($dateEnd->asDb());
        };
        return $correctDateEnd;
    }

}
