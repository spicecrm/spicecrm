import {CommonModule} from "@angular/common";
import {NgModule, Renderer2, Output, Component, Injectable, EventEmitter, OnInit, AfterViewInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, Input} from "@angular/core";
import {FormsModule} from "@angular/forms";

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
import {GlobalUtilityComponents} from "../../globalutilitycomponents/globalutilitycomponents";

import /*embed*/ {ContactNewslettersButton} from "./components/contactnewslettersbutton";
import /*embed*/ {ContactNewsletters} from "./components/contactnewsletters";
import /*embed*/ {ContactPortalButton} from "./components/contactportalbutton";
import /*embed*/ {ContactPortalDetails} from "./components/contactportaldetails";

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
        ContactNewslettersButton,
        ContactNewsletters,
        ContactPortalButton,
        ContactPortalDetails,
    ]
})
export class ModuleContacts {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}