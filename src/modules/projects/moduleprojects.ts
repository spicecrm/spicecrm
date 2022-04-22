/**
 * @module ModuleProjects
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ { projectwbsHierarchy } from "./services/projectwbshierarchy.service";

import /*embed*/ {ProjectWBSHierarchy} from "./components/projectwbshierarchy";
import /*embed*/ {ProjectWBSHierarchyNode} from "./components/projectwbshierarchynode";

import /*embed*/ {ProjectActivityDashletActivity} from "./components/projectactivitydashletactivity";
import /*embed*/ {ProjectActivityDashlet} from "./components/projectactivitydashlet";
import /*embed*/ {ProjectActivityConfirmation} from "./components/projectactivityconfirmation";
import /*embed*/ {fieldProjectActivityEffort} from "./fields/fieldprojectactivityeffort";
import /*embed*/ {fieldProjectPlannedActivityConsumption} from "./fields/fieldprojectplannedactivityconsumption";
import /*embed*/ {fieldProjectActivityDropdown} from "./fields/fieldprojectactivitydropdown";
import /*embed*/ {fieldProjectActivityStartdate} from "./fields/fieldprojectactivitystartdate";
import /*embed*/ {fieldProjectActivityDuration} from "./fields/fieldprojectactivityduration";
import /*embed*/ {ProjectSettlementLine} from "./components/projectsettlementline";

import /*embed*/ {ProjectWBSQuoteButton} from "./components/projectwbsquotebutton";
import /*embed*/ {ProjectSettlementButton} from "./components/projectsettlementbutton";
import /*embed*/ {ProjectSettlement} from "./components/projectsettlement";
import {ProjectWBSHierarchyAddNode} from "./components/projectwbshierarchyaddnode";


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
        ProjectWBSHierarchyAddNode,
        ProjectActivityDashlet,
        ProjectActivityDashletActivity,
        fieldProjectActivityDropdown,
        fieldProjectActivityEffort,
        fieldProjectPlannedActivityConsumption,
        fieldProjectActivityStartdate,
        ProjectActivityConfirmation,
        ProjectSettlementButton,
        ProjectSettlementLine,
        ProjectSettlement,
        fieldProjectActivityDuration,
        ProjectWBSQuoteButton
    ]
})
export class ModuleProjects {}
