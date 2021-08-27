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
namespace SpiceCRM\modules\Projects;

use SpiceCRM\data\BeanFactory;
use SpiceCRM\data\SugarBean;
use SpiceCRM\includes\utils\SpiceUtils;

class Project extends SugarBean {
    // basic definition
    public $object_name = 'Project';
    public $module_dir = 'Projects';
    public $table_name = 'projects';
    public $new_schema = true;

    // calculated information
    public $total_estimated_effort;
    public $total_actual_effort;
    public $estimated_start_date;
    public $estimated_end_date;


    /**
     * add some calculated values on retrieve
     * @param int $id
     * @param false $encode
     * @param bool $deleted
     * @param bool $relationships
     * @return Project|null
     */
    public function retrieve($id = -1, $encode = false, $deleted = true, $relationships = true)
    {
        $bean =  parent::retrieve($id, $encode, $deleted, $relationships);

        // calculations
        if($bean){
            // calculate planned & actual efforts using wbs elements
            $this->total_estimated_effort = 0;
            $this->total_actual_effort = 0;
            $wbsElements = $this->get_linked_beans('projectwbss');
            foreach($wbsElements as $wbs){
                // handle planned efforts
                $this->total_estimated_effort += $wbs->planned_effort;
                // handle actual efforts
                $this->total_actual_effort += $wbs->consumed_effort;
            }

            // calculate start and end dates according to earliest WBS element start date and lastest WBS end date
            if(count($wbsElements) > 0) {
                $this->estimated_start_date = SpiceUtils::getMinDate($wbsElements, 'date_start');
                $this->estimated_end_date = SpiceUtils::getMaxDate($wbsElements, 'date_end');
            }
                    }

        return $bean;
    }




    /**
     *
     */
    function get_summary_text()
    {
        return $this->name;
    }



    function bean_implements($interface){
        switch($interface){
            case 'ACL':return true;
        }
        return false;
    }



}

