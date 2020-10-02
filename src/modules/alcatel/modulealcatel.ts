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

import /*embed*/ {AlcatelToolbarIndicator} from "./components/alcateltoolbarindicator";
import /*embed*/ {AlcatelPreferences} from "./components/alcatelpreferences";


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
        AlcatelToolbarIndicator,
        AlcatelPreferences
    ]
})
export class ModuleAlcatel {
}
