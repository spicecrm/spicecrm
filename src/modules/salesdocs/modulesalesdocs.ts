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
 * services
 */
import {salesdocrecord} from './services/salesdocrecord';

/**
 * pipes
 */
import {SalesDocsItemsParentPipe} from './pipes/salesdocsitemsparentpipe';

/**
 * fields
 */
import {fieldSalesdocTypes} from './fields/fieldsalesdoctypes';
import {fieldSalesdocItemTypes} from './fields/fieldsalesdocitemtypes';
import {fieldSalesdocTaxCategories} from './fields/fieldsalesdoctaxcategories';
import {SalesDocsItemsContainer} from './components/salesdocsitemscontainer';
import {SalesDocsItemHeader} from "./components/salesdocsitemheader";
import {SalesDocsItemFooter} from "./components/salesdocsitemfooter";
import {SalesDocsItemContainer} from "./components/salesdocsitemcontainer";
import {SalesDocsItemDetailsContainer} from "./components/salesdocsitemdetailscontainer";
import {SalesDocsItemsAddProduct} from './components/salesdocsitemsaddproduct';
import {SalesDocsItemsAddProductGroup} from './components/salesdocsitemsaddproductgroup';
import {SalesDocsItemsAddProductVariant} from "./components/salesdocsitemsaddproductvariant";
import {SalesDocsItemsAddText} from "./components/salesdocsitemsaddtext";
import {SalesDocsItemsDeletedPipe} from './pipes/salesdocsitemsdeletedpipe';
import {SalesDocsItemsParentSelector} from './components/salesdocsitemsparentselector';
import {SalesdocsNewButton} from "./components/salesdocsnewbutton";
import {SalesDocsAddBasics} from "./components/salesdocsaddbasics";
import {SalesDocsAddMain} from "./components/salesdocsaddmain";
import {SalesDocsRecordView} from "./components/salesdocsrecordview";
import {SalesDocsItemsAddTypeSelector} from "./components/salesdocsitemsaddtypeselector";
import {SalesDocsGlobalNavigationMenuItemActionNew} from "./components/salesdocsglobalnavigationmenuitemactionnew";
import {SalesdocsRejectButton} from "./components/salesdocsrejectbutton";
import {SalesdocsRejectModal} from "./components/salesdocsrejectmodal";
import {SalesDocsRejectItemsContainer} from "./components/salesdocsrejectitemscontainer";
import {SalesDocsItemRejectContainer} from "./components/salesdocsitemrejectcontainer";
import {SalesDocsEquipmentPanel} from './components/salesdocsequipmentpanel';
import {SalesDocsEquipmentItem} from './components/salesdocsequipmentitem';
import {SalesVoucherRedeemButton} from './components/salesvoucherredeembutton';
import {SalesVoucherRedeemModal} from './components/salesvoucherredeemmodal';
import {SalesDocsConvertButton} from './components/salesdocsconvertbutton';
import {SalesDocsConvertSelectType} from './components/salesdocsconvertselecttype';
import {SalesDocsConvertModalItemHeader} from './components/salesdocsconvertmodalitemheader';
import {SalesDocsConvertModalItem} from './components/salesdocsconvertmodalitem';
import {SalesDocsConvertModal} from './components/salesdocsconvertmodal';
import {SalesDocsFlowButton} from './components/salesdocsflowbutton';
import {SalesDocsFlowTableRow} from './components/salesdocsflowtablerow';
import {SalesDocsFlowModal} from './components/salesdocsflowmodal';
import {fieldSalesdocItemAmount} from "./fields/fieldsalesdocitemamount";
import {SalesDocsItemCalculate} from "./components/salesdocsitemcalculate";

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
        SalesDocsItemCalculate,
        SalesDocsItemsParentSelector,
        SalesDocsItemsParentPipe,
        fieldSalesdocTypes,
        fieldSalesdocItemTypes,
        fieldSalesdocTaxCategories,
        fieldSalesdocItemAmount,
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
        SalesDocsConvertModal,
        SalesDocsFlowButton,
        SalesDocsFlowModal,
        SalesDocsFlowTableRow
    ]
})
export class ModuleSalesDocs {
}
