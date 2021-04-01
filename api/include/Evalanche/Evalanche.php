<?php

namespace SpiceCRM\includes\Evalanche;

use SoapFault;
use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Evalanche\soap\EvalancheSoapClient;
use SpiceCRM\includes\SugarObjects\SpiceConfig;


class Evalanche
{
    public $soapClient;
    public $options;
    public $wsdl;
    public $pool;
    public $attribute;

    public function __construct()
    {
        
        // connection
        $this->wsdl = SpiceConfig::getInstance()->config['evalanche']['wsdl'];

        $this->options = [
            'login' => SpiceConfig::getInstance()->config['evalanche']['login'],
            'password' => SpiceConfig::getInstance()->config['evalanche']['password'],
            'trace' => 1];

        // pool id
        $this->pool = SpiceConfig::getInstance()->config['evalanche']['pool_id'];
        $this->attribute = SpiceConfig::getInstance()->config['evalanche']['attribute_id'];

    }

    // UTILS

    /**
     * maps associative array to EvalanceHashMap
     * @param $data
     * @return array
     */
    private function hashmapFromArray($data)
    {
        foreach ($data as $key => $value) {
            $items[] = [
                'key' => strval($key),
                'value' => strval($value)
            ];
        }

        return ['items' => $items];
    }

    /**
     * curl call to Reporting API
     * @param $username
     * @param $password
     * @param $mailing_date
     * @param $customer_id
     * @param $pool_id
     * @param $table
     * @return mixed
     */
    private function reportingCall($username, $password, $mailing_date, $customer_id, $pool_id, $table)
    {
        $curl = curl_init();
        $url = 'https://scnem3.com/report.php?format=json&from=' . $mailing_date . '&to=today-1second&customer_id=' . $customer_id . '&pool_id=' . $pool_id . '&table=' . $table;
        curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($curl, CURLOPT_USERPWD, "$username:$password");
        // turn off ssl check
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_ENCODING, "UTF-8");

        $response = curl_exec($curl);
        if (empty($response)) {
            $response = curl_error($curl);
        }
        return json_decode($response);
    }

    /**
     * writes an entry in evalanche log if an exception occurs
     * @param $bean_id
     * @param $bean_type
     * @param $response
     * @param $soapfault
     * @param null $evalanche_id
     */
    private function writeLog($bean_id, $bean_type, $method, $response, $soapfault, $evalanche_id = null)
    {
        $db = DBManagerFactory::getInstance();
        
        if (SpiceConfig::getInstance()->config['evalanche']['log'] == 1) {
            $date = $db->now();
            $query = "INSERT INTO sysevalanchelog (id, bean_id, bean_type, method, evalanche_id, response, soapfault, request_date) VALUES (uuid(), '$bean_id', '$bean_type', '$method','$evalanche_id', '$response', '$soapfault','$date')";
            $db->query($query);
        }
    }

    private function getSpiceIds($db, $array, $array_key)
    {
        $crm = [];
        if (!empty($array)) {
            $query = "SELECT parent_id FROM contactsonlineprofiles WHERE username in ('" . implode("','", $array) . "')";
            $db->query($query);
            while ($row = $db->fetchByAssoc($query)) {
                echo $row;
                $crm[strval($array_key)][] = $row['parent_id'];
            }
        }
        return $crm;
    }

    /**
     * logs the activty of a SpiceCRM Target / Evalanche Profile resulting from a SpiceCRM CampagnTask / Evalanche Mailing Transfer
     * @param $db
     * @param $array
     * @param $campaigntaskid
     * @param $array_key
     */
    private function recordActivityLog($db, $array, $campaigntaskid, $array_key)
    {
        if (!empty($array)) {
            $query = "UPDATE campaign_log set activity_type = '" . $array_key . "' WHERE campaigntask_id = '" . $campaigntaskid . "' AND target_id in ('" . implode("','", $array) . "')";
            $db->query($query);
        }

    }
    // CONTACT

    /**
     * creates an Evalanche profile from a CRM contact, saves the id of the new profile as username of the online profile relative to the contact.
     * if the online/Evalanche profile already exists, it updates it with the provided changes from the contact.
     * @param $id
     * @return boolean
     * @throws SoapFault
     */
    public function createProfileFromBean($id, $module)
    {
        
$db = DBManagerFactory::getInstance();
        $data = [];

        $bean = BeanFactory::getBean($module, $id);
        if (!empty($bean)) {
            $query = "SELECT * FROM sysevalanche_fieldmapping WHERE module =" . "$module";
            $query = $db->query($query);
            while ($row = $db->fetchByAssoc($query)) {
                $data[$row['evalanche']] = $bean->{$row['spice']};
            }
            $str = $data['NEWSLETTER'];
            $str = str_replace("^", "", $str);
            $str = '|' . str_replace(',', '|', $str) . '|';
            $data['NEWSLETTER'] = $str;
            $data['PERMISSION'] = SpiceConfig::getInstance()->config['evalanche']['doi_permission'];
            $data['LANGUAGE'] = SpiceConfig::getInstance()->config['evalanche']['language'];
            $items = $this->hashmapFromArray($data);
            try {
                $this->soapClient = new EvalancheSoapClient($this->wsdl . '/profile', $this->options);
                $contactsOnlineProfile = BeanFactory::getBean('ContactsOnlineProfiles');
                if (!$contactsOnlineProfile->retrieve_by_string_fields(['name' => 'Evalanche', 'parent_type' => $bean->module_name, 'parent_id' => $bean->id])) {
                    $response = $this->soapClient->__soapCall('create', [['pool_id' => $this->pool, 'data' => $items]]);
                    $contactsOnlineProfile->name = 'Evalanche';
                    $contactsOnlineProfile->username = $response->createResult;
                    $contactsOnlineProfile->parent_type = 'Contacts';
                    $contactsOnlineProfile->parent_id = $bean->id;
                    $contactsOnlineProfile->save();
                } else {
                    $this->soapClient->__soapCall('updateById', [['profile_id' => $contactsOnlineProfile->username, 'data' => $items]]);
                }
            } catch (SoapFault $e) {
                $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                $this->writeLog($id, $bean->module_name, 'create', str_replace("'", '', $e->getMessage()), $soapfault, $contactsOnlineProfile->username);
            }

            return true;
        } else {
            return false;
        }
    }

    /**
     * deletes a profile from Evalanche
     * @param $id
     */
    public function deleteFromEvalanche($id, $module)
    {
        $bean = BeanFactory::getBean($module, $id);
        $contactsOnlineProfile = BeanFactory::getBean('ContactsOnlineProfiles');
        $contactToDelete = $contactsOnlineProfile->retrieve_by_string_fields(['name' => 'Evalanche', 'parent_type' => $bean->module_name, 'parent_id' => $bean->id]);
        if (!empty($contactToDelete)) {
            try {
                $this->soapClient = new EvalancheSoapClient($this->wsdl . '/profile', $this->options);
                $soapcall = $this->soapClient->__soapCall('delete', [['profile_ids' => [$contactToDelete->username]]]);
            } catch (SoapFault $e) {
                $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                $this->writeLog($id, $bean->module_name, 'delete', str_replace("'", '', $e->getMessage()), $soapfault, $contactToDelete->username);
            }
            if ($soapcall->deleteResult == true) {
                $contactsOnlineProfile->mark_deleted($contactToDelete->id);
            }
        }
    }

    // PROSPECTLIST

    /**
     * creates an attribute option for a given attribute, sets the prospectlist id as the value of this option and returns the id of the newly created option
     * @param $soapClient
     * @param $id
     * @return integer
     */
    private function createAttributeOption($id)
    {
        try {
            $this->soapClient = new EvalancheSoapClient($this->wsdl . '/pool', $this->options);
            $response = $this->soapClient->__soapCall('addAttributeOptions', [['pool_id' => $this->pool, 'attribute_id' => $this->attribute, 'labels' => ['item' => $id]]]);
        } catch (SoapFault $e) {
            $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
            $this->writeLog($id, 'ProspectLists', 'addAttributeOptions', str_replace("'", '', $e->getMessage()), $soapfault);
        }
        $optionItems = $response->addAttributeOptionsResult->options->item;
        foreach ($optionItems as $item) {
            if ($item->value == $id) {
                $optionId = $item->id;
            }
        }
        return $optionId;
    }

    /**
     * checks if prospectlist id is already been added to the attribute options
     * @param $soapClient
     * @param $id
     * @return bool
     */
    private function checkIfAttributeOptionExists($id)
    {
        $prospectListsEvalanche = [];
        try {
            $this->soapClient = new EvalancheSoapClient($this->wsdl . '/pool', $this->options);
            $response = $this->soapClient->__soapCall('getAttributes', [['pool_id' => $this->pool]]);
        } catch (SoapFault $e) {
            $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
            $this->writeLog($id, 'ProspectLists', 'getAttributes', str_replace("'", '', $e->getMessage()), $soapfault);
        }

        if (!is_null($response)) {
            $attributes = $response->getAttributesResult->item;
            foreach ($attributes as $item) {
                if ($item->id == $this->attribute) {
                    $prospectListsEvalanche = $item->options->item;
                }
            }
            foreach ($prospectListsEvalanche as $attribute) {
                if ($attribute->value == $id) {
                    $evalancheTargetListId = $attribute->id;
                } else {
                    $evalancheTargetListId = false;
                }
            }
            return $evalancheTargetListId;
        } else {
            return false;
        }

    }

    /**
     * creates a targetgroup given the id of the Spice prospectlist
     * @param $id
     * @return bool
     * @throws SoapFault
     */
    public function createTargetGroupFromProspectList($id)
    {
        $prospectlist = BeanFactory::getBean('ProspectLists', $id);
        if ($this->checkIfAttributeOptionExists($id) != false) {
            $optionId = $this->checkIfAttributeOptionExists($id);
        } else {
            $optionId = $this->createAttributeOption($id);
        }
        try {
            $this->soapClient = new EvalancheSoapClient($this->wsdl . '/targetgroup', $this->options);
            $args = ['pool_id' => $this->pool, 'attribute_id' => $this->attribute, 'option_id' => $optionId, 'category_id' => 0, 'name' => $prospectlist->name];
            $response = $this->soapClient->__soapCall('createByOption', [$args]);
        } catch (SoapFault $e) {
            $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
            $this->writeLog($prospectlist->id, $$prospectlist->module_name, 'createByOption', str_replace("'", '', $e->getMessage()), $soapfault);
        }

        if (!is_null($response)) {
            $ext_id = $response->createByOptionResult->id;
            $prospectlist->ext_id = $ext_id;
            $prospectlist->attribute_id = $optionId;
            $prospectlist->save();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Retrieves all profiles of a given Evalanche Targetgroup
     * @param $ext_id
     * @return array
     * @throws SoapFault
     */
    private function getProfilesFromEvalanche($ext_id)
    {
        $evalancheProfiles = [];
        try {
            $this->soapClient = new EvalancheSoapClient($this->wsdl . '/profile', $this->options);
            $jobInfoCall = $this->soapClient->__soapCall('getByTargetGroup', [['targetgroup_id' => $ext_id, 'pool_attribute_list' => ['EXTERNALID']]]);
            $job_info = $jobInfoCall->getByTargetGroupResult;
            while ($job_info->status < 2) {
                $jobInfoCall = $this->soapClient->__soapCall('getJobInformation', [['job_id' => $job_info->id]]);
                $job_info = $jobInfoCall->getJobInformationResult;
                $jobId = $job_info->id;
            }
        } catch (SoapFault $e) {
            $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
            $this->writeLog('', 'Prospectlists', 'getByTargetGroup', str_replace("'", '', $e->getMessage()), $soapfault, $ext_id);
        }

        $response = $this->soapClient->__soapCall('getResults', [['job_id' => $jobId]]);
        $result = $response->getResultsResult->result->item;
        foreach ($result as $item) {
            if (!empty($item->items->item->value)) {
                $evalancheProfiles[] = $item->items->item->value;
            } elseif (!empty($item->item->value)) {
                $evalancheProfiles[] = $item->item->value;
            }
        }
        return $evalancheProfiles;
    }


    /**
     * Retrieves the profiles linked to Evalanche for a given ProspectList
     * @param $listID string
     * @return array
     */
    private function getLinkedSpiceProfiles($listID)
    {
        $db = DBManagerFactory::getInstance();

        $list = [];
        $query = "SELECT contactsonlineprofiles.parent_id
            FROM prospect_lists_prospects
            JOIN prospect_lists ON prospect_lists_prospects.prospect_list_id = prospect_lists.id
            JOIN contacts ON prospect_lists_prospects.related_id = contacts.id
            JOIN contactsonlineprofiles ON parent_id = contacts.id
            WHERE prospect_list_id = '" . $listID . "' AND contactsonlineprofiles.name = 'Evalanche' AND contactsonlineprofiles.deleted = 0 AND prospect_lists_prospects.deleted = 0";

        $query = $db->query($query);

        while ($row = $db->fetchByAssoc($query)) {
            $list[] = $row['parent_id'];
        }

        return $list;
    }

    /**
     * Compares the Spice ProspectList with the corresponding Targetgroup on Evalanche, delivers a count of the two lists
     * @param $id string
     * @return array
     */
    public function getProspectListStatistic($id)
    {
        $prospectlist = BeanFactory::getBean('ProspectLists', $id);
        if (!empty($prospectlist->id)) {
            $spiceList = $this->getLinkedSpiceProfiles($prospectlist->id);
            if (empty($prospectlist->ext_id)) {
                $this->createTargetGroupFromProspectList($prospectlist->id);
                $prospectlist->save();
            } else {
                $evalancheList = $this->getProfilesFromEvalanche($prospectlist->ext_id);
            }

        }
        // do something
        return [
            'spice' => $spiceList,
            'evalanche' => $evalancheList,
            'difference' => array_values(array_diff($spiceList, $evalancheList))
        ];
    }

    /**
     * synchronizes the contacts in the SpiceCRM Prospectlist and its respective Evalanche list
     * @param $listid string
     * @param $body array
     * @return bool
     * @throws SoapFault
     **/
    public function synchronizeTargetLists($listid, $body)
    {
        $db = DBManagerFactory::getInstance();

        $prospectlist = BeanFactory::getBean('ProspectLists', $listid);
        $prospects = $body->getParsedBody();
        $prospects = $prospects['prospects'];
        $query = "SELECT username from contactsonlineprofiles WHERE parent_id in ('" . implode("','", $prospects) . "')";
        $query = $db->query($query);
        if (!empty($prospectlist->attribute_id)) {
            $data = ["SPICECRM" => $prospectlist->attribute_id];
            $items = $this->hashmapFromArray($data);
            while ($row = $db->fetchByAssoc($query)) {
                $list[] = $row['username'];
            }
            try {
                $this->soapClient = new EvalancheSoapClient($this->wsdl . '/profile', $this->options);
                foreach ($list as $profile) {
                    $this->soapClient->__soapCall('mergeById', [['profile_id' => $profile, 'data' => $items]]);
                }
            } catch (SoapFault $e) {
                $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                $this->writeLog($listid, $prospects->module_name, 'mergeById', str_replace("'", '', $e->getMessage()), $soapfault);
            }
            return true;
        } else {
            return false;
        }
    }


    // MAILING


    /**
     * get available templates from Evalanche
     */
    public function getTemplates($id)
    {
        $templates = [];
        $targetlists = [];
        $campaignTask = BeanFactory::getBean('CampaignTasks', $id);
        $relatedTargetLists = $campaignTask->get_linked_beans('prospectlists', 'ProspectList');
        foreach ($relatedTargetLists as $list) {
            $targetlists[] = ['id' => $list->ext_id, 'name' => $list->name, 'selected' => false];
        }
        try {
            $this->soapClient = new EvalancheSoapClient($this->wsdl . '/mailingtemplate', $this->options);
            $soapCall = $this->soapClient->__soapCall('getByCategory', [['category_id' => 9720]]);
        } catch (SoapFault $e) {
            $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
            $this->writeLog('', 'MailingTemplate', 'getAll', str_replace("'", '', $e->getMessage()), $soapfault);
        }
        $response = $soapCall->getByCategoryResult;

        if (!empty($response)) {
            foreach ($response->item as $item) {
                $templates[$item->id] = $item->name;

            }

        }
        return ['templates' => (array)$templates,
            'targetlists' => $targetlists];
    }

    /**
     * @param $body
     * @return bool
     */
    private function createDraftMailing($requestBody)
    {
        if (!empty($requestBody)) {
            try {
                $this->soapClient = new EvalancheSoapClient($this->wsdl . '/mailing', $this->options);
                $soapCall = $this->soapClient->__soapCall('createDraft', [$requestBody]);
            } catch (SoapFault $e) {
                $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                $this->writeLog('', 'CampaignTasks', 'createDraft', str_replace("'", '', $e->getMessage()), $soapfault);
            }
            $response = $soapCall->createDraftResult;
            if (!empty($response)) {
                return $response->id;
            } else {
                return false;
            }
        }

    }

    /**
     * @param $requestBody
     * @return boolean
     */
    private function setSubjects($requestBody)
    {
        if (!empty($requestBody)) {
            try {
                $this->soapClient = new EvalancheSoapClient($this->wsdl . '/mailing', $this->options);
                $soapCall = $this->soapClient->__soapCall('setSubjects', [$requestBody]);
            } catch (SoapFault $e) {
                $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                $this->writeLog('', 'CampaignTasks', 'setSubjects', str_replace("'", '', $e->getMessage()), $soapfault);
            }
            return $soapCall->setSubjectsResult;
        }

    }

    /**
     * @param $id
     * @param $body
     * @return array
     */
    public function sendMailing($id, $body)
    {
        $campaignTask = BeanFactory::getBean('CampaignTasks', $id);
        $postData = $body->getParsedBody();
        if (!empty($postData)) {
            $requestBody = ['name' => $postData['name'], 'template_id' => $postData['template'], 'category_id' => 0];
            $mailing_id = $this->createDraftMailing($requestBody);
            if (!empty($mailing_id)) {
                $requestData = ['mailing_id' => $mailing_id, 'subjects' => ['targetgroup_id' => 0, 'subjectline' => $postData['subjectline']]];
                $success = $this->setSubjects($requestData);
            }
            if ($success == true) {
                try {
                    $this->soapClient = new EvalancheSoapClient($this->wsdl . '/mailing', $this->options);
                    $soapCall = $this->soapClient->__soapCall('sendToTargetgroup', [['mailing_id' => $mailing_id, 'targetgroup_id' => 74910, 'send_time' => '', 'speed' => '']]);
                } catch (SoapFault $e) {
                    $soapfault = '{"code": ' . $e->getCode() . ', "file": ' . $e->getFile() . ', "line": ' . $e->getLine() . '}';
                    $this->writeLog('', 'CampaignTasks', 'sendToTargetgroup', str_replace("'", '', $e->getMessage()), $soapfault);
                }
                $response = $soapCall->sendToTargetgroupResult;
                if (!empty($response)) {
                    $campaignTask->mailing_id = $response->id;
                    $campaignTask->save();
                }
            }
            $outcome = true;
        } else {
            $outcome = false;
        }
        return ['success' => $outcome,
            'data' => $mailing_id];
    }

    /**
     * @param $id
     * @return mixed
     */
    public function getMailingStats($id)
    {
        
$db = DBManagerFactory::getInstance();
        $campaignTask = BeanFactory::getBean('CampaignTasks', $id);
        $query = "SELECT id FROM campaign_log WHERE campaigntask_id = '" . $campaignTask->id . "'";
        $query = $db->query($query);
        while ($row = $db->fetchByAssoc($query)) {
            $campaignLogIds[] = $row['id'];
        }
        if (!empty($campaignTask) and $campaignTask->activated == 1) {
            $report = $this->reportingCall(SpiceConfig::getInstance()->config['evalanche']['login'], SpiceConfig::getInstance()->config['evalanche']['password'], $campaignTask->start_date, SpiceConfig::getInstance()->config['evalanche']['customer_id'], $this->pool, 'trackinghistory');
            $mailing_report = [];
            foreach ($report as $singlentry) {
                if ($singlentry->resource_id == $campaignTask->mailing_id) {
                    if ($singlentry->type == 19) {
                        $mailing_report['opened'][] = $singlentry->profile_id;
                    }
                    if ($singlentry->type == 5) {
                        $mailing_report['clicked'][] = $singlentry->profile_id;
                    }
                    if ($singlentry->type == 1100) {
                        $mailing_report['unsubscribed'][] = $singlentry->profile_id;
                    }

                }
            }
            $bounces = $this->reportingCall(SpiceConfig::getInstance()->config['evalanche']['login'], SpiceConfig::getInstance()->config['evalanche']['password'], $campaignTask->start_date, SpiceConfig::getInstance()->config['evalanche']['customer_id'], $this->pool, 'newslettersendlogs');
            foreach ($bounces as $entry) {
                if ($entry->state == 2 or $entry->state == 3) {
                    $mailing_report['bounced'][] = $entry->profile_id;
                }
            }
//            $arr = [];
//            foreach($mailing_report as $key=>$value) {
//                $arr[] = $this->getSpiceIds($db, $value, $key);
//            }
            $crm = [];
            if (!empty($mailing_report['opened'])) {
                $query = "SELECT parent_id FROM contactsonlineprofiles WHERE username in ('" . implode("','", $mailing_report['opened']) . "')";
                $query = $db->query($query);
                while ($row = $db->fetchByAssoc($query)) {
                    $crm['opened'][] = $row['parent_id'];
                }
            }
            if (!empty($mailing_report['clicked'])) {
                $query = "SELECT parent_id FROM contactsonlineprofiles WHERE username in ('" . implode("','", $mailing_report['clicked']) . "')";
                $query = $db->query($query);
                while ($row = $db->fetchByAssoc($query)) {
                    $crm['clicked'][] = $row['parent_id'];
                }
            }
            if (!empty($mailing_report['unsubscribed'])) {
                $query = "SELECT parent_id FROM contactsonlineprofiles WHERE username in ('" . implode("','", $mailing_report['unsubscribed']) . "')";
                $query = $db->query($query);
                while ($row = $db->fetchByAssoc($query)) {
                    $crm['unsubscribed'][] = $row['parent_id'];
                }
            }

            if (!empty($mailing_report['bounced'])) {
                $query = "SELECT parent_id FROM contactsonlineprofiles WHERE username in ('" . implode("','", $mailing_report['bounced']) . "')";
                $query = $db->query($query);
                while ($row = $db->fetchByAssoc($query)) {
                    $crm['bounced'][] = $row['parent_id'];
                }
            }

            foreach ($crm as $key => $value) {
                $this->recordActivityLog($db, $value, $campaignTask->id, $key);
            }

            return $crm;
        }

    }


}
