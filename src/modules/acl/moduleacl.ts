import {CommonModule} from '@angular/common';
import {AfterViewInit, ComponentFactoryResolver, Component, ElementRef, NgModule, Renderer, Renderer2, ViewChild, ViewContainerRef, Injectable, Input, Output, EventEmitter, SimpleChanges, OnInit, OnDestroy, OnChanges} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';

import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
// import 'rxjs/add/observable/of';

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
import {GlobalUtilityComponents}      from '../../globalutilitycomponents/globalutilitycomponents';

import /*embed*/ {ACLTypesManager} from "./components/acltypesmanager";
import /*embed*/ {ACLManagerHeader} from "./components/aclmanagerheader";
import /*embed*/ {ACLTypesManagerTypes} from "./components/acltypesmanagertypes";
import /*embed*/ {ACLTypesManagerTypesActions} from "./components/acltypesmanagertypesactions";
import /*embed*/ {ACLTypesManagerTypesFields} from "./components/acltypesmanagertypesfields";
import /*embed*/ {ACLTypesManagerTypesAddFields} from "./components/acltypesmanagertypesaddfields";
import /*embed*/ {ACLTypesManagerTypesAddAction} from "./components/acltypesmanagertypesaddaction";
import /*embed*/ {ACLObjectsManager} from "./components/aclobjectsmanager";
import /*embed*/ {ACLObjectsManagerObjects} from "./components/aclobjectsmanagerobjects";
import /*embed*/ {ACLObjectsManagerAddObjectModal} from "./components/aclobjectsmanageraddobjectmodal";
import /*embed*/ {ACLObjectsManagerObject} from "./components/aclobjectsmanagerobject";
import /*embed*/ {ACLObjectsManagerObjectDetails} from "./components/aclobjectsmanagerobjectdetails";
import /*embed*/ {ACLObjectsManagerObjectFieldvalues} from "./components/aclobjectsmanagerobjectfieldvalues";
import /*embed*/ {ACLObjectsManagerObjectFields} from "./components/aclobjectsmanagerobjectfields";

import /*embed*/ {ACLProfilesManager} from "./components/aclprofilesmanager";
import /*embed*/ {ACLProfilesManagerProfile} from "./components/aclprofilesmanagerprofile";
import /*embed*/ {ACLProfilesManagerProfiles} from "./components/aclprofilesmanagerprofiles";
import /*embed*/ {ACLProfilesManagerAddObjectModal} from "./components/aclprofilesmanageraddobjectmodal";
import /*embed*/ {ACLProfilesManagerAddProfileModal} from "./components/aclprofilesmanageraddprofilemodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents
    ],
    declarations: [
        ACLTypesManager,
        ACLManagerHeader,
        ACLTypesManagerTypes,
        ACLTypesManagerTypesActions,
        ACLTypesManagerTypesAddAction,
        ACLTypesManagerTypesFields,
        ACLTypesManagerTypesAddFields,
        ACLObjectsManager,
        ACLObjectsManagerObjects,
        ACLObjectsManagerAddObjectModal,
        ACLObjectsManagerObject,
        ACLObjectsManagerObjectDetails,
        ACLObjectsManagerObjectFieldvalues,
        ACLObjectsManagerObjectFields,
        ACLProfilesManager,
        ACLProfilesManagerProfiles,
        ACLProfilesManagerProfile,
        ACLProfilesManagerAddProfileModal,
        ACLProfilesManagerAddObjectModal
    ]
})
export class ModuleACL {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}