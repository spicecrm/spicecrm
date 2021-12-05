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

if(empty(SpiceDictionaryHandler::getInstance()->dictionary['User'])){
	include('modules/Users/vardefs.php');
}
SpiceDictionaryHandler::getInstance()->dictionary['Employee'] = SpiceDictionaryHandler::getInstance()->dictionary['User'];
//users of employees modules are not allowed to change the employee/user status.
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['status']['massupdate']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['is_admin']['massupdate']=false;
//begin bug 48033
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['UserType']['massupdate']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['messenger_type']['massupdate']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['email_link_type']['massupdate']=false;
//end bug 48033
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['email1']['required']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['email_addresses']['required']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['email_addresses_primary']['required']=false;
// bugs 47553 & 49716
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['status']['studio']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['status']['required']=false;
SpiceDictionaryHandler::getInstance()->dictionary['Employee']['fields']['bonuscards'] = [
	'name' => 'bonuscards',
	'type' => 'link',
	'relationship' => 'bonuscards_employees',
	'module' => 'BonusCards',
	'bean_name' => 'BonusCard',
	'source' => 'non-db',
	'vname' => 'LBL_BONUSCARDS',
];
