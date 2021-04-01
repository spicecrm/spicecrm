/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
import {DirectivesModule} from "../../directives/directives";

/**
 * pipes
 */
import /*embed*/ {SalesDocsItemsParentPipe} from './pipes/salesdocsitemsparentpipe';

/**
 * fields
 */
import /*embed*/ {fieldSalesdocTypes} from './fields/fieldsalesdoctypes';
import /*embed*/ {fieldSalesdocItemTypes} from './fields/fieldsalesdocitemtypes';
import /*embed*/ {fieldSalesdocTaxCategories} from './fields/fieldsalesdoctaxcategories';
import /*embed*/ {SalesDocsItemsContainer} from './components/salesdocsitemscontainer';
import /*embed*/ {SalesDocsItemHeader} from "./components/salesdocsitemheader";
import /*embed*/ {SalesDocsItemFooter} from "./components/salesdocsitemfooter";
import /*embed*/ {SalesDocsItemContainer} from "./components/salesdocsitemcontainer";
import /*embed*/ {SalesDocsItemDetailsContainer} from "./components/salesdocsitemdetailscontainer";
import /*embed*/ {SalesDocsItemsAddProduct} from './components/salesdocsitemsaddproduct';
import /*embed*/ {SalesDocsItemsAddProductGroup} from './components/salesdocsitemsaddproductgroup';
import /*embed*/ {SalesDocsItemsAddProductVariant} from "./components/salesdocsitemsaddproductvariant";
import /*embed*/ {SalesDocsItemsAddText} from "./components/salesdocsitemsaddtext";
import /*embed*/ {SalesDocsPrintButton} from './components/salesdocsprintbutton';
import /*embed*/ {SalesDocsItemsDeletedPipe} from './pipes/salesdocsitemsdeletedpipe';
import /*embed*/ {SalesDocsItemsParentSelector} from './components/salesdocsitemsparentselector';
import /*embed*/ {SalesdocsNewButton} from "./components/salesdocsnewbutton";
import /*embed*/ {SalesDocsAddBasics} from "./components/salesdocsaddbasics";
import /*embed*/ {SalesDocsAddMain} from "./components/salesdocsaddmain";
import /*embed*/ {SalesDocsRecordView} from "./components/salesdocsrecordview";
import /*embed*/ {SalesDocsItemsAddTypeSelector} from "./components/salesdocsitemsaddtypeselector";
import /*embed*/ {SalesDocsGlobalNavigationMenuItemActionNew} from "./components/salesdocsglobalnavigationmenuitemactionnew";
import /*embed*/ {SalesdocsRejectButton} from "./components/salesdocsrejectbutton";
import /*embed*/ {SalesdocsRejectModal} from "./components/salesdocsrejectmodal";
import /*embed*/ {SalesDocsRejectItemsContainer} from "./components/salesdocsrejectitemscontainer";
import /*embed*/ {SalesDocsItemRejectContainer} from "./components/salesdocsitemrejectcontainer";
import /*embed*/ {SalesDocsEquipmentPanel} from './components/salesdocsequipmentpanel';
import /*embed*/ {SalesDocsEquipmentItem} from './components/salesdocsequipmentitem';
import /*embed*/ {SalesVoucherRedeemButton} from './components/salesvoucherredeembutton';
import /*embed*/ {SalesVoucherRedeemModal} from './components/salesvoucherredeemmodal';
import /*embed*/ {SalesDocsConvertButton} from './components/salesdocsconvertbutton';
import /*embed*/ {SalesDocsConvertSelectType} from './components/salesdocsconvertselecttype';
import /*embed*/ {SalesDocsConvertModalItemHeader} from './components/salesdocsconvertmodalitemheader';
import /*embed*/ {SalesDocsConvertModalItem} from './components/salesdocsconvertmodalitem';
import /*embed*/ {SalesDocsConvertModal} from './components/salesdocsconvertmodal';

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
        SalesDocsItemFooter,
        SalesDocsItemContainer,
        SalesDocsItemDetailsContainer,
        SalesDocsItemsAddProduct,
        SalesDocsItemsAddProductGroup,
        SalesDocsItemsAddProductVariant,
        SalesDocsItemsAddText,
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
        SalesDocsItemsAddTypeSelector,
        SalesDocsGlobalNavigationMenuItemActionNew,
        SalesdocsRejectButton,
        SalesdocsRejectModal,
        SalesDocsRejectItemsContainer,
        SalesDocsItemRejectContainer,
        SalesDocsEquipmentItem,
        SalesDocsEquipmentPanel,
        SalesVoucherRedeemButton,
        SalesVoucherRedeemModal,
        SalesDocsConvertButton,
        SalesDocsConvertSelectType,
        SalesDocsConvertModalItemHeader,
        SalesDocsConvertModalItem,
        SalesDocsConvertModal
    ]
})
export class ModuleSalesDocs {
}
