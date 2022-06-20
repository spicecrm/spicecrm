/**
 * @module ModulePotentials
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {PotentialsManager} from "./components/potentialsmanager";
import {PotentialsManagerAddButton} from "./components/potentialsmanageraddbutton";
import {PotentialsOpportunityAllocationTab} from "./components/potentialsopportunityallocationtab";
import {PotentialsOpportunityAllocationLines} from "./components/potentialsopportunityallocationlines";
import {PotentialsOpportunityAllocationLineItem} from "./components/potentialsopportunityallocationlineitem";
import {PotentialsOpportunityAllocationsCCFilterPipe} from "./pipes/potentialsopportunityallocationsccfilterpipe";
import {PotentialsManagerNewButton} from "./components/potentialsmanagernewbutton";

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
        PotentialsManager,
        PotentialsManagerAddButton,
        PotentialsOpportunityAllocationTab,
        PotentialsOpportunityAllocationLines,
        PotentialsOpportunityAllocationLineItem,
        PotentialsOpportunityAllocationsCCFilterPipe,
        PotentialsManagerNewButton
    ]
})
export class ModulePotentials {}
