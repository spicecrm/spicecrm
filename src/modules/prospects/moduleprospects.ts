/**
 * @module ModuleProspects
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {SystemComponents} from "../../systemcomponents/systemcomponents";
import {DirectivesModule} from "../../directives/directives";
import {ProspectConvertContact} from "./components/prospectconvertcontact";
import {ProspectConvertAccount} from "./components/prospectconvertaccount";
import {ProspectConvertButton} from "./components/prospectconvertbutton";
import {ProspectConvertModal} from "./components/prospectconvertmodal";
import {ObjectFields} from "../../objectfields/objectfields";



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        SystemComponents,
        DirectivesModule,
        ObjectFields
    ],
    declarations: [
        ProspectConvertContact,
        ProspectConvertAccount,
        ProspectConvertButton,
        ProspectConvertModal
    ],
})
export class ModuleProspects {

}
