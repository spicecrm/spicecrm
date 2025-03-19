/**
 * @module ModuleProcessManagement
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {fieldProcessImpactScore} from "./fields/fieldprocessimpactscore";
import {ProcessManagementProcessMap} from "./components/processmanagementprocessmap";
import {ProcessManagementProcessCategory} from "./components/processmanagementprocesscategory";
import {ProcessManagementAddProcessGroupButton} from "./components/processmanagementaddprocessgroupbutton";
import {ProcessManagementProcessGroup} from "./components/processmanagementprocessgroup";
import {ProcessManagementAddProcessButton} from "./components/processmanagementaddprocessbutton";


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
        ProcessManagementProcessMap,
        ProcessManagementProcessCategory,
        ProcessManagementAddProcessGroupButton,
        ProcessManagementProcessGroup,
        ProcessManagementAddProcessButton,
        fieldProcessImpactScore
    ],
})
export class ModuleProcessManagement {}
