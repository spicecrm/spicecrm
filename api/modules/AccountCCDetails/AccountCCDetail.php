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
namespace SpiceCRM\modules\AccountCCDetails;

use SpiceCRM\data\SugarBean;

class AccountCCDetail extends SugarBean
{
    //Sugar vars
    public $table_name = "accountccdetails";
    public $object_name = "AccountCCDetail";
    public $new_schema = true;
    public $module_dir = "AccountCCDetails";

    public $id;
    public $date_entered;
    public $date_modified;
    public $date_indexed;
    public $assigned_user_id;
    public $modified_user_id;
    public $created_by;
    public $created_by_name;
    public $modified_by_name;
    public $name;
    public $description;

    public $account_id;
    public $companycode;
    public $abccategory;
    public $paymentterms;
    public $incoterm1;
    public $incoterm2;

    public $companycode_name;

    public $relationship_fields = ['companycode_id' => 'companycodes'];

    function bean_implements($interface)
    {
        switch ($interface) {
            case 'ACL':
                return true;
        }
        return false;
    }

    function __toString()
    {
        return $this->get_summary_text();
    }

    function get_summary_text()
    {
        return $this->companycode_name;
    }
}
