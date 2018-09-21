import {CommonModule} from "@angular/common";
import {NgModule, Renderer2, AfterViewChecked, ChangeDetectorRef, Output, Component, Injectable, EventEmitter, OnInit, AfterViewInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {Observable, Subject} from "rxjs";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {relatedmodels} from "../../services/relatedmodels.service";
import {modal} from "../../services/modal.service";
import {session} from "../../services/session.service";
import {broadcast} from "../../services/broadcast.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modelutilities} from "../../services/modelutilities.service";
import {currency} from '../../services/currency.service';

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalUtilityComponents} from "../../globalutilitycomponents/globalutilitycomponents";

import /*embed*/ {UserChangePasswordButton} from "./components/userchangepasswordbutton";
import /*embed*/ {UserChangePasswordModal} from "./components/userchangepasswordmodal";
import /*embed*/ {UserPreferences} from "./components/userpreferences";
import /*embed*/ {UserRoles} from "./components/userroles";
import /*embed*/ {UserRolesAddModal} from "./components/userrolesaddmodal";
import /*embed*/ {UserAddButton} from "./components/useraddbutton";
import /*embed*/ {UserAddModal} from "./components/useraddmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        GlobalUtilityComponents,
        DirectivesModule,
    ],
    declarations: [
        UserChangePasswordButton,
        UserChangePasswordModal,
        UserPreferences,
        UserRoles,
        UserRolesAddModal,
        UserAddButton,
        UserAddModal,
    ]
})
export class ModuleUsers {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}