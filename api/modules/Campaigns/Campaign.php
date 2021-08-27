<?php
namespace SpiceCRM\modules\Campaigns;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\database\DBManagerFactory;

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
 ********************************************************************************/

class Campaign extends SugarBean {

	// module name definitions and table relations
	var $table_name = "campaigns";
	var $rel_prospect_list_table = "prospect_list_campaigns";
	var $object_name = "Campaign";
	var $module_dir = 'Campaigns';
	var $importable = true;

  	// This is used to retrieve related fields from form posts.
	var $additional_column_fields = [
				'assigned_user_name', 'assigned_user_id',
    ];

	var $relationship_fields = ['prospect_list_id'=>'prospect_lists'];

	function clear_campaign_prospect_list_relationship($campaign_id, $prospect_list_id='')
	{
		if(!empty($prospect_list_id))
			$prospect_clause = " and prospect_list_id = '$prospect_list_id' ";
		else
			$prospect_clause = '';

		$query = "DELETE FROM $this->rel_prospect_list_table WHERE campaign_id='$campaign_id' AND deleted = '0' " . $prospect_clause;
	 	$this->db->query($query, true, "Error clearing campaign to prospect_list relationship: ");
	}


	function mark_relationships_deleted($id)
	{
		$this->clear_campaign_prospect_list_relationship($id);
	}


	function save($check_notify = FALSE, $fts_index_bean = TRUE) {

        //US DOLLAR
        if(isset($this->amount) && !empty($this->amount)){

            $currency = BeanFactory::getBean('Currencies');
            $currency->retrieve($this->currency_id);
            $this->amount_usdollar = $currency->convertToDollar($this->amount);

        }

		// Bug53301
		if($this->campaign_type != 'NewsLetter') {
		    $this->frequency = '';
		}
		
		return parent::save($check_notify, $fts_index_bean);

	}

	function mark_deleted($id){
        $query = "update contacts set campaign_id = null where campaign_id = '{$id}' ";
        $this->db->query($query);
        $query = "update accounts set campaign_id = null where campaign_id = '{$id}' ";
        $this->db->query($query);
        // bug49632 - delete campaign logs for the campaign as well
        $query = "update campaign_log set deleted = 1 where campaign_id = '{$id}' ";
        $this->db->query($query);
		return parent::mark_deleted($id);
	}


	 function bean_implements($interface){
		switch($interface){
			case 'ACL':return true;
		}
		return false;
	}

    function track_prospects($status = 'targeted'){
        $campaign_id = DBManagerFactory::getInstance()->quote($this->id);
        $delete_query="delete from campaign_log where campaign_id='".$campaign_id."' and activity_type='$status'";
        $this->db->query($delete_query);

        $current_date = $this->db->now();
        $guidSQL = $this->db->getGuidSQL();

        $insert_query= "INSERT INTO campaign_log (id,activity_date, campaign_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted";
        $insert_query.=')';
        $insert_query.="SELECT {$guidSQL}, $current_date, plc.campaign_id,{$guidSQL},plp.prospect_list_id, plp.related_id, plp.related_type,'$status',0 ";
        $insert_query.="FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id";
        $insert_query.=" INNER JOIN prospect_list_campaigns plc ON plc.prospect_list_id = prospect_lists.id";
        $insert_query.=" WHERE plc.campaign_id='". DBManagerFactory::getInstance()->quote($this->id)."'";
        $insert_query.=" AND prospect_lists.deleted=0";
        $insert_query.=" AND plc.deleted=0";
        $insert_query.=" AND plp.deleted=0";
        $insert_query.=" AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%'";
        $this->db->query($insert_query);

        global $mod_strings;
        //return success message
        return $mod_strings['LBL_DEFAULT_LIST_ENTRIES_WERE_PROCESSED'];
    }
}
