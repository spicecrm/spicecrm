<?php
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
namespace SpiceCRM\includes\SugarObjects\templates\person;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\SugarObjects\templates\basic\Basic;
use SpiceCRM\includes\Localization\Localization;
use SpiceCRM\modules\EmailAddresses\EmailAddress;

class Person extends Basic
{
    var $picture;
    /**
     * @var bool controls whether or not to invoke the getLocalFormatttedName method with title and salutation
     */
    var $createLocaleFormattedName = true;

    /**
     * @var Link2
     */
    public $email_addresses;

    public function __construct()
    {
        parent::__construct();
        $this->emailAddress = BeanFactory::getBean('EmailAddresses');
    }

    /**
     * need to override to have a name field created for this class
     *
     * @see parent::retrieve()
     */
    public function retrieve($id = -1, $encode = true, $deleted = true, $relationships = true)
    {
        $retVal = parent::retrieve($id, $encode, $deleted, $relationships);
        $this->_create_proper_name_field();
        // call fill_in_relationship_fields again .... workaround till we get the SugarBean::fill_in_relationship_fields clean
        if ($relationships) {
            $this->fill_in_relationship_fields();
        }
        return $retVal;
    }

    /**
     * a helper function to reterieve a person via an email address
     *
     * @param $email
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return Basic|bool|null
     */
    public function retrieve_by_email_address($email, $encode = true, $deleted = true, $relationships = true)
    {
        $email_addr = BeanFactory::getBean('EmailAddresses');
        $result = $email_addr->retrieve_by_string_fields(['email_address' => $email]);
        if($result)
        {
            $sql = "SELECT bean_id FROM email_addr_bean_rel WHERE email_address_id = '{$email_addr->id}' AND bean_module = '$this->module_dir' AND deleted = 0";
            $row = $this->db->fetchByAssoc($this->db->query($sql));
            if(!$row) return false;
            return $this->retrieve($row['bean_id'], $encode, $deleted, $relationships);
        }
        return false;
    }

    /**
     * This function helps generate the name and full_name member field variables from the salutation, title, first_name and last_name fields.
     * It takes into account the locale format settings as well as ACL settings if supported.
     */
    public function _create_proper_name_field()
    {
        global $locale, $app_list_strings;
        if (empty($locale)) {
            $locale = new Localization();
        }

        // Bug# 46125 - make first name, last name, salutation and title of Contacts respect field level ACLs
        $first_name = "";
        $last_name = "";
        $salutation = "";
        $title = "";

        // first name has at least read access
        $first_name = $this->first_name;

        // last name has at least read access
        $last_name = $this->last_name;


        // salutation has at least read access
        if (isset($this->field_defs['salutation']['options'])
            && isset($app_list_strings[$this->field_defs['salutation']['options']])
            && isset($app_list_strings[$this->field_defs['salutation']['options']][$this->salutation])) {

            $salutation = $app_list_strings[$this->field_defs['salutation']['options']][$this->salutation];
        } // if

        // last name has at least read access
        $title = $this->title;

        // Corner Case:
        // Both first name and last name cannot be empty, at least one must be shown
        // In that case, we can ignore field level ACL and just display last name...
        // In the ACL field level access settings, last_name cannot be set to "none"
        if (empty($first_name) && empty($last_name)) {
            $full_name = $locale->getLocaleFormattedName("", $last_name, $salutation, $title);
        } else {
            if ($this->createLocaleFormattedName) {
                $full_name = $locale->getLocaleFormattedName($first_name, $last_name, $salutation, $title);
            } else {
                $full_name = $locale->getLocaleFormattedName($first_name, $last_name);
            }
        }

        $this->name = $full_name;
        $this->full_name = $full_name; //used by campaigns
    }

    public function getLetterSalutation()
    {
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();
        $currentLanguage = $currentUser->getPreference('language');
        $language = $this->communication_language ?: $currentLanguage ?: 'en_us';
        $app_list_strings = return_app_list_strings_language($language);
        return $app_list_strings['salutation_letter_dom'][$this->salutation];
    }

    public function getLetterName()
    {
        $nameArray = [];
        if(!empty($this->degree1)) $nameArray[] =  $this->degree1;
        if(!empty($this->first_name)) $nameArray[] =  $this->first_name;
        if(!empty($this->last_name)) $nameArray[] =  $this->last_name;
        if(!empty($this->degree2)) $nameArray[] =  $this->degree2;
        return implode(' ', $nameArray);
    }

    public function getLetterLastName()
    {
        $nameArray = [];
        if(!empty($this->degree1)) $nameArray[] =  $this->degree1;
        if(!empty($this->last_name)) $nameArray[] =  $this->last_name;
        if(!empty($this->degree2)) $nameArray[] =  $this->degree2;
        return implode(' ', $nameArray);
    }

    /**
     * handle saving/adding the primary email address
     * @see parent::save()
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        $id = parent::save($check_notify, $fts_index_bean);

        if (empty(trim($this->email1))){
            return $this->id;
        }

        $primaryEmailAddressId = EmailAddress::getEmailAddressId($this->email1);

        if (!$primaryEmailAddressId) {
            $newEmailAddress = BeanFactory::newBean('EmailAddresses');
            $newEmailAddress->email_address = $this->email1;
            $newEmailAddress->email_address_caps = strtoupper($this->email1);
            $primaryEmailAddressId = $newEmailAddress->save();
        }

        if (!empty($this->primary_email_opt_in_status)) {
            $this->setPrimaryEmailAddress($primaryEmailAddressId, ['opt_in_status' => $this->primary_email_opt_in_status]);
        } else {
            $this->setPrimaryEmailAddress($primaryEmailAddressId);
        }

        return $id;
    }

    /**
     * fill in primary email address opt in status
     * @param $status
     */
    public function fillInPrimaryEmailAddressOptInStatus($status)
    {
        $this->primary_email_opt_in_status = $status;
    }

    /**
     * set the primary email address from the email1 field
     * @param string $primaryEmailAddressId
     * @param array $relFieldsValues
     */
    private function setPrimaryEmailAddress(string $primaryEmailAddressId, $relFieldsValues = [])
    {

        $relationExists = false;
        $linkedEmailAddresses = $this->get_linked_beans('email_addresses');

        if (!is_array($linkedEmailAddresses)) return;

        foreach ($linkedEmailAddresses as $linkedEmailAddress) {

            if ($primaryEmailAddressId == $linkedEmailAddress->email_address_id) {

                $relationExists = true;
                $this->email_addresses->add($linkedEmailAddress->id, ['primary_address' => 1]);
            } else {
                $this->email_addresses->add($linkedEmailAddress->id, ['primary_address' => 0]);
            }
        }

        if (!$relationExists) {
            $relFieldsValues['primary_address'] = 1;
            $this->email_addresses->add($primaryEmailAddressId, $relFieldsValues);
            $data = [
                'id' => $this->email_addresses->relationship->relid,
                'email_address_id' => $primaryEmailAddressId,
                'bean_id' => $this->id,
                'bean_module' => $this->_module,
                'opt_in_status' => $relFieldsValues['opt_in_status'],
                'primary_address' => $relFieldsValues['primary_address']
            ];
            EmailAddress::writeRelationshipAudit($data, $data);
        }
    }

    /**
     * @see parent::get_summary_text()
     */
    public function get_summary_text()
    {
        $this->_create_proper_name_field();
        return $this->name;
    }


    /**
     * exports a structure for the GDPR Releases
     * follows all links that have gdpr flags and if they are set lists tho
     **/
    function getGDPRRelease()
    {
        $db = DBManagerFactory::getInstance();

        $gdprReleases = [
            'gdpr_data_agreement' => $this->gdpr_data_agreement,
            'gdpr_marketing_agreement' => $this->gdpr_marketing_agreement,
            'related' => [],
            'audit' => []
        ];

        foreach ($this->field_defs as $field) {
            if ($field['type'] == 'link' && !empty($field['module'])) {
                $seed = BeanFactory::getBean($field['module']);
                if ($seed && (isset($seed->field_defs['gdpr_marketing_agreement']) || isset($seed->field_defs['gdpr_data_agreement']))) {
                    $linkedBeans = $this->get_linked_beans($field['name'], $seed->object_name);
                    foreach($linkedBeans as $linkedBean){
                        if($linkedBean->gdpr_data_agreement || $linkedBean->gdpr_marketing_agreement){
                            $gdprReleases['related'][] = [
                                'module' => $field['module'],
                                'id' => $linkedBean->id,
                                'summary_text' => $linkedBean->get_summary_text(),
                                'date_entered' => $linkedBean->date_entered,
                                'created_by' => $linkedBean->created_by,
                                'created_by_name' => $linkedBean->created_by_name,
                                'date_modified' => $linkedBean->date_modified,
                                'modified_user_id' => $linkedBean->modified_user_id,
                                'modified_by_name' => $linkedBean->modified_by_name,
                                'gdpr_data_agreement' => $linkedBean->gdpr_data_agreement,
                                'gdpr_marketing_agreement' => $linkedBean->gdpr_marketing_agreement
                            ];
                        }
                    }
                }
            }
        }

        usort($gdprReleases['related'], function($a, $b){
            return $a['date_modified'] > $b['date_modified'] ? -1 : 1;
        });

        // get audit fields
        if($this->is_AuditEnabled()){
            $audittablename = $this->get_audit_table_name();
            $auditFields = $db->query("SELECT * FROM $audittablename WHERE parent_id = '{$this->id}' AND field_name like 'gdpr_%' ORDER BY date_created DESC");
            while($auditField = $db->fetchByAssoc($auditFields)){
                $createdUser = BeanFactory::getBean('Users', $auditField['created_by']);
                $createdUser->_create_proper_name_field();
                $gdprReleases['audit'][]= [
                    'date_created' => $auditField['date_created'],
                    'field_name' => $auditField['field_name'],
                    'value' => $auditField['after_value_string'],
                    'created_by' => $auditField['created_by'],
                    'created_by_name' => $createdUser->full_name
                ];
            }
        }


        return $gdprReleases;
    }

    /**
     * introduced 2018-05-29 maretval
     * get array containing primary email address full data
     * @return mixed : bool | array
     */
    public function getPrimaryEmailAddressData(){

        $linkedAddresses = $this->get_linked_beans('email_addresses');

        foreach($linkedAddresses as $linkedAddresse){
            if($linkedAddresse->primary_address){
                return $linkedAddresse;
            }
        }
        return false;
    }


    /**
     * ensure the is_inactive flag is properly set in the index parameters
     *
     * @return array
     */
    public function add_fts_metadata()
    {
        return [
            'is_inactive' => [
                'type' => 'keyword',
                'search' => false,
                'enablesort' => true
            ]
        ];
    }

    /**
     * write is_inactive into the index
     */
    public function add_fts_fields()
    {
        return ['is_inactive' => $this->is_inactive ? '1' : '0'];
    }

    /**
     * Generate VCARD content
     * @return $content
     */
    public function getVCardContent() {
        global $app_list_strings;
        $content = "BEGIN:VCARD\nVERSION:4.0\n";
        $content .= "N:{$this->last_name};{$this->first_name};;{$this->salutation} {$this->degree1};{$this->degree2}\n";
        $content .= "FN:{$this->salutation} {$this->degree1} {$this->first_name} {$this->last_name} {$this->degree2}\n";
        $content .= $this->email1 && $this->email1 != "" ? "EMAIL;TYPE=INTERNET:{$this->email1}\n" : "";
        $content .= $this->account_name && $this->account_name != "" ? "ORG:{$this->account_name}\n" : "";
        $content .= $this->phone_work && $this->phone_work != "" ? "TEL;TYPE=WORK:{$this->phone_work}\n" : "";
        $content .= $this->phone_home && $this->phone_home != "" ? "TEL;TYPE=HOME:{$this->phone_home}\n" : "";
        $content .= $this->phone_mobile && $this->phone_mobile != "" ? "TEL;TYPE=CELL:{$this->phone_mobile}\n" : "";
        $content .= $this->phone_other && $this->phone_other != "" ? "TEL:{$this->phone_other}\n" : "";
        $title = $app_list_strings && $app_list_strings['contacts_title_dom'] ? $app_list_strings['contacts_title_dom'][$this->title_dd] : null;
        $content .= $title && $title != "" ? "TITLE:{$title}\n" : "";
        $content .= "ADR:;";
        $content .= $this->primary_address_street && $this->primary_address_street != "" ? "{$this->primary_address_street};" : ';';
        $content .= $this->primary_address_city && $this->primary_address_city != "" ? "{$this->primary_address_city};" : ';';
        $content .= $this->primary_address_state && $this->primary_address_state != "" ? "{$this->primary_address_state};" : ';';
        $content .= $this->primary_address_postalcode && $this->primary_address_postalcode != "" ? "{$this->primary_address_postalcode};" : ';';
        $content .= $this->primary_address_country && $this->primary_address_country != "" ? "{$this->primary_address_country}" : '';
        $content .= "\nEND:VCARD";
        return $content;
    }

    /**
     * override sugar function fill in additional fields on retrieve
     */
    public function fill_in_additional_detail_fields()
    {
        parent::fill_in_additional_detail_fields();
        $this->fillInEmail1Field();
    }

    /**
     * fill in the email1 field called by fill_in_additional_detail_fields
     */
    private function fillInEmail1Field() {
        $emailAddresses = $this->get_linked_beans('email_addresses');
        foreach ($emailAddresses as $emailAddress) {
            if ($emailAddress->primary_address != 1) continue;
            $this->email1 = $emailAddress->email_address;
            break;
        }
    }
}
