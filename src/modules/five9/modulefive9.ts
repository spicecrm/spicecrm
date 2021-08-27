/**
 * @module ModuleFive9
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {Five9ToolbarIndicator} from "./components/five9toolbarindicator";
import /*embed*/ {Five9Preferences} from "./components/five9preferences";

/**
 * a module that handles integration to the five9 Dialer and VOIP System
 * https://www.five9.com/
 */
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule
    ],
    declarations: [
        Five9ToolbarIndicator,
        Five9Preferences
    ]
})
export class ModuleFive9 {
}
