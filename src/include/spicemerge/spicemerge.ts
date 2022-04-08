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

import /*embed*/ {objectmerge} from './services/objectmerge.service';

import /*embed*/ {ObjectMergeModal} from './components/objectmergemodal';
import /*embed*/ {ObjectMergeModalRecords} from './components/objectmergemodalrecords';
import /*embed*/ {ObjectMergeModalData} from './components/objectmergemodaldata';
import /*embed*/ {ObjectMergeModalDataField} from './components/objectmergemodaldatafield';
import /*embed*/ {ObjectMergeModalExecute} from './components/objectmergemodalexecute';

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
