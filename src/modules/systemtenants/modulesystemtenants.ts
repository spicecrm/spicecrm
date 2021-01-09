/**
 * @module ModuleSystemTenants
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";

import /*embed*/ {SystemTenantActivateButton} from "./components/systemtenantactivatebutton";
import /*embed*/ {SystemTenantActivateModal} from "./components/systemtenantactivatemodal";
import /*embed*/ {SystemTenantLoadDemoDataButton} from "./components/systemtenantloaddemodatabutton";

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
        SystemTenantActivateButton,
        SystemTenantActivateModal,
        SystemTenantLoadDemoDataButton
    ]
})
export class ModuleSystemTenants {
}
