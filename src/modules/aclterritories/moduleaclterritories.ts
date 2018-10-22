import {CommonModule} from '@angular/common';
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {FormsModule}   from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';

import {Subject, Observable} from 'rxjs';


import {loginService, loginCheck} from '../../services/login.service';
import {metadata, aclCheck} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {modellist} from '../../services/modellist.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modelutilities} from '../../services/modelutilities.service';
import {helper} from '../../services/helper.service';
import {language} from '../../services/language.service';
import {broadcast} from '../../services/broadcast.service';
import {navigation} from '../../services/navigation.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {footer} from '../../services/footer.service';
import {assistant} from '../../services/assistant.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {toast} from '../../services/toast.service';
import {fts} from '../../services/fts.service';
import {configurationService} from '../../services/configuration.service';
import {mediafiles} from '../../services/mediafiles.service';
import {VersionManagerService} from '../../services/versionmanager.service';


import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';

import /*embed*/ {ACLTerritorriesManager} from "./components/aclterritorriesmanager";
import /*embed*/ {ACLTerritorriesManagerHeader} from './components/aclterritorriesmanagerheader';
import /*embed*/ {ACLTerritorriesManagerTerritories} from "./components/aclterritorriesmanagerterritories";
import /*embed*/ {ACLTerritorriesManagerTerritory} from "./components/aclterritorriesmanagerterritory";
import /*embed*/ {ACLTerritorriesManagerTerritoryValues} from "./components/aclterritorriesmanagerterritoryvalues";
import /*embed*/ {ACLTerritorriesManagerTerritoryAddModal} from "./components/aclterritorriesmanagerterritoryaddmodal";
import /*embed*/ {ACLTerritorriesElementmanager} from './components/aclterritorrieselementmanager';
import /*embed*/ {ACLTerritorriesElementmanagerElements} from './components/aclterritorrieselementmanagerelements';
import /*embed*/ {ACLTerritorriesElementmanagerElementValues} from './components/aclterritorrieselementmanagerelementvalues';
import /*embed*/ {ACLTerritorriesElementmanagerElementsAddModal} from './components/aclterritorrieselementmanagerelementsaddmodal';
import /*embed*/ {ACLTerritorriesElementmanagerElementValuesAddModal} from "./components/aclterritorrieselementmanagerelementvaluesaddmodal";
import /*embed*/ {ACLTerritorriesTypesmanager} from "./components/aclterritorriestypesmanager";
import /*embed*/ {ACLTerritorriesTypesmanagerTypeElements} from "./components/aclterritorriestypesmanagertypeelements";
import /*embed*/ {AclterritorriesTypesmanagerTypes} from "./components/aclterritorriestypesmanagertypes";
import /*embed*/ {ACLTerritorriesTypesmanagerTypeelementsAddModal} from "./components/aclterritorriestypesmanagertypeelementsaddmodal";
import /*embed*/ {ACLTerritorriesModulessmanager} from "./components/aclterritorriesmodulesmanager";
import /*embed*/ {ACLTerritorriesModulesmanagerModules} from "./components/aclterritorriesmodulesmanagermodules";
import /*embed*/ {ACLTerritorriesModulesmanagerModulesAddModal} from "./components/aclterritorriesmodulesmanagermodulesaddmodal";

import /*embed*/ {ACLObjectsManagerObjectTerritories} from "./components/aclobjectsmanagerobjectterritories";
import /*embed*/ {ACLObjectsManagerObjectTerritoriesModal} from "./components/aclobjectsmanagerobjectterritoriesmodal";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        ACLTerritorriesManager,
        ACLTerritorriesManagerHeader,
        ACLTerritorriesManagerTerritories,
        ACLTerritorriesManagerTerritory,
        ACLTerritorriesManagerTerritoryValues,
        ACLTerritorriesManagerTerritoryAddModal,
        ACLTerritorriesElementmanager,
        ACLTerritorriesElementmanagerElements,
        ACLTerritorriesElementmanagerElementValues,
        ACLTerritorriesElementmanagerElementsAddModal,
        ACLTerritorriesElementmanagerElementValuesAddModal,
        ACLTerritorriesTypesmanager,
        AclterritorriesTypesmanagerTypes,
        ACLTerritorriesTypesmanagerTypeElements,
        ACLTerritorriesTypesmanagerTypeelementsAddModal,
        ACLTerritorriesModulessmanager,
        ACLTerritorriesModulesmanagerModules,
        ACLTerritorriesModulesmanagerModulesAddModal,
        ACLObjectsManagerObjectTerritories,
        ACLObjectsManagerObjectTerritoriesModal
    ]
})
export class ModuleACLTerritories {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}