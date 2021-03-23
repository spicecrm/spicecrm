/**
 * @module DialogMailModule
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {DialogMailPanel} from "./components/dialogmailpanel";
import /*embed*/ {ProspectListsToDialogMailButton} from "./components/prospectliststodialogmailbutton";
import /*embed*/ {ProspectListsToDialogMailModal} from "./components/prospectliststodialogmailmodal";

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
        DialogMailPanel,
        ProspectListsToDialogMailButton,
        ProspectListsToDialogMailModal,
    ]
})
export class DialogMailModule {
}
