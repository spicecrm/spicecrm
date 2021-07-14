/**
 * This file enables packaging SpiceCRM frontend
 * @type {Gulp|{}}
 */
var gulp = require('gulp');
//BEGIN SPICECRM specific plugins
var embedComponents = require('./gulp-plugins/gulp-spicecrm-embed-components');
var embedTemplates = require('./gulp-plugins/gulp-spicecrm-embed-templates');
var refactorImports = require('./gulp-plugins/gulp-spicecrm-refactor-imports');
//END
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var header = require('gulp-header');
var request = require('request');
var fs = require('fs');
var uglify = require('gulp-uglify');
var colors = require('colors/safe');
var delFiles = require('del');
var delEmpty = require('delete-empty');
var removeEmptyLines = require('gulp-remove-empty-lines');
var moment = require('moment');
var buildDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
var tap = require('gulp-tap');
var swig = require('gulp-swig');

require('./gulpfile_globals.js');

/**
 * prepare header texts
 * These lines are protected and shall not be modified
 * A packaged SpiceCRM frontend shall contain copyright notice to aac services k.s.
 */
var releaseNumber = global.build.releaseNumber;
var buildNumber = releaseNumber + '.' + Date.now();
var aacservices = '© 2015 - ' + moment(new Date()).format('YYYY') + ' aac services k.s. All rights reserved.';
var headerText = '/** \n';
headerText += ' * ' + aacservices + '\n';
headerText += ' * release: ' + releaseNumber + '\n';
headerText += ' * date: ' + buildDate + '\n';
headerText += ' * build: ' + buildNumber + '\n';
headerText += ' **/\n';


/**
 * add custom build modules as an array. The value should reflect the value that is in field path in table sysuicustommodulerepository
 *
 * @type {Array}
 */
var customBuildModules = [
    /*{
        path: 'app/mycomponents/my.module'
    }*/
];

// load any custom entries
// Check if the file exists in the current directory.
var _customGulpfile = './src/custom/gulpfile_custom.gulp';
try {
    fs.accessSync(_customGulpfile, fs.constants.F_OK); //always use try/catch syntax with accessSync
    require(_customGulpfile);
    console.log('custom entries FOUND. OK');
}
catch (err){
    //nothing to do since it's not an error. File just does not exist
    console.log('NO custom entries found. OK');
}


/**
 * prepare cache buster
 * build number (release number + timestamp) will be added to file includes to force their reload.
 * example systemjs.config.js?v=2020.02.001.1589457891649
 */
gulp.task('js:build:subtask:bustcache', function(done) {
    // settings
    var swigopts = {
        load_json: true,
        // json_path: './data/',
        defaults: { cache: false},
        data: {
            buildNumber: buildNumber,
            aacservices: aacservices,
            version: 'version ' + buildNumber,
            app: 'app'
        }
    };

    // parse for html files
    gulp.src(['./assets/index.html', './assets/copyright.html', './assets/outlook/outlook.html', './assets/outlook/outlookcrm.html'])
        .pipe(swig(swigopts))
        .pipe(gulp.dest('./'));

    // define output .js for JS files
    swigopts.ext = '.js'
    gulp.src(['./assets/systemjs.config.js', './assets/outlook/outlook.config.js'])
        .pipe(swig(swigopts))
        .pipe(gulp.dest('./'));

    done(); //!important since gulp4
});

/**
 * delete dist folder
 */
gulp.task('js:build:subtask:deletedist', function (done) {
    //delete dist folder synchronously!
    _distSource = ['./dist'];
    delFiles.sync(_distSource, {force: true});
    done();
});

/**
 * do the build
 */
gulp.task('js:build:subtask:dobuild', function(done){
    gulp.src([
        'src/services/interfaces.service.ts',
        'src/services/logger.service.ts',
        'src/services/mathexpressioncompiler.ts',
        'src/services/cookie.service.ts',
        'src/services/broadcast.service.ts',
        'src/services/telephony.service.ts',
        'src/services/session.service.ts',
        'src/services/footer.service.ts',
        'src/services/configuration.service.ts',
        'src/services/layout.service.ts',
        'src/services/metadata.service.ts',
        'src/services/language.service.ts',
        'src/services/modelutilities.service.ts',
        'src/services/toast.service.ts',
        'src/services/modalwindow.service.ts',
        'src/services/modal.service.ts',
        'src/services/helper.service.ts',
        'src/services/apiloader.ts',
        'src/services/libloader.service.ts',
        'src/services/backend.service.ts',
        'src/services/recent.service.ts',
        'src/services/userpreferences.service.ts',
        'src/services/territories.service.ts',
        'src/services/favorite.service.ts',
        'src/services/reminder.service.ts',
        'src/services/currency.service.ts',
        'src/services/loader.service.ts',
        'src/services/login.service.ts',
        'src/services/dockedcomposer.service.ts',
        'src/services/fts.service.ts',
        'src/services/socket.service.ts',
        'src/services/navigation.service.ts',
        'src/services/navigationtab.service.ts',
        'src/services/model.service.ts',
        'src/services/mediafiles.service.ts',
        'src/services/modelattachments.service.ts',
        'src/services/modellist.service.ts',
        'src/services/popup.service.ts',
        'src/services/view.service.ts',
        'src/services/relatedmodels.service.ts',
        'src/services/activitiytimeline.service.ts',
        'src/services/fielderrorgrouping.service.ts',
        'src/services/notification.service.ts',
        'src/services/assistant.service.ts',
        'src/services/subscription.service.ts'
    ])
        .pipe(concat('services.ts'))
        .pipe(replace(/import[a-zA-Z0-9\-\s{}'",.\/\n\r@]*;/g, ''))
        .pipe(replace(/declare[a-zA-Z0-9\-\s{}'",.:\/\n\r@]*;/g, ''))
        .pipe(header(fs.readFileSync('src/services/buildheader.file', 'utf8')))
        //.pipe(removeEmptyLines()) => removed. Generates occasionally errors in files
        .pipe(header(headerText))
        .pipe(gulp.dest('./dist/services'));

    request(global.reference + '/config/repositorymodules', function (error, response, body) {
        var referencerepositorymodules = JSON.parse(body);
        console.log('retrieved ' + referencerepositorymodules.length + ' modules');
        var repositorymodules = [];

        // add custom entries
        if(global.customBuildModules){
            customBuildModules = global.customBuildModules;
        }

        // join with the custom modules if there are any
        if(customBuildModules.length > 0){
            repositorymodules = referencerepositorymodules.concat(customBuildModules);
        }
        else
            repositorymodules = referencerepositorymodules;

        for (var module of repositorymodules) {
            module.absolute_path = module.path;
            var module_path_elements = module.absolute_path.split('/');
            // remove the last and first element of the array
            // the app reference and the module name
            module_path_elements.splice(0, 1);
            module.file_name = module_path_elements[module_path_elements.length-1];
            module_path_elements.pop();
            module.directory = module_path_elements.join('/');

            module.relative_path = '../';
            for(i = 1; i < module_path_elements.length; i++)
            {
                module.relative_path += '../';
            }
        }

        for(var module of repositorymodules)
        {
            //console.log(module);
            gulp.src('src/' + module.directory + '/*.ts')
                .pipe(embedComponents({basePath: __dirname + '/src/' + module.directory}))
                .pipe(embedTemplates({basePath: __dirname}))
                .pipe(refactorImports({}, module, referencerepositorymodules))
                .pipe(replace(/\/\*build_date\*\//g, buildDate))
                .pipe(removeEmptyLines())
                .pipe(header(headerText))
                .pipe(gulp.dest('./dist/' + module.directory))
            //.on("end", () => {console.log(module)})
            ;
        }
    });



    gulp.src('src/*.ts')
        .pipe(replace(/["'./]*services.*;/g, '\'./services/services\''))
        .pipe(replace(/\/\*build_date\*\//g, buildDate))
        .pipe(replace(/["'./]*services.*;/g, '\'./services/services\''))
        .pipe(replace('// enableProdMode', 'enableProdMode'))
        .pipe(replace('/components/globallogin', '/globalcomponents'))
        .pipe(replace('/components/globalheader', '/globalcomponents'))
        .pipe(replace('/components/globalfooter', '/globalcomponents'))
        .pipe(replace('/systemcomponents/components/systemdynamicrouteinterceptor', '/systemcomponents/systemcomponents'))
        .pipe(replace('/systemcomponents/components/systeminstallercomponent', '/systemcomponents/systemcomponents'))
        .pipe(removeEmptyLines())
        .pipe(header(headerText))
        .pipe(gulp.dest('./dist'));

    done(); //!important since gulp4
});


/**
 * run build:
 * -> delete dist folder
 * -> parse templates for cachebuster
 * -> do the build itself
 */
gulp.task('js:build', gulp.series('js:build:subtask:deletedist', 'js:build:subtask:bustcache', 'js:build:subtask:dobuild'), function(done) {
    done(); //!important since gulp4

});


//var repositoryitems = ['AccountCCDetails', 'AccountHierarchy', 'AccountsContactsManager', 'AccountsContactsManagerDetails', 'AccountsKPIsOverview', 'ACLObjectsManager', 'ACLObjectsManagerAddObjectModal', 'ACLObjectsManagerObjectDetails', 'ACLObjectsManagerObjectFields', 'ACLObjectsManagerObjectFieldvalues', 'ACLObjectsManagerObjectTerritories', 'ACLObjectsManagerObjectTerritoriesModal', 'ACLProfilesManager', 'ACLProfilesManagerAddObjectModal', 'ACLProfilesManagerAddProfileModal', 'ACLTerritorriesElementmanager', 'ACLTerritorriesElementmanagerElementsAddModal', 'ACLTerritorriesElementmanagerElementValuesAddModal', 'ACLTerritorriesManager', 'ACLTerritorriesManagerTerritoryAddModal', 'ACLTerritorriesModulesmanagerModulesAddModal', 'ACLTerritorriesModulessmanager', 'ACLTerritorriesTypesmanager', 'ACLTerritorriesTypesmanagerTypeelementsAddModal', 'ACLTypesManager', 'ACLTypesManagerTypesAddAction', 'AddComponentsModule', 'AdminComponentsModule', 'AdministrationConfigEditor', 'AdministrationConfigurator', 'AdministrationDictRepair', 'AdministrationFTSManager', 'AdministrationFTSStats', 'AdministrationMain', 'AdministrationMenuRouteItem', 'AdministrationQuotaManager', 'AdministrationSysTrashcanManager', 'AdministrationSysTrashcanRecover', 'AsteriskToolbarIndicator', 'Calendar', 'CalendarAddCalendar', 'CalendarEventPopover', 'CalendarMorePopover', 'CalendarSheetDayEvent', 'CalendarSheetMonthEvent', 'CalendarSheetWeekEvent', 'CampaignSendMailButton', 'CampaignSendTestMailButton', 'CampaignTaskActivateButton', 'ComponentConfigManager', 'ComponentsetManager', 'ComponentsetManagerAddDialog', 'ComponentsetManagerEditDialog', 'ConfigCleaner', 'ContactCCDetails', 'ContactNewsletters', 'ContactNewslettersButton', 'ContactPortalButton', 'ContactPortalDetails', 'CRMLogViewer', 'CRMLogViewerModal', 'DashboardAddElement', 'DashboardContainer', 'DashboardGenericDashlet', 'DashboardRemindersDashlet', 'DashboardView', 'DashboardWeatherDashlet', 'DashletGenerator', 'DeploymentCRActive', 'DeploymentCRDBEntries', 'DeploymentCRDBSQL', 'DeploymentCRSetActiveButton', 'DhtmlxDiagram', 'DictionaryManager', 'DomainManager', 'EmailsPopoverBody', 'EmailToLeadButton', 'EmailToLeadModal', 'EmailToObjectButton', 'EmailToObjectModal', 'fieldAddress', 'fieldBarcode', 'fieldBase64', 'fieldBlank', 'fieldBool', 'fieldColorEnum', 'fieldCompanies', 'fieldCurrencies', 'fieldCurrency', 'fieldDate', 'fieldDateTime', 'fieldDateTimeDuration', 'fieldDateTimeSpan', 'fieldDuration', 'fieldEmail', 'fieldEmailAddresses', 'fieldEmailRecipients', 'fieldEmailRecipientsShort', 'fieldEmailTemplates', 'fieldEmailTo', 'fieldEnum', 'fieldEnumAlternate', 'FieldEnumModulesComponent', 'fieldEnumMulti', 'FieldEnumOutputTemplates', 'fieldFile', 'fieldFloat', 'fieldFullName', 'fieldGDPR', 'fieldGeneric', 'fieldHtml', 'fieldIconPopover', 'fieldLanguage', 'fieldLookup', 'fieldMailboxes', 'fieldMailRelais', 'fieldMediaFileImage', 'fieldModelFooterPopover', 'FieldModelInfoComponent', 'fieldModelPopover', 'fieldModifiedBy', 'fieldModuleFilter', 'fieldModuleIcon', 'fieldMultienum', 'fieldNotAuthorized', 'fieldNumber', 'fieldParent', 'fieldPhone', 'fieldRating', 'fieldRelate', 'fieldRichText', 'fieldSelectTree', 'fieldServiceCategories', 'fieldServiceQueue', 'FieldsetManager', 'FieldsetManagerAddDialog', 'FieldsetManagerCopyDialog', 'FieldsetManagerEditDialog', 'FieldSignatureComponent', 'fieldTerritory', 'fieldTerritorySecondary', 'fieldText', 'fieldTime', 'fieldTitle', 'fieldTotalAmount', 'fieldUrl', 'fieldVat', 'fieldWeightedAmount', 'fieldWorklog', 'GlobalAppLauncherDialog', 'GlobalComponents', 'GlobalDockedComposer', 'GlobalDockedComposerModal', 'GlobalHeaderActionItem', 'GlobalHeaderActions', 'GlobalHeaderFavorite', 'GlobalHeaderTools', 'GlobalHeaderWorkbench', 'GlobalNavigationMenuItem', 'GlobalNavigationMenuItemNew', 'GlobalNavigationMenuItemRoute', 'GlobalNavigationMenuMore', 'GlobalObtainImportantPreferences', 'GoogleCalendarManager', 'Home', 'HomeAssistantTile', 'HomeDashboard', 'KnowledgeBrowser', 'KnowledgeBrowserDetailsContainerRight', 'KnowledgeDocumentFavorites', 'KnowledgeDocumentRelatedList', 'KnowledgeManager', 'KRESTLogViewer', 'KRESTLogViewerModal', 'LabelSelectorComponent', 'LanguageLabelManagerComponent', 'LanguageLabelModal', 'LanguageLabelReferenceConfigForm', 'LanguageLabelReferenceConfigModal', 'LeadConvert', 'LeadConvertAccount', 'LeadConvertButton', 'LeadConvertContact', 'LeadConvertOpportunity', 'LeadConvertOpportunityButton', 'LeadConvertOpportunityModal', 'LeadOpenLeadsDashlet', 'MailboxEmailToLeadButton', 'MailboxEmailToLeadModal', 'MailboxesDashlet', 'MailboxesIMAPSMTPSelectFoldersModal', 'MailboxesManager', 'MailboxesmanagerTestIMAPModal', 'MailboxesmanagerTestModal', 'MailboxManager', 'MailboxManagerAddDialog', 'MailboxManagerEmail', 'MailboxManagerHeader', 'MediaFileImage', 'MediaFilePicker', 'MediaFileUploader', 'ModuleAccounts', 'ModuleACL', 'ModuleACLTerritories', 'ModuleActivities', 'ModuleAsterisk', 'ModuleCalendar', 'ModuleCampaigns', 'ModuleConfigAddDialog', 'ModuleConfigManager', 'ModuleContacts', 'ModuleDashboard', 'ModuleDeployment', 'ModuleEmails', 'ModuleFilterBuilder', 'ModuleHome', 'ModuleKnowledge', 'ModuleLeads', 'ModuleMailboxes', 'ModuleMediaFiles', 'ModuleProducts', 'ModuleProjects', 'ModuleQuestionnaires', 'ModuleReports', 'ModuleSalesDocs', 'ModuleSpiceImports', 'ModuleTeleSales', 'ModuleUsers', 'ModuleWorkflow', 'ObjectActionAuditlogButton', 'ObjectActionAuditlogModal', 'ObjectActionBeanToMailButton', 'ObjectActionDeleteButton', 'ObjectActionDuplicateButton', 'ObjectActionEditButton', 'ObjectActionImportButton', 'ObjectActionMailModal', 'ObjectActionNewButton', 'ObjectActionNewrelatedButton', 'ObjectActionOutputBeanButton', 'ObjectActionOutputBeanModal', 'ObjectActionSaveButton', 'ObjectActionSelectButton', 'ObjectActionsetMenuContainerDelete', 'ObjectActionsetMenuContainerEdit', 'ObjectActivitiyTimeline', 'ObjectActivitiyTimelineAddCall', 'ObjectActivitiyTimelineAddContainer', 'ObjectActivitiyTimelineAddEmail', 'ObjectActivitiyTimelineAddItem', 'ObjectActivitiyTimelineAddMeeting', 'ObjectActivitiyTimelineAddNote', 'ObjectActivitiyTimelineAddTask', 'ObjectActivitiyTimelineCall', 'ObjectActivitiyTimelineEmail', 'ObjectActivitiyTimelineEvent', 'ObjectActivitiyTimelineItemContainer', 'ObjectActivitiyTimelineNote', 'ObjectActivitiyTimelineSummaryModal', 'ObjectActivitiyTimelineTask', 'ObjectAddresses', 'ObjectComponents', 'ObjectEditModal', 'ObjectEditModalWReference', 'ObjectFields', 'ObjectGDPRModal', 'ObjectImportResult', 'ObjectList', 'ObjectListView', 'ObjectListViewContainer', 'ObjectListViewFilterPanelExportTargetlist', 'ObjectListViewHeader', 'ObjectListViewSettingsAddlistModal', 'ObjectListViewSettingsDeletelistModal', 'ObjectListViewSettingsSetfieldsModal', 'ObjectMergeModal', 'ObjectModalModuleDBLookup', 'ObjectModalModuleLookup', 'ObjectModelPopover', 'ObjectModelPopoverField', 'ObjectModelPopoverRelated', 'ObjectNotes', 'ObjectOptimisticLockingModal', 'ObjectPageHeader', 'ObjectPageHeaderDetails', 'ObjectPageHeaderTagPicker', 'ObjectPopoverBodyItem', 'ObjectPopoverHeader', 'ObjectRecordAdministrationTab', 'ObjectRecordChecklist', 'ObjectRecordDetails', 'ObjectRecordDetailsTab', 'ObjectRecordFieldset', 'ObjectRecordTabbedContainer', 'ObjectRecordTabbedDetails', 'ObjectRecordView', 'ObjectRecordViewContainer', 'ObjectRecordViewDetail1', 'ObjectRecordViewDetail2and1', 'ObjectRecordViewDetailsplit', 'ObjectRelateContainer', 'ObjectRelatedDuplicates', 'ObjectRelatedlistAll', 'ObjectRelatedlistFiles', 'ObjectRelatedlistList', 'ObjectRelatedlistSequenced', 'ObjectRelatedlistTiles', 'ObjectRepositoryExport', 'ObjectRepositoryManager', 'ObjectRepositoryManagerAddModule', 'ObjectRepositoryManagerAddRepo', 'ObjectTabContainer', 'ObjectTabContainerItem', 'ObjectVerticalTabContainer', 'ObjectVerticalTabContainerItem', 'PackageLoader', 'PiplContainer', 'PiplTabHeader', 'PortalCases', 'PortalComponents', 'PortalStart', 'ProductBrowser', 'ProductGroupsContentCodeAssignments', 'ProductGroupsLongtextCodeAssignments', 'ProductManager', 'ProductTextGenerator', 'ProductVariantsAttributes', 'ProjectActivityDashlet', 'ProjectWBSHierarchy', 'QuestionnaireEvaluation', 'QuestionnaireEvaluationDefault', 'QuestionnaireInterpretationAssignment', 'QuestionnaireInterpretationCategories', 'QuestionnairePreview', 'QuestionnairePreviewButton', 'QuestionsetCategoryPool', 'QuestionsetPreview', 'QuestionsetPreviewButton', 'QuestionsetRender', 'QuestionsetTypeParameters', 'QuestionsManager', 'QuestionsManagerAddModal', 'ReferenceConfigForm', 'ReporterAnalyzer', 'ReporterCockpit', 'ReporterDetailPresentationStandard', 'ReporterDetailView', 'ReporterDetailVisualizationGooglecharts', 'ReporterDetailVisualizationHighcharts', 'ReporterFieldColor', 'ReporterFieldCurrency', 'ReporterFieldDate', 'ReporterFieldEnum', 'ReporterFieldStandard', 'ReporterIntegrationCSVexportButton', 'ReporterIntegrationExportMask', 'ReporterIntegrationPDFexportButton', 'ReporterIntegrationQueryanalyzerButton', 'ReporterIntegrationQueryanalyzerModal', 'ReporterIntegrationTargetlistexportButton', 'ReporterIntegrationTargetlistexportModal', 'ReporterIntegrationXLSexportButton', 'ReporterPresentationDashlet', 'ReporterVisualizationContainer', 'ReporterVisualizationDashlet', 'SalesDocsItemsAddProduct', 'SalesDocsItemsContainer', 'SalesDocsPrintButton', 'SelectTreeAddDialog', 'SelectTreeComponent', 'ServiceActivitiyTimelineAddServiceCall', 'ServiceCategoryManagerComponent', 'ServiceComponentsModule', 'ServiceMyQueuesTicketsDashlet', 'ServiceMyQueuesTicketsDashletItem', 'ServiceMyTicketsDashlet', 'ServiceSelectQueueButton', 'ServiceSelectQueueModal', 'ServiceTicketProlongButton', 'ServiceTicketProlongModal', 'ServiceTicketSLAIndicator', 'SignServiceOrderModalButtonComponent', 'SignServiceOrderModalComponent', 'SpeechRecognition', 'SpiceImports', 'SpiceImportsDeleteModal', 'SpiceKanban', 'SpiceKanbanTile', 'SpiceMap', 'SpiceProcess', 'SpiceTerritorriesDetail', 'SpiceTimestream', 'SpiceUIComponentsModule', 'SystemCaptureImage', 'SystemComponentContainer', 'SystemComponentMissing', 'SystemComponents', 'SystemConfirmDialog', 'SystemDynamicRouteContainer', 'SystemLoadingModal', 'SystemModalWrapper', 'SystemModelPopover', 'SystemPrompt', 'SystemRichTextSourceModal', 'SystemTinyMCEModal', 'TasksAssitantTileClose', 'TasksManager', 'TasksManagerView', 'TeleSalesCockpit', 'TeleSalesCockpitAddAttempt', 'TeleSalesCockpitAddAttemptButton', 'TeleSalesCockpitAddAttemptModal', 'TeleSalesCockpitComplete', 'TeleSalesCockpitCompleteButton', 'TeleSalesCockpitCreateLead', 'TeleSalesCockpitCreateLeadButton', 'TeleSalesCockpitLogCall', 'TeleSalesCockpitLogCallButton', 'UserAddButton', 'UserAddModal', 'UserChangePasswordButton', 'UserChangePasswordModal', 'UserPreferences', 'UserResetPasswordButton', 'UserResetPasswordModal', 'UserRoles', 'UserRolesAddModal', 'ValidationRulesManager', 'VersionControllerComponent', 'WorkbenchConfig', 'WorkbenchConfigOptionActionset', 'WorkbenchConfigOptionBoolean', 'WorkbenchConfigOptionComponentset', 'WorkbenchConfigOptionDefault', 'WorkbenchConfigOptionFieldset', 'WorkbenchConfigOptionLabel', 'WorkbenchConfigOptionModule', 'WorkbenchConfigOptionModulefilter', 'WorkbenchModule', 'WorkflowManager', 'WorkflowPanel', 'WorkflowPanelHeader', 'WorkflowTasksDashlet'];
var customrepositoryitems = [];

// add custom entries
if(global.customrepositoryitems){
    customrepositoryitems = global.customrepositoryitems;
}

// Access reference.spicecrm.io or packages.spicecrm.io ?
global.reference = global.customReference ? 'https://'+global.customReference+'.spicecrm.io' : 'https://spicecrmreference.spicecrm.io/proxy/000';

/*
 * runs uglify and uses reserved words from the reference DB
 */
gulp.task('js:uglifyfromreference', function (done) {
    request(global.reference + '/config/repositoryitems', function (error, response, body) {
        var referencerepositoryitems = JSON.parse(body);
        console.log('retrieved ' + referencerepositoryitems.length + ' repositoryitems');

        //Check if all .ts files have a .js counterpart
        //if not abort operation
        _checkTsFiles = gulp.src('dist/**/*.ts')
            .pipe(tap(function(file, t) {
                //build name of file to check (.js)
                _filetocheck = file.path.replace(/\.ts/g, '\.js');
                // Check if the file exists in the current directory.
                fs.access(_filetocheck, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error(`${_filetocheck} does not exist. Did you compile folder?'`); //throw error
                        process.exit(-1); //exit process
                    }
                });
            }));

        _uglify = gulp.src('dist/**/*.js')
            .pipe(tap(function (file, t) {
                // check if js file has a ts counterpart
                // build name of file to check (.ts)
                _filetocheck = file.path.replace(/\.js/g, '\.ts');
                // Check if the file exists in the current directory.
                fs.access(_filetocheck, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error(`${_filetocheck} does not exist'`); //throw error
                        process.exit(-1); //exit process
                    }
                });
            }))
            .pipe(uglify({mangle: {reserved: referencerepositoryitems.concat(customrepositoryitems)}}))
            .on('error', function (err) {
                console.log(colors.red('[Error]' + err.toString()));
            })
            .pipe(header(headerText))
            .pipe(gulp.dest('./app'));


    });

    done(); //!important since gulp4
});

gulp.task('js:clean_src_js', function (done) {
    delFiles([
        'src/**/*.js',
        'src/**/*.js.map',
    ]);
    delEmpty.sync('src/');

    done(); //!important since gulp4
});

