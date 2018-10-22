import {CommonModule} from "@angular/common";
import {NgModule, Renderer2, Output, Component, Injectable, EventEmitter, OnInit, AfterViewInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {Subject, Observable} from "rxjs";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {metadata} from "../../services/metadata.service";
import {backend} from "../../services/backend.service";
import {model} from "../../services/model.service";
import {toast} from "../../services/toast.service";
import {relatedmodels} from "../../services/relatedmodels.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {ACManagerService} from "./services/acmanager.service";
import /*embed*/ { accountHierarchy } from "./services/accounthierarchy.service";

import /*embed*/ {AccountsKPIsOverview} from "./components/accountskpisoverview";
import /*embed*/ {AccountCCDetails} from "./components/accountccdetails";
import /*embed*/ {AccountCCDetailsTab} from "./components/accountccdetailstab";
import /*embed*/ {ContactCCDetails} from "./components/contactccdetails";
import /*embed*/ {ContactCCDetailsTab} from "./components/contactccdetailstab";
import /*embed*/ {AccountsContactsManager} from "./components/accountscontactsmanager";
import /*embed*/ {AccountsContactsManagerDetails} from "./components/accountscontactsmanagerdetails";
import /*embed*/ {AccountsContactsManagerList} from "./components/accountscontactsmanagerlist";
import /*embed*/ {AccountHierarchy} from "./components/accounthierarchy";
import /*embed*/ {AccountHierarchyNode} from "./components/accounthierarchynode";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        AccountsKPIsOverview,
        AccountCCDetails,
        AccountCCDetailsTab,
        ContactCCDetails,
        ContactCCDetailsTab,
        AccountsContactsManager,
        AccountsContactsManagerDetails,
        AccountsContactsManagerList,
        AccountHierarchy,
        AccountHierarchyNode,
    ],
    providers: [
        ACManagerService
    ]
})
export class ModuleAccounts {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}