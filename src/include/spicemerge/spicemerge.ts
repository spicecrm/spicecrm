/**
 * @module ModuleSpiceMerge
 */
import {CommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {DirectivesModule} from "../../directives/directives";
import {ObjectFields} from "../../objectfields/objectfields";
import {GlobalComponents} from "../../globalcomponents/globalcomponents";
import {ObjectComponents} from "../../objectcomponents/objectcomponents";
import {SystemComponents} from "../../systemcomponents/systemcomponents";

import {objectmerge} from './services/objectmerge.service';

import {ObjectMergeModal} from './components/objectmergemodal';
import {ObjectMergeModalRecords} from './components/objectmergemodalrecords';
import {ObjectMergeModalData} from './components/objectmergemodaldata';
import {ObjectMergeModalDataField} from './components/objectmergemodaldatafield';
import {ObjectMergeModalExecute} from './components/objectmergemodalexecute';

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
        ObjectMergeModal,
        ObjectMergeModalRecords,
        ObjectMergeModalData,
        ObjectMergeModalDataField,
        ObjectMergeModalExecute
    ]
})
export class ModuleSpiceMerge {}
