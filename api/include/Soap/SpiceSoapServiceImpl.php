<?php

namespace SpiceCRM\includes\Soap;
/***** SPICE-SUGAR-HEADER-SPACEHOLDER *****/

use SpiceCRM\data\api\handlers\SpiceBeanHandler;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\LogicHook\LogicHook;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\utils\SpiceUtils;
use SpiceCRM\includes\utils\SpiceFileUtils;

class SpiceSoapServiceImpl
{

    public static $helperObject = null;

    /**
     * Set a single relationship between two beans.  The items are related by module name and id.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- name of the module that the primary record is from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param String $module_id - The ID of the bean in the specified module_name
     * @param String link_field_name -- name of the link field which relates to the other module for which the relationship needs to be generated.
     * @param array related_ids -- array of related record ids for which relationships needs to be generated
     * @param array $name_value_list -- The keys of the array are the SugarBean attributes, the values of the array are the values the attributes should have.
     * @param integer $delete -- Optional, if the value 0 or nothing is passed then it will add the relationship for related_ids and if 1 is passed, it will delete this relationship for related_ids
     * @return Array - created - integer - How many relationships has been created
     *               - failed - integer - How many relationsip creation failed
     *                 - deleted - integer - How many relationships were deleted
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function set_relationship($session, $module_name, $module_id, $link_field_name, $related_ids, $name_value_list, $delete)
    {
        $error = new SoapError();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', '', '', '', $error)) {
            return;
        } // if

        $count = 0;
        $deletedCount = 0;
        $failed = 0;
        $deleted = 0;
	$name_value_array = [];
        if (is_array($name_value_list)) {
            $name_value_array = $name_value_list;
        }

        if (isset($delete)) {
            $deleted = $delete;
        }
        if (self::$helperObject->new_handle_set_relationship($module_name, $module_id, $link_field_name, $related_ids, $name_value_array, $deleted)) {
            if ($deleted) {
                $deletedCount++;
            } else {
                $count++;
            }
        } else {
            $failed++;
        } // else
	return ['created'=>$count , 'failed'=>$failed, 'deleted' => $deletedCount];
    }

    /**
     * Set a single relationship between two beans.  The items are related by module name and id.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param array $module_names -- Array of the name of the module that the primary record is from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param array $module_ids - The array of ID of the bean in the specified module_name
     * @param array $link_field_names -- Array of the name of the link field which relates to the other module for which the relationships needs to be generated.
     * @param array $related_ids -- array of an array of related record ids for which relationships needs to be generated
     * @param array $name_value_lists -- Array of Array. The keys of the inner array are the SugarBean attributes, the values of the inner array are the values the attributes should have.
     * @param array int $delete_array -- Optional, array of 0 or 1. If the value 0 or nothing is passed then it will add the relationship for related_ids and if 1 is passed, it will delete this relationship for related_ids
     * @return Array - created - integer - How many relationships has been created
     *               - failed - integer - How many relationsip creation failed
     *                 - deleted - integer - How many relationships were deleted
     *
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function set_relationships($session, $module_names, $module_ids, $link_field_names, $related_ids, $name_value_lists, $delete_array)
    {
        $error = new SoapError();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', '', '', '', $error)) {
            return;
        } // if

        if ((empty($module_names) || empty($module_ids) || empty($link_field_names) || empty($related_ids)) ||
            (sizeof($module_names) != (sizeof($module_ids) || sizeof($link_field_names) || sizeof($related_ids)))) {
            $error->set_error('invalid_data_format');
            self::$helperObject->setFaultObject($error);
            return;
        } // if

        $count = 0;
        $deletedCount = 0;
        $failed = 0;
        $counter = 0;
        $deleted = 0;
        foreach ($module_names as $module_name) {
		$name_value_list = [];
            if (is_array($name_value_lists) && isset($name_value_lists[$counter])) {
                $name_value_list = $name_value_lists[$counter];
            }
            if (is_array($delete_array) && isset($delete_array[$counter])) {
                $deleted = $delete_array[$counter];
            }
            if (self::$helperObject->new_handle_set_relationship($module_name, $module_ids[$counter], $link_field_names[$counter], $related_ids[$counter], $name_value_list, $deleted)) {
                if ($deleted) {
                    $deletedCount++;
                } else {
                    $count++;
                }
            } else {
                $failed++;
            } // else
            $counter++;
        } // foreach
	return ['created'=>$count , 'failed'=>$failed, 'deleted' => $deletedCount];
    } // fn


    /**
     * Update or create a list of SugarBeans
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param Array $name_value_lists -- Array of Bean specific Arrays where the keys of the array are the SugarBean attributes, the values of the array are the values the attributes should have.
     * @return Array    'ids' -- Array of the IDs of the beans that was written to (-1 on error)
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function set_entries($session, $module_name, $name_value_lists)
    {

        $error = new SoapError();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'write', 'no_access', $error)) {
            return;
        } // if

        return self::$helperObject->new_handle_set_entries($module_name, $name_value_lists, FALSE);
    }

    /**
     * Log out of the session.  This will destroy the session and prevent other's from using it.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @return Empty
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function logout($session)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $error = new SoapError();
        $logicHook = LogicHook::getInstance();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', '', '', '', $error)) {
            if($current_user) $logicHook->call_custom_logic('Users', $current_user,'after_logout');
            return;
        } // if

        if($current_user) $current_user->call_custom_logic('before_logout');
        session_destroy();
        if($current_user)  $logicHook->call_custom_logic('Users', $current_user, 'after_logout');
    } // fn


    /**
     * Retrieve vardef information on the fields of the specified bean.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param Array $fields -- Optional, if passed then retrieve vardef information on these fields only.
     * @return Array    'module_fields' -- Array - The vardef information on the selected fields.
     *                  'link_fields' -- Array - The vardef information on the link fields
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_module_fields($session, $module_name, $fields = [])
    {
        $error = new SoapError();
	    $module_fields = [];

        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'read', 'no_access', $error)) {
            return;
        } // if


        $seed = BeanFactory::getBean($module_name);
        if ($seed->ACLAccess('ListView', true) || $seed->ACLAccess('DetailView', true) || $seed->ACLAccess('EditView', true)) {
            $return = self::$helperObject->get_return_module_fields($seed, $module_name, $fields);
            return $return;
        }
        $error->set_error('no_access');
        self::$helperObject->setFaultObject($error);
        LoggerManager::getLogger()->error('End: SpiceSoapServiceImpl->get_module_fields FAILED NO ACCESS to ListView, DetailView or EditView for ' . $module_name);
    }

    /**
     *   Retrieve number of records in a given module
     *
     * @param String session      -- Session ID returned by a previous call to login.
     * @param String module_name  -- module to retrieve number of records from
     * @param String query        -- allows webservice user to provide a WHERE clause
     * @param int deleted         -- specify whether or not to include deleted records
     *
     * @return Array  result_count - integer - Total number of records for a given module and query
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_entries_count($session, $module_name, $query, $deleted)
    {

        $error = new SoapError();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'list', 'no_access', $error)) {
            return;
        } // if

        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $seed = BeanFactory::getBean($module_name);

        if (!self::$helperObject->checkQuery($error, $query)) {
            return;
        } // if

        if (!self::$helperObject->checkACLAccess($seed, 'ListView', $error, 'no_access')) {
            return;
        }

        $sql = 'SELECT COUNT(*) result_count FROM ' . $seed->_tablename . ' ';


        // build WHERE clauses, if any
	    $where_clauses = [];
        if (!empty($query)) {
            $where_clauses[] = $query;
        }
        if ($deleted == 0) {
            $where_clauses[] = $seed->_tablename . '.deleted = 0';
        }

        // if WHERE clauses exist, add them to query
        if (!empty($where_clauses)) {
            $sql .= ' WHERE ' . implode(' AND ', $where_clauses);
        }

        $res = DBManagerFactory::getInstance()->query($sql);
        $row = DBManagerFactory::getInstance()->fetchByAssoc($res);

        return [
                'result_count' => $row['result_count'],
        ];
    }

    /**
     * Retrieve a single SugarBean based on ID.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param String $id -- The SugarBean's ID value.
     * @param Array $select_fields -- A list of the fields to be included in the results. This optional parameter allows for only needed fields to be retrieved.
     * @param Array $link_name_to_fields_array -- A list of link_names and for each link_name, what fields value to be returned. For ex.'link_name_to_fields_array' => array(array('name' =>  'email_addresses', 'value' => array('id', 'email_address', 'opt_out', 'primary_address')))
     * @param bool $trackView -- Should we track the record accessed.
     * @return Array
     *        'entry_list' -- Array - The records name value pair for the simple data types excluding link field data.
     *         'relationship_list' -- Array - The records link field data. The example is if asked about accounts email address then return data would look like Array ( [0] => Array ( [name] => email_addresses [records] => Array ( [0] => Array ( [0] => Array ( [name] => id [value] => 3fb16797-8d90-0a94-ac12-490b63a6be67 ) [1] => Array ( [name] => email_address [value] => hr.kid.qa@example.com ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 1 ) ) [1] => Array ( [0] => Array ( [name] => id [value] => 403f8da1-214b-6a88-9cef-490b63d43566 ) [1] => Array ( [name] => email_address [value] => kid.hr@example.name ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 0 ) ) ) ) )
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_entry($session, $module_name, $id, $select_fields = [], $link_name_to_fields_array  = [],$track_view = FALSE)
    {
        return self::get_entries($session, $module_name, [$id], $select_fields, $link_name_to_fields_array, $track_view);
    }


    /**
     * Retrieve a list of SugarBean's based on provided IDs. This API will not wotk with report module
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param Array $ids -- An array of SugarBean IDs.
     * @param Array $select_fields -- A list of the fields to be included in the results. This optional parameter allows for only needed fields to be retrieved.
     * @param Array $link_name_to_fields_array -- A list of link_names and for each link_name, what fields value to be returned. For ex.'link_name_to_fields_array' => array(array('name' =>  'email_addresses', 'value' => array('id', 'email_address', 'opt_out', 'primary_address')))
     * @param bool $trackView -- Should we track the record accessed.
     * @return Array
     *        'entry_list' -- Array - The records name value pair for the simple data types excluding link field data.
     *         'relationship_list' -- Array - The records link field data. The example is if asked about accounts email address then return data would look like Array ( [0] => Array ( [name] => email_addresses [records] => Array ( [0] => Array ( [0] => Array ( [name] => id [value] => 3fb16797-8d90-0a94-ac12-490b63a6be67 ) [1] => Array ( [name] => email_address [value] => hr.kid.qa@example.com ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 1 ) ) [1] => Array ( [0] => Array ( [name] => id [value] => 403f8da1-214b-6a88-9cef-490b63d43566 ) [1] => Array ( [name] => email_address [value] => kid.hr@example.name ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 0 ) ) ) ) )
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_entries($session, $module_name, $ids, $select_fields, $link_name_to_fields_array, $track_view = FALSE)
    {
        $error = new SoapError();

        $linkoutput_list = [];
        $output_list = [];
        $using_cp = false;
        if ($module_name == 'CampaignProspects') {
            $module_name = 'Prospects';
            $using_cp = true;
        }
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'read', 'no_access', $error)) {
            return;
        } // if


        $temp = BeanFactory::getBean($module_name);
        foreach ($ids as $id) {
            $seed = @clone($temp);
            if ($using_cp)
                $seed = $seed->retrieveTarget($id);
            else {
                if ($seed->retrieve($id) == null)
                    $seed->deleted = 1;
            }

            if ($seed->deleted == 1)
            {
                $list = [];
                $list[] = ['name'=>'warning', 'value'=>'Access to this object is denied since it has been deleted or does not exist'];
                $list[] = ['name'=>'deleted', 'value'=>'1'];
                $output_list[] = ['id'=>$id,'module_name'=> $module_name,'name_value_list'=>$list,];
                continue;
            }
            if (!self::$helperObject->checkACLAccess($seed, 'DetailView', $error, 'no_access')) {
                return;
            }
            $output_list[] = self::$helperObject->get_return_value_for_fields($seed, $module_name, $select_fields);
            if (!empty($link_name_to_fields_array)) {
                $linkoutput_list[] = self::$helperObject->get_return_value_for_link_fields($seed, $module_name, $link_name_to_fields_array);
            }

        }

        return ['entry_list'=>$output_list, 'relationship_list' => $linkoutput_list];
    }

    /**
     * Update or create a single SugarBean.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param Array $name_value_list -- The keys of the array are the SugarBean attributes, the values of the array are the values the attributes should have.
     * @param Bool $track_view -- Should the tracker be notified that the action was performed on the bean.
     * @return Array    'id' -- the ID of the bean that was written to (-1 on error)
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function set_entry($session, $module_name, $name_value_list, $track_view = FALSE)
    {
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $error = new SoapError();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'edit', 'no_access', $error)) {
            $error->set_error('no_access');
            self::$helperObject->setFaultObject($error);
            return;
        } // if

        $seed = BeanFactory::getBean($module_name);
        foreach ($name_value_list as $name => $value) {
            if (is_array($value) && $value['name'] == 'id') {
                $seed->retrieve($value['value']);
                break;
            } else if ($name === 'id') {

                $seed->retrieve($value);
            }
        }

        $return_fields = [];
        foreach ($name_value_list as $name => $value) {
            if ($module_name == 'Users' && !empty($seed->id) && ($seed->id != $current_user->id) && $name == 'user_hash') {
                continue;
            }
            if (!empty($seed->field_defs[$name]['sensitive'])) {
                continue;
            }

            if (!is_array($value)) {
                $seed->$name = $value;
                $return_fields[] = $name;
            } else {
                //begin PHP7 COMPAT
                //$seed->$value['name']= $value['value'];
                $seed->{$value['name']} = $value['value'];
                //end
                $return_fields[] = $value['name'];
            }
        }
        if (!self::$helperObject->checkACLAccess($seed, 'edit', $error, 'no_access') || ($seed->deleted == 1 && !self::$helperObject->checkACLAccess($seed, 'delete', $error, 'no_access'))) {
            $error->set_error('no_access');
            self::$helperObject->setFaultObject($error);
            return;
        } // if

        $seed->save(self::$helperObject->checkSaveOnNotify());

        $return_entry_list = self::$helperObject->get_name_value_list_for_fields($seed, $return_fields);

        if ($seed->deleted == 1) {
            $seed->mark_deleted($seed->id);
        }

        return ['id'=>$seed->id, 'entry_list' => $return_entry_list];
    } // fn


    /**
     * Log the user into the application
     *
     * @param UserAuth array $user_auth -- Set user_name and password (password needs to be
     *      in the right encoding for the type of authentication the user is setup for.  For Base
     *      sugar validation, password is the plain text password.
     * @param String $application -- The name of the application you are logging in from.  (Currently unused).
     * @param array $name_value_list -- Array of name value pair of extra parameters. As of today only 'language' and 'notifyonsave' is supported
     * @return Array - id - String id is the session_id of the session that was created.
     *                 - module_name - String - module name of user
     *                 - name_value_list - Array - The name value pair of user_id, user_name, user_language, user_currency_id, user_currency_name,
     *                                         - user_default_team_id, user_is_admin, user_default_dateformat, user_default_timeformat
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function login($user_auth, $application = '', $name_value_list = [])
    {

        $error = new SoapError();

        try {

            $authParams = (object) ['authData' => (object) ['username' => $user_auth['user_name'], 'password' => $user_auth['password']], 'authType' => 'credentials'];

            AuthenticationController::getInstance()->authenticate($authParams);
        } catch (\SpiceCRM\includes\ErrorHandlers\UnauthorizedException $e) {
            $error->set_error($e->getMessage());
            LoggerManager::getLogger()->fatal('soap','Lockout reached for user ' . $user_auth['user_name']);
            // LogicHook::getInstance()->call_custom_logic('Users', 'login_failed');
            self::$helperObject->setFaultObject($error);
            return;
        }

        session_start();
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        //$current_user = $user;
        self::$helperObject->login_success($name_value_list);
        $current_user->loadPreferences();
        $_SESSION['is_valid_session'] = true;
        $_SESSION['ip_address'] = SpiceUtils::getClientIP();
        $_SESSION['user_id'] = $current_user->id;
        $_SESSION['type'] = 'user';
        // $_SESSION['avail_modules'] = self::$helperObject->get_user_module_list($current_user);
        $_SESSION['authenticated_user_id'] = $current_user->id;
        $_SESSION['unique_key'] = SpiceConfig::getInstance()->config['unique_key'];
        $current_user->call_custom_logic('after_login');
        $nameValueArray = [];
        global $current_language;
        $nameValueArray['user_id'] = self::$helperObject->get_name_value('user_id', $current_user->id);
        $nameValueArray['user_name'] = self::$helperObject->get_name_value('user_name', $current_user->user_name);
        $nameValueArray['user_language'] = self::$helperObject->get_name_value('user_language', $current_language);
        $cur_id = $current_user->getPreference('currency');
        $nameValueArray['user_currency_id'] = self::$helperObject->get_name_value('user_currency_id', $cur_id);
        $nameValueArray['user_is_admin'] = self::$helperObject->get_name_value('user_is_admin', SpiceUtils::isAdmin($current_user));
        $nameValueArray['user_default_team_id'] = self::$helperObject->get_name_value('user_default_team_id', $current_user->default_team);
        $nameValueArray['user_default_dateformat'] = self::$helperObject->get_name_value('user_default_dateformat', $current_user->getPreference('datef'));
        $nameValueArray['user_default_timeformat'] = self::$helperObject->get_name_value('user_default_timeformat', $current_user->getPreference('timef'));

        $num_grp_sep = $current_user->getPreference('num_grp_sep');
        $dec_sep = $current_user->getPreference('dec_sep');
        $nameValueArray['user_number_seperator'] = self::$helperObject->get_name_value('user_number_seperator', empty($num_grp_sep) ? SpiceConfig::getInstance()->config['default_number_grouping_seperator'] : $num_grp_sep);
        $nameValueArray['user_decimal_seperator'] = self::$helperObject->get_name_value('user_decimal_seperator', empty($dec_sep) ? SpiceConfig::getInstance()->config['default_decimal_seperator'] : $dec_sep);

        $nameValueArray['mobile_max_list_entries'] = self::$helperObject->get_name_value('mobile_max_list_entries', SpiceConfig::getInstance()->config['wl_list_max_entries_per_page']);
        $nameValueArray['mobile_max_subpanel_entries'] = self::$helperObject->get_name_value('mobile_max_subpanel_entries', SpiceConfig::getInstance()->config['wl_list_max_entries_per_subpanel']);


        $currencyObject = BeanFactory::getBean('Currencies');
        $currencyObject->retrieve($cur_id);
        $nameValueArray['user_currency_name'] = self::$helperObject->get_name_value('user_currency_name', $currencyObject->name);
        $_SESSION['user_language'] = $current_language;
        return ['id' => session_id(), 'module_name' => 'Users', 'name_value_list' => $nameValueArray];
    }



    /**
     * Retrieve a list of beans.  This is the primary method for getting list of SugarBeans from Sugar using the SOAP API.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module to return records from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param String $query -- SQL where clause without the word 'where'
     * @param String $order_by -- SQL order by clause without the phrase 'order by'
     * @param integer $offset -- The record offset to start from.
     * @param Array $select_fields -- A list of the fields to be included in the results. This optional parameter allows for only needed fields to be retrieved.
     * @param Array $link_name_to_fields_array -- A list of link_names and for each link_name, what fields value to be returned. For ex.'link_name_to_fields_array' => array(array('name' =>  'email_addresses', 'value' => array('id', 'email_address', 'opt_out', 'primary_address')))
     * @param integer $max_results -- The maximum number of records to return.  The default is the sugar configuration value for 'list_max_entries_per_page'
     * @param integer $deleted -- false if deleted records should not be include, true if deleted records should be included.
     * @return Array 'result_count' -- integer - The number of records returned
     *               'next_offset' -- integer - The start of the next page (This will always be the previous offset plus the number of rows returned.  It does not indicate if there is additional data unless you calculate that the next_offset happens to be closer than it should be.
     *               'entry_list' -- Array - The records that were retrieved
     *                 'relationship_list' -- Array - The records link field data. The example is if asked about accounts email address then return data would look like Array ( [0] => Array ( [name] => email_addresses [records] => Array ( [0] => Array ( [0] => Array ( [name] => id [value] => 3fb16797-8d90-0a94-ac12-490b63a6be67 ) [1] => Array ( [name] => email_address [value] => hr.kid.qa@example.com ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 1 ) ) [1] => Array ( [0] => Array ( [name] => id [value] => 403f8da1-214b-6a88-9cef-490b63d43566 ) [1] => Array ( [name] => email_address [value] => kid.hr@example.name ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 0 ) ) ) ) )
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_entry_list($session, $module_name, $query = '', $order_by = '', $offset = 0, $select_fields = [], $link_name_to_fields_array = [], $max_results = 0, $deleted = 0)
    {

        $error = new SoapError();
//        $using_cp = false;
//        if ($module_name == 'CampaignProspects') {
//            $module_name = 'Prospects';
//            $using_cp = true;
//        }
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'read', 'no_access', $error)) {
            LoggerManager::getLogger()->error('End: SpiceSoapServiceImpl->get_entry_list - FAILED on checkSessionAndModuleAccess');
            return;
        } // if

        if (!self::$helperObject->checkQuery($error, $query, $order_by)) {
            return;
        } // if

        $seed = BeanFactory::getBean($module_name);
        if (!self::$helperObject->checkACLAccess($seed, 'list', $error, 'no_access')) {
            LoggerManager::getLogger()->error('End: SpiceSoapServiceImpl->get_entry_list - FAILED on checkACLAccess');
            return;
        } // if

        if ($query == '') {
            $where = '';
        } // if
        if ($offset == '' || $offset == -1) {
            $offset = 0;
        } // if
        if ($deleted) {
            $deleted = -1;
        }
//        if ($using_cp) {
//            $response = $seed->retrieveTargetList($query, $select_fields, $offset, -1, -1, $deleted);
//        } else {
            $response = self::$helperObject->get_data_list($seed, $order_by, $query, $offset, -1, -1, $deleted, false);
//        } // else
        $list = $response['list'];

        $output_list = [];
        $linkoutput_list = [];

        foreach ($list as $value) {
            /* removed email legacy retrieve
            if (isset($value->emailAddress)) {
                $value->emailAddress->handleLegacyRetrieve($value);
            } // if
            */
            $value->fill_in_additional_detail_fields();

            $output_list[] = self::$helperObject->get_return_value_for_fields($value, $module_name, $select_fields);
            if (!empty($link_name_to_fields_array)) {
                $linkoutput_list[] = self::$helperObject->get_return_value_for_link_fields($value, $module_name, $link_name_to_fields_array);
            }
        } // foreach

        // Calculate the offset for the start of the next page
        $next_offset = $offset + sizeof($output_list);

        $returnRelationshipList = [];
        foreach ($linkoutput_list as $rel) {
            $link_output = [];
            foreach ($rel as $row) {
                $rowArray = [];
                foreach ($row['records'] as $record) {
                    $rowArray[]['link_value'] = $record;
                }
                $link_output[] = ['name' => $row['name'], 'records' => $rowArray];
            }
            $returnRelationshipList[]['link_list'] = $link_output;
        }

        $totalRecordCount = $response['row_count'];
        if (!empty(SpiceConfig::getInstance()->config['disable_count_query']))
            $totalRecordCount = -1;

        return ['result_count'=>sizeof($output_list), 'total_count' => $totalRecordCount, 'next_offset'=>$next_offset, 'entry_list'=>$output_list, 'relationship_list' => $returnRelationshipList];
    } // fn

    /**
     * Given a list of modules to search and a search string, return the id, module_name, along with the fields
     * We will support Accounts, Bugs, Cases, Contacts, Leads, Opportunities, Project, Quotes
     *
     * @param string $session - Session ID returned by a previous call to login.
     * @param string $search_string - string to search
     * @param string[] $modules - array of modules to query
     * @param int $offset - a specified offset in the query
     * @param int $max_results - max number of records to return
     * @param string $assigned_user_id - a user id to filter all records by, leave empty to exclude the filter
     * @param string[] $select_fields - An array of fields to return.  If empty the default return fields will be from the active list view defs.
     * @param bool $unified_search_only - A boolean indicating if we should only search against those modules participating in the unified search.
     * @param bool $favorites - A boolean indicating if we should only search against records marked as favorites.
     * @return Array return_search_result    - Array('Accounts' => array(array('name' => 'first_name', 'value' => 'John', 'name' => 'last_name', 'value' => 'Do')))
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function search_by_module($session, $search_string, $modules, $offset, $max_results, $assigned_user_id = '', $select_fields = [], $unified_search_only = TRUE, $favorites = FALSE)
    {

        $error = new SoapError();
        $output_list = [];
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', '', '', '', $error)) {
            $error->set_error('invalid_login');
            LoggerManager::getLogger()->error('End: SpiceSoapServiceImpl->search_by_module - FAILED on checkSessionAndModuleAccess');
            return;
        }

        // handle where clause
        $addwhere = '';
        if($assigned_user_id) {
            $addwhere = " AND assigned_user_id='$assigned_user_id' ";
        }

        $records = [];
        foreach($modules as $module){
            $handler = new SpiceBeanHandler();
            $data = $handler->get_bean_list($module, ['start' => $offset, 'limit' => $max_results, 'searchterm' => $search_string], $addwhere);
            $records = array_merge($records, $data['list']);
            $output_list[] = ['name' => $module, 'records' => $records];
        }

        return ['entry_list' => $output_list];
    }

    /**
     * Retrieve a collection of beans that are related to the specified bean and optionally return relationship data for those related beans.
     * So in this API you can get contacts info for an account and also return all those contact's email address or an opportunity info also.
     *
     * @param String $session -- Session ID returned by a previous call to login.
     * @param String $module_name -- The name of the module that the primary record is from.  This name should be the name the module was developed under (changing a tab name is studio does not affect the name that should be passed into this method)..
     * @param String $module_id -- The ID of the bean in the specified module
     * @param String $link_field_name -- The name of the lnk field to return records from.  This name should be the name the relationship.
     * @param String $related_module_query -- A portion of the where clause of the SQL statement to find the related items.  The SQL query will already be filtered to only include the beans that are related to the specified bean.
     * @param Array $related_fields - Array of related bean fields to be returned.
     * @param Array $related_module_link_name_to_fields_array - For every related bean returrned, specify link fields name to fields info for that bean to be returned. For ex.'link_name_to_fields_array' => array(array('name' =>  'email_addresses', 'value' => array('id', 'email_address', 'opt_out', 'primary_address'))).
     * @param Number $deleted -- false if deleted records should not be include, true if deleted records should be included.
     * @param String $order_by -- field to order the result sets by
     * @param Number $offset -- where to start in the return
     * @param Number $limit -- number of results to return (defaults to all)
     * @return Array 'entry_list' -- Array - The records that were retrieved
     *               'relationship_list' -- Array - The records link field data. The example is if asked about accounts contacts email address then return data would look like Array ( [0] => Array ( [name] => email_addresses [records] => Array ( [0] => Array ( [0] => Array ( [name] => id [value] => 3fb16797-8d90-0a94-ac12-490b63a6be67 ) [1] => Array ( [name] => email_address [value] => hr.kid.qa@example.com ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 1 ) ) [1] => Array ( [0] => Array ( [name] => id [value] => 403f8da1-214b-6a88-9cef-490b63d43566 ) [1] => Array ( [name] => email_address [value] => kid.hr@example.name ) [2] => Array ( [name] => opt_out [value] => 0 ) [3] => Array ( [name] => primary_address [value] => 0 ) ) ) ) )
     * @exception 'SoapFault' -- The SOAP error, if any
     */
    static function get_relationships($session, $module_name, $module_id, $link_field_name, $related_module_query, $related_fields, $related_module_link_name_to_fields_array, $deleted, $order_by = '', $offset = 0, $limit = false)
    {
        self::$helperObject = new SpiceSoapServiceUtil();
        $error = new SoapError();

        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'read', 'no_access', $error)) {
            return;
        } // if

        $mod = BeanFactory::getBean($module_name, $module_id);

        if (!self::$helperObject->checkQuery($error, $related_module_query, $order_by)) {
            return;
        } // if

        if (!self::$helperObject->checkACLAccess($mod, 'DetailView', $error, 'no_access')) {
            return;
        } // if

        $output_list = [];
        $linkoutput_list = [];

        // get all the related modules data.
        $result = self::$helperObject->getRelationshipResults($mod, $link_field_name, $related_fields, $related_module_query, $order_by, $offset, $limit);

        if ($result) {

            $list = $result['rows'];
            $filterFields = $result['fields_set_on_rows'];

            if (sizeof($list) > 0) {
                // get the related module name and instantiate a bean for that
                $submodulename = $mod->$link_field_name->getRelatedModuleName();
                $submoduletemp = BeanFactory::getBean($submodulename);

                foreach($list as $row) {
                    $submoduleobject = @clone($submoduletemp);
                    // set all the database data to this object
                    foreach ($filterFields as $field) {
                        $submoduleobject->$field = $row[$field];
                    } // foreach
                    if (isset($row['id'])) {
                        $submoduleobject->id = $row['id'];
                    }
                    $output_list[] = self::$helperObject->get_return_value_for_fields($submoduleobject, $submodulename, $filterFields);
                    if (!empty($related_module_link_name_to_fields_array)) {
                        $linkoutput_list[] = self::$helperObject->get_return_value_for_link_fields($submoduleobject, $submodulename, $related_module_link_name_to_fields_array);
                    } // if

                } // foreach
            }

        } // if

        return ['entry_list'=>$output_list, 'relationship_list' => $linkoutput_list];
    }


    /**
     * get_modified_relationships
     *
     * Get a list of the relationship records that have a date_modified value set within a specified date range.  This is used to
     * help facilitate sync operations.  The module_name should be "Users" and the related_module one of "Meetings", "Calls" and
     * "Contacts".
     *
     * @param xsd:string $session String of the session id
     * @param xsd:string $module_name String value of the primary module to retrieve relationship against
     * @param xsd:string $related_module String value of the related module to retrieve records off of
     * @param xsd:string $from_date String value in YYYY-MM-DD HH:MM:SS format of date_start range (required)
     * @param xsd:string $to_date String value in YYYY-MM-DD HH:MM:SS format of ending date_start range (required)
     * @param xsd:int $offset Integer value of the offset to begin returning records from
     * @param xsd:int $max_results Integer value of the max_results to return; -99 for unlimited
     * @param xsd:int $deleted Integer value indicating deleted column value search (defaults to 0).  Set to 1 to find deleted records
     * @param xsd:string $module_user_id String value of the user id (optional, but defaults to SOAP session user id anyway)  The module_user_id value
     * here ought to be the user id of the user initiating the SOAP session
     * @param tns:select_fields $select_fields Array value of fields to select and return as name/value pairs
     * @param xsd:string $relationship_name String value of the relationship name to search on
     * @param xsd:string $deletion_date String value in YYYY-MM-DD HH:MM:SS format for filtering on deleted records whose date_modified falls within range
     * this allows deleted records to be returned as well
     *
     * @return Array records that match search criteria
     */
    static function get_modified_relationships($session, $module_name, $related_module, $from_date, $to_date, $offset, $max_results, $deleted=0, $module_user_id = '', $select_fields = [], $relationship_name = '', $deletion_date = ''){
//        global $beanList, $beanFiles;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $error = new SoapError();
        $output_list = [];

        if(empty($from_date))
        {
            $error->set_error('invalid_call_error, missing from_date');
            return ['result_count'=>0, 'next_offset'=>0, 'field_list'=>$select_fields, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
        }

        if(empty($to_date))
        {
            $error->set_error('invalid_call_error, missing to_date');
            return ['result_count'=>0, 'next_offset'=>0, 'field_list'=>$select_fields, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
        }

        self::$helperObject = new SpiceSoapServiceUtil();
        if (!self::$helperObject->checkSessionAndModuleAccess($session, 'invalid_session', $module_name, 'read', 'no_access', $error))
        {
            return;
        } // if

//        if(empty($beanList[$module_name]) || empty($beanList[$related_module]))
//        {
//            $error->set_error('no_module');
//            return ['result_count'=>0, 'next_offset'=>0, 'field_list'=>$select_fields, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
//        }

        if(!self::$helperObject->check_modules_access($current_user, $module_name, 'read') || !self::$helperObject->check_modules_access($current_user, $related_module, 'read')){
            $error->set_error('no_access');
            return ['result_count'=>0, 'next_offset'=>0, 'field_list'=>$select_fields, 'entry_list'=>[], 'error'=>$error->get_soap_array()];
        }

        if($max_results > 0 || $max_results == '-99'){

            SpiceConfig::getInstance()->config['list_max_entries_per_page'] = $max_results;
        }

        // Cast to integer
        $deleted = (int)$deleted;
        $query = "(m1.date_modified > " . DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($from_date)."'", 'datetime'). " AND m1.date_modified <= ". DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($to_date)."'", 'datetime')." AND {0}.deleted = $deleted)";
        if(isset($deletion_date) && !empty($deletion_date)){
            $query .= " OR ({0}.date_modified > " . DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($deletion_date)."'", 'datetime'). " AND {0}.date_modified <= ". DBManagerFactory::getInstance()->convert("'". DBManagerFactory::getInstance()->quote($to_date)."'", 'datetime')." AND {0}.deleted = 1)";
        }

        if(!empty($current_user->id))
        {
            $query .= " AND m2.id = '". DBManagerFactory::getInstance()->quote($current_user->id)."'";
        }

        //if($related_module == 'Meetings' || $related_module == 'Calls' || $related_module = 'Contacts'){
        $query = SpiceUtils::stringFormat($query, ['m1']);
        //}

        $results = self::retrieve_modified_relationships($module_name, $related_module, $query, $deleted, $offset, $max_results, $select_fields, $relationship_name);

        $list = $results['result'];

        foreach($list as $value)
        {
            $output_list[] = self::$helperObject->array_get_return_value($value, $results['table_name']);
        }

        $next_offset = $offset + count($output_list);

        return [
            'result_count'=> count($output_list),
            'next_offset' => $next_offset,
            'entry_list' => $output_list,
            'error' => $error->get_soap_array()
        ];
    }

    /**
     * rerlationship Helper functions
     *
     * @param $module_1
     * @param $module_2
     * @param $relationship_name
     * @return array|false
     */
    static function retrieve_relationships_properties($module_1, $module_2, $relationship_name = "")
    {

        $db = DBManagerFactory::getInstance();
        $query = "SELECT * FROM relationships WHERE ((lhs_module = '" . $db->quote($module_1) . "' AND rhs_module='" . $db->quote($module_2) . "') OR (lhs_module = '" . $db->quote($module_2) . "' AND rhs_module='" . $db->quote($module_1) . "'))";
        if (!empty($relationship_name) && isset($relationship_name)) {
            $query .= " AND relationship_name = '" . $db->quote($relationship_name) . "'";
        }

        return $db->fetchOne($query);
    }

    static function retrieve_modified_relationships($module_name, $related_module, $relationship_query, $show_deleted, $offset, $max_results, $select_fields = [], $relationship_name = '')
    {

        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $error = new SoapError();
        $result_list = [];
        /*
        if (empty($beanList[$module_name]) || empty($beanList[$related_module])) {

            $error->set_error('no_module');
            return ['result' => $result_list, 'error' => $error->get_soap_array()];
        }
        */

        $row = self::retrieve_relationships_properties($module_name, $related_module, $relationship_name);

        if (empty($row)) {

            $error->set_error('no_relationship_support');
            return ['result' => $result_list, 'error' => $error->get_soap_array()];
        }

        $table = $row['join_table'];
        $has_join = true;
        if (empty($table)) {
            //return array('table_name'=>$table, 'result'=>$result_list, 'error'=>$error->get_soap_array());
            $table = $row['rhs_table'];
            $module_1 = $row['lhs_module'];
            $mod_key = $row['lhs_key'];
            $module_2 = $row['rhs_module'];
            $mod2_key = $row['rhs_key'];
            $has_join = false;
        } else {
            $module_1 = $row['lhs_module'];
            $mod_key = $row['join_key_lhs'];
            $module_2 = $row['rhs_module'];
            $mod2_key = $row['join_key_rhs'];
        }


        $mod = BeanFactory::getBean($module_1);
        $mod2 = BeanFactory::getBean($module_2);
        $table_alias = 'rt';
        if ($has_join == false) {
            $table_alias = 'm1';
        }

        if (isset($select_fields) && !empty($select_fields)) {
            $index = 0;
            $field_select = '';

            foreach ($select_fields as $field) {
                if ($field == "id") {
                    $field_select .= "DISTINCT m1.id";
                } else {
                    $parts = explode(' ', $field);
                    $alias = '';
                    if (count($parts) > 1) {
                        // have aliases: something like "blah.blah blah"
                        $alias = array_pop($parts);
                        $field = array_pop($parts); // will check for . further down
                    }
                    if ($alias == "email1") {
                        // special case for primary emails
                        $field_select .= "(SELECT email_addresses.email_address FROM {$mod->_tablename}
                    	LEFT JOIN  email_addr_bean_rel ON {$mod->_tablename}.id = email_addr_bean_rel.bean_id
                    		AND email_addr_bean_rel.bean_module='{$mod->_module}'
                    		AND email_addr_bean_rel.deleted=0 AND email_addr_bean_rel.primary_address=1
                    	LEFT JOIN email_addresses ON email_addresses.id = email_addr_bean_rel.email_address_id Where {$mod->_tablename}.id = m1.ID) email1";
                    } elseif ($alias == "email2") {
                        // special case for non-primary emails
                        // FIXME: This is not a DB-safe code. Does not work on SQL Server & Oracle.
                        // Using dirty hack here.
                        $field_select .= "(SELECT email_addresses.email_address FROM {$mod->_tablename}
                    	LEFT JOIN  email_addr_bean_rel on {$mod->_tablename}.id = email_addr_bean_rel.bean_id
                    		AND email_addr_bean_rel.bean_module='{$mod->_module}' AND email_addr_bean_rel.deleted=0
                    		AND email_addr_bean_rel.primary_address!=1
                    	LEFT JOIN email_addresses ON email_addresses.id = email_addr_bean_rel.email_address_id Where {$mod->_tablename}.id = m1.ID limit 1) email2";
                    } else {
                        if (strpos($field, ".") == false) {
                            // no dot - field for m1
                            $fieldname = "m1." . $mod->db->getValidDBName($field);
                        } else {
                            // There is a dot in here somewhere.
                            list($table_part, $field_part) = explode('.', $field);
                            $fieldname = $mod->db->getValidDBName($table_part) . "." . $mod->db->getValidDBName($field_part);
                        }
                        $field_select .= $fieldname;
                        if (!empty($alias)) {
                            $field_select .= " " . $mod->db->getValidDBName($alias);
                        }
                    }
                }
                if ($index < (count($select_fields) - 1)) {
                    $field_select .= ",";
                    $index++;
                }
            }//end foreach
            $query = "SELECT $field_select FROM $table $table_alias ";
        } else {
            $query = "SELECT rt.* FROM  $table $table_alias ";
        }

        if ($has_join == false) {
            $query .= " inner join $mod->_tablename m2 on $table_alias.$mod2_key = m2.id AND m2.id = '$current_user->id'";
        } else {
            $query .= " inner join $mod->_tablename m1 on rt.$mod_key = m1.id ";
            $query .= " inner join $mod2->_tablename m2 on rt.$mod2_key = m2.id AND m2.id = '$current_user->id'";
        }

        if (!empty($relationship_query)) {
            $query .= ' WHERE ' . SpiceUtils::stringFormat($relationship_query, [$table_alias]);
        }

        if ($max_results != '-99') {
            $result = $mod->db->limitQuery($query, $offset, $max_results);
        } else {
            $result = $mod->db->query($query);
        }
        while ($row = $mod->db->fetchByAssoc($result)) {
            $result_list[] = $row;
        }

        $total_count = !empty($result_list) ? count($result_list) : 0;
        return ['table_name' => $table, 'result' => $result_list, 'total_count' => $total_count, 'error' => $error->get_soap_array()];
    }
}

SpiceSoapServiceImpl::$helperObject = new SpiceSoapServiceUtil();

