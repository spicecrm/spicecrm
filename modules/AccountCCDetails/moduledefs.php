<?php
/**
 * introduced in version 20180100
 * this module is related to CompanyCodes.
 * When companycodes represent something like a sales organisations,
 * AccountCCDetails represent something like terms and conditions
 * for an account for the related sales organisation
 */
$moduleList[] = 'AccountCCDetails';
$beanList['AccountCCDetails'] = 'AccountCCDetail';
$beanFiles['AccountCCDetail'] = 'modules/AccountCCDetails/AccountCCDetail.php';
