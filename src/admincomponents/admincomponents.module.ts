import {CommonModule} from '@angular/common';
import {FormsModule}   from '@angular/forms';
import {AfterViewInit, OnInit, OnDestroy, ComponentFactoryResolver, Component, NgModule, Injectable, ViewChild, ViewContainerRef, ElementRef, Input, Output, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {Subject, Observable, Subscription} from 'rxjs';
import {CanActivate}    from '@angular/router';

import {session} from '../services/session.service';
import {metadata} from '../services/metadata.service';
import {modal} from '../services/modal.service';
import {modelutilities} from '../services/modelutilities.service';
import {backend} from '../services/backend.service';
import {navigation} from '../services/navigation.service';
import {language} from '../services/language.service';
import {configurationService} from '../services/configuration.service';
import {userpreferences} from '../services/userpreferences.service';
import {footer} from '../services/footer.service';
import {toast} from '../services/toast.service';
import {broadcast} from '../services/broadcast.service';
import {VersionManagerService} from '../services/versionmanager.service';
import { RouterModule, Routes, Router } from '@angular/router';
import {loginCheck } from '../services/login.service';
import {DirectivesModule} from "../directives/directives";
import {SystemComponents} from '../systemcomponents/systemcomponents';
import {relatedmodels} from '../services/relatedmodels.service';
import {model} from '../services/model.service';
import {view} from '../services/view.service';

import /*embed*/ {administrationconfigurator} from './services/administrationconfigurator.service'
import /*embed*/ {ftsconfiguration} from './services/ftsconfiguration.service'
import /*embed*/ {dictionary} from './services/dictionary.service'

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
        AdministrationSchedulerScheduleButton
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