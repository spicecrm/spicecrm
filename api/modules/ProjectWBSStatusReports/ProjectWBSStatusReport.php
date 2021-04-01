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

namespace SpiceCRM\modules\ProjectWBSStatusReports;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;

class ProjectWBSStatusReport extends SugarBean
{
    public $module_dir = 'ProjectWBSStatusReports';
    public $object_name = 'ProjectWBSStatusReport';
    public $table_name = 'projectwbsstatusreports';

    /**
     * save the new date entered in ProjectWBSStatusReport in the date_end field of the related ProjectWBS
     * @param false $check_notify
     * @param bool $fts_index_bean
     * @return String|void
     */
    public function save($check_notify = false, $fts_index_bean = true)
    {
        if (!empty($this->projectwbs_id)) {
            $projectwbs = BeanFactory::getBean('ProjectWBSs', $this->projectwbs_id);
            if($projectwbs) {
                $this->date_end = $projectwbs->date_end;
                $projectwbs->date_end = $this->new_date_end;
                $projectwbs->level_of_completion = $this->level_of_completion;
                if($projectwbs->level_of_completion == 100){
                    $projectwbs->wbs_status = 2; // completed
                }
                $projectwbs->save();
            }
        }

        return parent::save($check_notify, $fts_index_bean);
    }
}
