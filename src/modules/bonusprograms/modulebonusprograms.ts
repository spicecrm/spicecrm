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

import {BonusProgramValidityTypesField} from "./fields/bonusprogramvaliditytypesfield";
import {BonusCardValidityDateField} from "./fields/bonuscardvaliditydatefield";
import {BonusCardExtendButton} from "./actions/bonuscardextendbutton";
import {BonusCardBulkExtendButton} from "./actions/bonuscardbulkextendbutton";
import {BonusCardNewButton} from "./actions/bonuscardnewbutton";
import {BonusCardNewRelatedButton} from "./actions/bonuscardnewrelatedbutton";


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
        BonusCardBulkExtendButton,
        BonusCardNewButton,
        BonusCardNewRelatedButton,
    ]
})
export class ModuleBonusPrograms {}
