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

if(!defined('sugarEntry') || !sugarEntry) die('Not A Valid Entry Point');

global $mod_strings, $app_strings, $sugar_config;
$module_menu = Array();
if(ACLController::checkAccess('CompetitorAssessments','edit',true)){
    $module_menu[]=	Array("index.php?module=CompetitorAssessments&action=EditView&return_module=CompetitorAssessments&return_action=DetailView", $mod_strings['LNK_NEW_COMPETITORASSESSMENT'],"CreateCompetitorAssessments");
}
if(ACLController::checkAccess('CompetitorAssessments','list',true)){
    $module_menu[]=	Array("index.php?module=CompetitorAssessments&action=index&return_module=CompetitorAssessments&return_action=DetailView", $mod_strings['LNK_COMPETITORASSESSMENTS_LIST'],"CompetitorAssessments");
}
if(ACLController::checkAccess('CompetitorAssessments','import',true)){
    $module_menu[]=  Array("index.php?module=Import&action=Step1&import_module=CompetitorAssessments&return_module=CompetitorAssessments&return_action=index", $mod_strings['LNK_IMPORT_COMPETITORASSESSMENTS'],"Import");
}

