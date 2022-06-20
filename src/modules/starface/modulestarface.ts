/**
 * @module ModuleAsterisk
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {userpreferences} from "../../services/userpreferences.service";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import {StarfaceToolbarIndicator} from "./components/starfacetoolbarindicator";
import {StarfacePreferences} from "./components/starfacepreferences";


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
        StarfaceToolbarIndicator,
        StarfacePreferences
    ]
})
export class ModuleStarFace {
}
