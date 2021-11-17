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

/*********************************************************************************

 * Description:  Defines the English language pack for the base application.
 * Portions created by SugarCRM are Copyright (C) SugarCRM, Inc.
 * All Rights Reserved.
 * Contributor(s): ______________________________________..
 ********************************************************************************/

use SpiceCRM\includes\database\DBManagerFactory;
use SpiceCRM\includes\Logger\LoggerManager;
use SpiceCRM\includes\TimeDate;
use SpiceCRM\modules\ProspectLists\ProspectList;

/**
 * Queries for the list
 */
function get_subscription_lists_query($focus, $additional_fields = null) {
    //get all prospect lists belonging to Campaigns of type newsletter
    $all_news_type_pl_query = "select c.name, pl.list_type, plc.campaign_id, plc.prospect_list_id";
    if(is_array($additional_fields) && !empty($additional_fields)) $all_news_type_pl_query .= ', ' . implode(', ', $additional_fields);
    $all_news_type_pl_query .= " from prospect_list_campaigns plc , prospect_lists pl, campaigns c ";


	$all_news_type_pl_query .= "where plc.campaign_id = c.id ";
    $all_news_type_pl_query .= "and plc.prospect_list_id = pl.id ";
    $all_news_type_pl_query .= "and c.campaign_type = 'NewsLetter'  and pl.deleted = 0 and c.deleted=0 and plc.deleted=0 ";
    $all_news_type_pl_query .= "and (pl.list_type like 'exempt%' or pl.list_type ='default') ";

    $all_news_type_list =$focus->db->query($all_news_type_pl_query);

    //build array of all newsletter campaigns
    $news_type_list_arr = [];
    while ($row = $focus->db->fetchByAssoc($all_news_type_list)){$news_type_list_arr[] = $row;}

    //now get all the campaigns that the current user is assigned to
    $all_plp_current = "select prospect_list_id from prospect_lists_prospects where related_id = '$focus->id' and deleted = 0 ";

    //build array of prospect lists that this user belongs to
    $current_plp =$focus->db->query($all_plp_current );
    $current_plp_arr = [];
    while ($row = $focus->db->fetchByAssoc($current_plp)){$current_plp_arr[] = $row;}

    return ['current_plp_arr' => $current_plp_arr, 'news_type_list_arr' => $news_type_list_arr];
}


    /*This function is used by the Manage Subscriptions page in order to add the user
     * to the default prospect lists of the passed in campaign
     * Takes in campaign and prospect list id's we are subscribing to.
     * It also takes in a bean of the user (lead,target,prospect) we are subscribing
     * */
    function subscribe($campaign, $prospect_list, $focus, $default_list = false) {
            $relationship = strtolower($focus->getObjectName()).'s';

            //--grab all the lists for the passed in campaign id
            $pl_qry ="select id, list_type from prospect_lists where id in (select prospect_list_id from prospect_list_campaigns where campaign_id = '$campaign') and deleted = 0 ";
            LoggerManager::getLogger()->debug("In Campaigns Util: subscribe function, about to run query: ".$pl_qry );
            $pl_qry_result = $focus->db->query($pl_qry);

            //build the array of all prospect_lists
            $pl_arr = [];
            while ($row = $focus->db->fetchByAssoc($pl_qry_result)){$pl_arr[] = $row;}

            //--grab all the prospect_lists this user belongs to
            $curr_pl_qry ="select prospect_list_id, related_id  from prospect_lists_prospects ";
            $curr_pl_qry .="where related_id = '$focus->id'  and deleted = 0 ";
            LoggerManager::getLogger()->debug("In Campaigns Util: subscribe function, about to run query: ".$curr_pl_qry );
            $curr_pl_qry_result = $focus->db->query($curr_pl_qry);

            //build the array of all prospect lists that this current user belongs to
            $curr_pl_arr = [];
            while ($row = $focus->db->fetchByAssoc($curr_pl_qry_result)){$curr_pl_arr[] = $row;}

            //search through prospect lists for this campaign and identifiy the "unsubscription list"
            $exempt_id = '';
           foreach($pl_arr as $subscription_list){
                if(strpos($subscription_list['list_type'],  'exempt')!== false){
                    $exempt_id = $subscription_list['id'];
                }

                if($subscription_list['list_type'] == 'default' && $default_list) {
                    $prospect_list = $subscription_list['id'];
                }
           }

           //now that we have exempt (unsubscription) list id, compare against user list id's
           if(!empty($exempt_id)){
            $exempt_array['exempt_id'] = $exempt_id;

               foreach($curr_pl_arr as $curr_subscription_list){
                    if($curr_subscription_list['prospect_list_id'] == $exempt_id){
                        //--if we are in here then user is subscribing to a list in which they are exempt.
                        // we need to remove the user from this unsubscription list.
                        //Begin by retrieving unsubscription prospect list
                        $exempt_subscription_list = new ProspectList();


                        $exempt_result = $exempt_subscription_list->retrieve($exempt_id);
                        if($exempt_result == null)
                        {//error happened while retrieving this list
                            return;
                        }
                        //load realationships and delete user from unsubscription list
                        $exempt_subscription_list->load_relationship($relationship);
                        $exempt_subscription_list->$relationship->delete($exempt_id,$focus->id);

                    }
               }
           }

            //Now we need to check if user is already in subscription list
            $already_here = 'false';
            //for each list user is subscribed to, compare id's with current list id'
            foreach($curr_pl_arr as $user_list){
                if(in_array($prospect_list, $user_list)){
                    //if user already exists, then set flag to true
                    $already_here = 'true';
                }
            }
            if($already_here ==='true'){
                //do nothing, user is already subscribed
            }else{
                //user is not subscribed already, so add to subscription list
                $subscription_list = new ProspectList();
                $subs_result = $subscription_list->retrieve($prospect_list);
                if($subs_result == null)
                {//error happened while retrieving this list, iterate and continue
                    return;
                }
                //load subscription list and add this user
                LoggerManager::getLogger()->debug("In Campaigns Util, loading relationship: ".$relationship);
                $subscription_list->load_relationship($relationship);
                $subscription_list->$relationship->add($focus->id);
            }
}


    /*This function is used by the Manage Subscriptions page in order to add the user
     * to the exempt prospect lists of the passed in campaign
     * Takes in campaign and focus parameters.
     * */
    function unsubscribe($campaign, $focus) {
        $relationship = strtolower($focus->getObjectName()).'s';
        //--grab all the list for this campaign id
        $pl_qry ="select id, list_type from prospect_lists where id in (select prospect_list_id from prospect_list_campaigns where campaign_id = '$campaign') and deleted = 0 ";
        $pl_qry_result = $focus->db->query($pl_qry);
        //build the array with list information
        $pl_arr = [];
        LoggerManager::getLogger()->debug("In Campaigns Util, about to run query: ".$pl_qry);
    	while ($row = $focus->db->fetchByAssoc($pl_qry_result)){$pl_arr[] = $row;}

        //retrieve lists that this user belongs to
        $curr_pl_qry ="select prospect_list_id, related_id  from prospect_lists_prospects ";
        $curr_pl_qry .="where related_id = '$focus->id'  and deleted = 0 ";
        LoggerManager::getLogger()->debug("In Campaigns Util, unsubscribe function about to run query: ".$curr_pl_qry );
        $curr_pl_qry_result = $focus->db->query($curr_pl_qry);

        //build the array with current user list information
        $curr_pl_arr = [];
        while ($row = $focus->db->fetchByAssoc($curr_pl_qry_result)){$curr_pl_arr[] = $row;}
         //check to see if user is already there in prospect list
        $already_here = 'false';
        $exempt_id = '';

        foreach($curr_pl_arr as $user_list){
        	foreach($pl_arr as $v){
        		//if list is exempt list
            	if($v['list_type'] == 'exempt'){
            		//save the exempt list id for later use
            		$exempt_id = $v['id'];
					//check to see if user is already in this exempt list
            		if(in_array($v['id'], $user_list)){
                		$already_here = 'true';
            		}

                	break 2;
            	}
        	}
        }

        //unsubscribe subscripted newsletter
        foreach($pl_arr as $subscription_list){
			//create a new instance of the prospect list
        	$exempt_list = new ProspectList();
        	$exempt_list->retrieve($subscription_list['id']);
        	$exempt_list->load_relationship($relationship);
			//if list type is default, then delete the relationship
            //if list type is exempt, then add the relationship to unsubscription list
            if($subscription_list['list_type'] == 'exempt') {
		        $exempt_list->$relationship->add($focus->id);
            }elseif($subscription_list['list_type'] == 'default' || $subscription_list['list_type'] == 'test'){
            	//if list type is default or test, then delete the relationship
            	$exempt_list->$relationship->delete($subscription_list['id'],$focus->id);
            }

        }

        if($already_here =='true'){
            //do nothing, user is already exempted

        }else{
            //user is not exempted yet , so add to unsubscription list


            $exempt_result = $exempt_list->retrieve($exempt_id);
            if($exempt_result == null)
            {//error happened while retrieving this list
                return;
            }
            LoggerManager::getLogger()->debug("In Campaigns Util, loading relationship: ".$relationship);
            $exempt_list->load_relationship($relationship);
            $exempt_list->$relationship->add($focus->id);
        }

    }


/**
 * Handle campaign log entry creation for mail-merge activity. The function will be called by the soap component.
 *
 * @param String campaign_id Primary key of the campaign
 * @param array targets List of keys for entries from prospect_lists_prosects table
 */
 function campaign_log_mail_merge($campaign_id, $targets) {

    $campaign= new Campaign();
    $campaign->retrieve($campaign_id);

    if (empty($campaign->id)) {
        LoggerManager::getLogger()->debug('set_campaign_merge: Invalid campaign id'. $campaign_id);
    } else {
        foreach ($targets as $target_list_id) {
            $pl_query = "select * from prospect_lists_prospects where id='". DBManagerFactory::getInstance()->quote($target_list_id)."'";
            $result= DBManagerFactory::getInstance()->query($pl_query);
            $row= DBManagerFactory::getInstance()->fetchByAssoc($result);
            if (!empty($row)) {
                write_mail_merge_log_entry($campaign_id,$row);
            }
        }
    }

 }
/**
 * Function creates a campaign_log entry for campaigns processesed using the mail-merge feature. If any entry
 * exist the hit counter is updated. target_tracker_key is used to locate duplicate entries.
 * @param string campaign_id Primary key of the campaign
 * @param array $pl_row A row of data from prospect_lists_prospects table.
 */
function write_mail_merge_log_entry($campaign_id,$pl_row) {

    //Update the log entry if it exists.
    $update="update campaign_log set hits=hits+1 where campaign_id='". DBManagerFactory::getInstance()->quote($campaign_id)."' and target_tracker_key='" . DBManagerFactory::getInstance()->quote($pl_row['id']) . "'";
    $result= DBManagerFactory::getInstance()->query($update);

    //get affected row count...
    $count= DBManagerFactory::getInstance()->getAffectedRowCount();
    if ($count==0) {
        $data=[];

        $data['id']="'" . create_guid() . "'";
        $data['campaign_id']="'" . DBManagerFactory::getInstance()->quote($campaign_id) . "'";
        $data['target_tracker_key']="'" . DBManagerFactory::getInstance()->quote($pl_row['id']) . "'";
        $data['target_id']="'" .  DBManagerFactory::getInstance()->quote($pl_row['related_id']) . "'";
        $data['target_type']="'" .  DBManagerFactory::getInstance()->quote($pl_row['related_type']) . "'";
        $data['activity_type']="'targeted'";
        $data['activity_date']="'" . TimeDate::getInstance()->nowDb() . "'";
        $data['list_id']="'" .  DBManagerFactory::getInstance()->quote($pl_row['prospect_list_id']) . "'";
        $data['hits']=1;
        $data['deleted']=0;
        $insert_query="INSERT into campaign_log (" . implode(",",array_keys($data)) . ")";
        $insert_query.=" VALUES  (" . implode(",",array_values($data)) . ")";
        DBManagerFactory::getInstance()->query($insert_query);
    }
}

    function track_campaign_prospects($focus){
        $campaign_id = DBManagerFactory::getInstance()->quote($focus->id);
        $delete_query="delete from campaign_log where campaign_id='".$campaign_id."' and activity_type='targeted'";
        $focus->db->query($delete_query);

        $current_date = $focus->db->now();
        $guidSQL = $focus->db->getGuidSQL();

        $insert_query= "INSERT INTO campaign_log (id,activity_date, campaign_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted";
        $insert_query.=')';
        $insert_query.="SELECT {$guidSQL}, $current_date, plc.campaign_id,{$guidSQL},plp.prospect_list_id, plp.related_id, plp.related_type,'targeted',0 ";
        $insert_query.="FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id";
        $insert_query.=" INNER JOIN prospect_list_campaigns plc ON plc.prospect_list_id = prospect_lists.id";
        $insert_query.=" WHERE plc.campaign_id='". DBManagerFactory::getInstance()->quote($focus->id)."'";
        $insert_query.=" AND prospect_lists.deleted=0";
        $insert_query.=" AND plc.deleted=0";
        $insert_query.=" AND plp.deleted=0";
        $insert_query.=" AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%'";
        $focus->db->query($insert_query);

        global $mod_strings;
        //return success message
        return $mod_strings['LBL_DEFAULT_LIST_ENTRIES_WERE_PROCESSED'];
    }

    function create_campaign_log_entry($campaign_id, $focus, $rel_name, $rel_bean, $target_id = ''){
        $timedate = TimeDate::getInstance();

        $target_ids = [];
        //check if this is specified for one target/contact/prospect/lead (from contact/lead detail subpanel)
        if(!empty($target_id)){
            $target_ids[] = $target_id;
        }else{
            //this is specified for all, so load target/prospect relationships (mark as sent button)
            $focus->load_relationship($rel_name);
            $target_ids = $focus->$rel_name->get();

        }
        if(count($target_ids)>0){


            //retrieve the target beans and create campaign log entry
            foreach($target_ids as $id){
                 //perform duplicate check
                 $dup_query = "select id from campaign_log where campaign_id = '$campaign_id' and target_id = '$id'";
                 $dup_result = $focus->db->query($dup_query);
                 $row = $focus->db->fetchByAssoc($dup_result);

                //process if this is not a duplicate campaign log entry
                if(empty($row)){
                    //create campaign tracker id and retrieve related bio bean
                     $tracker_id = create_guid();
                     $rel_bean->retrieve($id);

                    //create new campaign log record.
                    $campaign_log = new CampaignLog();
                    $campaign_log->campaign_id = $campaign_id;
                    $campaign_log->target_tracker_key = $tracker_id;
                    $campaign_log->target_id = $rel_bean->id;
                    $campaign_log->target_type = $rel_bean->module_dir;
                    $campaign_log->activity_type = 'targeted';
                    $campaign_log->activity_date=$timedate->now();
                    //save the campaign log entry
                    $campaign_log->save();
                }
            }
        }

    }

    /*
     * This function will return an array that has been formatted to work as a Quick Search Object for prospect lists
     */
    function getProspectListQSObjects($source = '', $return_field_name='name', $return_field_id='id' ) {
        global $app_strings;
        //if source has not been specified, then search across all prospect lists
        if(empty($source)){
            $qsProspectList = ['method' => 'query',
                                'modules'=> ['ProspectLists'],
                                'group' => 'and',
                                'field_list' => ['name', 'id'],
                                'populate_list' => ['prospect_list_name', 'prospect_list_id'],
                                'conditions' => [['name'=>'name','op'=>'like_custom','end'=>'%','value'=>'']],
                                'order' => 'name',
                                'limit' => '30',
                                'no_match_text' => $app_strings['ERR_SQS_NO_MATCH']];
        }else{
             //source has been specified use it to tell quicksearch.js which html input to use to get filter value
            $qsProspectList = ['method' => 'query',
                                'modules'=> ['ProspectLists'],
                                'group' => 'and',
                                'field_list' => ['name', 'id'],
                                'populate_list' => [$return_field_name, $return_field_id],
                                'conditions' => [
                                                    ['name'=>'name','op'=>'like_custom','end'=>'%','value'=>''],
                                                    //this condition has the source parameter defined, meaning the query will take the value specified below
                                                    ['name'=>'list_type', 'op'=>'like_custom', 'end'=>'%','value'=>'', 'source' => $source]
                                ],
                                'order' => 'name',
                                'limit' => '30',
                                'no_match_text' => $app_strings['ERR_SQS_NO_MATCH']];

        }

        return $qsProspectList;
    }
