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
import {modelutilities} from "../../services/modelutilities.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {GlobalUtilityComponents} from "../../globalutilitycomponents/globalutilitycomponents";

import /*embed*/ { projectwbsHierarchy } from "./services/projectwbshierarchy.service";

import /*embed*/ {ProjectWBSHierarchy} from "./components/projectwbshierarchy";
import /*embed*/ {ProjectWBSHierarchyNode} from "./components/projectwbshierarchynode";
import /*embed*/ {ProjectActivityDashlet} from "./components/projectactivitydashlet";

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
        ProjectWBSHierarchy,
        ProjectWBSHierarchyNode,
        ProjectActivityDashlet
    ]
})
export class ModuleProjects {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}