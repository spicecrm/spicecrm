/**
 * @module ModuleSalesDocs
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

import /*embed*/ {SalesDocsItemsParentPipe} from './pipes/salesdocsitemsparentpipe';

import /*embed*/ {SalesDocsItemsContainer} from './components/salesdocsitemscontainer';
import /*embed*/ {SalesDocsItemHeader} from "./components/salesdocsitemheader";
import /*embed*/ {SalesDocsItemContainer} from "./components/salesdocsitemcontainer";
import /*embed*/ {SalesDocsItemDetailsContainer} from "./components/salesdocsitemdetailscontainer";
import /*embed*/ {SalesDocsItemsDisplay} from './components/salesdocsitemsdisplay';
import /*embed*/ {SalesDocsItemsEdit} from './components/salesdocsitemsedit';
import /*embed*/ {SalesDocsItemsAddProduct} from './components/salesdocsitemsaddproduct';
import /*embed*/ {SalesDocsItemsAddProductGroup} from './components/salesdocsitemsaddproductgroup';
import /*embed*/ {SalesDocsItemsAddProductVariant} from "./components/salesdocsitemsaddproductvariant";
import /*embed*/ {SalesDocsPrintButton} from './components/salesdocsprintbutton';
import /*embed*/ {fieldSalesdocTypes} from './components/fieldsalesdoctypes';
import /*embed*/ {fieldSalesdocItemTypes} from './components/fieldsalesdocitemtypes';
import /*embed*/ {fieldSalesdocTaxCategories} from './components/fieldsalesdoctaxcategories';
import /*embed*/ {SalesDocsItemsDeletedPipe} from './pipes/salesdocsitemsdeletedpipe';
import /*embed*/ {SalesDocsItemsParentSelector} from './components/salesdocsitemsparentselector';
import /*embed*/ {SalesdocsNewButton} from "./components/salesdocsnewbutton";
import /*embed*/ {SalesDocsAddBasics} from "./components/salesdocsaddbasics";
import /*embed*/ {SalesDocsAddMain} from "./components/salesdocsaddmain";
import /*embed*/ {SalesDocsRecordView} from "./components/salesdocsrecordview";
import /*embed*/ {SalesDocsItemsAddTypeSelector} from "./components/salesdocsitemsaddtypeselector";
import {DirectivesModule} from "../../directives/directives";

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
        SalesDocsItemsContainer,
        SalesDocsItemHeader,
        SalesDocsItemContainer,
        SalesDocsItemDetailsContainer,
        SalesDocsItemsDisplay,
        SalesDocsItemsEdit,
        SalesDocsItemsAddProduct,
        SalesDocsItemsAddProductGroup,
        SalesDocsItemsAddProductVariant,
        SalesDocsPrintButton,
        SalesDocsItemsParentSelector,
        SalesDocsItemsParentPipe,
        fieldSalesdocTypes,
        fieldSalesdocItemTypes,
        fieldSalesdocTaxCategories,
        SalesDocsItemsDeletedPipe,
        SalesdocsNewButton,
        SalesDocsAddBasics,
        SalesDocsAddMain,
        SalesDocsRecordView,
        SalesDocsItemsAddTypeSelector
    ]
})
export class ModuleSalesDocs {
}