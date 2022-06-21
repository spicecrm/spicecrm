/**
 * @module EvalancheModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {ProspectListsToEvalancheButton} from "./components/prospectlisttoevalanchebutton";
import {ProspectListsToEvalancheModal} from "./components/prospectlisttoevalanchemodal";
import {EvalancheMailingButton} from "./components/evalanchemailingbutton";
import {EvalancheMailingModal} from "./components/evalanchemailingmodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
        DirectivesModule,
        ReactiveFormsModule,
    ],
    declarations: [
        ProspectListsToEvalancheButton,
        ProspectListsToEvalancheModal,
        EvalancheMailingButton,
        EvalancheMailingModal
    ]
})
export class EvalancheModule {
}
