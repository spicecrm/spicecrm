/**
 * @module ModuleSalesDocs
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {SalesDocsItemsParentPipe} from './pipes/salesdocsitemsparentpipe';

import /*embed*/ {SalesDocsItemsContainer} from './components/salesdocsitemscontainer';
import /*embed*/ {SalesDocsItemsDisplay} from './components/salesdocsitemsdisplay';
import /*embed*/ {SalesDocsItemsEdit} from './components/salesdocsitemsedit';
import /*embed*/ {SalesDocsItemsAddProduct} from './components/salesdocsitemsaddproduct';
import /*embed*/ {SalesDocsPrintButton} from './components/salesdocsprintbutton';
import /*embed*/ {fieldSalesdocTypes} from './components/fieldsalesdoctypes';
import /*embed*/ {SalesDocsItemsDeletedPipe} from './pipes/salesdocsitemsdeletedpipe';
import /*embed*/ {SalesDocsItemsParentSelector} from './components/salesdocsitemsparentselector';
import /*embed*/ {SalesdocsNewButton} from "./components/salesdocsnewbutton";
import /*embed*/ {SalesDocsAddBasics} from "./components/salesdocsaddbasics";
import /*embed*/ {SalesDocsAddMain} from "./components/salesdocsaddmain";
import /*embed*/ {SalesDocsRecordView} from "./components/salesdocsrecordview";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
    ],
    declarations: [
        SalesDocsItemsContainer,
        SalesDocsItemsDisplay,
        SalesDocsItemsEdit,
        SalesDocsItemsAddProduct,
        SalesDocsPrintButton,
        SalesDocsItemsParentSelector,
        SalesDocsItemsParentPipe,
        fieldSalesdocTypes,
        SalesDocsItemsDeletedPipe,
        SalesdocsNewButton,
        SalesDocsAddBasics,
        SalesDocsAddMain,
        SalesDocsRecordView
    ]
})
export class ModuleSalesDocs {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}