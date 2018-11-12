import {CommonModule} from '@angular/common';
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    ElementRef,
    NgModule,
    HostListener,
    Renderer,
    Renderer2,
    ViewChild,
    ViewContainerRef,
    Injectable,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    OnInit,
    OnDestroy,
    OnChanges,
    ChangeDetectorRef,
    HostBinding,
    Pipe,
    PipeTransform,
    Optional,
    Attribute
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Title, DomSanitizer} from '@angular/platform-browser';

import {Subject, Observable} from 'rxjs';


import {FormsModule} from '@angular/forms';
import {RouterModule, Routes, Router, ActivatedRoute} from '@angular/router';
import {DirectivesModule} from "../directives/directives";
import {ObjectFields} from '../objectfields/objectfields';
import {GlobalComponents} from '../globalcomponents/globalcomponents';
import {SystemComponents} from '../systemcomponents/systemcomponents';

import {fielderrorgrouping} from '../services/fielderrorgrouping.service';
import {modal} from '../services/modal.service';
import {loginService, loginCheck} from '../services/login.service';
import {metadata, aclCheck} from '../services/metadata.service';
import {model} from '../services/model.service';
import {modellist} from '../services/modellist.service';
import {relatedmodels} from '../services/relatedmodels.service';
import {modelutilities} from '../services/modelutilities.service';
import {language} from '../services/language.service';
import {broadcast} from '../services/broadcast.service';
import {navigation} from '../services/navigation.service';
import {backend} from '../services/backend.service';
import {session} from '../services/session.service';
import {footer} from '../services/footer.service';
import {assistant} from '../services/assistant.service';
import {view} from '../services/view.service';
import {popup} from '../services/popup.service';
import {toast} from '../services/toast.service';
import {fts} from '../services/fts.service';
import {modelattachments} from '../services/modelattachments.service';
import {activitiyTimeLineService} from '../services/activitiytimeline.service';
import {favorite} from '../services/favorite.service';
import {configurationService} from '../services/configuration.service';
import {reminder} from '../services/reminder.service';
import {helper} from '../services/helper.service';
import {userpreferences} from '../services/userpreferences.service';
import {dockedComposer} from '../services/dockedcomposer.service';
import {VersionManagerService} from '../services/versionmanager.service';

import /*embed*/ {listfilters} from './services/listfilters.service';
import /*embed*/ {objectimport} from './services/objectimport.service';
import /*embed*/ {objectmerge} from './services/objectmerge.service';
import /*embed*/ {objectnote} from './services/objectnote.service';

import /*embed*/ {ObjectListViewHeader} from './components/objectlistviewheader';
import /*embed*/ {ObjectListViewHeaderListSelector} from './components/objectlistviewheaderlistselector';
import /*embed*/ {ObjectList} from './components/objectlist';
import /*embed*/ {ObjectListViewContainer} from './components/objectlistviewcontainer';
import /*embed*/ {ObjectListView} from './components/objectlistview';
import /*embed*/ {ObjectListHeader} from './components/objectlistheader';
import /*embed*/ {ObjectListHeaderActionMenu} from './components/objectlistheaderactionmenu';
import /*embed*/ {ObjectListItem} from './components/objectlistitem';
import /*embed*/ {ObjectListItemField} from './components/objectlistitemfield';
import /*embed*/ {ObjectActionMenu} from './components/objectactionmenu';
import /*embed*/ {ObjectActionsetMenu} from './components/objectactionsetmenu';
import /*embed*/ {ObjectActionsetMenuContainer} from './components/objectactionsetmenucontainer';
import /*embed*/ {ObjectActionsetMenuContainerEdit} from './components/objectactionsetmenucontaineredit';
import /*embed*/ {ObjectActionsetMenuContainerDelete} from './components/objectactionsetmenucontainerdelete';
import /*embed*/ {ObjectListTypes} from './components/objectlisttypes';

import /*embed*/ {ObjectActionContainer} from './components/objectactioncontainer';
import /*embed*/ {ObjectActionContainerItem} from './components/objectactioncontaineritem';
import /*embed*/ {ObjectActionEditButton} from './components/objectactioneditbutton';
import /*embed*/ {ObjectActionDeleteButton} from './components/objectactiondeletebutton';
import /*embed*/ {ObjectActionAuditlogButton} from './components/objectactionauditlogbutton';
import /*embed*/ {ObjectActionAuditlogModal} from './components/objectactionauditlogmodal';
import /*embed*/ {ObjectActionNewButton} from './components/objectactionnewbutton';
import /*embed*/ {ObjectActionDuplicateButton} from './components/objectactionduplicatebutton';
import /*embed*/ {ObjectActionSaveButton} from './components/objectactionsavebutton';
import /*embed*/ {ObjectActionNewrelatedButton} from './components/objectactionnewrelatedbutton';
import /*embed*/ {ObjectActionImportButton} from './components/objectactionimportbutton';
import /*embed*/ {ObjectReminderButton} from './components/objectreminderbutton';
import /*embed*/ {ObjectActionSelectButton} from './components/objectactionselectbutton';
import /*embed*/ {ObjectActionBeanToMailButton} from './components/objectactionbeantomailbutton';
import /*embed*/ {ObjectActionMailModal} from './components/objectactionmailmodal';

import /*embed*/ {ObjectEditModal} from './components/objecteditmodal';
import /*embed*/ {ObjectEditModalWReference} from './components/objecteditmodalwreference';
import /*embed*/ {ObjectEditModalDialogContainer} from './components/objecteditmodaldialogcontainer';
import /*embed*/ {ObjectEditModalDialogDuplicates} from './components/objecteditmodaldialogduplicates';

import /*embed*/ {ObjectListViewAggregatesPanel} from './components/objectlistviewaggregatespanel';
import /*embed*/ {ObjectListViewAggregate} from './components/objectlistviewaggregate';
import /*embed*/ {ObjectListViewAggregateItem} from './components/objectlistviewaggregateitem';

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
import /*embed*/ {ObjectIcon} from './components/objecticon';
import /*embed*/ {ObjectPageHeader} from './components/objectpageheader';
import /*embed*/ {ObjectPageHeaderTags} from './components/objectpageheadertags';
import /*embed*/ {ObjectPageHeaderTagPicker} from './components/objectpageheadertagpicker';
import /*embed*/ {ObjectPageHeaderDetails} from './components/objectpageheaderdetails';
import /*embed*/ {ObjectPageHeaderDetailRow} from './components/objectpageheaderdetailrow';
import /*embed*/ {ObjectPageHeaderDetailRowField} from './components/objectpageheaderdetailrowfield';
import /*embed*/ {ObjectTabContainerItem, ObjectTabContainer, ObjectTabContainerItemHeader} from './components/objecttabcontainer';
import /*embed*/ {ObjectVerticalTabContainerItem, ObjectVerticalTabContainer, ObjectVerticalTabContainerItemHeader} from './components/objectverticaltabcontainer';
import /*embed*/ {ObjectRelateContainer} from './components/objectrelatecontainer';
import /*embed*/ {ObjectRelatedlistHeader} from './components/objectrelatedlistheader';
import /*embed*/ {ObjectRelatedlistFooter} from './components/objectrelatedlistfooter';
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
import /*embed*/ {ObjectRelatedlistSequencedTable} from './components/objectrelatedlistsequencedtable';
import /*embed*/ {ObjectRelatedListSequencedItem} from './components/objectrelatedlistsequenceditem';

import /*embed*/ {ObjectFileActionMenu} from './components/objectfileactionmenu';

import /*embed*/ {ObjectStatusNetworkButton} from './components/objectstatusnetworkbutton';
import /*embed*/ {ObjectStatusNetworkButtonItem} from './components/objectstatusnetworkbuttonitem';

import /*embed*/ {ObjectRecordFieldset} from './components/objectrecordfieldset';
import /*embed*/ {ObjectRecordFieldsetField} from './components/objectrecordfieldsetfield';
import /*embed*/ {ObjectRecordFieldsetHorizontalList} from './components/objectrecordfieldsethorizontallist';

import /*embed*/ {ObjectRecordChecklist} from './components/objectrecordchecklist';
import /*embed*/ {ObjectRecordChecklistItem} from './components/objectrecordchecklistitem';

import /*embed*/ {ObjectActivitiyTimeline} from './components/objectactivitytimeline';
import /*embed*/ {ObjectActivityTimelineFilter} from "./components/objectactivitiytimelinefilter";
import /*embed*/ {ObjectActivitiyTimelineContainer} from './components/objectactivitytimelinecontainer';
import /*embed*/ {ObjectActivitiyTimelineItemContainer} from './components/objectactivitiytimelineitemcontainer';
import /*embed*/ {ObjectActivitiyTimelineAddTabContainer} from './components/objectactivitiytimelineaddtabcontainer';
import /*embed*/ {ObjectActivitiyTimelineCall} from './components/objectactivitytimelinecall';
import /*embed*/ {ObjectActivitiyTimelineEvent} from './components/objectactivitytimelineevent';
import /*embed*/ {ObjectActivitiyTimelineEmail} from './components/objectactivitytimelineemail';
import /*embed*/ {ObjectActivitiyTimelineNote} from './components/objectactivitiytimelinenote';
import /*embed*/ {ObjectActivitiyTimelineTask} from './components/objectactivitiytimelinetask';
import /*embed*/ {ObjectActivitiyTimelineAddContainer} from './components/objectactivitiytimelineaddcontainer';
import /*embed*/ {ObjectActivitiyTimelineAddItem} from './components/objectactivitiytimelineadditem';
import /*embed*/ {ObjectActivitiyTimelineAddCall} from './components/objectactivitiytimelineaddcall';
import /*embed*/ {ObjectActivitiyTimelineAddMeeting} from './components/objectactivitiytimelineaddmeeting';
import /*embed*/ {ObjectActivitiyTimelineAddTask} from './components/objectactivitiytimelineaddtask';
import /*embed*/ {ObjectActivitiyTimelineAddEmail} from './components/objectactivitiytimelineaddemail';
import /*embed*/ {ObjectActivitiyTimelineAddNote} from './components/objectactivitiytimelineaddnote';
import /*embed*/ {ObjectActivitiyTimelineSummary} from './components/objectactivitiytimelinesummary';
import /*embed*/ {ObjectActivitiyTimelineSummaryButton} from './components/objectactivitiytimelinesummarybutton';
import /*embed*/ {ObjectActivitiyTimelineSummaryModal} from './components/objectactivitiytimelinesummarymodal';

import /*embed*/ {ObjectRecordDetails} from './components/objectrecorddetails';
import /*embed*/ {ObjectRecordDetailsTab} from './components/objectrecorddetailstab';
import /*embed*/ {ObjectRecordAdministrationTab} from './components/objectrecordadministrationtab';
import /*embed*/ {ObjectRecordDetailsTabRow} from './components/objectrecorddetailstabrow';
import /*embed*/ {ObjectRecordDetailsTabRowField} from './components/objectrecorddetailstabrowfield';
import /*embed*/ {ObjectRecordTabbedDetails} from './components/objectrecordtabbeddetails';
import /*embed*/ {ObjectRecordTabbedDetailsTab} from './components/objectrecordtabbeddetailstab';

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
import /*embed*/ {ObjectMergeModal} from './components/objectmergemodal';
import /*embed*/ {ObjectMergeModalRecords} from './components/objectmergemodalrecords';
import /*embed*/ {ObjectMergeModalData} from './components/objectmergemodaldata';
import /*embed*/ {ObjectMergeModalDataField} from './components/objectmergemodaldatafield';
import /*embed*/ {ObjectMergeModalExecute} from './components/objectmergemodalexecute';

import /*embed*/ {ObjectNotes} from './components/objectnotes';
import /*embed*/ {ObjectNote} from './components/objectnote';

import /*embed*/ {ObjectAddresses, ObjectAddressesPipe} from './components/objectaddresses';
import /*embed*/ {ObjectAddress} from './components/objectaddress';

import /*embed*/ {ObjectGDPRModal} from './components/objectgdprmodal';

import /*embed*/ {ObjectPopoverHeader} from './components/objectpopoverheader';
import /*embed*/ {ObjectPopoverBodyItem} from './components/objectpopoverbodyitem';
import /*embed*/ {ObjectRowItemComponent} from "./components/objectrowitem";
import /*embed*/ {ObjectModalModuleDBLookup} from "./components/objectmodalmoduledblookup";
import /*embed*/ {ObjectActionOutputBeanModal} from "./components/objectactionoutputbeanmodal";
import /*embed*/ {ObjectActionOutputBeanButton} from "./components/objectactionoutputbeanbutton";

import /*embed*/ {ObjectKeyValuesPipe} from "./components/objectkeyvalue.pipe";
import /*embed*/ {ObjectTableRow} from "./components/objecttablerow";
import /*embed*/ {ObjectTable} from "./components/objecttable";

import /*embed*/ {ObjectModelPopover} from "./components/objectmodelpopover";
import /*embed*/ {ObjectModelPopoverField} from "./components/objectmodelpopoverfield";
import /*embed*/ {ObjectModelPopoverRelated} from "./components/objectmodelpopoverrelated";
import /*embed*/ {ObjectModelPopoverRelatedItem} from "./components/objectmodelpopoverrelateditem";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        SystemComponents,
        DirectivesModule,
        RouterModule.forRoot([
            // {path: 'module/Home', component: ModuleHome, canActivate: [loginCheck]},
            {path: 'module/:module', component: ObjectListViewContainer, canActivate: [loginCheck, aclCheck]},
            {path: 'module/:module/import', component: ObjectImport, canActivate: [loginCheck]},
            {path: 'module/:module/:id', component: ObjectRecordViewContainer, canActivate: [loginCheck]},
            {path: 'module/:module/:id/:related/:link', component: ObjectRelatedlistAll, canActivate: [loginCheck]},
            {
                path: 'module/:module/:id/:related/:link/:fieldset',
                component: ObjectRelatedlistAll,
                canActivate: [loginCheck]
            },
            {path: '**', redirectTo: 'module/Home', canActivate: [loginCheck]}
        ])],
    declarations: [
        ObjectIcon,
        ObjectListViewContainer,
        ObjectListView,
        ObjectListTypes,
        ObjectListViewHeader,
        ObjectListViewHeaderListSelector,
        ObjectList,
        ObjectListHeader,
        ObjectListHeaderActionMenu,
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
        ObjectActionContainer,
        ObjectActionContainerItem,
        ObjectActionEditButton,
        ObjectActionSaveButton,
        ObjectActionDeleteButton,
        ObjectActionAuditlogButton,
        ObjectActionAuditlogModal,
        ObjectGDPRModal,
        ObjectActionNewButton,
        ObjectActionDuplicateButton,
        ObjectActionNewrelatedButton,
        ObjectActionImportButton,
        ObjectActionSelectButton,
        ObjectEditModal,
        ObjectEditModalWReference,
        ObjectEditModalDialogContainer,
        ObjectEditModalDialogDuplicates,
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
        ObjectRelatedlistHeader,
        ObjectRelatedlistFooter,
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
        ObjectRelatedlistSequencedTable,
        ObjectRelatedListSequencedItem,
        ObjectFileActionMenu,
        ObjectActivitiyTimeline,
        ObjectActivityTimelineFilter,
        ObjectActivitiyTimelineContainer,
        ObjectActivitiyTimelineItemContainer,
        ObjectActivitiyTimelineAddTabContainer,
        ObjectActivitiyTimelineCall,
        ObjectActivitiyTimelineEvent,
        ObjectActivitiyTimelineEmail,
        ObjectActivitiyTimelineTask,
        ObjectActivitiyTimelineNote,
        ObjectActivitiyTimelineAddContainer,
        ObjectActivitiyTimelineAddItem,
        ObjectActivitiyTimelineAddCall,
        ObjectActivitiyTimelineAddMeeting,
        ObjectActivitiyTimelineAddTask,
        ObjectActivitiyTimelineAddEmail,
        ObjectActivitiyTimelineAddNote,
        ObjectActivitiyTimelineSummary,
        ObjectActivitiyTimelineSummaryButton,
        ObjectActivitiyTimelineSummaryModal,
        ObjectRecordDetails,
        ObjectRecordDetailsTab,
        ObjectRecordAdministrationTab,
        ObjectRecordDetailsTabRow,
        ObjectRecordDetailsTabRowField,
        ObjectRecordChecklist,
        ObjectRecordChecklistItem,
        ObjectRecordTabbedDetails,
        ObjectRecordTabbedDetailsTab,
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
        ObjectMergeModal,
        ObjectMergeModalRecords,
        ObjectMergeModalData,
        ObjectMergeModalDataField,
        ObjectMergeModalExecute,
        ObjectNotes,
        ObjectNote,
        ObjectAddresses,
        ObjectAddressesPipe,
        ObjectAddress,
        ObjectPopoverHeader,
        ObjectPopoverBodyItem,
        ObjectRecordFieldset,
        ObjectRecordFieldsetField,
        ObjectRecordFieldsetHorizontalList,
        ObjectRowItemComponent,
        ObjectModalModuleDBLookup,
        ObjectActionOutputBeanModal,
        ObjectActionOutputBeanButton,
        ObjectStatusNetworkButton,
        ObjectStatusNetworkButtonItem,
        ObjectKeyValuesPipe,
        ObjectTableRow,
        ObjectTable,
        ObjectModelPopover,
        ObjectModelPopoverField,
        ObjectModelPopoverRelated,
        ObjectModelPopoverRelatedItem
    ],
    entryComponents: [
        ObjectIcon,
        ObjectListViewHeader,
        ObjectListView,
        ObjectList,
        ObjectPageHeader,
        ObjectPageHeaderDetails,
        ObjectPageHeaderDetailRow,
        ObjectPageHeaderDetailRowField,
        ObjectTabContainer,
        ObjectTabContainerItem,
        ObjectRelateContainer,
        ObjectRelatedlistList,
        ObjectRelatedlistTiles,
        ObjectRelatedCardTile,
        ObjectRelatedlistFiles,
        ObjectRelatedDuplicates,
        ObjectActivitiyTimeline,
        ObjectActivitiyTimelineContainer,
        ObjectActivitiyTimelineCall,
        ObjectActivitiyTimelineEvent,
        ObjectActivitiyTimelineEmail,
        ObjectActivitiyTimelineTask,
        ObjectActivitiyTimelineAddContainer,
        ObjectRecordView,
        ObjectRecordViewDetail1,
        ObjectRecordViewDetail2and1,
        ObjectRecordDetails,
        ObjectRecordDetailsTab,
        ObjectRecordDetailsTabRow,
        ObjectRecordDetailsTabRowField,
        ObjectActionEditButton,
        ObjectActionDeleteButton,
        ObjectActionNewButton,
        ObjectActionNewrelatedButton,
        ObjectActionImportButton,
        ObjectActionSelectButton,
        ObjectActionBeanToMailButton,
        ObjectNotes
    ],
    exports: [
        ObjectListViewHeader,
        ObjectList,
        ObjectListItem,
        ObjectIcon,
        ObjectPageHeader,
        ObjectPageHeaderDetails,
        ObjectPageHeaderDetailRow,
        ObjectActionMenu,
        ObjectActionsetMenu,
        ObjectSelectButton,
        ObjectRelatedListItem,
        ObjectPopoverHeader,
        ObjectPopoverBodyItem,
        ObjectActionContainer,
        ObjectRecordFieldset,
        ObjectRecordFieldsetHorizontalList,
        ObjectRowItemComponent,
        ObjectTabContainerItemHeader,
        ObjectTableRow,
        ObjectTable,
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