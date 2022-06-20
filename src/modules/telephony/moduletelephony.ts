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

import {TelephonyDockedCall} from "./components/telephonydockedcall";
import {TelephonyCallDuration} from "./components/telephonycallduration";
import {TelephonyCallSearching} from "./components/telephonycallsearching";
import {TelephonyCallPanelRelated} from "./components/telephonycallpanelrelated";
import {TelephonyCallPanelRelatedCompact} from "./components/telephonycallpanelrelatedcompact";
import {TelephonyCallPanelSaveButton} from "./components/telephonycallpanelsavebutton";
import {TelephonyCallLogAttemptButton} from "./components/telephonycalllogattemptbutton";
import {TelephonyCallSearchModal} from "./components/telephonycallsearchmodal";
import {TelephonyCallSearchButton} from "./components/telephonycallsearchbutton";
import {TelephonyCallCreateRelatedModal} from "./components/telephonycallcreaterelatedmodal";
import {TelephonyCallCreateRelatedButton} from "./components/telephonycallcreaterelatedbutton";
import {TelephonyCallPanel} from "./components/telephonycallpanel";
import {TelephonyCallModelUpdate} from "./components/telephonycallmodelupdate";
import {TelephonyToolbarIndicator} from "./components/telephonytoolbarindicator";


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
        TelephonyCallSearchButton,
        TelephonyCallSearchModal,
        TelephonyCallCreateRelatedButton,
        TelephonyCallCreateRelatedModal,
        TelephonyCallModelUpdate,
        TelephonyToolbarIndicator
    ]
})
export class ModuleTelephony {
}
