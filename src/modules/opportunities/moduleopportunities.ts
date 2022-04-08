/**
 * @module ModuleOpportunities
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {OpportunityRevenueLinesActiveLinesPipe} from "./pipes/opportunityrevenuelinesactivelinespipe";
import /*embed*/ {OpportunityRevenueLinesTab} from "./components/opportunityrevenuelinestab";
import /*embed*/ {OpportunityRevenueLines} from "./components/opportunityrevenuelines";
import /*embed*/ {OpportunityRevenueLinesCreator} from "./components/opportunityrevenuelinescreator";
import /*embed*/ {OpportunityRevenueLineItem} from "./components/opportunityrevenuelineitem";

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
        OpportunityRevenueLinesActiveLinesPipe,
        OpportunityRevenueLinesTab,
        OpportunityRevenueLines,
        OpportunityRevenueLinesCreator,
        OpportunityRevenueLineItem
    ]
})
export class ModuleOpportunities {}
