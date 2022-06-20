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

import {SystemTenantActivateButton} from "./components/systemtenantactivatebutton";
import {SystemTenantActivateModal} from "./components/systemtenantactivatemodal";
import {SystemTenantLoadDemoDataButton} from "./components/systemtenantloaddemodatabutton";
import {SystemTenantHeaderBarValidity} from "./components/systemtenantheaderbarvalidity";
import {SystemTenantHeaderBarSummary} from "./components/systemtenantheaderbarsummary";
import {SystemTenantHeaderBar} from "./components/systemtenantheaderbar";

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
    exports: [
        SystemTenantHeaderBarSummary
    ],
    declarations: [
        SystemTenantHeaderBar,
        SystemTenantHeaderBarValidity,
        SystemTenantHeaderBarSummary,
        SystemTenantActivateButton,
        SystemTenantActivateModal,
        SystemTenantLoadDemoDataButton
    ]
})
export class ModuleSystemTenants {
}
