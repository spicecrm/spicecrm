/**
 * @module ModuleAsterisk
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {TelephonyDockedCall} from "./components/telephonydockedcall";
import /*embed*/ {TelephonyCallDuration} from "./components/telephonycallduration";
import /*embed*/ {TelephonyCallSearching} from "./components/telephonycallsearching";
import /*embed*/ {TelephonyCallPanelRelated} from "./components/telephonycallpanelrelated";
import /*embed*/ {TelephonyCallPanelRelatedCompact} from "./components/telephonycallpanelrelatedcompact";
import /*embed*/ {TelephonyCallPanelSaveButton} from "./components/telephonycallpanelsavebutton";
import /*embed*/ {TelephonyCallLogAttemptButton} from "./components/telephonycalllogattemptbutton";
import /*embed*/ {TelephonyCallSearchContactButton} from "./components/telephonycallsearchcontactbutton";
import /*embed*/ {TelephonyCallCreateContactButton} from "./components/telephonycallcreatecontactbutton";
import /*embed*/ {TelephonyCallPanel} from "./components/telephonycallpanel";
import /*embed*/ {TelephonyCallModelUpdate} from "./components/telephonycallmodelupdate";
import /*embed*/ {TelephonyToolbarIndicator} from "./components/telephonytoolbarindicator";

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
        TelephonyDockedCall,
        TelephonyCallPanel,
        TelephonyCallSearching,
        TelephonyCallDuration,
        TelephonyCallPanelRelated,
        TelephonyCallPanelRelatedCompact,
        TelephonyCallPanelSaveButton,
        TelephonyCallLogAttemptButton,
        TelephonyCallSearchContactButton,
        TelephonyCallCreateContactButton,
        TelephonyCallModelUpdate,
        TelephonyToolbarIndicator
    ]
})
export class ModuleTelephony {
}
