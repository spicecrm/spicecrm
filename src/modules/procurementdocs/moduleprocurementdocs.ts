/**
 * @module ModuleProcurementDocs
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
import {procurementdocrecord} from './services/procurementdocrecord';

/**
 * pipes
 */
import {ProcurementDocsItemsParentPipe} from './pipes/procurementdocsitemsparentpipe';

/**
 * fields
 */
import {fieldProcurementDocTypes} from './fields/fieldprocurementdoctypes';
import {fieldProcurementDocItemTypes} from './fields/fieldprocurementdocitemtypes';
import {fieldProcurementDocTaxCategories} from './fields/fieldprocurementdoctaxcategories';
import {ProcurementDocsItemsContainer} from './components/procurementdocsitemscontainer';
import {ProcurementDocsItemHeader} from "./components/procurementdocsitemheader";
import {ProcurementDocsItemFooter} from "./components/procurementdocsitemfooter";
import {ProcurementDocsItemContainer} from "./components/procurementdocsitemcontainer";
import {ProcurementDocsItemDetailsContainer} from "./components/procurementdocsitemdetailscontainer";
import {ProcurementDocsItemsAddProduct} from './components/procurementdocsitemsaddproduct';
import {ProcurementDocsItemsAddProductGroup} from './components/procurementdocsitemsaddproductgroup';
import {ProcurementDocsItemsAddProductVariant} from "./components/procurementdocsitemsaddproductvariant";
import {ProcurementDocsItemsAddText} from "./components/procurementdocsitemsaddtext";
import {ProcurementDocsItemsDeletedPipe} from './pipes/procurementdocsitemsdeletedpipe';
import {ProcurementDocsItemsParentSelector} from './components/procurementdocsitemsparentselector';
import {ProcurementDocsNewButton} from "./components/procurementdocsnewbutton";
import {ProcurementDocsAddBasics} from "./components/procurementdocsaddbasics";
import {ProcurementDocsAddMain} from "./components/procurementdocsaddmain";
import {ProcurementDocsRecordView} from "./components/procurementdocsrecordview";
import {ProcurementDocsItemsAddTypeSelector} from "./components/procurementdocsitemsaddtypeselector";
import {ProcurementDocsGlobalNavigationMenuItemActionNew} from "./components/procurementdocsglobalnavigationmenuitemactionnew";
import {ProcurementDocsRejectButton} from "./components/procurementdocsrejectbutton";
import {ProcurementDocsRejectModal} from "./components/procurementdocsrejectmodal";
import {ProcurementDocsRejectItemsContainer} from "./components/procurementdocsrejectitemscontainer";
import {ProcurementDocsItemRejectContainer} from "./components/procurementdocsitemrejectcontainer";
import {ProcurementDocsConvertButton} from './components/procurementdocsconvertbutton';
import {ProcurementDocsConvertSelectType} from './components/procurementdocsconvertselecttype';
import {ProcurementDocsConvertModalItemHeader} from './components/procurementdocsconvertmodalitemheader';
import {ProcurementDocsConvertModalItem} from './components/procurementdocsconvertmodalitem';
import {ProcurementDocsConvertModal} from './components/procurementdocsconvertmodal';
import {ProcurementDocsFlowButton} from './components/procurementdocsflowbutton';
import {ProcurementDocsFlowTableRow} from './components/procurementdocsflowtablerow';
import {ProcurementDocsFlowModal} from './components/procurementdocsflowmodal';

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
        ProcurementDocsItemsContainer,
        ProcurementDocsItemHeader,
        ProcurementDocsItemFooter,
        ProcurementDocsItemContainer,
        ProcurementDocsItemDetailsContainer,
        ProcurementDocsItemsAddProduct,
        ProcurementDocsItemsAddProductGroup,
        ProcurementDocsItemsAddProductVariant,
        ProcurementDocsItemsAddText,
        ProcurementDocsItemsParentSelector,
        ProcurementDocsItemsParentPipe,
        fieldProcurementDocTypes,
        fieldProcurementDocItemTypes,
        fieldProcurementDocTaxCategories,
        ProcurementDocsItemsDeletedPipe,
        ProcurementDocsNewButton,
        ProcurementDocsAddBasics,
        ProcurementDocsAddMain,
        ProcurementDocsRecordView,
        ProcurementDocsItemsAddTypeSelector,
        ProcurementDocsGlobalNavigationMenuItemActionNew,
        ProcurementDocsRejectButton,
        ProcurementDocsRejectModal,
        ProcurementDocsRejectItemsContainer,
        ProcurementDocsItemRejectContainer,
        ProcurementDocsConvertButton,
        ProcurementDocsConvertSelectType,
        ProcurementDocsConvertModalItemHeader,
        ProcurementDocsConvertModalItem,
        ProcurementDocsConvertModal,
        ProcurementDocsFlowButton,
        ProcurementDocsFlowModal,
        ProcurementDocsFlowTableRow
    ]
})
export class ModuleProcurementDocs {
}
