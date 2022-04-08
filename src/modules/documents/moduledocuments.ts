/**
 * @module ModuleDocuments
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {FormsModule} from "@angular/forms";

import /*embed*/ {fieldDocumentRevisionStatus} from "./fields/fielddocumentrevisionstatus";
import /*embed*/ {DocumentCreateRevisionButton} from "./components/documentcreaterevisionbutton";
import /*embed*/ {DocumentCreateRevisionModal} from "./components/documentcreaterevisionmodal";




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
        fieldDocumentRevisionStatus,
        DocumentCreateRevisionButton,
        DocumentCreateRevisionModal
    ]
})
export class ModuleDocuments {}
