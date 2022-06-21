/**
 * @module ServiceComponentsModule
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';

import {ObjectFields} from '../../objectfields/objectfields';
import {GlobalComponents} from '../../globalcomponents/globalcomponents';
import {DirectivesModule} from '../../directives/directives';
import {ObjectComponents} from '../../objectcomponents/objectcomponents';
import {SystemComponents} from '../../systemcomponents/systemcomponents';

// import interfaces
import {ServicePlannerRecordI, ServicePlannerEventI, ServicePlannerDirectionResultI, ServicePlannerRoutePointI} from './interfaces/servicecomponents.interfaces';

import {ServicePlannerService} from "./services/serviceplanner.service";

import {SignServiceOrderModalButtonComponent} from "./components/signserviceordermodalbutton";
import {SignServiceOrderModalComponent} from "./components/signserviceordermodal";
import {ServiceOrderSummaryComponent} from "./components/serviceordersummary";
import {ServiceActivitiyTimelineAddServiceCall} from "./components/serviceactivitiytimelineaddservicecall";
import {ServiceAddTicketButton} from "./components/serviceaddticketbutton";
import {ServiceAddTicketActionButton} from "./components/serviceaddticketactionbutton";
import {ServiceCategoryManagerComponent} from "./components/servicecategorymanager";
import {ServiceSelectQueueButton} from "./components/serviceselectqueuebutton";
import {ServiceSelectQueueModal} from "./components/serviceselectqueuemodal";
import {ServiceMyTicketsDashlet} from "./components/servicemyticketsdashlet";
import {ServiceMyQueuesTicketsDashlet} from "./components/servicemyqueuesticketsdashlet";
import {ServiceMyQueuesTicketsDashletItem} from "./components/servicemyqueuesticketsdashletitem";
import {ServiceTicketProlongButton} from "./components/serviceticketprolongbutton";
import {ServiceTicketProlongModal} from "./components/serviceticketprolongmodal";
import {ServiceTicketSLAIndicator} from "./components/serviceticketslaindicator";
import {ServiceRequestFeedbackButton} from "./components/servicerequestfeedbackbutton";
import {ServiceTicketNewButton} from "./components/serviceticketnewbutton";
import {ServiceTicketNewModal} from "./components/serviceticketnewmodal";
import {ServiceTicketCloseButton} from "./components/serviceticketclosebutton";
import {ServiceTicketCloseModal} from "./components/serviceticketclosemodal";
import {ServiceTicketView} from "./components/serviceticketview";
import {ServiceTicketDetail} from "./components/serviceticketdetail";
import {ServiceTicketContactDetail} from "./components/serviceticketcontactdetail";
import {ServiceTicketConsumerDetail} from "./components/serviceticketconsumerdetail";
import {ServiceTicketAccountDetail} from "./components/serviceticketaccountdetail";
import {ServiceActivitiyTimelineAddServiceNote} from "./components/serviceactivitiytimelineaddservicenote";
import {ServiceTicketRelatedTickets} from "./components/serviceticketrelatedtickets";
import {ServiceTicketRelatedTicketsTiles} from "./components/serviceticketrelatedticketstiles";
import {fieldWarrantyIndicator} from './fields/fieldwarrantyindicator';
import {fieldBooleanBullet} from './fields/fieldbooleanbullet';
import {fieldServiceQueue} from './fields/fieldservicequeue';
import {fieldServiceEnhancedCategories} from './fields/fieldserviceenhancedcategories';

import {ServiceOrderNewButton} from "./components/serviceordernewbutton";
import {ServiceOrderEffortItem} from "./components/serviceordereffortitem";
import {ServiceOrderEffortItemDetails} from "./components/serviceordereffortitemdetails";
import {ServiceOrderEffortPanel} from "./components/serviceordereffortpanel";
import {ServiceOrderEquipmentItem} from "./components/serviceorderequipmentitem";
import {ServiceOrderEquipmentPanel} from "./components/serviceorderequipmentpanel";
import {ServiceOrderItemItem} from "./components/serviceorderitemitem";
import {ServiceOrderItemPanel} from "./components/serviceorderitempanel";
import {ServiceOrderItemPipe} from "./pipes/serviceorderitemspipe";
import {ServiceOrderAddTypeSelector} from "./components/serviceorderaddtypeselector";
import {ServiceOrderConfirmButton} from "./components/serviceorderconfirmbutton";
import {ServiceOrderConfirmModal} from "./components/serviceorderconfirmmodal";
import {ServiceOrderItemConfirmItem} from "./components/serviceorderitemconfirmitem";
import {ServiceOrderItemConfirmationPanel} from "./components/serviceorderitemconfirmationpanel";
import {ServiceOrderEffortConfirmationItem} from "./components/serviceordereffortconfirmationitem";
import {ServiceOrderEffortConfirmationPanel} from "./components/serviceordereffortconfirmationpanel";
import {ServicePlanner} from "./components/serviceplanner";
import {ServicePlannerMapsModelPopover} from "./components/serviceplannermapsmodelpopover";
import {ServicePlannerMapsModelPopoverDirection} from "./components/serviceplannermapsmodelpopoverdirection";
import {ModuleSpiceTimeline} from "../../include/spicetimeline/spicetimeline";
import {ServiceDocSignatureButton} from "./components/servicedocsignaturebutton";
import {ServiceDocSignatureContent} from "./components/servicedocsignaturecontent";
import {ServiceDocSignatureModal} from "./components/servicedocsignaturemodal";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        DirectivesModule,
        ObjectComponents,
        SystemComponents,
        ModuleSpiceTimeline,
    ],
    declarations: [
        fieldWarrantyIndicator,
        fieldBooleanBullet,
        fieldServiceQueue,
        fieldServiceEnhancedCategories,
        SignServiceOrderModalButtonComponent,
        SignServiceOrderModalComponent,
        ServiceOrderSummaryComponent,
        ServiceActivitiyTimelineAddServiceCall,
        ServiceAddTicketButton,
        ServiceAddTicketActionButton,
        ServiceCategoryManagerComponent,
        ServiceSelectQueueButton,
        ServiceSelectQueueModal,
        ServiceMyTicketsDashlet,
        ServiceMyQueuesTicketsDashlet,
        ServiceMyQueuesTicketsDashletItem,
        ServiceTicketProlongButton,
        ServiceTicketProlongModal,
        ServiceTicketSLAIndicator,
        ServiceRequestFeedbackButton,
        ServiceTicketNewButton,
        ServiceTicketNewModal,
        ServiceTicketCloseButton,
        ServiceTicketCloseModal,
        ServiceTicketView,
        ServiceTicketDetail,
        ServiceTicketContactDetail,
        ServiceTicketConsumerDetail,
        ServiceTicketAccountDetail,
        ServiceActivitiyTimelineAddServiceNote,
        ServiceTicketRelatedTickets,
        ServiceTicketRelatedTicketsTiles,
        ServiceOrderNewButton,
        ServiceOrderItemPipe,
        ServiceOrderEffortItem,
        ServiceOrderEffortItemDetails,
        ServiceOrderEffortPanel,
        ServiceOrderEquipmentItem,
        ServiceOrderEquipmentPanel,
        ServiceOrderItemItem,
        ServiceOrderItemPanel,
        ServiceOrderAddTypeSelector,
        ServiceOrderConfirmButton,
        ServiceOrderConfirmModal,
        ServiceOrderItemConfirmItem,
        ServiceOrderItemConfirmationPanel,
        ServiceOrderEffortConfirmationItem,
        ServiceOrderEffortConfirmationPanel,
        ServicePlanner,
        ServicePlannerMapsModelPopover,
        ServicePlannerMapsModelPopoverDirection,
        ServiceDocSignatureButton,
        ServiceDocSignatureContent,
        ServiceDocSignatureModal
    ]
})
export class ServiceComponentsModule {
}
