/**
 * @module ModuleSalesDocs
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {VersionManagerService} from '../../services/versionmanager.service';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';


import /*embed*/ {SalesDocsItemsContainer} from './components/salesdocsitemscontainer';
import /*embed*/ {SalesDocsItemsDisplay} from './components/salesdocsitemsdisplay';
import /*embed*/ {SalesDocsItemsEdit} from './components/salesdocsitemsedit';
import /*embed*/ {SalesDocsItemsAddProduct} from './components/salesdocsitemsaddproduct';
import /*embed*/ {SalesDocsPrintButton} from './components/salesdocsprintbutton';
import /*embed*/ {SalesDocsItemsParentSelector, SalesDocsItemsParentPipe} from './components/salesdocsitemsparentselector';


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
        SalesDocsItemsParentPipe
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