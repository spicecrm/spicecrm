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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { projectwbsHierarchy } from "./services/projectwbshierarchy.service";

import {ProjectWBSHierarchy} from "./components/projectwbshierarchy";
import {ProjectWBSHierarchyNode} from "./components/projectwbshierarchynode";

import {ProjectActivityDashletActivity} from "./components/projectactivitydashletactivity";
import {ProjectActivityDashlet} from "./components/projectactivitydashlet";
import {ProjectActivityConfirmation} from "./components/projectactivityconfirmation";
import {fieldProjectActivityEffort} from "./fields/fieldprojectactivityeffort";
import {fieldProjectPlannedActivityConsumption} from "./fields/fieldprojectplannedactivityconsumption";
import {fieldProjectActivityDropdown} from "./fields/fieldprojectactivitydropdown";
import {fieldProjectActivityStartdate} from "./fields/fieldprojectactivitystartdate";
import {fieldProjectActivityDuration} from "./fields/fieldprojectactivityduration";
import {ProjectSettlementLine} from "./components/projectsettlementline";

import {ProjectWBSQuoteButton} from "./components/projectwbsquotebutton";
import {ProjectSettlementButton} from "./components/projectsettlementbutton";
import {ProjectSettlement} from "./components/projectsettlement";
import {ProjectWBSHierarchyAddNode} from "./components/projectwbshierarchyaddnode";
import {ProjectWBSGantt} from "./components/projectwbsgantt";
import {ProjectActivityTrackTimeModal} from "./components/projectactivitytracktimemodal";
import {ProjectWBSManagerView} from "./components/projectwbsmanagerview";
import {ProjectActivityElements} from "./components/projectactivityelements";
import {ProjectWBSElement} from "./components/projectwbselement";
import {ProjectSettlementSaveButton} from "./components/projectsettlementsavebutton";
import {projectActivityListItem} from "./components/projectactivitylistitem";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ScrollingModule
    ],
    declarations: [
        ProjectWBSHierarchy,
        ProjectWBSHierarchyNode,
        ProjectWBSHierarchyAddNode,
        ProjectWBSGantt,
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
        ProjectWBSQuoteButton,
        ProjectActivityTrackTimeModal,
        ProjectWBSManagerView,
        ProjectActivityElements,
        ProjectWBSElement,
        ProjectActivityElements,
        ProjectSettlementSaveButton,
        projectActivityListItem

    ], exports: [
        ProjectActivityTrackTimeModal
    ]
})
export class ModuleProjects {}
