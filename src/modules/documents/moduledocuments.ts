/**
 * @module ModuleCurrencies
 */

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';
import {DirectivesModule} from "../../directives/directives";
import {VersionManagerService} from "../../services/versionmanager.service";
import {FormsModule} from "@angular/forms";

import /*embed*/ {fieldDocumentRevisionStatus} from "./fields/fielddocumentrevisionstatus";




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
        fieldDocumentRevisionStatus
    ]
})
export class ModuleDocuments {}
