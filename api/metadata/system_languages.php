<?php
/**
 * future tables to retrieve labels translations from
 * User: maretval
 * Date: 22.12.2017
 * Time: 13:57
 */

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


$dictionary['syslangs'] = [
    'table' => 'syslangs',
    'changerequests' => [
        'active' => true,
        'name' => 'language_code'
    ],
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'language_code' => [
            'name' => 'language_code',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'char',
            'len' => '10',
            'required' => true,
        ],
        'language_name' => [
            'name' => 'language_name',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'char',
            'len' => '50',
            'required' => true,
        ],
        'sort_sequence' => [
            'name' => 'sort_sequence',
            'vname' => 'LBL_SORT_SEQUENCE',
            'type' => 'int',
            'default' => 99
        ],
        'is_default' => [
            'name' => 'is_default',
            'vname' => 'LBL_IS_DEFAULT',
            'type' => 'bool',
        ],
        'system_language' => [
            'name' => 'system_language',
            'vname' => 'LBL_SYSTEM_LANGUAGE',
            'type' => 'bool',
        ],
        'communication_language' => [
            'name' => 'communication_language',
            'vname' => 'LBL_COMMUNICATION_LANGUAGE',
            'type' => 'bool',
        ]
    ],
    'indices' => [
        ['name' => 'syslanguagespk', 'type' =>'primary','fields' => ['id']],
        ['name' => 'syslanguages_idx', 'type' =>'index','fields' => ['language_code']],
        ['name' => 'syslanguagesdefault_idx', 'type' =>'index','fields' => ['is_default']],
        ['name' => 'syslanguageslangdefault_idx', 'type' =>'index','fields' => ['language_code', 'is_default']],
    ],
];

$dictionary['syslanguagelabels'] = [
    'table' => 'syslanguagelabels',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ],
        'name' => [
            'name' => 'name',
            'vname' => 'LBL_LABEL',
            'type' => 'varchar',
            'len' => '100',
            'required' => true,
        ],
// removed in spice 2020.03.001
//        'version' => array (
//            'name' => 'version',
//            'vname' => 'LBL_VERSION',
//            'type' => 'varchar',
//            'len' => 16,
//        ),
//        'package' => array(
//            'name' => 'package',
//            'type' => 'varchar',
//            'len' => 32
//        )
    ],
    'indices' => [
        ['name' => 'syslanguagelabelspk', 'type' =>'primary', 'fields' => ['id']],
        ['name' => 'syslanguagelabel_idx', 'type' =>'unique', 'fields' => ['name']],
    ],
];

$dictionary['syslanguagetranslations'] = [
    'table' => 'syslanguagetranslations',
    'fields' => [
        'id' => [
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ],
        'syslanguagelabel_id' => [
            'name' => 'syslanguagelabel_id',
            'vname' => 'LBL_SYSLANGUAGELABEL_ID',
            'type' => 'id',
            'required' => true,
        ],
        'syslanguage' => [
            'name' => 'syslanguage',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'char',
            'len' => 5,
            'required' => true,
        ],
        'translation_default' => [
            'name' => 'translation_default',
            'vname' => 'LBL_TRANSLATION_DEFAULT',
            'type' => 'varchar',
            'required' => true,
        ],
        'translation_short' => [
            'name' => 'translation_short',
            'vname' => 'LBL_TRANSLATION_SHORT',
            'type' => 'varchar',
            'required' => false,
        ],
        'translation_long' => [
            'name' => 'translation_long',
            'vname' => 'LBL_TRANSLATION_LONG',
            'type' => 'text',
            'required' => false,
        ],
    ],
    'indices' => [
        ['name' => 'syslanguagetranslationspk', 'type' =>'primary', 'fields' => ['id']],
        ['name' => 'syslanguagetranslationlabel_idx', 'type' =>'index', 'fields' => ['syslanguagelabel_id']],
        ['name' => 'syslanguagetranslationlang_idx', 'type' =>'index', 'fields' => ['syslanguage']],
        // array('name' => 'syslanguagelabelidlang_idx', 'type' =>'unique', 'fields' => array('syslanguagelabel_id', 'syslanguage')),
    ],
];

$dictionary['syslanguagecustomlabels'] = [
    'table' => 'syslanguagecustomlabels',
    'fields' => $dictionary['syslanguagelabels']['fields'],
    'indices' => [
        ['name' => 'syslanguagecustomlabelspk', 'type' =>'primary', 'fields' => ['id']],
        ['name' => 'syslanguagecustomlabel_idx', 'type' =>'unique','fields' => ['name']],
    ],
];

$dictionary['syslanguagecustomtranslations'] = [
    'table' => 'syslanguagecustomtranslations',
    'fields' => $dictionary['syslanguagetranslations']['fields'],
    'indices' => [
        ['name' => 'syslanguagecustomtranslationspk', 'type' =>'primary', 'fields' => ['id']],
        ['name' => 'syslanguagecustomtranslationlabel_idx', 'type' =>'index', 'fields' => ['syslanguagelabel_id']],
        ['name' => 'syslanguagecustomtranslationlang_idx', 'type' =>'index', 'fields' => ['syslanguage']],
        ['name' => 'syslanguagecustomlabelidlang_idx', 'type' =>'unique', 'fields' => ['syslanguagelabel_id', 'syslanguage']],
    ],
];

