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


namespace SpiceCRM\modules\Inquiries;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SpiceBean;
use SpiceCRM\includes\SpiceNumberRanges\SpiceNumberRanges;
use SpiceCRM\extensions\modules\CatalogOrders\CatalogOrder;

class Inquiry extends SpiceBean
{
    public function get_summary_text()
    {
        //todo: a ticket number or something???
        return $this->name;
    }

    public function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }

        return false;
    }


    /**
     * overwritten... to fill in the "email1" field...
     * @param int|string $id
     * @param bool $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return SpiceBean
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $result = parent::retrieve($id, $encode, $deleted, $relationships);
        $consumer = BeanFactory::getBean('Consumers', $this->consumer_id);
        $this->email1 = $consumer->email1;

        // make sure we send an empty array in any case for the catalogs if none are set
        if(empty($this->catalogorder_catalogs)) $this->catalogorder_catalogs = json_encode([]);

        return $result;
    }

    // needed to write the filled in link array into the helper offers property used in the before save hooks...
    public function mapFromRestArray($arr)
    {
        $this->offers_bk = $arr['inquiryoffers']['beans'];
        if(!$this->offers_bk)
            $this->offers_bk = $arr['offers'];
    }

    // overwritten...
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if (empty($this->name) || $this->new_with_id === true) {
            $this->name = SpiceNumberRanges::getNextNumberForField('Inquiries', 'name');
        }

        // each inquiry type has to be its own stati... otherwise the status network doesn't work...
        if((!$this->status || $this->status[0] == '_') && $this->inquiry_type)
        {
            $this->status = "{$this->inquiry_type}_new";
        }


        // try to find a consumer with the given email...
        if ($this->email && !$this->parent_id) {
            $contact = BeanFactory::getBean('Contacts');
            if ($contact->retrieve_by_email_address($this->email)){
                $this->parent_id = $contact->id;
                $this->parent_type = 'Contacts';
            }
        }

        if (empty($this->parent_id))
        {
            $contact = $this->toContact();
            $contact->save();

            $this->parent_id = $contact->id;
            $this->parent_type = 'Contacts';
            // todo: online profile too?
        }

        // checks the catalogs array...
        if (is_array($this->catalogorder_catalogs))
        {
            foreach ($this->catalogorder_catalogs as $idx => &$obj) {
                if (!$obj['quantity']) {
                    $obj['quantity'] = 1;
                }

                if ($obj['ext_id']) {
                    $prod = BeanFactory::getBean('Products');
                    $prod->retrieve_by_string_fields(['ext_id' => $obj['ext_id']]);
                    if($prod->ext_id != $obj['ext_id']) {
                        unset($this->catalogorder_catalogs[$idx]);
                        continue;
                    }
                    $obj['product_id'] = $prod->id;
                    unset($obj['ext_id']);
                }
                // if no product_id is set, remove it from the array
                if (!$obj['product_id']) {
                    unset($this->catalogorder_catalogs[$idx]);
                    continue;
                }
            }
            if(!$this->catalogorder_catalogs)
                throw new Exception('Given Catalogs are completely empty or incorrect!');

            $this->catalogorder_catalogs = json_encode($this->catalogorder_catalogs);
        }

        if($this->inquiry_type == 'catalog' && !$this->catalogorder_catalogs)
            throw new Exception('An inquiry of type catalog needs the field catalogorder_catalogs to be set!');

        $retVal =  parent::save($check_notify);

        return $retVal;
    }

    private function closeEmails()
    {
        $email = BeanFactory::getBean('Emails');
        $emails = $email->retrieve_for_bean($this);
        foreach($emails as $email)
        {
            if($email && $email->openness != 'user_closed'&& $email->openness != 'system_closed'){
                $email->openness = 'system_closed';
                $email->save(false);
            }
        }
    }


    public function toCatalogOrder()
    {
        if($this->inquiry_type != 'catalog')
            return false;

        $bean = new CatalogOrder();
        foreach($this as $prop => $val)
        {
            if(strpos($prop, 'catalogorder') !== false)
            {
                $name = str_replace('catalogorder_', '', $prop);
                $bean->{$name} = $this->{$prop};
            }
        }

        $bean->inquiry_id = $this->id;
        $bean->ttgconsumer_id = $this->ttgconsumer_id;
        return $bean;
    }

    public function toContact()
    {
        $contact = BeanFactory::getBean('Contacts');
        $contact->salutation = $this->salutation;
        $contact->first_name = $this->first_name;
        $contact->last_name = $this->last_name;
        $contact->email1 = $this->email;
        $contact->gdpr_data_agreement = $this->gdpr_data_agreement;
        $contact->gdpr_marketing_agreement = $this->gdpr_marketing_agreement;
        $contact->primary_address_street = $this->inquiry_address_street;
        $contact->primary_address_city = $this->inquiry_address_city;
        $contact->primary_address_state = $this->inquiry_address_state;
        $contact->primary_address_postalcode = $this->inquiry_address_postalcode;
        $contact->primary_address_country = $this->inquiry_address_country;
        $contact->primary_address_latitude = $this->inquiry_address_latitude;
        $contact->primary_address_longitude = $this->inquiry_address_longitude;
        $contact->primary_address_attn = $this->inquiry_address_attn;
        $contact->phone_home = $this->phone_home;
        $contact->phone_mobile = $this->phone_mobile;
        $contact->phone_work = $this->phone_work;
        $contact->phone_other = $this->phone_other;
        $contact->phone_fax = $this->phone_fax;

        return $contact;
    }
}
