<?php
namespace SpiceCRM\modules\Consumers;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\includes\SugarObjects\templates\person\Person;

class Consumer extends Person {
    public $module_dir = 'Consumers';
    public $object_name = 'Consumer';
    public $table_name = 'consumers';
    public $new_schema = true;

    var $full_name; // l10n localized name

    public $additional_column_fields = [];

    public $relationship_fields = [
    ];


    public function get_summary_text(){
        return $this->name;
    }

    public function bean_implements($interface){
        switch($interface){
            case 'ACL':return true;
        }
        return false;
    }

    function fill_in_additional_detail_fields() {
        parent::fill_in_additional_detail_fields();
        if(empty($this->id)) return;

        if(!empty($this->portal_active) && $this->portal_active == 1) {
            $this->portal_active = true;
        }
        // Set campaign name if there is a campaign id
        if( !empty($this->campaign_id)){

            $camp = BeanFactory::getBean('Campaigns');
            $where = "campaigns.id='{$this->campaign_id}'";
            $campaign_list = $camp->get_full_list("campaigns.name", $where, true);
            $this->campaign_name = $campaign_list[0]->name;
        }
    }
}
