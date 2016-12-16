<?php

$viewdefs['KReleasePackages']['DetailView'] = array(
    'templateMeta' => array(
        'useTabs' => false,
        'maxColumns' => '2',
        'widths' => array(
            array('label' => '10', 'field' => '30'),
            array('label' => '10', 'field' => '30')
        ),
        'form' => array(
            'buttons' => array(
                'EDIT',
                'DUPLICATE',
                'DELETE',
                array('customCode' => '<input id="PRINT_HEADER" class="button primary" type="button" value="Print" name="button" onclick="void window.open(\'index.php?action=DetailView&module=KReleasePackages&record={$fields.id.value}&print=true\',\'printwin\',\'menubar=1,status=0,resizable=1,scrollbars=1,toolbar=0,location=1\')" title="{$APP.LBL_PRINT_BUTTON_TITLE}">'),
                array('customCode' => '<input id="CHANGE_HEADER" class="button primary" type="button" value="ChangeLog" name="button" onclick="void window.open(\'index.php?action=getfilechanges&module=KReleasePackages&to_pdf=true&record={$fields.id.value}&print=true\',\'printwin\',\'menubar=1,status=0,resizable=1,scrollbars=1,toolbar=0,location=1\')" title="{$APP.LBL_CHANGES_BUTTON_TITLE}">'),
                array('customCode' => '<input type="button" value="Package" id="package_button" name="Package" onclick="var _form = document.getElementById(\'formDetailView\'); _form.return_module.value=\'KReleasePackages\'; _form.return_action.value=\'DetailView\'; _form.return_id.value=\'{$fields.id.value}\'; _form.action.value=\'createPackage\';SUGAR.ajaxUI.submitForm(_form);" class="button primary" title="Package">'),
                array('customCode' => '<input type="button" value="Release" id="release_button" name="Release" onclick="var _form = document.getElementById(\'formDetailView\'); _form.return_module.value=\'KReleasePackages\'; _form.return_action.value=\'DetailView\'; _form.return_id.value=\'{$fields.id.value}\'; _form.action.value=\'releasePackage\';SUGAR.ajaxUI.submitForm(_form);" class="button primary" title="Release">'),
            ),
        ),
    ),
    'panels' => array(
        'lbl_kreleasepackages_main' => array(
            array(
                'name',
                'rpstatus'
            ),
            array(
                'release_date',
                'rptype'
            ),
            array(
                'release_version',
                'required_release_regex'
            ),
            array(
                'set_version',
                'conflict_with'
            ),
            array('repairs', 'repair_modules')
        ),
        'lbl_admin_panel' => array(
            array(
                array(
                    'name' => 'date_entered',
                    'customCode' => '{$fields.date_entered.value} {$APP.LBL_BY} {$fields.created_by_name.value}',
                    'label' => 'LBL_DATE_ENTERED',
                ),
                array(
                    'name' => 'date_modified',
                    'customCode' => '{$fields.date_modified.value} {$APP.LBL_BY} {$fields.modified_by_name.value}',
                    'label' => 'LBL_DATE_MODIFIED',
                )
            )
        )
    )
);
