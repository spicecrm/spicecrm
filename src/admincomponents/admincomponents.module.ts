/**
 * @module AdminComponentsModule
 */
import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {NgModule, Component} from '@angular/core';
import {VersionManagerService} from '../services/versionmanager.service';
import { RouterModule, Routes, Router } from '@angular/router';
import {DirectivesModule} from "../directives/directives";
import {SystemComponents} from '../systemcomponents/systemcomponents';

import /*embed*/ {administrationconfigurator} from './services/administrationconfigurator.service';
import /*embed*/ {ftsconfiguration} from './services/ftsconfiguration.service';
import /*embed*/ {dictionary} from './services/dictionary.service';

import /*embed*/ { AdministrationMenu } from './components/administrationmenu';
import /*embed*/ { AdministrationMenuRouteItem } from './components/administrationmenurouteitem';
import /*embed*/ { AdministrationConfigurator } from './components/administrationconfigurator';
import /*embed*/ { AdministrationConfiguratorItem } from './components/administrationconfiguratoritem';
import /*embed*/ { AdministrationConfiguratorItemRole } from './components/administrationconfiguratoritemrole';
import /*embed*/ { AdministrationQuotaManager } from './components/administrationquotamanager';
import /*embed*/ { AdministrationQuotaManagerField } from './components/administrationquotamanagerfield';

import /*embed*/ { AdministrationFTSManager } from './components/administrationftsmanager';
import /*embed*/ { AdministrationFTSManagerFields } from './components/administrationftsmanagerfields';
import /*embed*/ { AdministrationFTSManagerDetails } from './components/administrationftsmanagerdetails';
import /*embed*/ { AdministrationFTSManagerFieldsAdd } from './components/administrationftsmanagerfieldsadd';
import /*embed*/ { AdministrationFTSStats } from './components/administrationftsstats';

import /*embed*/ { AdministrationSystemStats } from './components/administrationsystemstats';

import /*embed*/ { AdministrationSysTrashcanManager } from './components/administrationsystrashcanmanager';
import /*embed*/ { AdministrationSysTrashcanRecover } from './components/administrationsystrashcanrecover';

import /*embed*/ { AdministrationDictRepair } from './components/administrationdictrepair';

import /*embed*/ { AdministrationConfigEditor } from './components/administrationconfigeditor';

import /*embed*/ { AdministrationSchedulerJobsEnum } from './components/administrationschedulerjobsenum';
import /*embed*/ { AdministrationSchedulerJobLog } from './components/administrationschedulerjoblog';
import /*embed*/ { AdministrationSchedulerRunButton } from './components/administrationschedulerrunbutton';
import /*embed*/ { AdministrationSchedulerScheduleButton } from './components/administrationschedulerschedulebutton';

import /*embed*/ { AdministrationDictionaryManager, AdministrationDictionaryManagerItem, AdministrationDictionaryManagerItemField } from './components/administrationdictionarymanager';
import /*embed*/ {VersionControllerComponent} from "./components/versioncontroller";


@Component({
    selector: 'administration-main',
    template: '<div administration-menu></div>'
})
export class AdministrationMain {}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        RouterModule.forChild([
            { path: '', component: AdministrationMain}
        ])
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
        AdministrationFTSManager,
        AdministrationFTSManagerFields,
        AdministrationFTSManagerDetails,
        AdministrationFTSManagerFieldsAdd,
        AdministrationFTSStats,
        AdministrationDictionaryManager,
        AdministrationDictionaryManagerItem,
        AdministrationDictionaryManagerItemField,
        AdministrationSysTrashcanManager,
        AdministrationSysTrashcanRecover,
        AdministrationDictRepair,
        VersionControllerComponent,
        AdministrationConfigEditor,
        AdministrationSchedulerJobsEnum,
        AdministrationSchedulerJobLog,
        AdministrationSchedulerRunButton,
        AdministrationSchedulerScheduleButton,
        AdministrationSystemStats
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
        AdministrationDictionaryManagerItemField
    ],
    exports: [],

})
export class AdminComponentsModule
{
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms:VersionManagerService,
    ) {
        vms.registerModule(this);
    }
}