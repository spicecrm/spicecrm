/**
 * @module ModuleSpicePriceDetermination
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {SpicePriceManagerModal} from "./components/spicepricemanagermodal";
import {SpicePriceManagerButton} from "./components/spicepricemanagerbutton";
import {SpicePriceDeterminationConfigurator} from "./components/spicepricedeterminationconfigurator";
import {SpicePriceDeterminationConfiguratorElements} from "./components/spicepricedeterminationconfiguratorelements";
import {SpicePriceDeterminationConfiguratorDeterminations} from "./components/spicepricedeterminationconfiguratordeterminations";
import {SpicePriceDeterminationConfiguratorDeterminationElements} from "./components/spicepricedeterminationconfiguratordeterminationelements";
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {SpicePriceDeterminationConfiguratorConditiontypes} from "./components/spicepricedeterminationconfiguratorconditiontypes";
import {SpicePriceDeterminationConfiguratorConditiontypeDeterminations} from "./components/spicepricedeterminationconfiguratorconditiontypedeterminations";
import {SpicePriceDeterminationConfiguratorSchemes} from "./components/spicepricedeterminationconfiguratorschemes";
import {
    SpicePriceDeterminationConfiguratorInputConditiontype
} from "./components/spicepricedeterminationconfigurationinputconditiontype";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        CdkDropList,
        CdkDrag,
        CdkDragHandle,
    ],
    declarations: [
        SpicePriceManagerButton,
        SpicePriceManagerModal,
        SpicePriceDeterminationConfigurator,
        SpicePriceDeterminationConfiguratorElements,
        SpicePriceDeterminationConfiguratorDeterminations,
        SpicePriceDeterminationConfiguratorDeterminationElements,
        SpicePriceDeterminationConfiguratorConditiontypes,
        SpicePriceDeterminationConfiguratorConditiontypeDeterminations,
        SpicePriceDeterminationConfiguratorSchemes,
        SpicePriceDeterminationConfiguratorInputConditiontype
    ]
})
export class ModuleSpicePriceDetermination {
}
