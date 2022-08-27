/**
 * global variables
 * basic settings for gulp tasks
 */

// ----------- Access spicecrmreference.spicecrm.io ------------- //
global.reference = 'https://spicecrmreference.spicecrm.io/api';
//global.reference = 'http://localhost/_projects/spicecrm_be_factory';

// ----------- build information ------------- //
global.build = {
    releasenumber: '2022.02.001',
    buildnumber: ''
};
// ----------- spiceconfigurations for spiceinstaller ------------- //
// spiceconfigurations
global.spiceconfigurations = {
    folder: 'spiceconfigurations',
    filename: 'spiceconfigurations.json',
    system: {
        php: {
            min: "7.2",
            max: "8.0"
        },
        elasticsearch: {
            min: "7.6.2",
            max: "7.11.0"
        },
        mysql: {
            min: "5.7",
            max: "8.0"
        },
        oci: {
            min: "5.7?",
            max: "8.0?"
        },
        mssql: {
            min: "5.7?",
            max: "8.0?"
        }
    }
};


// ----------- release packaging ------------- //
global.releaseSettings = [];
global.releasePaths = {};
global.releasePaths.excludeFilesCommonBE = [
    //'!.gitignore',
    // '!.htaccess',
    '!*.idea',
    '!*.bak',
    '!*.log',
    '!*.jar',
    '!*.zip',
    '!*.zjn.*',
    '!composer.json',
    '!composer.lock',
    '!config.php',
    '!config_override.php',
    '!cron.bat',
    '!Gruntfile.js',
    '!gulpfile_globals.js',
    '!gulpfile_release.js',
    '!gulpfile_spiceconfigurations.js',
    '!gulpfile_upgradecustomer.js',
    '!manifest.php',
    '!package.json',
    '!package-lock.json',
    '!files.md5'
];

global.releasePaths.includeFilesCommonBE = ['*.*','LICENSE', '.gitignore', '.htaccess','.gitignore',
    'data/**/*.*',
    'include/**/*.*',
    'KREST/**/*.*',
    '!KREST/**/*.idea',
    '!KREST/**/*.zip',
    '!KREST/**/dev.php',
    '!KREST/**/logview.php',
    '!KREST/packaging/**',
    '!spiceconfigurations/**',
    '!tests/**',
    'language/**/*.*',
    'metadata/**/*.*',
    'modules/**/*.*',
    'service/**/*.*',
    'soap/**/*.*',
    'vendor/**/*.*'

];


global.releasePaths.excludeFilesCoreBE = ['' +
    '!include/Alcatel/**',
    '!include/CleverReach/**',
    '!include/DialogMail/**',
    '!include/Evalanche/**',
    '!include/Five9VOIP/**',
    '!include/MailChimp/**',
    '!include/mjml/**',
    '!include/SpiceBCardReader/**',
    '!include/SpiceCRMExchange/**',
    '!include/SpiceCRMGsuite/**',
    '!include/SpiceDuns/**.php',
    '!include/SpiceSocket/**',
    '!include/StarFaceVOIP/**',
    '!include/SugarObjects/implements/spiceaclterritories/**/*.*',
    '!include/SystemDictionary/**',
    '!include/VoiceOverIP/**',
    '!metadata/kreport*.php',
    '!metadata/*potentials*.php',
    '!metadata/knowledgedocuments_knowledgedocumentsMetaData.php',
    '!metadata/priceConditionsMetaData.php',
    '!metadata/sales*.php',
    '!metadata/sapidoc*.php',
    '!metadata/spiceaclterr*.php',
    '!metadata/scrumuserstories_systemdeploymentcrsMetaData.php',
    '!metadata/serviceorders_accountsMetaData.php',
    '!metadata/serviceorders_serviceequipmentsMetaData.php',
    '!metadata/serviceequipmentsMetaData.php',
    '!metadata/sysevalanchelog.metadata.php',
    '!metadata/sysexchange.fieldmapping.metadata.php',
    '!metadata/sysexchange.inboundrecords.metadata.php',
    '!metadata/sysexchange.outboundrecords.metadata.php',
    '!metadata/sysexchange.userconfig.metadata.php',
    '!metadata/sysgroupwarebeansyncqueue.metadata.php',
    '!metadata/systemdeploymentreleases_usersMetaData.php',
    '!metadata/system_shorturls.php',
    '!metadata/starface.metadata.php',
    '!metadata/sysexchange*.php',
    '!metadata/systemdeployment.metadata.php',
    '!metadata/system_exchange_user_config.php',
    '!metadata/voip.metadata.php',
    '!modules/BonusCards/**',
    '!modules/BonusPrograms/**',
    '!modules/ContactCCDetails/**',
    '!modules/ContactsOnlineProfiles/**',
    '!modules/GoogleCalendar/api/**',
    '!modules/GoogleCalendar/GoogleCalendar.php',
    '!modules/GoogleCalendar/GoogleCalendarEvent.php',
    '!modules/GoogleCalendar/GoogleCalendarRestHandler.php',
    '!modules/GoogleCalendar/GSuiteUserConfig.php',
    '!modules/GoogleLanguage/**',
    '!modules/GoogleTasks/**',
    '!modules/GoogleOAuth/**',
    '!modules/Inquiries/**',
    '!modules/KnowledgeBooks/**/*',
    '!modules/KnowledgeDocuments/**/*',
    '!modules/KnowledgeDocumentAccessLogs/**/*',
    '!modules/KReports/**',
    '!modules/LandingPages/**',
    '!modules/Mailboxes/Handlers/A1Handler.php',
    '!modules/Mailboxes/Handlers/Ews*.php',
    '!modules/Mailboxes/Handlers/Outlook*.php',
    '!modules/Mailboxes/Handlers/GSuite*.php',
    '!modules/Mailboxes/Handlers/GMail*.php',
    '!modules/Mailboxes/Handlers/MailgunHandler.php',
    '!modules/Mailboxes/Handlers/Personal*.php',
    '!modules/Mailboxes/Handlers/SendgridHandler.php',
    '!modules/Mailboxes/Handlers/TwillioHandler.php',
    '!modules/Mailboxes/api/controllers/EwsController.php',
    '!modules/Mailboxes/api/controllers/GmailController.php',
    '!modules/Mailboxes/api/controllers/Mailgun*.php',
    '!modules/Mailboxes/api/controllers/SendgridController.php',
    '!modules/Mailboxes/api/controllers/TwilioController.php',
    '!modules/Mailboxes/api/extensions/gmail.php',
    '!modules/Mailboxes/api/extensions/ews.php',
    '!modules/Mailboxes/api/extensions/mailgun*.php',
    '!modules/Mailboxes/api/extensions/sendgrid.php',
    '!modules/Mailboxes/api/extensions/twilio.php',
    '!modules/OrgUnits/**',
    '!modules/Potentials/**',
    '!modules/Price*/**',
    '!modules/Product*/**',
    '!modules/Question*/**',
    '!modules/Travel*/**',
    '!modules/Schedulers/ScheduledTasks/**',
    '!modules/ServiceCal*/**',
    '!modules/ServiceEquipments/**',
    '!modules/ServiceF*/**',
    '!modules/ServiceLocations/**',
    '!modules/ServiceOrder*/**',
    '!modules/ServiceQueues/**',
    '!modules/ServiceCalls/**',
    '!modules/ServiceTickets/api/**',
    '!modules/ServiceTickets/mailboxprocessors/**',
    '!modules/ServiceTicketNotes/**',
    '!modules/ServiceTicketProlongations/**',
    '!modules/ServiceTicketSLA*/**',
    '!modules/ServiceTicketStages/**',
    '!modules/Sales*/**',
    '!modules/SAPIdocs/**',
    '!modules/ScrumEpics/**',
    '!modules/ScrumThemes/**',
    '!modules/ScrumUserStories/**',
    '!modules/Shops/**',
    '!modules/SpiceACLTerritories/**',
    '!modules/SystemDeploymentC*/**',
    '!modules/SystemDeploymentPackages/api/**',
    '!modules/SystemDeploymentPackages/SystemDeploymentPackage.php',
    '!modules/SystemDeploymentPackages/vardefs.php',
    '!modules/SystemDeploymentR*/**',
    '!modules/SystemDeploymentS*/**',
    '!modules/SystemHolidayCalendar*/**',
    '!modules/SystemTenants/**',
    '!modules/TestUnits/**',
    '!modules/TextMessage*/**',
    '!modules/Travel*/**',
    '!modules/TRDocumentation/**',
    '!modules/TRExchangeConnector/**',
    '!modules/UOM*/**',
    '!modules/Workflow*/**'
];


global.releasePaths.kreporterCoreBE =[
    'metadata/kreport.categories.metadata.php',
    'modules/KReports/*.*',
    'modules/KReports/api/controllers/KReportsController.php',
    'modules/KReports/api/controllers/KReportsCoreController.php',
    'modules/KReports/api/controllers/KReportsPluginsController.php',
    'modules/KReports/api/extensions/kreports.php',
    'modules/KReports/api/extensions/kreportscore.php',
    'modules/KReports/api/extensions/kreportsplugins.php',
    'modules/KReports/config/**/*.*',
    'modules/KReports/Plugins/Integration/kcsvexport/**/*.*',
    'modules/KReports/Plugins/Integration/ktargetlistexport_basic/**/*.*',
    'modules/KReports/Plugins/Presentation/standardview/**/*.*',
    'modules/KReports/Plugins/prototypes/**/*.*',
    'modules/KReports/Plugins/Visualization/googlecharts/**/*.*',
    '!modules/KReports/plugins.dictionary.empty',
    '!modules/KReports/plugins.dictionary.extended',
    '!modules/KReports/api/extensions/kreporter.php',
];
global.releasePaths.kreporterMoreBE =[
    'modules/KReports/*.*',
    '!modules/KReports/api/extensions/kreporter.php',
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