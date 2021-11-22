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
