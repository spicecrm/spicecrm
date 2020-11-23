/**
 * @module AdminComponentsModule
 */
import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {NgModule, Component} from '@angular/core';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {VersionManagerService} from '../services/versionmanager.service';
import { RouterModule, Routes, Router } from '@angular/router';
import {DirectivesModule} from "../directives/directives";
import {SystemComponents} from '../systemcomponents/systemcomponents';

import /*embed*/ {administrationconfigurator} from './services/administrationconfigurator.service';
import /*embed*/ {ftsconfiguration} from './services/ftsconfiguration.service';
import /*embed*/ {dictionary} from './services/dictionary.service';
import /*embed*/ {administration} from './services/administration.service';

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

import /*embed*/ { AdministrationSysTrashcanManager } from './components/administrationsystrashcanmanager';
import /*embed*/ { AdministrationSysTrashcanRecover } from './components/administrationsystrashcanrecover';

import /*embed*/ { AdministrationDictRepair } from './components/administrationdictrepair';
import /*embed*/ {AdministrationDictRepairItem} from "./components/administrationdictrepairitem";
import /*embed*/ {AdministrationDictRepairModal} from "./components/administrationdictrepairmodal";
import /*embed*/ {AdministrationDictRepairLanguage} from "./components/administrationdictrepairlanguage";
import /*embed*/ { AdministrationConfigEditor } from './components/administrationconfigeditor';

import /*embed*/ { AdministrationSchedulerJobsEnum } from './components/administrationschedulerjobsenum';
import /*embed*/ { AdministrationSchedulerJobLog } from './components/administrationschedulerjoblog';
import /*embed*/ { AdministrationSchedulerRunButton } from './components/administrationschedulerrunbutton';
import /*embed*/ { AdministrationSchedulerScheduleButton } from './components/administrationschedulerschedulebutton';

import /*embed*/ { AdministrationDictionaryManager, AdministrationDictionaryManagerItem, AdministrationDictionaryManagerItemField } from './components/administrationdictionarymanager';
import /*embed*/ {AdministrationGeneralSettings} from "./components/administrationgeneralsettings";
import /*embed*/ {AdministrationLanguages} from "./components/administrationlanguages";
import /*embed*/ {AdministrationDefaultPreferences} from './components/administrationdefaultpreferences';




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        DragDropModule
    ],
    declarations: [
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
        AdministrationConfigEditor,
        AdministrationSchedulerJobsEnum,
        AdministrationSchedulerJobLog,
        AdministrationSchedulerRunButton,
        AdministrationSchedulerScheduleButton,
        AdministrationSystemStats,
        AdministrationSystemVersions,
        AdministrationFtsManagerIndexModal,
        AdministrationHomeScreen,
        AdministrationHomeScreenCard,
        AdministrationHomeScreenCardItem,
        AdministrationGeneralSettings,
        AdministrationLanguages,
        AdministrationDefaultPreferences
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
        AdministrationDefaultPreferences
    ],
    exports: [],

})
export class AdminComponentsModule {
    public readonly version = '1.0';
    public readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}
