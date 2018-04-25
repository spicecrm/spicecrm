<?php
/**
 * future tables to retrieve labels translations from
 * User: maretval
 * Date: 22.12.2017
 * Time: 13:57
 */

if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');
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

//not necessary yet
//$dictionary['syslanguages'] = array (
//    'table' => 'syslanguages',
//    'fields' => array (
//        'id' => array (
//            'name' => 'id',
//            'vname' => 'LBL_ID',
//            'type' => 'id',
//            'required' => true,
//        ),
//        'language' => array (
//            'name' => 'language',
//            'vname' => 'LBL_LANGUAGE',
//            'type' => 'char',
//            'len' => '5',
//            'required' => true,
//        ),
//        'is_default' => array (
//            'name' => 'is_default',
//            'vname' => 'LBL_IS_DEFAULT',
//            'type' => 'bool',
//        ),
//    ),
//    'indices' => array (
//        array('name' => 'syslanguagespk', 'type' =>'primary','fields' => array('id')),
//        array('name' => 'syslanguages_idx', 'type' =>'index','fields' => array('language')),
//        array('name' => 'syslanguagesdefault_idx', 'type' =>'index','fields' => array('is_default')),
//        array('name' => 'syslanguageslangdefault_idx', 'type' =>'index','fields' => array('language', 'is_default')),
//    ),
//);

$dictionary['syslanguagelabels'] = array (
    'table' => 'syslanguagelabels',
    'fields' => array (
        'id' => array (
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ),
        'name' => array (
            'name' => 'name',
            'vname' => 'LBL_LABEL',
            'type' => 'varchar',
            'len' => '100',
            'required' => true,
        ),
        'version' => array (
            'name' => 'version',
            'vname' => 'LBL_VERSION',
            'type' => 'varchar',
            'len' => 16,
        ),
        'package' => array(
            'name' => 'package',
            'type' => 'varchar',
            'len' => 32
        )
    ),
    'indices' => array (
        array('name' => 'syslanguagelabelspk', 'type' =>'primary', 'fields' => array('id')),
        array('name' => 'syslanguagelabel_idx', 'type' =>'unique', 'fields' => array('name')),
    ),
);

$dictionary['syslanguagetranslations'] = array (
    'table' => 'syslanguagetranslations',
    'fields' => array (
        'id' => array (
            'name' => 'id',
            'vname' => 'LBL_ID',
            'type' => 'id'
        ),
        'syslanguagelabel_id' => array (
            'name' => 'syslanguagelabel_id',
            'vname' => 'LBL_SYSLANGUAGELABEL_ID',
            'type' => 'id',
            'required' => true,
        ),
        'syslanguage' => array (
            'name' => 'syslanguage',
            'vname' => 'LBL_LANGUAGE',
            'type' => 'char',
            'len' => 5,
            'required' => true,
        ),
        'translation_default' => array (
            'name' => 'translation_default',
            'vname' => 'LBL_TRANSLATION_DEFAULT',
            'type' => 'varchar',
            'required' => true,
        ),
        'translation_short' => array (
            'name' => 'translation_short',
            'vname' => 'LBL_TRANSLATION_SHORT',
            'type' => 'varchar',
            'required' => false,
        ),
        'translation_long' => array (
            'name' => 'translation_long',
            'vname' => 'LBL_TRANSLATION_LONG',
            'type' => 'text',
            'required' => false,
        ),
    ),
    'indices' => array (
        array('name' => 'syslanguagetranslationspk', 'type' =>'primary', 'fields' => array('id')),
        array('name' => 'syslanguagetranslationlabel_idx', 'type' =>'index', 'fields' => array('syslanguagelabel_id')),
        array('name' => 'syslanguagetranslationlang_idx', 'type' =>'index', 'fields' => array('syslanguage')),
        array('name' => 'syslanguagelabelidlang_idx', 'type' =>'unique', 'fields' => array('syslanguagelabel_id', 'syslanguage')),
    ),
);

$dictionary['syslanguagecustomlabels'] = array (
    'table' => 'syslanguagecustomlabels',
    'fields' => $dictionary['syslanguagelabels']['fields'],
    'indices' => array (
        array('name' => 'syslanguagecustomlabelspk', 'type' =>'primary', 'fields' => array('id')),
        array('name' => 'syslanguagecustomlabel_idx', 'type' =>'unique','fields' => array('name')),
    ),
);

$dictionary['syslanguagecustomtranslations'] = array (
    'table' => 'syslanguagecustomtranslations',
    'fields' => $dictionary['syslanguagetranslations']['fields'],
    'indices' => array (
        array('name' => 'syslanguagecustomtranslationspk', 'type' =>'primary', 'fields' => array('id')),
        array('name' => 'syslanguagecustomtranslationlabel_idx', 'type' =>'index', 'fields' => array('syslanguagelabel_id')),
        array('name' => 'syslanguagecustomtranslationlang_idx', 'type' =>'index', 'fields' => array('syslanguage')),
        array('name' => 'syslanguagecustomlabelidlang_idx', 'type' =>'unique', 'fields' => array('syslanguagelabel_id', 'syslanguage')),
    ),
);

