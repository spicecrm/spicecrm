<?php

namespace SpiceCRM\modules\ProjectActivities;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;

class ProjectActivity extends SugarBean
{
    public $module_dir = 'ProjectActivities';
    public $object_name = 'ProjectActivity';
    public $table_name = 'projectactivities';
    public $new_schema = true;


    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean =  parent::retrieve($id, $encode, $deleted, $relationships);

        if($bean){
            if (!empty($bean->projectplannedactivity_id)) {
                $pa = BeanFactory::getBean('ProjectPlannedActivities', $bean->projectplannedactivity_id);
                if($pa){
                    $bean->projectplannedactivity_summary = $pa->get_summary_text();
                    if(empty($bean->projectplannedactivity_name) && empty($pa->name)){
                        $bean->projectplannedactivity_name = $pa->get_summary_text();
                    }
                    unset($pa);
                }
            }
        }

        return $bean;
    }

    /*
    function fill_in_additional_list_fields()
    {
        parent::fill_in_additional_list_fields();

        if (!empty($this->projectplannedactivity_id)) {
            $pa = BeanFactory::getBean('ProjectPlannedActivities', $this->projectplannedactivity_id);
            if($pa){
                $this->projectplannedactivity_summary = $pa->get_summary_text();
                if(empty($this->projectplannedactivity_name) && empty($pa->name)){
                    $this->projectplannedactivity_name = $pa->get_summary_text();
                }
                unset($pa);
            }
        }
    }
    */
}
