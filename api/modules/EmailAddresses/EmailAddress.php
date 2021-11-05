<?php

namespace SpiceCRM\modules\EmailAddresses;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\authentication\AuthenticationController;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\ErrorHandlers\Exception;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\SpiceFTSManager\SpiceFTSHandler;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\includes\utils\DBUtils;
use SpiceCRM\includes\utils\SpiceUtils;

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

/*********************************************************************************
 * Description:
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc. All Rights
 * Reserved. Contributor(s): ______________________________________..
 *********************************************************************************/


/**
 * handle managing email addresses with modules
 */
class EmailAddress extends SugarBean
{
    /**
     * holds the table name
     * @var string
     */
    public $table_name = 'email_addresses';
    /**
     * holds the module name
     * @var string
     */
    public $module_dir = 'EmailAddresses';
    /**
     * holds the object name
     * @var string
     */
    public $object_name = 'EmailAddress';
    /**
     * holds the email address field from db
     * @var string
     */
    public $email_address;
    /**
     * holds the email address caps field from db
     * @var string
     */
    public $email_address_caps;

    /**
     * clean the email address before save
     * @param false $check_notify
     * @param bool $fts_index_bean
     * @param $ignoreInvalidEmailAddresses bool
     * @return int|string
     * @throws Exception
     * @see SugarBean::save
     */
    public function save($check_notify = false, $fts_index_bean = true, bool $ignoreInvalidEmailAddresses = true)
    {
        $this->email_address = $this->cleanAddress($this->email_address);
        $this->email_address_caps = $this->cleanAddress($this->email_address_caps);
        if (!$ignoreInvalidEmailAddresses && !$this->isValidEmailAddress($this->email_address)) {
            throw new Exception("Invalid Email Address: {$this->email_address}", 422);
        }
        return parent::save($check_notify, $fts_index_bean);
    }

    /**
     * check if the email addresses is valid
     */
    public static function isValidEmailAddress($text)
    {
        return filter_var($text, FILTER_VALIDATE_EMAIL);
    }

    /**
     * search email address fields in all modules with the email address search term and return the result
     * @param $searchterm
     * @return array
     * @throws \Exception
     */
    public function search($searchterm): array
    {
        $db = DBManagerFactory::getInstance();

        $emailAddresses = [];

        // get an FTS manager

        // determine the modules
        $modules = $db->query("SELECT * FROM sysfts");
        while ($module = $db->fetchByAssoc($modules)) {
            $emailFields = [];

            $ftsParams = json_decode(html_entity_decode($module['settings']));
            if ($ftsParams->emailsearch !== true) {
                continue;
            }

            $fields = json_decode($module['ftsfields'], true);
            foreach ($fields as $field) {
                if ($field['email'] === true) {
                    $emailFields[] = $field['indexfieldname'];
                }
            }
            $moduleResults = SpiceFTSHandler::getInstance()->getGlobalSearchResults($module['module'], $searchterm, null, [], [], [], $emailFields);
            foreach ($moduleResults[$module['module']]['hits'] as $hit) {
                $foundemailaddress = [];
                foreach ($emailFields as $emailField) {

                    if (is_array($hit['_source'][$emailField])) {
                        foreach ($hit['_source'][$emailField] as $thisEmail) {
                            if (array_search(strtolower($thisEmail), $foundemailaddress) !== false)
                                continue;

                            $emailAddresses[] = [
                                'module' => $hit['_source']['_module'] ?: $hit['_type'],
                                'id' => $hit['_id'],
                                'score' => $hit['_score'],
                                'summary_text' => $hit['_source']['summary_text'],
                                'email_address' => $thisEmail,
                                'email_address_id' => $this->getEmailAddressId($thisEmail)
                            ];

                            // memorize the email address
                            $foundemailaddress[] = strtolower($thisEmail);
                        }

                    } else {
                        if (empty($hit['_source'][$emailField]) || array_search(strtolower($hit['_source'][$emailField]), $foundemailaddress) !== false)
                            continue;


                        $emailAddresses[] = [
                            'module' => $hit['_source']['_module'] ?: $hit['_type'],
                            'id' => $hit['_id'],
                            'score' => $hit['_score'],
                            'summary_text' => $hit['_source']['summary_text'],
                            'email_address' => $hit['_source'][$emailField],
                            'email_address_id' => $this->getEmailAddressId($hit['_source'][$emailField])
                        ];

                        // memorize the email address
                        $foundemailaddress[] = strtolower($hit['_source'][$emailField]);
                    }
                }
            }
        }

        // sort the return array
        usort($emailAddresses, function ($a, $b) {
            if ($a['score'] == $b['score']) {
                return $a['email'] > $b['email'] ? 1 : -1;
            } else {
                return $a['score'] > $b['score'] ? -1 : 1;
            }
        });

        return $emailAddresses;
    }

    /**
     * searches for email addresses on all related beans on a parent bean
     *
     * @param SugarBean $seed
     * @return array
     */
    public function searchForParentBean($seed)
    {
        // the array to hold the response
        $emailAddresses = [];

        // internal array to memorize whichbeans havebeen searched for and what email addresses have been added
        $addedBeanIds = [];
        $addedEmailAddressIds = [];

        //load all relationships and loop through them
        $seed->load_relationships();
        foreach ($seed->field_defs as $fieldName => $fieldData) {
            if ($fieldData['type'] == 'link') {
                // try to find links ont he beans for email addresses
                $emailAddressLinks = [];

                // make sure the link is loaded
                if (!$seed->{$fieldName}) continue;

                // get the linked module
                $linkedModule = $seed->{$fieldName}->getRelatedModuleName();
                $related = BeanFactory::getBean($linkedModule);
                foreach ($related->field_defs as $rFieldName => $rFieldData) {
                    if ($rFieldData['type'] == 'link' && $rFieldData['module'] == 'EmailAddresses') {
                        $emailAddressLinks[] = $rFieldName;
                    }
                }

                // if we have email address links parse them
                if (count($emailAddressLinks) > 0) {
                    // get alllinked beans on the parent
                    $linkedBeans = $seed->get_linked_beans($fieldName, $linkedModule, [], 0, -99);
                    foreach ($linkedBeans as $linkedBean) {
                        // check if we didhavethis bean already
                        if (in_array($linkedBean->id, $addedBeanIds)) continue;

                        // loop through all email address link fields
                        foreach ($emailAddressLinks as $emailAddressLink) {
                            $emailAddressesBeans = $linkedBean->get_linked_beans($emailAddressLink);
                            foreach ($emailAddressesBeans as $emailAddressesBean) {
                                // check if wehave the email address already
                                if (in_array($linkedBean->id . $emailAddressesBean->id, $addedEmailAddressIds)) continue;

                                // otherwise add
                                $emailAddresses[] = [
                                    'module' => $linkedModule,
                                    'id' => $linkedBean->id,
                                    'summary_text' => $linkedBean->summary_text ?: $linkedBean->name,
                                    'email_address' => $emailAddressesBean->email_address,
                                    'email_address_id' => $emailAddressesBean->id
                                ];

                                // add the reference
                                $addedEmailAddressIds[] = $linkedBean->id . $emailAddressesBean->id;
                            }
                        }

                        // add the id to the added beans
                        $addedBeanIds[] = $linkedBean->id;
                    }
                }
            }
        }

        // done
        return $emailAddresses;
    }

    /**
     * mark email address as invalid and remove from primary
     * @param $emailAddress
     */
    public function markEmailAddressInvalid($emailAddress)
    {
        $emailAddressBean = BeanFactory::getBean('EmailAddresses');
        $emailAddressBean->retrieve_by_string_fields(['email_address_caps' => strtoupper($emailAddress)]);
        if (!empty($emailAddressBean->id)) {
            $emailAddressBean->invalid_email = 1;
            $emailAddressBean->save();
            $this->db->updateQuery('email_addr_bean_rel', ['email_address_id' => $emailAddressBean->id], ['primary_address' => 0]);
        }
    }

    /**
     * retrieve by email address and return the id
     * @param $emailAddress
     * @return string | null
     */
    public static function getEmailAddressId($emailAddress): ?string
    {
        $emailAddressBean = BeanFactory::getBean('EmailAddresses');
        $emailAddressBean->retrieve_by_string_fields(['email_address_caps' => strtoupper($emailAddress)]);
        return $emailAddressBean->id;
    }

    /**
     * todo adjust
     * returns a collection of beans matching the email address
     * @param string $email Address to match
     * @return array
     */
    function getBeansByEmailAddress($email)
    {

        $list = [];
        $email = trim($email);

        if (empty($email)) return [];

        $emailCaps = $this->db->quote(strtoupper(trim($email)));
        $q = "SELECT * FROM email_addr_bean_rel eabl INNER JOIN email_addresses ea ON ea.id = eabl.email_address_id ";
        $q .= "WHERE ea.email_address_caps = '$emailCaps' and eabl.deleted != 1 ";
        $query = $this->db->query($q);

        while ($row = $this->db->fetchByAssoc($query))
            $list[] = BeanFactory::getBean($row['bean_module'], $row['bean_id']);
        return $list;
    }

    /**
     * split the email address data comes in the following form: "name" <email@example.com>
     * @param $addressString
     * @return array
     */
    public function splitEmailAddress($addressString): array
    {
        $email = $this->cleanAddress($addressString);

        if (!preg_match($this->regex, $email)) {
            $email = ''; // remove bad email addresses
        }
        $name = trim(str_replace([$email, '<', '>', '"', "'"], '', $addressString));
        return ["name" => $name, "email" => strtolower($email)];
    }

    /**
     * Normalizes an RFC-clean email address, returns a string that is the email address only
     * @param string $text Dirty email address in the following form: "name" <email@example.com>
     * @return string clean email address
     */
    public static function cleanAddress(string $text): ?string
    {
        $text = DBUtils::fromHtml($text);
        preg_match_all("/[\._a-zA-Z0-9-]+@[\._a-zA-Z0-9-]+/i", $text, $matches);
        return $matches[0][0];
    }

    /**
     * write relationship audit entries for the field changes
     * @param array $dataBefore
     * @param array $dataAfter
     * @throws Exception
     */
    public static function writeRelationshipAudit(array $dataBefore, array $dataAfter)
    {
        global $dictionary;
        $db = DBManagerFactory::getInstance();
        $transactionId = LoggerManager::getLogger()->getTransactionId();
        $currentUser = AuthenticationController::getInstance()->getCurrentUser();

        foreach ($dataAfter as $fieldName => $valueAfter) {

            if ($fieldName == 'date_modified' || $fieldName != 'opt_in_status' && $dataBefore[$fieldName] == $valueAfter) continue;

            $fieldType = $dictionary['email_addr_bean_rel']['fields'][$fieldName]['type'];
            $insertData = [
                'id' => SpiceUtils::createGuid(),
                'parent_id' => $dataBefore['id'],
                'transaction_id' => $transactionId,
                'date_created' => TimeDate::getInstance()->nowDb(),
                'created_by' => $currentUser->id,
                'field_name' => $fieldName,
                'data_type' => $fieldType,
                'before_value' => $dataBefore[$fieldName],
                'after_value' => $valueAfter,
            ];
            $db->insertQuery('email_addr_bean_rel_audit', $insertData);
        }
    }

    /**
     * set the opt in status for the email address relationship
     * @param $bean
     * @param $emailAddress
     * @param string $newStatus 'pending' | 'opted_in' | 'opted_out'
     * @return bool|void
     */
    public static function setOptInStatus($bean, $emailAddress, string $newStatus): bool
    {
        if (empty($bean->id)) return false;

        if (!$emailAddress) {
            return false;
        }

        $bean->email_addresses->add($emailAddress, ['opt_in_status' => $newStatus]);

        return true;
    }
}
