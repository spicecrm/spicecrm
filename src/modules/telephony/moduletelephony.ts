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
import /*embed*/ {TelephonyCallPanel} from "./components/telephonycallpanel";

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
        TelephonyCallPanelSaveButton
    ]
})
export class ModuleTelephony {
}
