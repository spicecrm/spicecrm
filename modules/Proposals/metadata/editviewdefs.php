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

$viewdefs['Proposals']['EditView'] = array(
    'templateMeta' => array(
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'form' => array(
            'enctype'=> 'multipart/form-data',
            'buttons'=>array('SAVE', 'CANCEL',),
        ),
        'useTabs' => false,
         'tabDefs' => array(
            'LBL_MAINDATA' => array(
                'newTab' => false
            ),
             'LBL_PANEL_VALUEPROPOSITION' => array(
                 'newTab' => false
             ),
             'LBL_PANEL_UPLOADS' => array(
                 'newTab' => false
             ),
             'LBL_PANEL_ASSIGNMENT' => array(
                'newTab' => false
             )
        ),
        'javascript' => '
				<script>
				function deleteAttachmentCallBack(text)
				{literal} { {/literal}
				if(text == \'true\') {literal} { {/literal}
				document.getElementById(\'new_attachment\').style.display = \'\';
				ajaxStatus.hideStatus();
				document.getElementById(\'old_attachment\').innerHTML = \'\';
				{literal} } {/literal} else {literal} { {/literal}
				document.getElementById(\'new_attachment\').style.display = \'none\';
				ajaxStatus.flashStatus(SUGAR.language.get(\'Notes\', \'ERR_REMOVING_ATTACHMENT\'), 2000);
				{literal} } {/literal}
				{literal} } {/literal} ;
				function deleteAttachmentByIndex(index)
				{literal} { {/literal}
				document.getElementById(\'new_file\' + index).style.display = \'\';
				document.getElementById(\'old_file\' + index).style.display = \'none\';
				document.getElementById(\'deletefile\' + index).value = \'1\';
				{literal} } {/literal}
				</script>'
    ),
    'panels' => array(
        'LBL_MAINDATA' => array(
            array(
                array('name' => 'name'),
            ),
            array(
                array('name' => 'account_name'),
                array('name' => 'opportunity_name'),
            ),
            array(
                array('name' => 'proposalstatus'),
                array('name' => 'description'),
            ),
        ),
        'LBL_PANEL_VALUEPROPOSITION' => array(
            array(
                array('name' => 'amount'),
                array('name' => 'currency_id', 'label' => 'LBL_CURRENCY'),
            ),
        ),
        'LBL_PANEL_UPLOADS' => array(
            array(
                array('name' => 'file1name',
                    'customCode' => '<span id=\'new_file1\'style=\'display:{if !empty($fields.file1name.value)}none{/if}\'>
										<input name="file1" tabindex="3" type="file" size="60"/>
										</span>
										<div  style="border: 1px dotted #999; width: calc(100% - 10px); padding: 5px; margin: 5px 0px; display:{if empty($fields.file1name.value)}none{/if};" id=\'old_file1\'>
										<input type=\'hidden\' id=\'deletefile1\' name=\'deletefile1\' value=\'0\'>
										{$fields.file1name.value}<input type=\'hidden\' name=\'old_file1name\' value=\'{$fields.file1name.value}\'/><input type=\'hidden\' name=\'old_file1id\' value=\'{$fields.file1id.value}\'/>
										<img style="vertical-align:middle;margin-left:5px;float: right;" src="themes/SpiceTheme/images/delete.png" onclick=\'deleteAttachmentByIndex("1")\'>
										</div>',
                ),
                array(),
            ),
            array(
                array('name' => 'file2name',
                    'customCode' => '<span id=\'new_file2\' style=\'display:{if !empty($fields.file2name.value)}none{/if}\'>
										<input name="file2" tabindex="3" type="file" size="60"/>
										</span>
										<div style="border: 1px dotted #999; width: calc(100% - 10px); padding: 5px; margin: 5px 0px; display:{if empty($fields.file2name.value)}none{/if};" id=\'old_file2\'>
										<input type=\'hidden\' id=\'deletefile2\' name=\'deletefile2\' value=\'0\'>
										{$fields.file2name.value}<input type=\'hidden\' name=\'old_file2name\' value=\'{$fields.file2name.value}\'/><input type=\'hidden\' name=\'old_file2id\' value=\'{$fields.file2id.value}\'/>
										<img style="vertical-align:middle;margin-left:5px;float: right;" src="themes/SpiceTheme/images/delete.png" onclick=\'deleteAttachmentByIndex("2")\'>
										</div>',
                ),
                array(),
            ),
            array(
                array('name' => 'file3name',
                    'customCode' => '<span id=\'new_file3\' style=\'display:{if !empty($fields.file3name.value)}none{/if}\'>
										<input name="file3" tabindex="3" type="file" size="60"/>
										</span>
										<div style="border: 1px dotted #999; width: calc(100% - 10px); padding: 5px; margin: 5px 0px; display:{if empty($fields.file3name.value)}none{/if};" id=\'old_file3\'>
										<input type=\'hidden\' id=\'deletefile3\' name=\'deletefile3\' value=\'0\'>
										{$fields.file3name.value}<input type=\'hidden\' name=\'old_file2name\' value=\'{$fields.file2name.value}\'/><input type=\'hidden\' name=\'old_file3id\' value=\'{$fields.file3id.value}\'/>
										<img style="vertical-align:middle;margin-left:5px;float: right;" src="themes/SpiceTheme/images/delete.png" onclick=\'deleteAttachmentByIndex("3")\'>
										</div>',
                ),
                array(),
            ),
        ),
        'LBL_PANEL_ASSIGNMENT' => array(
            array(
                array('name' => 'assigned_user_name'),
                null
            )
        )
    )
);
