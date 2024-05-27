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

namespace SpiceCRM\modules\Agreements;

use SpiceCRM\data\SpiceBean;

class Agreement extends SpiceBean {
    
    public $valid_from;
    public $valid_to;

    public $is_valid = false;

    /**
     * checks if the agreement's validation is expired
     */
    public function isValid(){

        $today = gmdate('Y-m-d');

        if(!$this->valid_from == null && !$this->valid_to == null) { //checking whether the date fields are not empty

            //condition if the start/end of validation lies in the future or lies in the past
            if($today >= $this->valid_from && $today <= $this->valid_to) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        } elseif ($this->valid_from == null && !$this->valid_to == null){
            if($today <= $this->valid_to) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        } elseif (!$this->valid_from == null && $this->valid_to == null){
            if($today >= $this->valid_from) {
                $this->is_valid = true;
            } else {
                $this->is_valid = false;
            };
        }
    }

    public function fill_in_additional_detail_fields()
    {

        $this->isValid();

        parent::fill_in_additional_detail_fields();
    }
};