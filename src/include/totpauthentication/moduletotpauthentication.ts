/**
 * @module ModuleTOTPAuthentication
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import /*embed*/ {TOTPAuthenticationGenerateButton} from "./components/totpauthenticationgeneratebutton";
import /*embed*/ {TOTPAuthenticationGenerateModal} from "./components/totpauthenticationgeneratemodal";

/**
 * provides components for the
 */
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
        TOTPAuthenticationGenerateButton,
        TOTPAuthenticationGenerateModal
    ]
})
export class ModuleTOTPAuthentication {
}
