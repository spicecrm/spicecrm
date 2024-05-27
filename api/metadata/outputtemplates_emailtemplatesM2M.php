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

use SpiceCRM\includes\SpiceDictionary\SpiceDictionaryHandler;

SpiceDictionaryHandler::getInstance()->dictionary['outputtemplates_emailtemplates'] = [
    'table'         => 'outputtemplates_emailtemplates',
    'contenttype'   => 'relationdata',
    'fields'        => [
        'id' => ['name' =>'id', 'type' =>'varchar', 'len'=>'36'],
        'outputtemplate_id' => ['name' =>'outputtemplate_id', 'type' =>'varchar', 'len'=>'36'],
        'emailtemplate_id' => ['name' =>'emailtemplate_id', 'type' =>'varchar', 'len'=>'36'],
        'date_modified' => ['name' => 'date_modified','type' => 'datetime'],
        'deleted' => ['name' =>'deleted', 'type' =>'bool', 'len'=>'1', 'required'=>false, 'default'=>0],
    ],
    'indices'       => [
        ['name' =>'emailtemplates_outputtemplatespk', 'type' =>'primary', 'fields'=> ['id']],
        ['name' => 'idx_emailtemplate_outputtemplate', 'type'=>'alternate_key', 'fields'=> ['emailtemplate_id','outputtemplate_id']],
        ['name' => 'idx_emtid_del_outtid', 'type' => 'index', 'fields'=> ['outputtemplate_id', 'deleted', 'emailtemplate_id']],

    ],
    'relationships' => [
        'outputtemplates_emailtemplates' => [
            'lhs_module'=> 'EmailTemplates',
            'lhs_table'=> 'emailtemplates',
            'lhs_key' => 'id',
            'rhs_module'=> 'OutputTemplates',
            'rhs_table'=> 'outputtemplates',
            'rhs_key' => 'id',
            'relationship_type'=>'many-to-many',
            'join_table'=> 'outputtemplates_emailtemplates',
            'join_key_lhs'=>'emailtemplate_id',
            'join_key_rhs'=>'outputtemplate_id',
        ],
    ],
];
