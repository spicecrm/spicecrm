/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        AdministrationAPIInspector,
        AdministrationApiInspectorMethods,
        AdministrationApiInspectorMethodParameters,
        AdministrationAPIInspectorDetails,
        AdministrationapiinspectorMethodResponses,
        AdministrationApiInspectorMethodTest,
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
}
