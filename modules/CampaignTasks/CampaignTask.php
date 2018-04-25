<?php 
 
if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
        
require_once('data/SugarBean.php');

class CampaignTask extends SugarBean {
    public $module_dir = 'CampaignTasks';
    public $object_name = 'CampaignTask';
    public $table_name = 'campaigntasks';
    public $new_schema = true;
    
    public $additional_column_fields = Array();

    public $relationship_fields = Array(
    );


    public function get_summary_text(){
        return $this->name;
    }

    public function bean_implements($interface){
        switch($interface){
            case 'ACL':return true;
        }
        return false;
    }

    function track_prospects($status = 'targeted'){
        $delete_query="DELETE FROM campaign_log WHERE campaign_id='".$this->campaign_id."' AND campaigntask_id='".$this->id."' AND activity_type='$status'";
        $this->db->query($delete_query);

        $current_date = $this->db->now();
        $guidSQL = $this->db->getGuidSQL();

        $insert_query= "INSERT INTO campaign_log (id,activity_date, campaign_id, campaigntask_id, target_tracker_key,list_id, target_id, target_type, activity_type, deleted";
        $insert_query.=')';
        $insert_query.="SELECT {$guidSQL}, $current_date, '{$this->campaign_id}' campaign_id,  plc.campaigntask_id , {$guidSQL},plp.prospect_list_id, plp.related_id, plp.related_type,'$status',0 ";
        $insert_query.="FROM prospect_lists INNER JOIN prospect_lists_prospects plp ON plp.prospect_list_id = prospect_lists.id";
        $insert_query.=" INNER JOIN prospect_list_campaigntasks plc ON plc.prospect_list_id = prospect_lists.id";
        $insert_query.=" WHERE plc.campaigntask_id='".$GLOBALS['db']->quote($this->id)."'";
        $insert_query.=" AND prospect_lists.deleted=0";
        $insert_query.=" AND plc.deleted=0";
        $insert_query.=" AND plp.deleted=0";
        $insert_query.=" AND prospect_lists.list_type!='test' AND prospect_lists.list_type not like 'exempt%'";
        $this->db->query($insert_query);

    }
    
}