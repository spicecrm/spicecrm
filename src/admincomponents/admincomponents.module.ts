/**
 * @module AdminComponentsModule
 */
import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {NgModule} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {DirectivesModule} from "../directives/directives";
import {SystemComponents} from '../systemcomponents/systemcomponents';
import {ObjectComponents} from "../objectcomponents/objectcomponents";
import {ObjectFields} from "../objectfields/objectfields";


import { AdministrationMain } from './components/administrationmain';
import { AdministrationMenu } from './components/administrationmenu';
import { AdministrationMenuRouteItem } from './components/administrationmenurouteitem';
import { AdministrationConfigurator } from './components/administrationconfigurator';
import { AdministrationConfiguratorItem } from './components/administrationconfiguratoritem';
import { AdministrationConfiguratorItemRole } from './components/administrationconfiguratoritemrole';
import { AdministrationQuotaManager } from './components/administrationquotamanager';
import { AdministrationQuotaManagerField } from './components/administrationquotamanagerfield';


import { AdministrationFTSStatus } from './components/administrationftsstatus';
import { AdministrationFTSManager } from './components/administrationftsmanager';
import { AdministrationFTSManagerFields } from './components/administrationftsmanagerfields';
import { AdministrationFTSManagerFieldsList } from './components/administrationftsmanagerfieldslist';
import { AdministrationFTSManagerDetails } from './components/administrationftsmanagerdetails';
import { AdministrationFTSManagerModuleAdd } from './components/administrationftsmanagermoduleadd';
import { AdministrationFTSManagerFieldsAdd } from './components/administrationftsmanagerfieldsadd';
import { AdministrationFTSStats } from './components/administrationftsstats';
import { AdministrationFtsManagerIndexModal } from './components/administrationftsmanagerindexmodal';
import {AdministrationHomeScreen} from "./components/administrationhomescreen";
import {AdministrationHomeScreenCard} from "./components/administrationhomescreencard";
import {AdministrationHomeScreenCardItem} from "./components/administrationhomescreencarditem";

import { AdministrationSystemStats } from './components/administrationsystemstats';
import {AdministrationSystemCacheViewer} from "./components/administrationsystemcacheviewer";
import {AdministrationSystemCacheViewerDetails} from "./components/administrationsystemcacheviewerdetails";
import { AdministrationSystemVersions } from './components/administrationsystemversions';

import { AdministrationAPIInspector } from './components/administrationapiinspector';
import { AdministrationAPIInspectorDetails } from './components/administrationapiinspectordetails';
import { AdministrationApiInspectorMethodParameters } from "./components/administrationapiinspectormethodparameters";
import { AdministrationApiInspectorMethods } from "./components/administrationapiinspectormethods";
import { AdministrationapiinspectorMethodResponses } from "./components/administrationapiinspectormethodresponses";
import { AdministrationApiInspectorMethodTest } from "./components/administrationapiinspectormethodtest";


import { AdministrationSysTrashcanManager } from './components/administrationsystrashcanmanager';
import { AdministrationSysTrashcanRecover } from './components/administrationsystrashcanrecover';

import { AdministrationDictRepair } from './components/administrationdictrepair';
import {AdministrationDictRepairItem} from "./components/administrationdictrepairitem";
import {AdministrationDictRepairModal} from "./components/administrationdictrepairmodal";
import {AdministrationDictRepairACLRoles} from "./components/administrationdictrepairaclroles";
import {AdministrationDictRepairDbColumnsModal} from "./components/administrationdictrepairdbcolumnsmodal";
import {AdministrationDictRepairConvertDBCharsetModal} from "./components/administrationdictrepairconvertdbcharsetmodal";
import { AdministrationConfigEditor } from './components/administrationconfigeditor';
import {AdministrationConfigEditorEnum} from "./components/administrationconfigeditorenum";

import { AdministrationJobMethods } from './components/administrationjobmethods';
import { AdministrationJobLog } from './components/administrationjoblog';
import { AdministrationJobRunButton } from './components/administrationjobrunbutton';
import { AdministrationJobScheduleButton } from './components/administrationjobschedulebutton';
import { AdministrationJobKillButton } from './components/administrationjobkillbutton';
import { AdministrationJobTaskRunButton } from './components/administrationjobtaskrunbutton';
import { AdministrationJobRunningList } from './components/administrationjobrunninglist';
import { AdministrationJobFailedList } from './components/administrationjobfailedlist';
import { AdministrationJobCockpit } from './components/administrationjobcockpit';

import { AdministrationDictionaryManager, AdministrationDictionaryManagerItem, AdministrationDictionaryManagerItemField } from './components/administrationdictionarymanager';
import {AdministrationGeneralSettings} from "./components/administrationgeneralsettings";
import {AdministrationLanguages} from "./components/administrationlanguages";
import {AdministrationDefaultPreferences} from './components/administrationdefaultpreferences';
import {AdministrationUserAccessLogViewer} from './components/administrationuseraccesslogviewer';

import {AdministrationLoginRestriction} from './components/administrationloginrestriction';
import {AdministrationLoginRestrictionIpAddresses} from './components/administrationloginrestrictionipaddresses';
import {AdministrationLoginRestrictionIpAddressesRow} from './components/administrationloginrestrictionipaddressesrow';
import {AdministrationPasswordConfig} from './components/administrationpasswordconfig';
import {AdministrationBlockedUsers} from './components/administrationblockedusers';
import {AdministrationLoginManagement} from './components/administrationloginmanagement';
import {AdministrationLoginMethods} from './components/administrationloginmethods';

import {AdministrationGDPRRetentionManager} from "./components/administrationgdprretentionmanager";
import {AdministrationAssetManager} from "./components/administrationassetmanager";
import {AdministrationMigrateLegacyDoms} from "./components/administrationmigratelegacydoms";
import {WorkbenchModule} from "../workbench/workbench.module";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        DragDropModule,
        ObjectComponents,
        ObjectFields,
        WorkbenchModule
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
        AdministrationDictRepairModal,
        AdministrationDictRepairACLRoles,
        AdministrationDictRepairDbColumnsModal,
        AdministrationConfigEditor,
        AdministrationConfigEditorEnum,
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
        AdministrationSystemCacheViewer,
        AdministrationSystemCacheViewerDetails,
        AdministrationSystemVersions,
        AdministrationFtsManagerIndexModal,
        AdministrationHomeScreen,
        AdministrationHomeScreenCard,
        AdministrationHomeScreenCardItem,
        AdministrationGeneralSettings,
        AdministrationLanguages,
        AdministrationMigrateLegacyDoms,
        AdministrationDefaultPreferences,
        AdministrationUserAccessLogViewer,
        AdministrationDictRepairConvertDBCharsetModal,
        AdministrationLoginRestriction,
        AdministrationLoginRestrictionIpAddresses,
        AdministrationLoginRestrictionIpAddressesRow,
        AdministrationPasswordConfig,
        AdministrationBlockedUsers,
        AdministrationLoginManagement,
        AdministrationAssetManager,
        AdministrationLoginMethods,

    ]

})
export class AdminComponentsModule {
}
