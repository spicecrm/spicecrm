/**
 * @module ModuleProjects
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {VersionManagerService} from "../../services/versionmanager.service";
import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

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