/**
 * @module ModuleSpicePath
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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
    ],
    declarations: [
        SpicePriceManagerButton,
        SpicePriceManagerModal
    ]
})
export class ModuleSpicePriceDetermination {
}
