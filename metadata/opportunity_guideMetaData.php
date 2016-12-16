<?php
if (!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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

$dictionary['spicebeanguides'] = array(
    'table' => 'spicebeanguides',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'module' => array(
            'name' => 'module',
            'type' => 'varchar',
            'len' => '50'
        ),
        'status_field' => array(
            'name' => 'status_field',
            'type' => 'varchar',
            'len' => '36'
        ),
        'build_language' => array(
            'name' => 'build_language',
            'type' => 'text'
        )
    )
);

$dictionary['spicebeanguidestages'] = array(
    'table' => 'spicebeanguidestages',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'spicebeanguide_id' => array(
            'name' => 'spicebeanguide_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'stage' => array(
            'name' => 'stage',
            'type' => 'varchar',
            'len' => '36'
        ),
        'secondary_stage' => array(
            'name' => 'secondary_stage',
            'type' => 'varchar',
            'len' => '36'
        ),
        'stage_sequence' => array(
            'name' => 'stage_sequence',
            'type' => 'int'
        ),
        'stage_color' => array(
            'name' => 'stage_color',
            'type' => 'varchar',
            'len' => '6'
        ),
        'stage_add_data' => array(
            'name' => 'stage_add_data',
            'type' => 'text'
        )
    )
);

$dictionary['spicebeanguidestages_texts'] = array(
    'table' => 'spicebeanguidestages_texts',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'stage_id' => array(
            'name' => 'stage_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'language' => array(
            'name' => 'language',
            'type' => 'varchar',
            'len' => '5'
        ),
        'stage_name' => array(
            'name' => 'stage_name',
            'type' => 'varchar',
            'len' => '25'
        ),
        'stage_secondaryname' => array(
            'name' => 'stage_secondaryname',
            'type' => 'varchar',
            'len' => '25'
        ),
        'stage_description' => array(
            'name' => 'stage_description',
            'type' => 'text'
        )
    )
);

$dictionary['spicebeanguidestages_checks'] = array(
    'table' => 'spicebeanguidestages_checks',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'spicebeanguide_id' => array(
            'name' => 'spicebeanguide_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'stage_id' => array(
            'name' => 'stage_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'check_sequence' => array(
            'name' => 'check_sequence',
            'type' => 'int'
        ),
        'check_include' => array(
            'name' => 'check_include',
            'type' => 'varchar',
            'len' => '150'
        ),
        'check_class' => array(
            'name' => 'check_class',
            'type' => 'varchar',
            'len' => '80'
        ),
        'check_method' => array(
            'name' => 'check_method',
            'type' => 'varchar',
            'len' => '80'
        )
    )
);

$dictionary['spicebeanguidestages_check_texts'] = array(
    'table' => 'spicebeanguidestages_check_texts',
    'fields' => array(
        'id' => array(
            'name' => 'id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'stage_check_id' => array(
            'name' => 'stage_check_id',
            'type' => 'varchar',
            'len' => '36'
        ),
        'language' => array(
            'name' => 'language',
            'type' => 'varchar',
            'len' => '5'
        ),
        'text' => array(
            'name' => 'text',
            'type' => 'varchar',
            'len' => '50'
        )
    )
);