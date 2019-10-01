/**
 * @module ModulePotentials
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

import /*embed*/ {PotentialsManager} from "./components/potentialsmanager";
import /*embed*/ {PotentialsManagerAddButton} from "./components/potentialsmanageraddbutton";
import /*embed*/ {PotentialsOpportunityAllocationTab} from "./components/potentialsopportunityallocationtab";
import /*embed*/ {PotentialsOpportunityAllocationLines} from "./components/potentialsopportunityallocationlines";
import /*embed*/ {PotentialsOpportunityAllocationLineItem} from "./components/potentialsopportunityallocationlineitem";
import /*embed*/ {PotentialsOpportunityAllocationsCCFilterPipe} from "./pipes/potentialsopportunityallocationsccfilterpipe";

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
        PotentialsOpportunityAllocationsCCFilterPipe
    ]
})
export class ModulePotentials {
    public readonly version = "1.0";
    public readonly build_date = "/*build_date*/";

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
