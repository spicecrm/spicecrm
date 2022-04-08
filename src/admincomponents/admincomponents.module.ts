/**
 * @module AdminComponentsModule
 */
import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {NgModule, Component} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { RouterModule, Routes, Router } from '@angular/router';
import {DirectivesModule} from "../directives/directives";
import {SystemComponents} from '../systemcomponents/systemcomponents';
import {ObjectComponents} from "../objectcomponents/objectcomponents";
import {ObjectFields} from "../objectfields/objectfields";

import /*embed*/ {administrationconfigurator} from './services/administrationconfigurator.service';
import /*embed*/ {ftsconfiguration} from './services/ftsconfiguration.service';
import /*embed*/ {dictionary} from './services/dictionary.service';
import /*embed*/ {administration} from './services/administration.service';
import /*embed*/ {administrationapiinspectorService} from "./services/administrationapiinspector.service";

import /*embed*/ { AdministrationMain } from './components/administrationmain';
import /*embed*/ { AdministrationMenu } from './components/administrationmenu';
import /*embed*/ { AdministrationMenuRouteItem } from './components/administrationmenurouteitem';
import /*embed*/ { AdministrationConfigurator } from './components/administrationconfigurator';
import /*embed*/ { AdministrationConfiguratorItem } from './components/administrationconfiguratoritem';
import /*embed*/ { AdministrationConfiguratorItemRole } from './components/administrationconfiguratoritemrole';
import /*embed*/ { AdministrationQuotaManager } from './components/administrationquotamanager';
import /*embed*/ { AdministrationQuotaManagerField } from './components/administrationquotamanagerfield';


import /*embed*/ { AdministrationFTSStatus } from './components/administrationftsstatus';
import /*embed*/ { AdministrationFTSManager } from './components/administrationftsmanager';
import /*embed*/ { AdministrationFTSManagerFields } from './components/administrationftsmanagerfields';
import /*embed*/ { AdministrationFTSManagerFieldsList } from './components/administrationftsmanagerfieldslist';
import /*embed*/ { AdministrationFTSManagerDetails } from './components/administrationftsmanagerdetails';
import /*embed*/ { AdministrationFTSManagerModuleAdd } from './components/administrationftsmanagermoduleadd';
import /*embed*/ { AdministrationFTSManagerFieldsAdd } from './components/administrationftsmanagerfieldsadd';
import /*embed*/ { AdministrationFTSStats } from './components/administrationftsstats';
import /*embed*/ { AdministrationFtsManagerIndexModal } from './components/administrationftsmanagerindexmodal';
import /*embed*/ {AdministrationHomeScreen} from "./components/administrationhomescreen";
import /*embed*/ {AdministrationHomeScreenCard} from "./components/administrationhomescreencard";
import /*embed*/ {AdministrationHomeScreenCardItem} from "./components/administrationhomescreencarditem";

import /*embed*/ { AdministrationSystemStats } from './components/administrationsystemstats';
import /*embed*/ { AdministrationSystemVersions } from './components/administrationsystemversions';

import /*embed*/ { AdministrationAPIInspector } from './components/administrationapiinspector';
import /*embed*/ { AdministrationAPIInspectorDetails } from './components/administrationapiinspectordetails';
import /*embed*/ { AdministrationApiInspectorMethodParameters } from "./components/administrationapiinspectormethodparameters";
import /*embed*/ { AdministrationApiInspectorMethods } from "./components/administrationapiinspectormethods";
import /*embed*/ { AdministrationapiinspectorMethodResponses } from "./components/administrationapiinspectormethodresponses";
import /*embed*/ { AdministrationApiInspectorMethodTest } from "./components/administrationapiinspectormethodtest";


import /*embed*/ { AdministrationSysTrashcanManager } from './components/administrationsystrashcanmanager';
import /*embed*/ { AdministrationSysTrashcanRecover } from './components/administrationsystrashcanrecover';

import /*embed*/ { AdministrationDictRepair } from './components/administrationdictrepair';
import /*embed*/ {AdministrationDictRepairItem} from "./components/administrationdictrepairitem";
import /*embed*/ {AdministrationDictRepairModal} from "./components/administrationdictrepairmodal";
import /*embed*/ {AdministrationDictRepairLanguage} from "./components/administrationdictrepairlanguage";
import /*embed*/ {AdministrationDictRepairACLRoles} from "./components/administrationdictrepairaclroles";
import /*embed*/ {AdministrationDictRepairCache} from "./components/administrationdictrepaircache";
import /*embed*/ {AdministrationDictRepairDbColumns} from "./components/administrationdictrepairdbcolumns";
import /*embed*/ {AdministrationDictRepairDbColumnsModal} from "./components/administrationdictrepairdbcolumnsmodal";
import /*embed*/ {AdministrationDictRepairConvertDBCharset} from "./components/administrationdictrepairconvertdbcharset";
import /*embed*/ {AdministrationDictRepairConvertDBCharsetModal} from "./components/administrationdictrepairconvertdbcharsetmodal";
import /*embed*/ { AdministrationConfigEditor } from './components/administrationconfigeditor';

import /*embed*/ { AdministrationJobMethods } from './components/administrationjobmethods';
import /*embed*/ { AdministrationJobLog } from './components/administrationjoblog';
import /*embed*/ { AdministrationJobRunButton } from './components/administrationjobrunbutton';
import /*embed*/ { AdministrationJobScheduleButton } from './components/administrationjobschedulebutton';
import /*embed*/ { AdministrationJobKillButton } from './components/administrationjobkillbutton';
import /*embed*/ { AdministrationJobTaskRunButton } from './components/administrationjobtaskrunbutton';
import /*embed*/ { AdministrationJobRunningList } from './components/administrationjobrunninglist';
import /*embed*/ { AdministrationJobFailedList } from './components/administrationjobfailedlist';
import /*embed*/ { AdministrationJobCockpit } from './components/administrationjobcockpit';

import /*embed*/ { AdministrationDictionaryManager, AdministrationDictionaryManagerItem, AdministrationDictionaryManagerItemField } from './components/administrationdictionarymanager';
import /*embed*/ {AdministrationGeneralSettings} from "./components/administrationgeneralsettings";
import /*embed*/ {AdministrationLanguages} from "./components/administrationlanguages";
import /*embed*/ {AdministrationDefaultPreferences} from './components/administrationdefaultpreferences';
import /*embed*/ {AdministrationUserAccessLogViewer} from './components/administrationuseraccesslogviewer';

import /*embed*/ {AdministrationLoginRestriction} from './components/administrationloginrestriction';
import /*embed*/ {AdministrationLoginRestrictionIpAddresses} from './components/administrationloginrestrictionipaddresses';
import /*embed*/ {AdministrationLoginRestrictionIpAddressesRow} from './components/administrationloginrestrictionipaddressesrow';
import /*embed*/ {AdministrationPasswordConfig} from './components/administrationpasswordconfig';
import /*embed*/ {AdministrationBlockedUsers} from './components/administrationblockedusers';
import /*embed*/ {AdministrationLoginManagement} from './components/administrationloginmanagement';

import /*embed*/ {AdministrationGDPRRetentionManager} from "./components/administrationgdprretentionmanager";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        DragDropModule,
        ObjectComponents,
        ObjectFields
    ],
    declarations: [
        AdministrationAPIInspector,
        AdministrationApiInspectorMethods,
        AdministrationApiInspectorMethodParameters,
        AdministrationAPIInspectorDetails,
        AdministrationapiinspectorMethodResponses,
        AdministrationApiInspectorMethodTest,
        AdministrationGDPRRetentionManager,
        AdministrationMain,
        AdministrationMenu,
        AdministrationMenuRouteItem,
        AdministrationConfigurator,
        AdministrationConfiguratorItem,
        AdministrationConfiguratorItemRole,
        AdministrationQuotaManager,
        AdministrationQuotaManagerField,
        AdministrationFTSStatus,
        AdministrationFTSManager,
        AdministrationFTSManagerModuleAdd,
        AdministrationFTSManagerFields,
        AdministrationFTSManagerFieldsList,
        AdministrationFTSManagerDetails,
        AdministrationFTSManagerFieldsAdd,
        AdministrationFTSStats,
        AdministrationDictionaryManager,
        AdministrationDictionaryManagerItem,
        AdministrationDictionaryManagerItemField,
        AdministrationSysTrashcanManager,
        AdministrationSysTrashcanRecover,
        AdministrationDictRepair,
        AdministrationDictRepairItem,
        AdministrationDictRepairLanguage,
        AdministrationDictRepairModal,
        AdministrationDictRepairACLRoles,
        AdministrationDictRepairCache,
        AdministrationDictRepairDbColumns,
        AdministrationDictRepairDbColumnsModal,
        AdministrationConfigEditor,
        AdministrationJobMethods,
        AdministrationJobLog,
        AdministrationJobRunButton,
        AdministrationJobScheduleButton,
        AdministrationJobKillButton,
        AdministrationJobTaskRunButton,
        AdministrationJobRunningList,
        AdministrationJobFailedList,
        AdministrationJobCockpit,
        AdministrationSystemStats,
        AdministrationSystemVersions,
        AdministrationFtsManagerIndexModal,
        AdministrationHomeScreen,
        AdministrationHomeScreenCard,
        AdministrationHomeScreenCardItem,
        AdministrationGeneralSettings,
        AdministrationLanguages,
        AdministrationDefaultPreferences,
        AdministrationUserAccessLogViewer,
        AdministrationDictRepairConvertDBCharset,
        AdministrationDictRepairConvertDBCharsetModal,
        AdministrationLoginRestriction,
        AdministrationLoginRestrictionIpAddresses,
        AdministrationLoginRestrictionIpAddressesRow,
        AdministrationPasswordConfig,
        AdministrationBlockedUsers,
        AdministrationLoginManagement
    ],
    entryComponents: [
        AdministrationMain,
        AdministrationMenu,
        AdministrationConfigurator,
        AdministrationQuotaManager,
        AdministrationQuotaManagerField,
        AdministrationFTSManager,
        AdministrationDictionaryManager,
        AdministrationDictionaryManagerItem,
        AdministrationDictionaryManagerItemField,
        AdministrationDefaultPreferences,
        AdministrationJobRunningList,
        AdministrationJobFailedList,
        AdministrationLoginRestriction,
        AdministrationLoginRestrictionIpAddresses,
        AdministrationLoginRestrictionIpAddressesRow,
        AdministrationPasswordConfig,
        AdministrationBlockedUsers,
        AdministrationLoginManagement
    ]

})
export class AdminComponentsModule {
}
