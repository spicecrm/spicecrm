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
import /*embed*/ {SalesdocsWithReferenceButton} from "./components/salesdocswithreferencebutton";
import /*embed*/ {SalesdocsWithReferenceTypeModal} from "./components/salesdocswithreferencetypemodal";
import /*embed*/ {SalesdocsWithReferenceSelectItemsModal} from "./components/salesdocswithreferenceselectitemsmodal";
import /*embed*/ {SalesDocsEquipmentPanel } from './components/salesdocsequipmentpanel';
import /*embed*/ {SalesDocsEquipmentItem } from './components/salesdocsequipmentitem';
import /*embed*/ {SalesVoucherRedeemButton } from './components/salesvoucherredeembutton';
import /*embed*/ {SalesVoucherRedeemModal } from './components/salesvoucherredeemmodal';

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
        SalesdocsWithReferenceButton,
        SalesdocsWithReferenceTypeModal,
        SalesdocsWithReferenceSelectItemsModal,
        SalesDocsEquipmentItem,
        SalesDocsEquipmentPanel,
        SalesVoucherRedeemButton,
        SalesVoucherRedeemModal
    ]
})
export class ModuleSalesDocs {
}
