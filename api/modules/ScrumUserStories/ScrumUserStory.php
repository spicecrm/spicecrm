<?php
/***** SPICE-HEADER-SPACEHOLDER *****/
namespace SpiceCRM\modules\ScrumUserStories;

use SpiceCRM\data\SugarBean;

class ScrumUserStory extends SugarBean {
    public $module_dir = 'ScrumUserStories';
    public $object_name = 'ScrumUserStory';
    public $table_name = 'scrumuserstories';


    public function save($check_notify = false, $fts_index_bean = true)
    {
        // calulate the completion in terms of complexity points completed
        $this->calculateCompletionRatio();

        return parent::save($check_notify, $fts_index_bean);
    }

    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $ret =  parent::retrieve($id, $encode, $deleted, $relationships);

        // calulate the completion in terms of complexity points completed
        $this->calculateCompletionRatio();

        return $ret;
    }

    private function calculateCompletionRatio(){
        $this->ratio = $this->level_of_completion > 0 ? $this->level_of_complexity / 100 * $this->level_of_completion : 0;
    }
}
