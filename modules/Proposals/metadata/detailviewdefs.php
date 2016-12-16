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

$viewdefs['Proposals']['DetailView'] = array(
    'templateMeta' => array(
        'form' => array(
            'buttons' => array('EDIT', 'DUPLICATE', 'DELETE')
        ),
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'useTabs' => true,
        'tabDefs' => array(
            'LBL_MAINDATA' => array(
                'newTab' => true
            ),
            'LBL_PANEL_VALUEPROPOSITION' => array(
                'newTab' => false
            ),
            'LBL_PANEL_ASSIGNMENT' => array(
                'newTab' => true
            )
        ),
        // 'headerPanel' => 'modules/Proposals/ProposalGuide.php',
    ),
    'panels' => array(
        // 'helper' => 'modules/Proposals/ProposalGuide.php',
        'LBL_MAINDATA' => array(
            array(
                array('name' => 'name'),
                null,
            ),
            array(
                array('name' => 'account_name'),
                array('name' => 'opportunity_name'),
            ),
            array(
                array('name' => 'proposalstatus'),
                array(
                    'name' => 'description',
                    'nl2br' => true
                ),
            )
        ),
        'LBL_PANEL_VALUEPROPOSITION' => array(
            array(
                array('name' => 'amount', 'label' => '{$MOD.LBL_AMOUNT} ({$CURRENCY})'),
                null
            ),
        ),
        'LBL_PANEL_UPLOADS' => array(
            array(
                array('name' => 'file1name', 'type' => 'file', 'displayParams' => array('id' => 'id', 'link' => 'file1name', 'fileid' => 'file1id')),
                array(),
            ),
            array(
                array('name' => 'file2name', 'type' => 'file', 'displayParams' => array('id' => 'id', 'link' => 'file2name', 'fileid' => 'file2id')),
                array(),
            ),
            array(
                array('name' => 'file3name', 'type' => 'file', 'displayParams' => array('id' => 'id', 'link' => 'file3name', 'fileid' => 'file3id')),
                array(),
            ),
        ),
        'LBL_PANEL_ASSIGNMENT' => array(
            array(
                array(
                    'name' => 'assigned_user_name',
                    'label' => 'LBL_ASSIGNED_TO',
                ),
                array(
                    'name' => 'date_modified',
                    'label' => 'LBL_DATE_MODIFIED',
                    'customCode' => '{$fields.date_modified.value} {$APP.LBL_BY} {$fields.modified_by_name.value}',
                ),
            ),
            array(
                array(
                    'name' => 'date_entered',
                    'customCode' => '{$fields.date_entered.value} {$APP.LBL_BY} {$fields.created_by_name.value}',
                )
            )
        )
    )
);