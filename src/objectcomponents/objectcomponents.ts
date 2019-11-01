/**
 * @module ObjectComponents
 */
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {
    NgModule
} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {DirectivesModule} from "../directives/directives";
import {ObjectFields} from '../objectfields/objectfields';
import {SystemComponents} from '../systemcomponents/systemcomponents';

import {loginCheck} from '../services/login.service';
import {metadata, aclCheck} from '../services/metadata.service';
import {canNavigateAway} from '../services/navigation.service';
import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {listfilters} from './services/listfilters.service';
import /*embed*/ {objectimport} from './services/objectimport.service';


import /*embed*/ {ObjectKeyValuesPipe} from "./pipes/objectkeyvalue.pipe";
import /*embed*/ {ObjectFieldFilterPipe} from "./pipes/objectfieldfilter.pipe";

import /*embed*/ {ObjectListViewHeader} from './components/objectlistviewheader';
import /*embed*/ {ObjectListViewHeaderListSelector} from './components/objectlistviewheaderlistselector';
import /*embed*/ {ObjectList} from './components/objectlist';
import /*embed*/ {ObjectListViewContainer} from './components/objectlistviewcontainer';
import /*embed*/ {ObjectListView} from './components/objectlistview';
import /*embed*/ {ObjectActionContainerItem} from './components/objectactioncontaineritem';
import /*embed*/ {ObjectActionContainer} from './components/objectactioncontainer';
import /*embed*/ {ObjectListHeader} from './components/objectlistheader';
import /*embed*/ {ObjectListHeaderActionMenu} from './components/objectlistheaderactionmenu';
import /*embed*/ {ObjectListHeaderActionsExportCSVButton} from './components/objectlistheaderactionsexportcsvbutton';
import /*embed*/ {ObjectListHeaderActionsExportCSVSelectFields} from './components/objectlistheaderactionsexportcsvselectfields';
import /*embed*/ {ObjectListHeaderActionsExportTargetlistButton} from './components/objectlistheaderactionsexporttargetlistbutton';
import /*embed*/ {ObjectListHeaderActionsExportTargetlistModal} from './components/objectlistheaderactionsexporttargetlistmodal';
import /*embed*/ {ObjectListHeaderActionsSelectAllButton} from "./components/objectlistheaderactionsselectallbutton";
import /*embed*/ {ObjectListHeaderActionsUnselectAllButton} from "./components/objectlistheaderactionsunselectallbutton";

import /*embed*/ {ObjectListItem} from './components/objectlistitem';
import /*embed*/ {ObjectListItemField} from './components/objectlistitemfield';
import /*embed*/ {ObjectActionMenu} from './components/objectactionmenu';
import /*embed*/ {ObjectActionsetMenu} from './components/objectactionsetmenu';
import /*embed*/ {ObjectActionsetMenuContainer} from './components/objectactionsetmenucontainer';
import /*embed*/ {ObjectActionsetMenuContainerEdit} from './components/objectactionsetmenucontaineredit';
import /*embed*/ {ObjectActionsetMenuContainerDelete} from './components/objectactionsetmenucontainerdelete';
import /*embed*/ {ObjectListTypes} from './components/objectlisttypes';

import /*embed*/ {ObjectActionEditButton} from './components/objectactioneditbutton';
import /*embed*/ {ObjectActionDeleteButton} from './components/objectactiondeletebutton';
import /*embed*/ {ObjectActionAuditlogButton} from './components/objectactionauditlogbutton';
import /*embed*/ {ObjectActionOpenButton} from './components/objectactionopenbutton';
import /*embed*/ {ObjectActionCancelButton} from './components/objectactioncancelbutton';
import /*embed*/ {ObjectActionModalSaveButton} from './components/objectactionmodalsavebutton';
import /*embed*/ {ObjectActionRemoveButton} from "./components/objectactionremovebutton";
import /*embed*/ {ObjectActionAuditlogModal} from './components/objectactionauditlogmodal';
import /*embed*/ {ObjectActionNewButton} from './components/objectactionnewbutton';
import /*embed*/ {ObjectActionDuplicateButton} from './components/objectactionduplicatebutton';
import /*embed*/ {ObjectActionSaveButton} from './components/objectactionsavebutton';
import /*embed*/ {ObjectActionSaveRelatedButton} from './components/objectactionsaverelatedbutton';
import /*embed*/ {ObjectActionNewrelatedButton} from './components/objectactionnewrelatedbutton';
import /*embed*/ {ObjectActionNewCopyRuleBeanButton, ObjectActionNewCopyRuleBeanButtonModelHelper} from './components/objectactionnewcopyrulebeanbutton';
import /*embed*/ {ObjectActionImportButton} from './components/objectactionimportbutton';
import /*embed*/ {ObjectReminderButton} from './components/objectreminderbutton';
import /*embed*/ {ObjectActionSelectButton} from './components/objectactionselectbutton';
import /*embed*/ {ObjectActionBeanToMailButton} from './components/objectactionbeantomailbutton';
import /*embed*/ {ObjectActionMailModal} from './components/objectactionmailmodal';

import /*embed*/ {ObjectEditModal} from './components/objecteditmodal';
import /*embed*/ {ObjectEditModalWReference} from './components/objecteditmodalwreference';
import /*embed*/ {ObjectEditModalDialogContainer} from './components/objecteditmodaldialogcontainer';
import /*embed*/ {ObjectEditModalDialogDuplicates} from './components/objecteditmodaldialogduplicates';
import /*embed*/ {ObjectEditModalDialogDuplicatesPanel} from './components/objecteditmodaldialogduplicatespanel';
import /*embed*/ {ObjectOptimisticLockingModal} from './components/objectoptimisticlockingmodal';
import /*embed*/ {ObjectOptimisticLockingModalDataField} from "./components/objectoptimisticlockingmodaldatafield";
import /*embed*/ {ObjectOptimisticLockingModalChange} from "./components/objectoptimisticlockingmodalchange";

import /*embed*/ {ObjectListViewAggregatesPanel} from './components/objectlistviewaggregatespanel';
import /*embed*/ {ObjectListViewAggregate} from './components/objectlistviewaggregate';
import /*embed*/ {ObjectListViewAggregateItem} from './components/objectlistviewaggregateitem';
import /*embed*/ {ObjectListViewAggregateItemTerm} from './components/objectlistviewaggregateitemterm';
import /*embed*/ {ObjectListViewAggregateItemRange} from './components/objectlistviewaggregateitemrange';
import /*embed*/ {ObjectListViewTagsAggregate} from './components/objectlistviewtagsaggregate';

import /*embed*/ {ObjectListViewFilterPanel} from './components/objectlistviewfilterpanel';
import /*embed*/ {ObjectListViewFilterPanelExportButton} from './components/objectlistviewfilterpanelexportbutton';
import /*embed*/ {ObjectListViewFilterPanelExportTargetlist} from './components/objectlistviewfilterpanelexporttargetlist';
import /*embed*/ {ObjectListViewFilterPanelFilterMyItems} from './components/objectlistviewfilterpanelfiltermyitems';
import /*embed*/ {ObjectListViewFilterPanelFilterItem} from './components/objectlistviewfilterpanelfilteritem';
import /*embed*/ {ObjectListViewFilterPanelFilterText} from './components/objectlistviewfilterpanelfiltertext';
import /*embed*/ {ObjectListViewFilterPanelFilterEnum} from './components/objectlistviewfilterpanelfilterenum';
import /*embed*/ {ObjectListViewFilterPanelFilterBool} from './components/objectlistviewfilterpanelfilterbool';
import /*embed*/ {ObjectListViewFilterPanelFilterDate} from './components/objectlistviewfilterpanelfilterdate';

import /*embed*/ {ObjectListViewSettings} from './components/objectlistviewsettings';
import /*embed*/ {ObjectListViewSettingsAddlistModal} from './components/objectlistviewsettingsaddlistmodal';
import /*embed*/ {ObjectListViewSettingsDeletelistModal} from './components/objectlistviewsettingsdeletelistmodal';
import /*embed*/ {ObjectListViewSettingsSetfieldsModal} from './components/objectlistviewsettingssetfieldsmodal';
import /*embed*/ {ObjectRecordViewContainer} from './components/objectrecordviewcontainer';
import /*embed*/ {ObjectRecordView} from './components/objectrecordview';
import /*embed*/ {ObjectRecordViewDetail1} from './components/objectrecordviewdetail1';
import /*embed*/ {ObjectRecordViewDetail2and1} from './components/objectrecordviewdetail2and1';
import /*embed*/ {ObjectRecordViewDetailsplit} from './components/objectrecordviewdetailsplit';
import /*embed*/ {ObjectPageHeader} from './components/objectpageheader';
import /*embed*/ {ObjectPageHeaderTags} from './components/objectpageheadertags';
import /*embed*/ {ObjectPageHeaderTagPicker} from './components/objectpageheadertagpicker';
import /*embed*/ {ObjectPageHeaderDetails} from './components/objectpageheaderdetails';
import /*embed*/ {ObjectPageHeaderDetailRow} from './components/objectpageheaderdetailrow';
import /*embed*/ {ObjectPageHeaderDetailRowField} from './components/objectpageheaderdetailrowfield';
import /*embed*/ {ObjectTabContainerItem, ObjectTabContainer, ObjectTabContainerItemHeader} from './components/objecttabcontainer';
import /*embed*/ {ObjectVerticalTabContainer} from './components/objectverticaltabcontainer';
import /*embed*/ {ObjectVerticalTabContainerItem} from './components/objectverticaltabcontaineritem';
import /*embed*/ {ObjectVerticalTabContainerItemHeader} from './components/objectverticaltabcontaineritemheader';
import /*embed*/ {ObjectRelateContainer} from './components/objectrelatecontainer';
import /*embed*/ {ObjectRelatedCardHeader} from './components/objectrelatedcardheader';
import /*embed*/ {ObjectRelatedCard} from './components/objectrelatedcard';
import /*embed*/ {ObjectRelatedCardFooter} from './components/objectrelatedcardfooter';
import /*embed*/ {ObjectRelatedList} from './components/objectrelatedlist';
import /*embed*/ {ObjectRelatedlistList} from './components/objectrelatedlistlist';
import /*embed*/ {ObjectRelatedListItem} from './components/objectrelatedlistitem';
import /*embed*/ {ObjectRelatedlistTiles} from './components/objectrelatedlisttiles';
import /*embed*/ {ObjectRelatedCardTile} from './components/objectrelatedcardtile';
import /*embed*/ {ObjectRelatedlistFiles} from './components/objectrelatedlistfiles';
import /*embed*/ {ObjectRelatedCardFile} from './components/objectrelatedcardfile';
import /*embed*/ {ObjectRelatedDuplicates} from './components/objectrelatedduplicates';
import /*embed*/ {ObjectRelatedDuplicateTile} from './components/objectrelatedduplicatetile';
import /*embed*/ {ObjectRelatedlistAll} from './components/objectrelatedlistall';
import /*embed*/ {ObjectRelatedlistTable} from './components/objectrelatedlisttable';
import /*embed*/ {ObjectRelatedlistSequenced} from './components/objectrelatedlistsequenced';
import /*embed*/ {ObjectRelatedListSequencedItem} from './components/objectrelatedlistsequenceditem';

import /*embed*/ {ObjectFileActionMenu} from './components/objectfileactionmenu';

import /*embed*/ {ObjectStatusNetworkButton} from './components/objectstatusnetworkbutton';
import /*embed*/ {ObjectStatusNetworkButtonItem} from './components/objectstatusnetworkbuttonitem';

import /*embed*/ {ObjectRecordFieldset} from './components/objectrecordfieldset';
import /*embed*/ {ObjectRecordFieldsetField} from './components/objectrecordfieldsetfield';
import /*embed*/ {ObjectRecordFieldsetHorizontalList} from './components/objectrecordfieldsethorizontallist';
import /*embed*/ {ObjectRecordFieldsetContainer} from './components/objectrecordfieldsetcontainer';

import /*embed*/ {ObjectRecordChecklist} from './components/objectrecordchecklist';
import /*embed*/ {ObjectRecordChecklistItem} from './components/objectrecordchecklistitem';

import /*embed*/ {ObjectRecordDetails} from './components/objectrecorddetails';
import /*embed*/ {ObjectRecordDetailsTab} from './components/objectrecorddetailstab';
import /*embed*/ {ObjectRecordDetailsModelstateTab} from './components/objectrecorddetailsmodelstatetab';
import /*embed*/ {ObjectRecordDetailsFooter} from './components/objectrecorddetailsfooter';
import /*embed*/ {ObjectRecordAdministrationTab} from './components/objectrecordadministrationtab';
import /*embed*/ {ObjectRecordDetailsTabRow} from './components/objectrecorddetailstabrow';
import /*embed*/ {ObjectRecordDetailsTabRowField} from './components/objectrecorddetailstabrowfield';
import /*embed*/ {ObjectRecordTabbedDetails} from './components/objectrecordtabbeddetails';
import /*embed*/ {ObjectRecordTabbedDetailsTab} from './components/objectrecordtabbeddetailstab';
import /*embed*/ {ObjectRecordDetailsRelatedListTab} from './components/objectrecorddetailsrelatedlisttab';

import /*embed*/ {ObjectModalModuleLookup} from './components/objectmodalmodulelookup';
import /*embed*/ {ObjectSelectButton} from './components/objectselectbutton';

import /*embed*/ {ObjectImport} from './components/objectimport';
import /*embed*/ {ObjectImportSelect} from './components/objectimportselect';
import /*embed*/ {ObjectImportMap} from './components/objectimportmap';
import /*embed*/ {ObjectImportFixed} from './components/objectimportfixed';
import /*embed*/ {ObjectImportCheck} from './components/objectimportcheck';
import /*embed*/ {ObjectImportUpdate} from "./components/objectimportupdate";
import /*embed*/ {ObjectImportResult} from './components/objectimportresult';

import /*embed*/ {ObjectMergeButton} from './components/objectmergebutton';

import /*embed*/ {ObjectAddresses, ObjectAddressesPipe} from './components/objectaddresses';
import /*embed*/ {ObjectAddress} from './components/objectaddress';

import /*embed*/ {ObjectGDPRModal} from './components/objectgdprmodal';

import /*embed*/ {ObjectRowItemComponent} from "./components/objectrowitem";
import /*embed*/ {ObjectModalModuleDBLookup} from "./components/objectmodalmoduledblookup";
import /*embed*/ {ObjectActionOutputBeanModal} from "./components/objectactionoutputbeanmodal";
import /*embed*/ {ObjectActionOutputBeanButton} from "./components/objectactionoutputbeanbutton";
import /*embed*/ {ObjectActionVCardButton} from "./components/objectactionvcardbutton";


import /*embed*/ {ObjectTableRow} from "./components/objecttablerow";
import /*embed*/ {ObjectTable} from "./components/objecttable";

import /*embed*/ {ObjectModelPopover} from "./components/objectmodelpopover";
import /*embed*/ {ObjectModelPopoverHeader} from "./components/objectmodelpopoverheader";
import /*embed*/ {ObjectModelPopoverField} from "./components/objectmodelpopoverfield";
import /*embed*/ {ObjectModelPopoverRelated} from "./components/objectmodelpopoverrelated";
import /*embed*/ {ObjectModelPopoverRelatedItem} from "./components/objectmodelpopoverrelateditem";

import /*embed*/ {ObjectTexts} from "./components/objecttexts";
import /*embed*/ {ObjectTextsAddButton} from "./components/objecttextsaddbutton";
import /*embed*/ {ObjectTextsAddModal} from "./components/objecttextsaddmodal";

import /*embed*/ {ObjectRecordMessagesBadge} from "./components/objectrecordmessagesbadge";

/**
 * This module encapsulates various components that are used related to an object or the handling of multiple objects
 */
@NgModule({
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        ObjectFields,
        SystemComponents,
        DirectivesModule,
        RouterModule.forRoot([
            // {path: 'module/Home', component: ModuleHome, canActivate: [loginCheck]},
            {
                path: 'module/:module',
                    component: ObjectListViewContainer,
                canActivate: [loginCheck, canNavigateAway, aclCheck],
                data: {aclaction: 'list'}
            },
            {
                path: 'module/:module/import',
                component: ObjectImport,
                canActivate: [loginCheck, aclCheck],
                data: {aclaction: 'import'}
            },
            /*
            {
                path: 'module/:module/historysummary/:id',
                component: ObjectActivitiyTimelineSummary,
                canActivate: [loginCheck, aclCheck],
                data: {aclaction: 'view'}
            },
            */
            {
                path: 'module/:module/:id',
                component: ObjectRecordViewContainer,
                canActivate: [loginCheck, canNavigateAway, aclCheck],
                data: {aclaction: 'view'}
            },
            {path: 'module/:module/:id/:related/:link', component: ObjectRelatedlistAll, canActivate: [loginCheck]},
            {
                path: 'module/:module/:id/:related/:link/:fieldset',
                component: ObjectRelatedlistAll,
                canActivate: [loginCheck, aclCheck],
                data: {aclaction: 'view'}
            }
        ])],
    declarations: [
        ObjectListViewContainer,
        ObjectListView,
        ObjectListTypes,
        ObjectListViewHeader,
        ObjectListViewHeaderListSelector,
        ObjectList,
        ObjectListHeader,
        ObjectActionContainer,
        ObjectActionContainerItem,
        ObjectListHeaderActionMenu,
        ObjectListHeaderActionsExportCSVButton,
        ObjectFieldFilterPipe,
        ObjectListHeaderActionsExportCSVSelectFields,
        ObjectListHeaderActionsExportTargetlistButton,
        ObjectListHeaderActionsExportTargetlistModal,
        ObjectListHeaderActionsSelectAllButton,
        ObjectListHeaderActionsUnselectAllButton,
        ObjectListItem,
        ObjectListItemField,
        ObjectActionMenu,
        ObjectActionsetMenu,
        ObjectActionsetMenuContainer,
        ObjectActionsetMenuContainerEdit,
        ObjectActionsetMenuContainerDelete,
        ObjectListViewAggregatesPanel,
        ObjectListViewAggregate,
        ObjectListViewAggregateItem,
        ObjectListViewAggregateItemTerm,
        ObjectListViewAggregateItemRange,
        ObjectListViewTagsAggregate,
        ObjectListViewFilterPanel,
        ObjectListViewFilterPanelExportButton,
        ObjectListViewFilterPanelExportTargetlist,
        ObjectListViewFilterPanelFilterMyItems,
        ObjectListViewFilterPanelFilterItem,
        ObjectListViewFilterPanelFilterText,
        ObjectListViewFilterPanelFilterEnum,
        ObjectListViewFilterPanelFilterBool,
        ObjectListViewFilterPanelFilterDate,
        ObjectListViewSettings,
        ObjectListViewSettingsAddlistModal,
        ObjectListViewSettingsDeletelistModal,
        ObjectListViewSettingsSetfieldsModal,
        ObjectActionEditButton,
        ObjectActionSaveButton,
        ObjectActionSaveRelatedButton,
        ObjectActionDeleteButton,
        ObjectActionAuditlogButton,
        ObjectActionOpenButton,
        ObjectActionCancelButton,
        ObjectActionModalSaveButton,
        ObjectActionRemoveButton,
        ObjectActionAuditlogModal,
        ObjectGDPRModal,
        ObjectActionNewButton,
        ObjectActionDuplicateButton,
        ObjectActionNewrelatedButton,
        ObjectActionNewCopyRuleBeanButton,
        ObjectActionNewCopyRuleBeanButtonModelHelper,
        ObjectActionImportButton,
        ObjectActionSelectButton,
        ObjectEditModal,
        ObjectEditModalWReference,
        ObjectEditModalDialogContainer,
        ObjectEditModalDialogDuplicates,
        ObjectEditModalDialogDuplicatesPanel,
        ObjectOptimisticLockingModal,
        ObjectOptimisticLockingModalDataField,
        ObjectOptimisticLockingModalChange,
        ObjectRecordViewContainer,
        ObjectRecordView,
        ObjectRecordViewDetail1,
        ObjectRecordViewDetail2and1,
        ObjectRecordViewDetailsplit,
        ObjectPageHeader,
        ObjectPageHeaderTags,
        ObjectPageHeaderTagPicker,
        ObjectPageHeaderDetails,
        ObjectPageHeaderDetailRow,
        ObjectPageHeaderDetailRowField,
        ObjectTabContainer,
        ObjectTabContainerItem,
        ObjectTabContainerItemHeader,
        ObjectVerticalTabContainer,
        ObjectVerticalTabContainerItem,
        ObjectVerticalTabContainerItemHeader,
        ObjectRelateContainer,
        ObjectRelatedCard,
        ObjectRelatedCardHeader,
        ObjectRelatedCardFooter,
        ObjectRelatedList,
        ObjectRelatedlistList,
        ObjectRelatedListItem,
        ObjectRelatedlistTiles,
        ObjectRelatedCardTile,
        ObjectRelatedlistFiles,
        ObjectRelatedCardFile,
        ObjectRelatedDuplicates,
        ObjectRelatedDuplicateTile,
        ObjectRelatedlistAll,
        ObjectRelatedlistTable,
        ObjectRelatedlistSequenced,
        ObjectRelatedListSequencedItem,
        ObjectFileActionMenu,
        ObjectRecordDetails,
        ObjectRecordDetailsTab,
        ObjectRecordDetailsModelstateTab,
        ObjectRecordDetailsFooter,
        ObjectRecordAdministrationTab,
        ObjectRecordDetailsTabRow,
        ObjectRecordDetailsTabRowField,
        ObjectRecordChecklist,
        ObjectRecordChecklistItem,
        ObjectRecordTabbedDetails,
        ObjectRecordTabbedDetailsTab,
        ObjectRecordDetailsRelatedListTab,
        ObjectModalModuleLookup,
        ObjectSelectButton,
        ObjectReminderButton,
        ObjectActionBeanToMailButton,
        ObjectActionMailModal,
        ObjectImport,
        ObjectImportSelect,
        ObjectImportMap,
        ObjectImportFixed,
        ObjectImportCheck,
        ObjectImportUpdate,
        ObjectImportResult,
        ObjectMergeButton,
        ObjectAddresses,
        ObjectAddressesPipe,
        ObjectAddress,
        ObjectRecordFieldset,
        ObjectRecordFieldsetField,
        ObjectRecordFieldsetHorizontalList,
        ObjectRecordFieldsetContainer,
        ObjectRowItemComponent,
        ObjectModalModuleDBLookup,
        ObjectActionOutputBeanModal,
        ObjectActionOutputBeanButton,
        ObjectActionVCardButton,
        ObjectStatusNetworkButton,
        ObjectStatusNetworkButtonItem,
        ObjectKeyValuesPipe,
        ObjectTableRow,
        ObjectTable,
        ObjectModelPopover,
        ObjectModelPopoverHeader,
        ObjectModelPopoverField,
        ObjectModelPopoverRelated,
        ObjectModelPopoverRelatedItem,
        ObjectTexts,
        ObjectTextsAddButton,
        ObjectTextsAddModal,
        ObjectRecordMessagesBadge
    ],
    exports: [
        ObjectListViewHeader,
        ObjectList,
        ObjectListItem,
        ObjectPageHeader,
        ObjectPageHeaderDetails,
        ObjectPageHeaderDetailRow,
        ObjectActionContainer,
        ObjectActionMenu,
        ObjectActionsetMenu,
        ObjectSelectButton,
        ObjectRelatedList,
        ObjectRelatedlistTable,
        ObjectRelatedListItem,
        ObjectRecordFieldset,
        ObjectRecordFieldsetHorizontalList,
        ObjectRowItemComponent,
        ObjectTabContainerItemHeader,
        ObjectTableRow,
        ObjectTable,
        ObjectRelatedCard,
        ObjectRelatedCardHeader,
        ObjectRelatedCardFooter,
        ObjectRecordDetails,
        ObjectRecordDetailsFooter,
        ObjectEditModalDialogContainer,
        ObjectListHeaderActionMenu,
        ObjectRecordMessagesBadge,
        ObjectRelatedlistFiles
    ]
})
export class ObjectComponents {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}
