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
namespace SpiceCRM\includes\SugarObjects\templates\company;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\templates\basic\Basic;
use SpiceCRM\modules\EmailAddresses\EmailAddress;

class Company extends Basic
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
        $this->emailAddress = BeanFactory::getBean('EmailAddresses');
    }

    /**
     * override the retrieve function in order to properly map email1 value
     *
     * @see parent::retrieve()
     */

    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {

        $retVal = parent::retrieve($id, $encode, $deleted, $relationships);
        if ($relationships) {
            $this->fill_in_relationship_fields();
        }
        return $retVal;
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

        $this->setPrimaryAddress($primaryEmailAddressId);

        return $id;
    }

    /**
     * set the primary email address from the email1 field
     * @param string $primaryEmailAddressId
     */
    private function setPrimaryAddress(string $primaryEmailAddressId) {

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
            $this->email_addresses->add($primaryEmailAddressId, ['primary_address' => 1]);
        }
    }

    /**
     * a helper function to reterieve a company via an email address
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
