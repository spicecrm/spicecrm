/**
 * global variables
 * basic settings for gulp tasks
 * this file will be included in backend gulp jobs
 * keep it here
 */

// ----------- build information ------------- //
global.build = {
    releaseNumber: '2023.01.001',
    buildNumber: ''
};


global.customReference = '';
// ----------- exclude files ------------- //
global.releasePathsFE = {};
global.releasePathsFE.excludeAppCoreFE = [
    '!./app/portalcomponents/**',
    '!./app/modules/aclterritories/**',
    '!./app/modules/alcatel/**',
    '!./app/modules/asterisk/**',
    '!./app/modules/catalogs/**',
    '!./app/modules/deployment/**',
    '!./app/modules/five9/**',
    '!./app/modules/knowledge/**',
    '!./app/modules/potentials/**/*',
    '!./app/modules/priceconditions/**',
    '!./app/modules/products/**',
    '!./app/modules/projects/**',
    '!./app/modules/questionnaires/**',
    '!./app/modules/reportsdesignermore/**/*',
    '!./app/modules/reportsmore/**/*',
    '!./app/modules/salesdocs/**',
    '!./app/modules/salesplanning/**',
    '!./app/modules/sap/**',
    '!./app/modules/sapidocs/**',
    '!./app/modules/servicecomponents/**',
    '!./app/modules/starface/**',
    '!./app/modules/systemtenants/**',
    '!./app/modules/telephony/**',
    '!./app/modules/telesales/**',
    '!./app/modules/workflow/**',
    '!./app/include/cleverreach/**',
    '!./app/include/dialogmail/**',
    '!./app/include/duns/**',
    '!./app/include/evalanche/**',
    '!./app/include/exchange/**',
    '!./app/include/gsuite/**',
    '!./app/include/gsuitesettings/**',
    '!./app/include/mailchimp/**',
    '!./app/include/outlook/**',
    '!./app/include/pipl/**',
    '!./app/include/quilleditor/**',
//    '!./app/include/groupware/**',
    '!./app/include/spicebcardreader/**/*'
];
global.releasePathsFE.excludeSrcCoreFE = [
    '!./src/portalcomponents/**/*',
    '!./src/workbench/**/*',
    '!./src/modules/aclterritories/**/*',
    '!./src/modules/alcatel/**/*',
    '!./src/modules/asterisk/**/*',
    '!./src/modules/catalogs/**/*',
    '!./src/modules/deployment/**/*',
    '!./src/modules/five9/**/*',
    '!./src/modules/knowledge/**/*',
    '!./src/modules/potentials/**/*',
    '!./src/modules/priceconditions/**/*',
    '!./src/modules/products/**/*',
    '!./src/modules/projects/**/*',
    '!./src/modules/questionnaires/**/*',
    '!./src/modules/reportsdesignermore/**/*',
    '!./src/modules/reportsmore/**/*',
    '!./src/modules/reportsdesignermore/**/*',
    '!./src/modules/salesdocs/**/*',
    '!./src/modules/salesplanning/**',
    '!./src/modules/sap/**',
    '!./src/modules/sapidocs/**',
    '!./src/modules/servicecomponents/**/*',
    '!./src/modules/starface/**/*',
    '!./src/modules/systemtenants/**/*',
    '!./src/modules/telephony/**/*',
    '!./src/modules/telesales/**/*',
    '!./src/modules/workflow/**/*',
    '!./src/include/cleverreach/**/*',
    '!./src/include/dialogmail/**/*',
    '!./src/include/duns/**/*',
    '!./src/include/evalanche/**/*',
    '!./src/include/exchange/**/*',
    '!./src/include/gsuite/**/*',
    '!./src/include/gsuitesettings/**/*',
    '!./src/include/mailchimp/**/*',
    '!./src/include/pipl/**/*',
//    '!./src/include/groupware/**/*',
    '!./src/include/outlook/**/*',
    '!./src/include/spicebcardreader/**/*'
];


/**
 * global pattern / replacement definitions
 *
 */
global.spiceHeaderPattern = new RegExp("/\\*\\*\\*\\*\\* SPICE-HEADER-SPACEHOLDER \\*\\*\\*\\\*\\*/", 'g');
global.spiceHeader = '/*********************************************************************************\r\n' +
    '* This file is part of SpiceCRM. SpiceCRM is an enhancement of SugarCRM Community Edition\r\n' +
    '* and is developed by aac services k.s.. All rights are (c) 2016 by aac services k.s.\r\n' +
    '* You can contact us at info@spicecrm.io\r\n' +
    '* \r\n' +
    '* SpiceCRM is free software: you can redistribute it and/or modify\r\n' +
    '* it under the terms of the GNU General Public License as published by\r\n' +
    '* the Free Software Foundation, either version 3 of the License, or\r\n' +
    '* (at your option) any later version\r\n' +
    '* \r\n' +
    '* The interactive user interfaces in modified source and object code versions\r\n' +
    '* of this program must display Appropriate Legal Notices, as required under\r\n' +
    '* Section 5 of the GNU Affero General Public License version 3.\r\n' +
    '* \r\n' +
    '* In accordance with Section 7(b) of the GNU Affero General Public License version 3,\r\n' +
    '* these Appropriate Legal Notices must retain the display of the "Powered by\r\n' +
    '* SugarCRM" logo. If the display of the logo is not reasonably feasible for\r\n' +
    '* technical reasons, the Appropriate Legal Notices must display the words\r\n' +
    '* "Powered by SugarCRM".\r\n' +
    '* \r\n' +
    '* SpiceCRM is distributed in the hope that it will be useful,\r\n' +
    '* but WITHOUT ANY WARRANTY; without even the implied warranty of\r\n' +
    '* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\r\n' +
    '* GNU General Public License for more details.\r\n' +
    '* You should have received a copy of the GNU General Public License\r\n' +
    '* along with this program.  If not, see <http://www.gnu.org/licenses/>.\r\n' +
    '********************************************************************************/';
global.spiceSugarHeaderPattern = new RegExp("/\\*\\*\\*\\*\\* SPICE-SUGAR-HEADER-SPACEHOLDER \\*\\*\\*\\\*\\*/", 'g');
global.spiceSugarHeader = '/*********************************************************************************\r\n' +
    '* SugarCRM Community Edition is a customer relationship management program developed by\r\n' +
    '* SugarCRM, Inc. Copyright (C) 2004-2013 SugarCRM Inc.\r\n' +
    '* \r\n' +
    '* This program is free software; you can redistribute it and/or modify it under\r\n' +
    '* the terms of the GNU Affero General Public License version 3 as published by the\r\n' +
    '* Free Software Foundation with the addition of the following permission added\r\n' +
    '* to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK\r\n' +
    '* IN WHICH THE COPYRIGHT IS OWNED BY SUGARCRM, SUGARCRM DISCLAIMS THE WARRANTY\r\n' +
    '* OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.\r\n' +
    '* \r\n' +
    '* This program is distributed in the hope that it will be useful, but WITHOUT\r\n' +
    '* ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS\r\n' +
    '* FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more\r\n' +
    '* details.\r\n' +
    '* \r\n' +
    '* You should have received a copy of the GNU Affero General Public License along with\r\n' +
    '* this program; if not, see http://www.gnu.org/licenses or write to the Free\r\n' +
    '* Software Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA\r\n' +
    '* 02110-1301 USA.\r\n' +
    '* \r\n' +
    '* You can contact SugarCRM, Inc. headquarters at 10050 North Wolfe Road,\r\n' +
    '* SW2-130, Cupertino, CA 95014, USA. or at email address contact@sugarcrm.com.\r\n' +
    '* \r\n' +
    '* The interactive user interfaces in modified source and object code versions\r\n' +
    '* of this program must display Appropriate Legal Notices, as required under\r\n' +
    '* Section 5 of the GNU Affero General Public License version 3.\r\n' +
    '* \r\n' +
    '* In accordance with Section 7(b) of the GNU Affero General Public License version 3,\r\n' +
    '* these Appropriate Legal Notices must retain the display of the "Powered by\r\n' +
    '* SugarCRM" logo. If the display of the logo is not reasonably feasible for\r\n' +
    '* technical reasons, the Appropriate Legal Notices must display the words\r\n' +
    '* "Powered by SugarCRM".\r\n' +
    '********************************************************************************/';
