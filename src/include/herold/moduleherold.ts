/**
 * @module ModuleSpiceNotes
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {HeroldAddAccountButton} from "./components/heroldaddaccountbutton";
import {HeroldAddAccountModal} from "./components/heroldaddaccountmodal";
import {fieldHeroldId} from "./fields/fieldheroldid";
import {HeroldCompleteAccountModal} from "./components/heroldcompleteaccountmodal";


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
        HeroldAddAccountButton,
        HeroldAddAccountModal,
        HeroldCompleteAccountModal,
        fieldHeroldId
    ]
})
export class ModuleHerold {

}
