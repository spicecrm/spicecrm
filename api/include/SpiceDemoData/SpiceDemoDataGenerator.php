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
namespace SpiceCRM\includes\SpiceDemoData;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\authentication\AuthenticationController;

/**
 * Class SpiceDemoDataGenerator
 *
 * this class supports generation of demo data using mockaroo.com as a service
 * method names shall be written as in following pattern: generateModulename.
 * Example generateAccounts
 * @package SpiceCRM\includes\SpiceDemoData
 */
class SpiceDemoDataGenerator
{
    public $key = '08e28c80';

    /**
     * generate some Accounts
     */
    public function generateAccounts(){
        $accounts = $this->makeCall('accounts');
        foreach($accounts as $account){
            $seed = BeanFactory::getBean('Accounts');
            foreach($seed->field_defs as $fieldName => $fieldData){
                if(isset($account[$fieldName])){
                    $seed->{$fieldName} = $account[$fieldName];
                }
            }
            if(!empty($seed->id)){
                $seed->new_with_id = true;
            }

            // populate some default values
            $this->popuplateDefaults($seed);

            // save the bean
            $seed->save();
        }
    }

    /**
     * generate some Contacts
     */
    public function generateContacts(){
        $db = DBManagerFactory::getInstance();

        $contacts = $this->makeCall('contacts');
        foreach($contacts as $contact){
            $seed = BeanFactory::getBean('Contacts');
            foreach($seed->field_defs as $fieldName => $fieldData){
                if(isset($contact[$fieldName])){
                    $seed->{$fieldName} = $contact[$fieldName];
                }
            }
            if(!empty($seed->id)){
                $seed->new_with_id = true;
            }

            // populate some default values
            $this->popuplateDefaults($seed);

            // save the bean
            $seed->save();

            $seed->load_relationship('accounts');
            $account = $db->fetchByAssoc($db->query("SELECT id FROM accounts WHERE billing_address_country = '$seed->primary_address_country' ORDER BY RAND() LIMIT 1"));
            $seed->accounts->add($account['id']);
        }
    }

    /**
     * generate some Consumers
     */
    public function generateConsumers(){
        $db = DBManagerFactory::getInstance();

        $contacts = $this->makeCall('consumers');
        foreach($contacts as $contact){
            $seed = BeanFactory::getBean('Consumers');
            foreach($seed->field_defs as $fieldName => $fieldData){
                if(isset($contact[$fieldName])){
                    $seed->{$fieldName} = $contact[$fieldName];
                }
            }
            if(!empty($seed->id)){
                $seed->new_with_id = true;
            }

            // populate some default values
            $this->popuplateDefaults($seed);

            // save the bean
            $seed->save();
        }
    }

    /**
     * generate some Leads
     */
    public function generateLeads(){
        $db = DBManagerFactory::getInstance();

        $leads = $this->makeCall('leads');
        foreach($leads as $lead){
            $seed = BeanFactory::getBean('Leads');
            foreach($seed->field_defs as $fieldName => $fieldData){
                if(isset($lead[$fieldName])){
                    $seed->{$fieldName} = $lead[$fieldName];
                }
            }
            if(!empty($seed->id)){
                $seed->new_with_id = true;
            }

            // populate some default values
            $this->popuplateDefaults($seed);

            // save the bean
            $seed->save();
        }
    }

    /**
     * generate some Opportunities
     */
    public function generateOpportunities(){
        $db = DBManagerFactory::getInstance();

        $opportunities = $this->makeOpportunities();
        foreach($opportunities as $opportunity){
            $seed = BeanFactory::getBean('Opportunities');
            foreach($seed->field_defs as $fieldName => $fieldData){
                if(isset($opportunity[$fieldName])){
                    $seed->{$fieldName} = $opportunity[$fieldName];
                }
            }
            if(!empty($seed->id)){
                $seed->new_with_id = true;
            }

            // populate some default values
            $this->popuplateDefaults($seed);

            // relate to random account
            $seed->load_relationship('accounts');
            $account = $db->fetchByAssoc($db->query("SELECT id, name FROM accounts WHERE deleted=0 ORDER BY RAND() LIMIT 1"));

            // save the bean
            $seed->name = $account['name'];
            $seed->save();

            $seed->accounts->add($account['id']);
        }
    }

    /**
     * generate data for opportunities
     * @return mixed
     */
    private function makeOpportunities(){
        $opportunities = [];
        $appListStrings = return_app_list_strings_language('en_us');
        for($i=0; $i < 50; $i++){
            $opportunity = [
                'amount' => round(mt_rand(25000, 150000), -3),
                'sales_stage' => array_rand($appListStrings['sales_stage_dom']),
                'probability' => round(mt_rand(10, 100), -1),
                'date_closed' => date('Y-m-d', strtotime( '+'.mt_rand(20,120).' days')),
                'opportunity_type' => array_rand($appListStrings['opportunity_type_dom']),
                'lead_source' => array_rand($appListStrings['lead_source_dom']),

            ];
            $opportunities[] = $opportunity;
        }
        return $opportunities;
    }

    /**
     * populate default bean properties
     * @param $seed
     */
    private function  popuplateDefaults(&$seed){
        $current_user = AuthenticationController::getInstance()->getCurrentUser();

        $seed->assigned_user_id = $current_user->id;
    }

    /**
     * call mockaroo api
     * @param $api
     * @return mixed
     */
    private function makeCall($api){
        $cURL = "https://my.api.mockaroo.com/$api.json?key=".$this->key;
        $ch = curl_init($cURL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        return json_decode($result, true);
    }
}
