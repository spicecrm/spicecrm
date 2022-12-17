<?php

namespace SpiceCRM\includes\Soap;
/*********************************************************************************
 * SugarCRM Community Edition is a customer relationship management program developed by
 * SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY
 * OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * this program; if not, see http://www.gnu.org/licenses or write to the Free
 * Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
 * 02110-1301 USA.
 *
 * You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,
 * SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.
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
 ********************************************************************************/


use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SugarObjects\SpiceConfig;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\modules\SpiceACL\SpiceACL;

class SpiceSoapServiceUtil
{

    function setFaultObject($errorObject)
    {
        if ($this->isLogLevelDebug()) {
            LoggerManager::getLogger()->debug('SoapHelperWebServices->setFaultObject - ' . var_export($errorObject, true));
        }
        global $service_object;
        $service_object->error($errorObject);
    }

    /**
     * Use the same logic as in SugarAuthenticate to validate the ip address
     *
     * @param string $session_var
     * @return bool - true if the ip address is valid, false otherwise.
     */
    function is_valid_ip_address($session_var)
    {

        // grab client ip address
        $clientIP = query_client_ip();
        $classCheck = 0;
        // check to see if config entry is present, if not, verify client ip
        if (!isset (SpiceConfig::getInstance()->config['verify_client_ip']) || SpiceConfig::getInstance()->config['verify_client_ip'] == true) {
            // check to see if we've got a current ip address in $_SESSION
            // and check to see if the session has been hijacked by a foreign ip
            if (isset ($_SESSION[$session_var])) {
                $session_parts = explode(".", $_SESSION[$session_var]);
                $client_parts = explode(".", $clientIP);
                if (count($session_parts) < 4) {
                    $classCheck = 0;
                } else {
                    // match class C IP addresses
                    for ($i = 0; $i < 3; $i++) {
                        if ($session_parts[$i] == $client_parts[$i]) {
                            $classCheck = 1;
                            continue;
                        } else {
                            $classCheck = 0;
                            break;
                        }
                    }
                }
                // we have a different IP address
                if ($_SESSION[$session_var] != $clientIP && empty ($classCheck)) {
                    LoggerManager::getLogger()->fatal("IP Address mismatch: SESSION IP: {$_SESSION[$session_var]} CLIENT IP: {$clientIP}");
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    }

    function checkACLAccess($bean, $viewType, $errorObject, $error_key)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->checkACLAccess');
        if (!$bean->ACLAccess($viewType)) {
            LoggerManager::getLogger()->error('SoapHelperWebServices->checkACLAccess - no ACLAccess');
            $errorObject->set_error($error_key);
            $this->setFaultObject($errorObject);
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->checkACLAccess');
            return false;
        } // if
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->checkACLAccess');
        return true;
    } // fn


    function checkQuery($errorObject, $query, $order_by = '')
    {
        return true;

    }

    function get_user_module_list($user)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_user_module_list');
        SpiceACL::getInstance()->filterModuleList($modules, false);
        return $modules;

    }

    function get_name_value_list($value)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_name_value_list');
        global $app_list_strings;
        $list = [];
        if (!empty($value->field_defs)) {
            if (isset($value->assigned_user_name)) {
                $list['assigned_user_name'] = $this->get_name_value('assigned_user_name', $value->assigned_user_name);
            }
            if (isset($value->modified_by_name)) {
                $list['modified_by_name'] = $this->get_name_value('modified_by_name', $value->modified_by_name);
            }
            if (isset($value->created_by_name)) {
                $list['created_by_name'] = $this->get_name_value('created_by_name', $value->created_by_name);
            }
            foreach ($value->field_defs as $var) {
                if (isset($var['source']) && ($var['source'] != 'db' && $var['source'] != 'custom_fields') && $var['name'] != 'email1' && $var['name'] != 'email2' && (!isset($var['type']) || $var['type'] != 'relate')) continue;

                if (isset($value->{$var['name']})) { //PHP7 COMPAT //$var['name']
                    $val = $value->{$var['name']};
                    $type = $var['type'];

                    if (strcmp($type, 'date') == 0) {
                        $val = substr($val, 0, 10);
                    } elseif (strcmp($type, 'enum') == 0 && !empty($var['options'])) {
                        //$val = $app_list_strings[$var['options']][$val];
                    }

                    $list[$var['name']] = $this->get_name_value($var['name'], $val);
                }
            }
        }
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->get_name_value_list');
        return $list;

    }

    function get_name_value_list_for_fields($value, $fields)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_name_value_list_for_fields');
        global $app_list_strings;
        global $invalid_contact_fields;

        $list = [];
        if (!empty($value->field_defs)) {
            if (empty($fields)) $fields = array_keys($value->field_defs);
            if (isset($value->assigned_user_name) && in_array('assigned_user_name', $fields)) {
                $list['assigned_user_name'] = $this->get_name_value('assigned_user_name', $value->assigned_user_name);
            }
            if (isset($value->modified_by_name) && in_array('modified_by_name', $fields)) {
                $list['modified_by_name'] = $this->get_name_value('modified_by_name', $value->modified_by_name);
            }
            if (isset($value->created_by_name) && in_array('created_by_name', $fields)) {
                $list['created_by_name'] = $this->get_name_value('created_by_name', $value->created_by_name);
            }

            $filterFields = $this->filter_fields($value, $fields);


            foreach ($filterFields as $field) {
                $var = $value->field_defs[$field];
                if (isset($value->{$var['name']})) { //PHP7 COMPAT //$value->$var['name']
                    $val = $value->{$var['name']}; //PHP7 COMPAT //$value->$var['name']
                    $type = $var['type'];

                    if (strcmp($type, 'date') == 0) {
                        $val = substr($val, 0, 10);
                    } elseif (strcmp($type, 'enum') == 0 && !empty($var['options'])) {
                        //$val = $app_list_strings[$var['options']][$val];
                    }

                    $list[$var['name']] = $this->get_name_value($var['name'], $val);
                } // if
            } // foreach
        } // if
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->get_name_value_list_for_fields');
        if ($this->isLogLevelDebug()) {
            LoggerManager::getLogger()->debug('SoapHelperWebServices->get_name_value_list_for_fields - return data = ' . var_export($list, true));
        } // if
        return $list;

    } // fn


    function array_get_name_value_list($array)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->array_get_name_value_list');
        $list = [];
        foreach ($array as $name => $value) {
            $list[$name] = $this->get_name_value($name, $value);
        }
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->array_get_name_value_list');
        return $list;

    }


    function array_get_name_value_lists($array)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->array_get_name_value_lists');
        $list = [];
        foreach ($array as $name => $value) {
            $tmp_value = $value;
            if (is_array($value)) {
                $tmp_value = [];
                foreach ($value as $k => $v) {
                    $tmp_value[$k] = $this->get_name_value($k, $v);
                }
            }
            $list[$name] = $this->get_name_value($name, $tmp_value);
        }
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->array_get_name_value_lists');
        return $list;
    }


    function name_value_lists_get_array($list)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->name_value_lists_get_array');
        $array = [];
        foreach ($list as $key => $value) {
            if (isset($value['value']) && isset($value['name'])) {
                if (is_array($value['value'])) {
                    $array[$value['name']]=[];
                    foreach ($value['value'] as $v) {
                        $array[$value['name']][$v['name']] = $v['value'];
                    }
                } else {
                    $array[$value['name']] = $value['value'];
                }
            }
        }
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->name_value_lists_get_array');
        return $array;
    }


    function array_get_return_value($array, $module)
    {

        LoggerManager::getLogger()->info('Begin/End: SoapHelperWebServices->array_get_return_value');
        return ['id'=>$array['id'],
            'module_name' => $module,
            'name_value_list' => $this->array_get_name_value_list($array)
        ];
    }


    function get_return_value_for_fields($value, $module, $fields)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_return_value_for_fields');
        global $module_name;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $module_name = $module;
        if ($module == 'Users' && $value->id != $current_user->id) {
            $value->user_hash = '';
        }
        $value = clean_sensitive_data($value->field_defs, $value);
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->get_return_value_for_fields');
        return ['id'=>$value->id,
            'module_name' => $module,
            'name_value_list' => $this->get_name_value_list_for_fields($value, $fields)
        ];
    }


    function get_return_value_for_link_fields($bean, $module, $link_name_to_value_fields_array)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_return_value_for_link_fields');
        global $module_name;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $module_name = $module;
        if ($module == 'Users' && $bean->id != $current_user->id) {
            $bean->user_hash = '';
        }
        $bean = clean_sensitive_data($bean->field_defs, $bean);

        if (empty($link_name_to_value_fields_array) || !is_array($link_name_to_value_fields_array)) {
            LoggerManager::getLogger()->debug('End: SoapHelperWebServices->get_return_value_for_link_fields - Invalid link information passed ');
            return [];
        }

        if ($this->isLogLevelDebug()) {
            LoggerManager::getLogger()->debug('SoapHelperWebServices->get_return_value_for_link_fields - link info = ' . var_export($link_name_to_value_fields_array, true));
        } // if
        $link_output = [];
        foreach ($link_name_to_value_fields_array as $link_name_value_fields) {
            if (!is_array($link_name_value_fields) || !isset($link_name_value_fields['name']) || !isset($link_name_value_fields['value'])) {
                continue;
            }
            $link_field_name = $link_name_value_fields['name'];
            $link_module_fields = $link_name_value_fields['value'];
            if (is_array($link_module_fields) && !empty($link_module_fields)) {
                $result = $this->getRelationshipResults($bean, $link_field_name, $link_module_fields);
                if (!$result) {
                    $link_output[] = ['name' => $link_field_name, 'records' => []];
                    continue;
                }
                $list = $result['rows'];
                $filterFields = $result['fields_set_on_rows'];
                if ($list) {
                    $rowArray = [];
                    foreach ($list as $row) {
                        $nameValueArray = [];
                        foreach ($filterFields as $field) {
                            $nameValue = [];
                            if (isset($row[$field])) {
                                $nameValueArray[$field] = $this->get_name_value($field, $row[$field]);
                            } // if
                        } // foreach
                        $rowArray[] = $nameValueArray;
                    } // foreach
                    $link_output[] = ['name' => $link_field_name, 'records' => $rowArray];
                } // if
            } // if
        } // foreach
        LoggerManager::getLogger()->debug('End: SoapHelperWebServices->get_return_value_for_link_fields');
        if ($this->isLogLevelDebug()) {
            LoggerManager::getLogger()->debug('SoapHelperWebServices->get_return_value_for_link_fields - output = ' . var_export($link_output, true));
        } // if
        return $link_output;
    } // fn


    function new_handle_set_relationship($module_name, $module_id, $link_field_name, $related_ids, $name_value_list, $delete)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->new_handle_set_relationship');
        global $beanList, $beanFiles;

        if (empty($beanList[$module_name])) {
            LoggerManager::getLogger()->debug('SoapHelperWebServices->new_handle_set_relationship - module ' . $module_name . ' does not exists');
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_relationship');
            return false;
        } // if

        $mod = BeanFactory::getBean($module_name);
        $mod->retrieve($module_id);
        if (!$mod->ACLAccess('DetailView')) {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_relationship');
            return false;
        }

        if ($mod->load_relationship($link_field_name)) {
            if (!$delete) {
                $name_value_pair = [];
                if (!empty($name_value_list)) {
                    $relFields = $mod->$link_field_name->getRelatedFields();
                    if (!empty($relFields)) {
                        $relFieldsKeys = array_keys($relFields);
                        foreach ($name_value_list as $key => $value) {
                            if (in_array($value['name'], $relFieldsKeys)) {
                                $name_value_pair[$value['name']] = $value['value'];
                            } // if
                        } // foreach
                    } // if
                }
                $mod->$link_field_name->add($related_ids, $name_value_pair);
            } else {
                foreach ($related_ids as $id) {
                    $mod->$link_field_name->delete($module_id, $id);
                } // foreach
            } // else
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_relationship');
            return true;
        } else {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_relationship');
            return false;
        }
    }


    function get_return_value($value, $module)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_return_value');
        global $module_name;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $module_name = $module;
        if ($module == 'Users' && $value->id != $current_user->id) {
            $value->user_hash = '';
        }
        $value = clean_sensitive_data($value->field_defs, $value);
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_entries');
        return ['id'=>$value->id,
            'module_name' => $module,
            'name_value_list' => $this->get_name_value_list($value)
        ];
    }


    function login_success($name_value_list = [])
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->login_success');
        global $current_language, $app_strings, $app_list_strings;
        $current_language = SpiceConfig::getInstance()->config['default_language'];
        if (is_array($name_value_list) && !empty($name_value_list)) {
            foreach ($name_value_list as $key => $value) {
                if (isset($value['name']) && ($value['name'] == 'language')) {
                    $language = $value['value'];
                    $supportedLanguages = SpiceConfig::getInstance()->config['languages'];
                    if (array_key_exists($language, $supportedLanguages)) {
                        $current_language = $language;
                    } // if
                } // if
                if (isset($value['name']) && ($value['name'] == 'notifyonsave')) {
                    if ($value['value']) {
                        $_SESSION['notifyonsave'] = true;
                    }
                } // if
            } // foreach
        } else {
            if (isset($_SESSION['user_language'])) {
                $current_language = $_SESSION['user_language'];
            } // if
        }
        LoggerManager::getLogger()->info("Users language is = " . $current_language);
        $app_strings = return_application_language($current_language);
        $app_list_strings = return_app_list_strings_language($current_language);
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->login_success');
    } // fn


    function checkSaveOnNotify()
    {
        $notifyonsave = false;
        if (isset($_SESSION['notifyonsave']) && $_SESSION['notifyonsave'] == true) {
            $notifyonsave = true;
        } // if
        return $notifyonsave;
    }


    function add_create_account($seed)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->add_create_account');
        $current_user = AuthenticationController::getInstance()->getCurrentUser();
        $account_name = $seed->account_name;
        $account_id = $seed->account_id;
        $assigned_user_id = $current_user->id;

        // check if it already exists
        $focus = BeanFactory::getBean('Accounts');
        if ($focus->ACLAccess('Save')) {
            $class = get_class($seed);
            $temp = new $class();
            $temp->retrieve($seed->id);
            if (empty($account_name) && empty($account_id)) {
                return;
            } // if
            if (!isset($seed->accounts)) {
                $seed->load_relationship('accounts');
            } // if

            if ($seed->account_name == '' && isset($temp->account_id)) {
                $seed->accounts->delete($seed->id, $temp->account_id);
                LoggerManager::getLogger()->info('End: SoapHelperWebServices->add_create_account');
                return;
            }
            $arr = [];

            if (!empty($account_id))  // bug # 44280
            {
                $query = "select id, deleted from {$focus->table_name} WHERE id='" . $seed->db->quote($account_id) . "'";
            } else {
                $query = "select id, deleted from {$focus->table_name} WHERE name='" . $seed->db->quote($account_name) . "'";
            }
            $result = $seed->db->query($query, true);

            $row = $seed->db->fetchByAssoc($result);

            // we found a row with that id
            if (isset($row['id']) && $row['id'] != -1) {
                // if it exists but was deleted, just remove it entirely
                if (isset($row['deleted']) && $row['deleted'] == 1) {
                    $query2 = "delete from {$focus->table_name} WHERE id='" . $seed->db->quote($row['id']) . "'";
                    $result2 = $seed->db->query($query2, true);
                } // else just use this id to link the contact to the account
                else {
                    $focus->id = $row['id'];
                }
            }

            // if we didnt find the account, so create it
            if (!isset($focus->id) || $focus->id == '') {
                $focus->name = $account_name;

                if (isset($assigned_user_id)) {
                    $focus->assigned_user_id = $assigned_user_id;
                    $focus->modified_user_id = $assigned_user_id;
                }
                $focus->save();
            }

            if ($seed->accounts != null && $temp->account_id != null && $temp->account_id != $focus->id) {
                $seed->accounts->delete($seed->id, $temp->account_id);
            }

            if (isset($focus->id) && $focus->id != '') {
                $seed->account_id = $focus->id;
            } // if
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->add_create_account');

        } else {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->add_create_account - Insufficient ACLAccess');
        } // else
    } // fn


    function check_for_duplicate_contacts($seed)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->check_for_duplicate_contacts');

        if (isset($seed->id)) {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->check_for_duplicate_contacts - no duplicte found');
            return null;
        }

        $query = '';

        $trimmed_email = trim($seed->email1);
        $trimmed_email2 = trim($seed->email2);
        $trimmed_last = trim($seed->last_name);
        $trimmed_first = trim($seed->first_name);
        if (!empty($trimmed_email) || !empty($trimmed_email2)) {

            //obtain a list of contacts which contain the same email address
            $contacts = $seed->emailAddress->getBeansByEmailAddress($trimmed_email);
            $contacts2 = $seed->emailAddress->getBeansByEmailAddress($trimmed_email2);
            $contacts = array_merge($contacts, $contacts2);
            if (count($contacts) == 0) {
                LoggerManager::getLogger()->info('End: SoapHelperWebServices->check_for_duplicate_contacts - no duplicte found');
                return null;
            } else {
                foreach ($contacts as $contact) {
                    if (!empty($trimmed_last) && strcmp($trimmed_last, $contact->last_name) == 0) {
                        if ((!empty($trimmed_email) || !empty($trimmed_email2)) && (strcmp($trimmed_email, $contact->email1) == 0 || strcmp($trimmed_email, $contact->email2) == 0 || strcmp($trimmed_email2, $contact->email) == 0 || strcmp($trimmed_email2, $contact->email2) == 0)) {
                            $contact->load_relationship('accounts');
                            if (empty($seed->account_name) || strcmp($seed->account_name, $contact->account_name) == 0) {
                                LoggerManager::getLogger()->info('End: SoapHelperWebServices->check_for_duplicate_contacts - duplicte found ' . $contact->id);
                                return $contact->id;
                            }
                        }
                    }
                }
                LoggerManager::getLogger()->info('End: SoapHelperWebServices->check_for_duplicate_contacts - no duplicte found');
                return null;
            }
        } else
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->check_for_duplicate_contacts - no duplicte found');
        return null;
    }


    function decrypt_string($string)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->decrypt_string');
        if (function_exists('mcrypt_cbc')) {

            $focus = BeanFactory::getBean('Administration');
            $focus->retrieveSettings();
            $key = '';
            if (!empty($focus->settings['ldap_enc_key'])) {
                $key = $focus->settings['ldap_enc_key'];
            }
            if (empty($key)) {
                LoggerManager::getLogger()->info('End: SoapHelperWebServices->decrypt_string - empty key');
                return $string;
            } // if
            $buffer = $string;
            $key = substr(md5($key), 0, 24);
            $iv = "password";
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->decrypt_string');
            return mcrypt_cbc(MCRYPT_3DES, $key, pack("H*", $buffer), MCRYPT_DECRYPT, $iv);
        } else {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->decrypt_string');
            return $string;
        }
    } // fn


    function isLogLevelDebug()
    {
        if (isset(SpiceConfig::getInstance()->config['logger'])) {
            if (isset(SpiceConfig::getInstance()->config['logger']['level'])) {
                return (SpiceConfig::getInstance()->config['logger']['level'] == 'debug');
            } // if
        }
        return false;
    } // fn


    function get_name_value($field, $value)
    {
        if ($value instanceof Link2 && !method_exists($value, '__toString'))
            $value = '';
        return ['name' => $field, 'value' => $value];
    }


    function filter_fields($value, $fields)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->filter_fields');
        global $invalid_contact_fields;
        $filterFields = [];
        foreach ($fields as $field) {
            if (is_array($invalid_contact_fields)) {
                if (in_array($field, $invalid_contact_fields)) {
                    continue;
                }
            }
            if (isset($value->field_defs[$field])) {
                $var = $value->field_defs[$field];
                if ($var['type'] == 'link') continue;
                if (isset($var['source'])
                    && ($var['source'] != 'db' && $var['source'] != 'custom_fields' && $var['source'] != 'non-db')
                    && $var['name'] != 'email1' && $var['name'] != 'email2'
                    && (!isset($var['type']) || $var['type'] != 'relate')) {

                    if ($value->module_dir == 'Emails'
                        && (($var['name'] == 'description') || ($var['name'] == 'description_html') || ($var['name'] == 'from_addr_name')
                            || ($var['name'] == 'reply_to_addr') || ($var['name'] == 'to_addrs_names') || ($var['name'] == 'cc_addrs_names')
                            || ($var['name'] == 'bcc_addrs_names') || ($var['name'] == 'raw_source'))) {

                    } else {
                        continue;
                    }
                }
            }
            $filterFields[] = $field;
        }
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->filter_fields');
        return $filterFields;
    }


    function get_return_module_fields($value, $module,$fields, $translate=true)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_return_module_fields');
        global $module_name;
        $module_name = $module;
        $result = $this->get_field_list($value,$fields,  $translate);
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->get_return_module_fields');

        $tableName = $value->getTableName();

        return ['module_name'=>$module, 'table_name' => $tableName,
            'module_fields'=> $result['module_fields'],
            'link_fields'=> $result['link_fields'],
        ];
    }


    function trackView($seed, $current_view)
    {
        $trackerManager = TrackerManager::getInstance();
        if($monitor = $trackerManager->getMonitor('tracker'))
        {
            $monitor->setValue('date_modified', TimeDate::getInstance()->nowDb());
            $monitor->setValue('user_id', AuthenticationController::getInstance()->getCurrentUser()->id);
            $monitor->setValue('module_name', $seed->module_dir);
            $monitor->setValue('action', $current_view);
            $monitor->setValue('item_id', $seed->id);
            $monitor->setValue('item_summary', $seed->get_summary_text());
            $monitor->setValue('visible',true);
            $trackerManager->saveMonitor($monitor, TRUE, TRUE);
        }
    }



    function checkModuleRoleAccess($module)
    {
        $results = [];
        $actions = ['edit','delete','list','view','import','export'];
        foreach ($actions as $action)
        {
            $access = SpiceACL::getInstance()->checkAccess($module, $action, true);
            $results[] = ['action' => $action, 'access' => $access];
        }

        return $results;
    }


    function get_file_contents_base64($filename, $remove = FALSE)
    {
        $contents = "";
        if( file_exists($filename) )
        {
            $contents =  base64_encode(file_get_contents($filename));
            if($remove)
                @unlink($filename);
        }

        return $contents;
    }


    function get_data_list($seed, $order_by = "", $where = "", $row_offset = 0, $limit=-1, $max=-1, $show_deleted = 0, $favorites = false, $singleSelect=false)
    {
        LoggerManager::getLogger()->debug("get_list:  order_by = '$order_by' and where = '$where' and limit = '$limit'");
        if(isset($_SESSION['show_deleted']))
        {
            $show_deleted = 1;
        }
        $order_by=$seed->process_order_by($order_by, null);

        $params = [];
        if(!empty($favorites)) {
            $params['favorites'] = true;
        }

        $query = $seed->create_new_list_query($order_by, $where,[],$params, $show_deleted);
        return $seed->process_list_query($query, $row_offset, $limit, $max, $where);
    }


    function get_field_list($value,$fields,  $translate=true) {

        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->get_field_list(too large a struct, '.print_r($fields, true).", $translate");
        $module_fields = [];
        $link_fields = [];
        if(!empty($value->field_defs)){

            foreach($value->field_defs as $var){
                if(!empty($fields) && !in_array( $var['name'], $fields))continue;
                if(isset($var['source']) && ($var['source'] != 'db' && $var['source'] != 'non-db' &&$var['source'] != 'custom_fields') && $var['name'] != 'email1' && $var['name'] != 'email2' && (!isset($var['type'])|| $var['type'] != 'relate'))continue;
                if ((isset($var['source']) && $var['source'] == 'non_db') && (isset($var['type']) && $var['type'] != 'link')) {
                    continue;
                }
                $required = 0;
                $options_dom = [];
                $options_ret = [];
                // Apparently the only purpose of this check is to make sure we only return fields
                //   when we've read a record.  Otherwise this function is identical to get_module_field_list
                if( isset($var['required']) && ($var['required'] || $var['required'] == 'true' ) ){
                    $required = 1;
                }

                if($var['type'] == 'bool')
                    $var['options'] = 'checkbox_dom';

                if(isset($var['options'])){
                    $options_dom = translate($var['options'], $value->module_dir);
                    if(!is_array($options_dom)) $options_dom = [];
                    foreach($options_dom as $key=>$oneOption)
                        $options_ret[$key] = $this->get_name_value($key,$oneOption);
                }

                if(!empty($var['dbType']) && $var['type'] == 'bool') {
                    $options_ret['type'] = $this->get_name_value('type', $var['dbType']);
                }

                $entry = [];
                $entry['name'] = $var['name'];
                $entry['type'] = $var['type'];
                $entry['group'] = isset($var['group']) ? $var['group'] : '';
                $entry['id_name'] = isset($var['id_name']) ? $var['id_name'] : '';

                if ($var['type'] == 'link') {
                    $entry['relationship'] = (isset($var['relationship']) ? $var['relationship'] : '');
                    $entry['module'] = (isset($var['module']) ? $var['module'] : '');
                    $entry['bean_name'] = (isset($var['bean_name']) ? $var['bean_name'] : '');
                    $link_fields[$var['name']] = $entry;
                } else {
                    if($translate) {
                        $entry['label'] = isset($var['vname']) ? translate($var['vname'], $value->module_dir) : $var['name'];
                    } else {
                        $entry['label'] = isset($var['vname']) ? $var['vname'] : $var['name'];
                    }
                    $entry['required'] = $required;
                    $entry['options'] = $options_ret;
                    $entry['related_module'] = (isset($var['id_name']) && isset($var['module'])) ? $var['module'] : '';
                    $entry['calculated'] =  (isset($var['calculated']) && $var['calculated']) ? true : false;
                    $entry['len'] =  isset($var['len']) ? $var['len'] : '';

                    if(isset($var['default'])) {
                        $entry['default_value'] = $var['default'];
                    }
                    if( $var['type'] == 'parent' && isset($var['type_name']) )
                        $entry['type_name'] = $var['type_name'];

                    $module_fields[$var['name']] = $entry;
                } // else
            } //foreach
        } //if

        if($value->module_dir == 'Meetings' || $value->module_dir == 'Calls')
        {
            if( isset($module_fields['duration_minutes']) && isset($GLOBALS['app_list_strings']['duration_intervals']))
            {
                $options_dom = $GLOBALS['app_list_strings']['duration_intervals'];
                $options_ret = [];
                foreach($options_dom as $key=>$oneOption)
                    $options_ret[$key] = $this->get_name_value($key,$oneOption);

                $module_fields['duration_minutes']['options'] = $options_ret;
            }
        }

        if($value->module_dir == 'Bugs'){

            $seedRelease = BeanFactory::getBean('Releases');
            $options = $seedRelease->get_releases(TRUE, "Active");
            $options_ret = [];
            foreach($options as $name=>$value){
                $options_ret[] =  ['name'=> $name , 'value'=>$value];
            }
            if(isset($module_fields['fixed_in_release'])){
                $module_fields['fixed_in_release']['type'] = 'enum';
                $module_fields['fixed_in_release']['options'] = $options_ret;
            }
            if(isset($module_fields['found_in_release'])){
                $module_fields['found_in_release']['type'] = 'enum';
                $module_fields['found_in_release']['options'] = $options_ret;
            }
            if(isset($module_fields['release'])){
                $module_fields['release']['type'] = 'enum';
                $module_fields['release']['options'] = $options_ret;
            }
            if(isset($module_fields['release_name'])){
                $module_fields['release_name']['type'] = 'enum';
                $module_fields['release_name']['options'] = $options_ret;
            }
        }

        if(isset($value->assigned_user_name) && isset($module_fields['assigned_user_id'])) {
            $module_fields['assigned_user_name'] = $module_fields['assigned_user_id'];
            $module_fields['assigned_user_name']['name'] = 'assigned_user_name';
        }
        if(isset($value->assigned_name) && isset($module_fields['team_id'])) {
            $module_fields['team_name'] = $module_fields['team_id'];
            $module_fields['team_name']['name'] = 'team_name';
        }
        if(isset($module_fields['modified_user_id'])) {
            $module_fields['modified_by_name'] = $module_fields['modified_user_id'];
            $module_fields['modified_by_name']['name'] = 'modified_by_name';
        }
        if(isset($module_fields['created_by'])) {
            $module_fields['created_by_name'] = $module_fields['created_by'];
            $module_fields['created_by_name']['name'] = 'created_by_name';
        }

        LoggerManager::getLogger()->info('End: SoapHelperWebServices->get_field_list');
        return ['module_fields' => $module_fields, 'link_fields' => $link_fields];
    }


    function new_handle_set_entries($module_name, $name_value_lists, $select_fields = FALSE) {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->new_handle_set_entries');
        global $beanList, $beanFiles, $app_list_strings;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $ret_values = [];

        $ids = [];
        $count = 1;
        $total = sizeof($name_value_lists);
        foreach($name_value_lists as $name_value_list){
            $seed = BeanFactory::getBean($module_name);

            $seed->update_vcal = false;
            foreach($name_value_list as $name => $value){
                if(is_array($value) &&  $value['name'] == 'id'){
                    $seed->retrieve($value['value']);
                    break;
                }
                else if($name === 'id' ){
                    $seed->retrieve($value);
                }
            }

            foreach($name_value_list as $name => $value) {
                //Normalize the input
                if(!is_array($value)){
                    $field_name = $name;
                    $val = $value;
                }
                else{
                    $field_name = $value['name'];
                    $val = $value['value'];
                }

                if($seed->field_name_map[$field_name]['type'] == 'enum'){
                    $vardef = $seed->field_name_map[$field_name];
                    if(isset($app_list_strings[$vardef['options']]) && !isset($app_list_strings[$vardef['options']][$val]) ) {
                        if ( in_array($val,$app_list_strings[$vardef['options']]) ){
                            $val = array_search($val,$app_list_strings[$vardef['options']]);
                        }
                    }
                }
                if($module_name == 'Users' && !empty($seed->id) && ($seed->id != $current_user->id) && $field_name == 'user_hash'){
                    continue;
                }
                if(!empty($seed->field_name_map[$field_name]['sensitive'])) {
                    continue;
                }
                $seed->$field_name = $val;
            }

            if($count == $total){
                $seed->update_vcal = false;
            }
            $count++;

            //Add the account to a contact
            if($module_name == 'Contacts'){
                LoggerManager::getLogger()->debug('Creating Contact Account');
                $this->add_create_account($seed);
                $duplicate_id = $this->check_for_duplicate_contacts($seed);
                if($duplicate_id == null){
                    if($seed->ACLAccess('Save') && ($seed->deleted != 1 || $seed->ACLAccess('Delete'))){
                        $seed->save();
                        if($seed->deleted == 1){
                            $seed->mark_deleted($seed->id);
                        }
                        $ids[] = $seed->id;
                    }
                }
                else{

                    //since we found a duplicate we should set the sync flag
                    if( $seed->ACLAccess('Save')){
                        $seed = new $class_name();
                        $seed->id = $duplicate_id;
                        $seed->contacts_users_id = $current_user->id;
                        $seed->save();
                        $ids[] = $duplicate_id;//we have a conflict
                    }

                }
            }
            else if($module_name == 'Meetings' || $module_name == 'Calls'){
                //we are going to check if we have a meeting in the system
                //with the same outlook_id. If we do find one then we will grab that
                //id and save it
                if( $seed->ACLAccess('Save') && ($seed->deleted != 1 || $seed->ACLAccess('Delete'))){
                    if(empty($seed->id) && !isset($seed->id)){
                        if(!empty($seed->outlook_id) && isset($seed->outlook_id)){
                            //at this point we have an object that does not have
                            //the id set, but does have the outlook_id set
                            //so we need to query the db to find if we already
                            //have an object with this outlook_id, if we do
                            //then we can set the id, otherwise this is a new object
                            $order_by = "";
                            $query = $seed->table_name.".outlook_id = '".$seed->outlook_id."'";
                            $response = $seed->get_list($order_by, $query, 0,-1,-1,0);
                            $list = $response['list'];
                            if(count($list) > 0){
                                foreach($list as $value)
                                {
                                    $seed->id = $value->id;
                                    break;
                                }
                            }//fi
                        }//fi
                    }//fi
                    if (empty($seed->reminder_time)) {
                        $seed->reminder_time = -1;
                    }
                    if($seed->reminder_time == -1){
                        $defaultRemindrTime = $current_user->getPreference('reminder_time');
                        if ($defaultRemindrTime != -1){
                            $seed->reminder_checked = '1';
                            $seed->reminder_time = $defaultRemindrTime;
                        }
                    }
                    $seed->save();
                    if($seed->deleted == 1){
                        $seed->mark_deleted($seed->id);
                    }
                    $ids[] = $seed->id;
                }//fi
            }
            else
            {
                if( $seed->ACLAccess('Save') && ($seed->deleted != 1 || $seed->ACLAccess('Delete'))){
                    $seed->save();
                    $ids[] = $seed->id;
                }
            }

            // if somebody is calling set_entries_detail() and wants fields returned...
            if ($select_fields !== FALSE) {
                $ret_values[$count] = [];

                foreach ($select_fields as $select_field) {
                    if (isset($seed->$select_field)) {
                        $ret_values[$count][$select_field] = $this->get_name_value($select_field, $seed->$select_field);
                    }
                }
            }
        }

        // handle returns for set_entries_detail() and set_entries()
        if ($select_fields !== FALSE) {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_entries');
            return [
                'name_value_lists' => $ret_values,
            ];
        }
        else {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->new_handle_set_entries');
            return [
                'ids' => $ids,
            ];
        }
    }


    function checkSessionAndModuleAccess($session, $login_error_key, $module_name, $access_level, $module_access_level_error_key, $errorObject)
    {
        if(isset($_REQUEST['oauth_token'])) {
            $session = $this->checkOAuthAccess($errorObject);
        }
        if(!$session) return false;


        if(!AuthenticationController::getInstance()->authenticate(null, null , $session, 'SpiceCRM')){
            $errorObject->set_error('invalid_login');
            setFaultObject($errorObject);
            return false;
        } // if

        return SpiceACL::getInstance()->checkACLAccess($module_name, $access_level);

    }


    function validate_authenticated($session_id)
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->validate_authenticated');
        if (!empty($session_id)) {

            // only initialize session once in case this method is called multiple times
            if (!session_id()) {
                session_id($session_id);
                session_start();
            }

            if (!empty($_SESSION['is_valid_session']) && $this->is_valid_ip_address('ip_address') && $_SESSION['type'] == 'user') {

                $authController = AuthenticationController::getInstance();
                $authController->setCurrentUser(BeanFactory::getBean('Users'));
                $current_user = $authController->getCurrentUser();
                $current_user->retrieve($_SESSION['user_id']);
                $this->login_success();
                LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->validate_authenticated - passed');
                LoggerManager::getLogger()->info('End: SoapHelperWebServices->validate_authenticated');
                return true;
            }

            LoggerManager::getLogger()->debug("calling destroy");
            session_destroy();
        }
        LogicHook::getInstance()->call_custom_logic('Users', 'login_failed');
        LoggerManager::getLogger()->info('End: SoapHelperWebServices->validate_authenticated - validation failed');
        return false;
    }


    function check_modules_access($user, $module_name, $action = 'write')
    {
        if (!isset($_SESSION['avail_modules'])) {
            $_SESSION['avail_modules'] = get_user_module_list($user);
        }
        if (isset($_SESSION['avail_modules'][$module_name])) {
            if ($action == 'write' && $_SESSION['avail_modules'][$module_name] == 'read_only') {
                if (is_admin($user)) return true;
                return false;
            } elseif ($action == 'write' && strcmp(strtolower($module_name), 'users') == 0 && !$user->isAdminForModule($module_name)) {
                //rrs bug: 46000 - If the client is trying to write to the Users module and is not an admin then we need to stop them
                return false;
            }
            return true;
        }
        return false;

    }

    function getRelationshipResults($bean, $link_field_name, $link_module_fields, $optional_where = '', $order_by = '', $offset = 0, $limit = '')
    {
        LoggerManager::getLogger()->info('Begin: SoapHelperWebServices->getRelationshipResults');

        global $beanList, $beanFiles;
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $bean->load_relationship($link_field_name);

        if (isset($bean->$link_field_name)) {
            //First get all the related beans
            $params = [];
            $params['offset'] = $offset;
            $params['limit'] = $limit;

            if (!empty($optional_where)) {
                $params['where'] = $optional_where;
            }

            $related_beans = $bean->$link_field_name->getBeans($params);
            //Create a list of field/value rows based on $link_module_fields
            $list = [];
            $filterFields = [];
            if (!empty($order_by) && !empty($related_beans)) {
                $related_beans = order_beans($related_beans, $order_by);
            }
            foreach ($related_beans as $id => $bean) {
                if (empty($filterFields) && !empty($link_module_fields)) {
                    $filterFields = $this->filter_fields($bean, $link_module_fields);
                }
                $row = [];
                foreach ($filterFields as $field) {
                    if (isset($bean->$field)) {
                        $row[$field] = $bean->$field;
                    } else {
                        $row[$field] = "";
                    }
                }
                //Users can't see other user's hashes
                if (is_a($bean, 'User') && $current_user->id != $bean->id && isset($row['user_hash'])) {
                    $row['user_hash'] = "";
                }
                $row = clean_sensitive_data($bean->field_defs, $row);
                $list[] = $row;
            }
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->getRelationshipResults');
            return ['rows' => $list, 'fields_set_on_rows' => $filterFields];
        } else {
            LoggerManager::getLogger()->info('End: SoapHelperWebServices->getRelationshipResults - ' . $link_field_name . ' relationship does not exists');
            return false;
        } // else

    } // fn

}
