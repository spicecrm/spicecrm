/**
 * @module ModuleBonusPrograms
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {BonusProgramValidityTypesField} from "./fields/bonusprogramvaliditytypesfield";
import /*embed*/ {BonusCardValidityDateField} from "./fields/bonuscardvaliditydatefield";
import /*embed*/ {BonusCardExtendButton} from "./actions/bonuscardextendbutton";


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
        BonusProgramValidityTypesField,
        BonusCardValidityDateField,
        BonusCardExtendButton,
    ]
})
export class ModuleBonusPrograms {}
