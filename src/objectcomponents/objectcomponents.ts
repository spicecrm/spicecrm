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
import {ScrollingModule} from "@angular/cdk/scrolling";

import {ChecklistItemI, ChecklistI} from "./interfaces/objectcomponents.interfaces";

import {loginCheck} from '../services/login.service';
import {metadata, aclCheck} from '../services/metadata.service';
import {canNavigateAway} from '../services/navigation.service';

import {ObjectKeyValuesPipe} from "./pipes/objectkeyvalue.pipe";
import {ObjectFieldFilterPipe} from "./pipes/objectfieldfilter.pipe";

import {ObjectListViewHeader} from './components/objectlistviewheader';
import {ObjectListViewHeaderDetails} from './components/objectlistviewheaderdetails';
import {ObjectListViewHeaderListSelector} from './components/objectlistviewheaderlistselector';
import {ObjectList} from './components/objectlist';
import {ObjectListViewContainer} from './components/objectlistviewcontainer';
import {ObjectListView} from './components/objectlistview';
import {ObjectActionContainerItem} from './components/objectactioncontaineritem';
import {ObjectActionContainer} from './components/objectactioncontainer';
import {ObjectListHeader} from './components/objectlistheader';
import {ObjectListHeaderSort} from './components/objectlistheadersort';
import {ObjectListHeaderActionMenu} from './components/objectlistheaderactionmenu';
import {ObjectListHeaderActionsAssignButton} from './components/objectlistheaderactionsassignbutton';
import {ObjectListHeaderActionsAssignModal} from './components/objectlistheaderactionsassignmodal';
import {ObjectListHeaderActionsDeleteButton} from './components/objectlistheaderactionsdeletebutton';
import {ObjectListHeaderActionsMergeButton} from './components/objectlistheaderactionsmergebutton';
import {ObjectListHeaderActionsExportCSVButton} from './components/objectlistheaderactionsexportcsvbutton';
import {ObjectListHeaderActionsExportCSVSelectFields} from './components/objectlistheaderactionsexportcsvselectfields';
import {ObjectListHeaderActionsExportTargetlistButton} from './components/objectlistheaderactionsexporttargetlistbutton';
import {ObjectListHeaderActionsExportTargetlistModal} from './components/objectlistheaderactionsexporttargetlistmodal';
import {ObjectListHeaderActionsSelectAllButton} from "./components/objectlistheaderactionsselectallbutton";
import {ObjectListHeaderActionsUnselectAllButton} from "./components/objectlistheaderactionsunselectallbutton";
import {ObjectListHeaderActionsSelectRangeButton} from "./components/objectlistheaderactionsselectrangebutton";
import {ObjectListHeaderActionsSelectRangeModal} from "./components/objectlistheaderactionsselectrangemodal";

import {ObjectListItem} from './components/objectlistitem';
import {ObjectListItemField} from './components/objectlistitemfield';
import {ObjectActionMenu} from './components/objectactionmenu';
import {ObjectActionsetMenu} from './components/objectactionsetmenu';
import {ObjectActionsetMenuContainer} from './components/objectactionsetmenucontainer';
import {ObjectActionsetMenuContainerEdit} from './components/objectactionsetmenucontaineredit';
import {ObjectActionsetMenuContainerDelete} from './components/objectactionsetmenucontainerdelete';
import {ObjectListTypes} from './components/objectlisttypes';

import {ObjectActionEditButton} from './components/objectactioneditbutton';
import {ObjectActionEditRelatedButton} from "./components/objectactioneditrelatedbutton";
import {ObjectActionDeleteButton} from './components/objectactiondeletebutton';
import {ObjectActionAuditlogButton} from './components/objectactionauditlogbutton';
import {ObjectActionOpenButton} from './components/objectactionopenbutton';
import {ObjectActionBooleanToggleButton} from "./components/objectactionbooleantogglebutton";
import {ObjectActionCancelButton} from './components/objectactioncancelbutton';
import {ObjectActionModalSaveButton} from './components/objectactionmodalsavebutton';
import {ObjectActionRemoveButton} from "./components/objectactionremovebutton";
import {ObjectActionAuditlogModal} from './components/objectactionauditlogmodal';
import {ObjectActionNewButton} from './components/objectactionnewbutton';
import {ObjectActionDuplicateButton} from './components/objectactionduplicatebutton';
import {ObjectActionSaveSendButton} from './components/objectactionsavesendbutton';
import {ObjectActionSaveButton} from './components/objectactionsavebutton';
import {ObjectActionSaveRelatedButton} from './components/objectactionsaverelatedbutton';
import {ObjectActionNewrelatedButton} from './components/objectactionnewrelatedbutton';
import {ObjectActionNewCopyRuleBeanButton, ObjectActionNewCopyRuleBeanButtonModelHelper} from './components/objectactionnewcopyrulebeanbutton';
import {ObjectReminderButton} from './components/objectreminderbutton';
import {ObjectReminderIcon} from './components/objectremindericon';
import {ObjectSubscriptionButton} from './components/objectsubscriptionbutton';
import {ObjectSubscriptionIcon} from './components/objectsubscriptionicon';
import {ObjectActionSelectButton} from './components/objectactionselectbutton';
import {ObjectActionBeanToMailButton} from './components/objectactionbeantomailbutton';
import {ObjectActionMailModal} from './components/objectactionmailmodal';

import {ObjectEditModal} from './components/objecteditmodal';
import {ObjectEditModalWReference} from './components/objecteditmodalwreference';
import {ObjectEditModalDialogContainer} from './components/objecteditmodaldialogcontainer';
import {ObjectEditModalDialogDuplicates} from './components/objecteditmodaldialogduplicates';
import {ObjectEditModalDialogDuplicatesPanel} from './components/objecteditmodaldialogduplicatespanel';
import {ObjectOptimisticLockingModal} from './components/objectoptimisticlockingmodal';
import {ObjectOptimisticLockingModalDataField} from "./components/objectoptimisticlockingmodaldatafield";
import {ObjectOptimisticLockingModalChange} from "./components/objectoptimisticlockingmodalchange";

import {ObjectListViewAggregatesButton} from './components/objectlistviewaggregatesbutton';
import {ObjectListViewAggregatesPanel} from './components/objectlistviewaggregatespanel';
import {ObjectListViewAggregate} from './components/objectlistviewaggregate';
import {ObjectListViewAggregateItem} from './components/objectlistviewaggregateitem';
import {ObjectListViewAggregateItemTerm} from './components/objectlistviewaggregateitemterm';
import {ObjectListViewAggregateItemRange} from './components/objectlistviewaggregateitemrange';
import {ObjectListViewTagsAggregate} from './components/objectlistviewtagsaggregate';
import {ObjectListViewAggregateChart} from "./components/objectlistviewaggregatechart";

import {ObjectListViewFilterButton} from './components/objectlistviewfilterbutton';
import {ObjectListViewFilterPanel} from './components/objectlistviewfilterpanel';
import {ObjectListViewFilterPanelFilterMyItems} from './components/objectlistviewfilterpanelfiltermyitems';
import {ObjectListViewFilterPanelFilterGeo} from './components/objectlistviewfilterpanelfiltergeo';
import {ObjectListViewFilterPanelFilterItem} from './components/objectlistviewfilterpanelfilteritem';

import {ObjectListViewSettings} from './components/objectlistviewsettings';
import {ObjectListViewSettingsAddlistModal} from './components/objectlistviewsettingsaddlistmodal';
import {ObjectListViewSettingsSetfieldsModal} from './components/objectlistviewsettingssetfieldsmodal';
import {ObjectRecordViewContainer} from './components/objectrecordviewcontainer';
import {ObjectRecordView} from './components/objectrecordview';
import {ObjectRecordViewDetail1} from './components/objectrecordviewdetail1';
import {ObjectRecordViewDetail2and1} from './components/objectrecordviewdetail2and1';
import {ObjectRecordViewDetailsplit} from './components/objectrecordviewdetailsplit';
import {ObjectRecordCreateContainer} from "./components/objectrecordcreatecontainer";
import {ObjectPageHeader} from './components/objectpageheader';
import {ObjectPageHeaderTags} from './components/objectpageheadertags';
import {ObjectPageHeaderTagPicker} from './components/objectpageheadertagpicker';
import {ObjectPageHeaderDetails} from './components/objectpageheaderdetails';
import {ObjectPageHeaderDetailRow} from './components/objectpageheaderdetailrow';
import {ObjectPageHeaderDetailRowField} from './components/objectpageheaderdetailrowfield';
import {ObjectTabContainer} from './components/objecttabcontainer';
import {ObjectTabContainerItem} from './components/objecttabcontaineritem';
import {ObjectTabContainerItemHeader} from './components/objecttabcontaineritemheader';
import {ObjectVerticalTabContainer} from './components/objectverticaltabcontainer';
import {ObjectVerticalTabContainerItem} from './components/objectverticaltabcontaineritem';
import {ObjectVerticalTabContainerItemHeader} from './components/objectverticaltabcontaineritemheader';
import {ObjectRelateContainer} from './components/objectrelatecontainer';
import {ObjectRelatedCardHeader} from './components/objectrelatedcardheader';
import {ObjectRelatedCardFooter} from './components/objectrelatedcardfooter';
import {ObjectRelatedCard} from './components/objectrelatedcard';
import {ObjectRelatedList} from './components/objectrelatedlist';
import {ObjectRelatedlistList} from './components/objectrelatedlistlist';
import {ObjectRelatedListItem} from './components/objectrelatedlistitem';
import {ObjectRelatedlistTiles} from './components/objectrelatedlisttiles';
import {ObjectRelatedCardTile} from './components/objectrelatedcardtile';
import {ObjectRelatedlistFiles} from './components/objectrelatedlistfiles';
import {ObjectRelatedCardFile} from './components/objectrelatedcardfile';
import {ObjectRelatedDuplicates} from './components/objectrelatedduplicates';
import {ObjectRelatedDuplicateTile} from './components/objectrelatedduplicatetile';
import {ObjectRelatedlistAll} from './components/objectrelatedlistall';
import {ObjectRelatedlistTable} from './components/objectrelatedlisttable';
import {ObjectRelatedlistSequenced} from './components/objectrelatedlistsequenced';
import {ObjectRelatedListSequencedItem} from './components/objectrelatedlistsequenceditem';

import {ObjectFileActionMenu} from './components/objectfileactionmenu';

import {ObjectStatusNetworkButtonItem} from './components/objectstatusnetworkbuttonitem';
import {ObjectStatusNetworkButton} from './components/objectstatusnetworkbutton';

import {ObjectRecordFieldset} from './components/objectrecordfieldset';
import {ObjectRecordFieldsetField} from './components/objectrecordfieldsetfield';
import {ObjectRecordFieldsetHorizontalList} from './components/objectrecordfieldsethorizontallist';
import {ObjectRecordFieldsetContainer} from './components/objectrecordfieldsetcontainer';

import {ObjectRecordChecklist} from './components/objectrecordchecklist';
import {ObjectRecordChecklistItem} from './components/objectrecordchecklistitem';

import {ObjectRecordDetails} from './components/objectrecorddetails';
import {ObjectRecordDetailsTab} from './components/objectrecorddetailstab';
import {ObjectRecordDetailsModelstateTab} from './components/objectrecorddetailsmodelstatetab';
import {ObjectRecordDetailsFooter} from './components/objectrecorddetailsfooter';
import {ObjectRecordAdministrationTab} from './components/objectrecordadministrationtab';
import {ObjectRecordDetailsTabRow} from './components/objectrecorddetailstabrow';
import {ObjectRecordDetailsTabRowField} from './components/objectrecorddetailstabrowfield';
import {ObjectRecordTabbedDetails} from './components/objectrecordtabbeddetails';
import {ObjectRecordTabbedDetailsTab} from './components/objectrecordtabbeddetailstab';
import {ObjectRecordDetailsRelatedListTab} from './components/objectrecorddetailsrelatedlisttab';

import {ObjectModalModuleLookupHeader} from './components/objectmodalmodulelookupheader';
import {ObjectModalModuleLookupAggregates} from './components/objectmodalmodulelookupaggregates';
import {ObjectModalModuleLookup} from './components/objectmodalmodulelookup';
import {ObjectSelectButton} from './components/objectselectbutton';

import {ObjectMergeButton} from './components/objectmergebutton';

import {ObjectAddresses, ObjectAddressesPipe} from './components/objectaddresses';
import {ObjectAddress} from './components/objectaddress';

import {ObjectGDPRModal} from './components/objectgdprmodal';

import {ObjectRowItemComponent} from "./components/objectrowitem";
import {ObjectActionVCardButton} from "./components/objectactionvcardbutton";


import {ObjectTableRow} from "./components/objecttablerow";
import {ObjectTable} from "./components/objecttable";

import {ObjectModelPopover} from "./components/objectmodelpopover";
import {ObjectModelPopoverHeader} from "./components/objectmodelpopoverheader";
import {ObjectModelPopoverField} from "./components/objectmodelpopoverfield";
import {ObjectModelPopoverRelated} from "./components/objectmodelpopoverrelated";
import {ObjectModelPopoverRelatedItem} from "./components/objectmodelpopoverrelateditem";


import {ObjectRecordMessagesBadge} from "./components/objectrecordmessagesbadge";
import {ObjectActionDeactivateBeansButton} from "./components/objectactiondeactivatebeansbutton";
import {ObjectActionDeactivateBeansModal} from "./components/objectactiondeactivatebeansmodal";
import {ObjectChecklists} from "./components/objectchecklists";
import {ObjectTimelineItemAudit} from "./components/objecttimelineitemaudit";
import {ObjectTimelineItemCreated} from "./components/objecttimelineitemcreated";
import {ObjectTimelineFilter} from "./components/objecttimelinefilter";
import {ObjectTimelineFullScreen} from "./components/objecttimelinefullscreen";
import {ObjecttimelineFullScreenDetail} from "./components/objecttimelinefullscreendetail";
import {ObjectTimeline} from "./components/objecttimeline";
import {ObjectTimelineItemModule} from "./components/objecttimelineitemmodule";
import {ObjectTimelineAuditlogModal} from "./components/objecttimelineauditlogmodal";
import {ObjectTimelineAuditDetail} from "./components/objecttimelineauditdetail";
import {ObjectTimelineItemLine} from "./components/objecttimelineitemline";
import {ObjectTimelineStencil} from "./components/objecttimelinestencil";
import {ObjectPopoverBodyItem} from "./components/objectpopoverbodyitem";
import {ObjectPopoverHeader} from "./components/objectpopoverheader";
import {ObjectSelectBeanListModal} from "./components/objectselectbeanlistmodal";
import {ObjectActionHelpTextButton} from "./components/objectactionhelptextbutton";
import {ObjectHelpTextModal} from "./components/objecthelptextmodal";
import {ObjectStatusNetworkModal} from "./components/objectstatusnetworkmodal";
import {ObjectStatusNetworkOpenModalButton} from "./components/objectstatusnetworkopenmodalbutton";
import {ObjectWorkflowButton} from "./components/objectworkflowbutton";

import {ObjectRelatedListUrls} from "./components/objectrelatedlisturl";
import {ObjectRelatedCardUrl} from "./components/objectrelatedcardurl";
import {ObjectUrlActionMenu} from "./components/objecturlactionmenu";
import {ObjectSetInactiveIcon} from "./components/objectsetinactiveicon";
import {ObjectActionCheckDuplicateButton} from "./components/objectactioncheckduplicatebutton";
import {ObjectRelatedDuplicatesCardFooter} from "./components/objectrelatedduplicatescardfooter";

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
        ScrollingModule,
        RouterModule],
    declarations: [
        ObjectSelectBeanListModal,
        ObjectListViewContainer,
        ObjectListView,
        ObjectListTypes,
        ObjectListViewHeader,
        ObjectListViewHeaderDetails,
        ObjectListViewHeaderListSelector,
        ObjectList,
        ObjectListHeader,
        ObjectListHeaderSort,
        ObjectActionContainer,
        ObjectActionContainerItem,
        ObjectListHeaderActionMenu,
        ObjectListHeaderActionsAssignButton,
        ObjectListHeaderActionsAssignModal,
        ObjectListHeaderActionsDeleteButton,
        ObjectListHeaderActionsMergeButton,
        ObjectListHeaderActionsExportCSVButton,
        ObjectFieldFilterPipe,
        ObjectListHeaderActionsExportCSVSelectFields,
        ObjectListHeaderActionsExportTargetlistButton,
        ObjectListHeaderActionsExportTargetlistModal,
        ObjectListHeaderActionsSelectAllButton,
        ObjectListHeaderActionsUnselectAllButton,
        ObjectListHeaderActionsSelectRangeButton,
        ObjectListHeaderActionsSelectRangeModal,
        ObjectListItem,
        ObjectListItemField,
        ObjectActionMenu,
        ObjectActionsetMenu,
        ObjectActionsetMenuContainer,
        ObjectActionsetMenuContainerEdit,
        ObjectActionsetMenuContainerDelete,
        ObjectListViewAggregatesButton,
        ObjectListViewAggregatesPanel,
        ObjectListViewAggregate,
        ObjectListViewAggregateChart,
        ObjectListViewAggregateItem,
        ObjectListViewAggregateItemTerm,
        ObjectListViewAggregateItemRange,
        ObjectListViewTagsAggregate,
        ObjectListViewFilterButton,
        ObjectListViewFilterPanel,
        ObjectListViewFilterPanelFilterMyItems,
        ObjectListViewFilterPanelFilterGeo,
        ObjectListViewFilterPanelFilterItem,
        ObjectListViewSettings,
        ObjectListViewSettingsAddlistModal,
        ObjectListViewSettingsSetfieldsModal,
        ObjectActionEditButton,
        ObjectActionEditRelatedButton,
        ObjectActionSaveSendButton,
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
        ObjectActionBooleanToggleButton,
        ObjectActionDuplicateButton,
        ObjectActionNewrelatedButton,
        ObjectActionNewCopyRuleBeanButton,
        ObjectActionNewCopyRuleBeanButtonModelHelper,
        ObjectActionSelectButton,
        ObjectRecordCreateContainer,
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
        ObjectModalModuleLookupHeader,
        ObjectModalModuleLookupAggregates,
        ObjectSelectButton,
        ObjectReminderButton,
        ObjectReminderIcon,
        ObjectSubscriptionButton,
        ObjectSubscriptionIcon,
        ObjectActionBeanToMailButton,
        ObjectActionMailModal,
        ObjectMergeButton,
        ObjectAddresses,
        ObjectAddressesPipe,
        ObjectAddress,
        ObjectRecordFieldset,
        ObjectRecordFieldsetField,
        ObjectRecordFieldsetHorizontalList,
        ObjectRecordFieldsetContainer,
        ObjectRowItemComponent,
        ObjectActionVCardButton,
        ObjectStatusNetworkButton,
        ObjectStatusNetworkButtonItem,
        ObjectKeyValuesPipe,
        ObjectTableRow,
        ObjectTable,
        ObjectTimeline,
        ObjectTimelineItemModule,
        ObjectTimelineItemLine,
        ObjectTimelineItemAudit,
        ObjectTimelineItemCreated,
        ObjectTimelineStencil,
        ObjectTimelineFilter,
        ObjectTimelineFullScreen,
        ObjecttimelineFullScreenDetail,
        ObjectTimelineAuditlogModal,
        ObjectTimelineAuditDetail,
        ObjectModelPopover,
        ObjectModelPopoverHeader,
        ObjectModelPopoverField,
        ObjectModelPopoverRelated,
        ObjectModelPopoverRelatedItem,
        ObjectRecordMessagesBadge,
        ObjectActionDeactivateBeansButton,
        ObjectActionDeactivateBeansModal,
        ObjectChecklists,
        ObjectPopoverBodyItem,
        ObjectPopoverHeader,
        ObjectActionHelpTextButton,
        ObjectHelpTextModal,
        ObjectStatusNetworkModal,
        ObjectStatusNetworkOpenModalButton,
        ObjectWorkflowButton,
        ObjectPopoverHeader,
        ObjectRelatedListUrls,
        ObjectRelatedCardUrl,
        ObjectUrlActionMenu,
        ObjectSetInactiveIcon,
        ObjectActionCheckDuplicateButton,
        ObjectRelatedDuplicatesCardFooter
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
        ObjectRecordFieldsetField,
        ObjectRecordFieldsetHorizontalList,
        ObjectRowItemComponent,
        ObjectTabContainerItemHeader,
        ObjectTableRow,
        ObjectTable,
        ObjectRelatedCard,
        ObjectRelatedCardHeader,
        ObjectRelatedCardFooter,
        ObjectRelatedCardTile,
        ObjectRecordDetails,
        ObjectRecordDetailsFooter,
        ObjectEditModalDialogContainer,
        ObjectListHeader,
        ObjectListHeaderActionMenu,
        ObjectRecordMessagesBadge,
        ObjectRelatedlistFiles,
        ObjectListTypes,
        ObjectListViewAggregate,
        ObjectListViewAggregatesButton,
        ObjectListViewHeaderDetails,
        ObjectListHeaderSort,
        ObjectRelatedlistFiles,
        ObjectKeyValuesPipe,
        ObjectPageHeaderTags,
        ObjectModalModuleLookup,
        ObjectModalModuleLookupHeader,
        ObjectModalModuleLookupAggregates,
        ObjectModelPopoverHeader,
        ObjectChecklists,
        ObjectRelatedListUrls,
        ObjectRelatedCardUrl,
        ObjectActionNewButton,
        ObjectRecordFieldsetContainer
    ]
})
export class ObjectComponents {}
