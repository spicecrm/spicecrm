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
import /*embed*/ {ServicePlannerRecordI, ServicePlannerEventI, ServicePlannerDirectionResultI, ServicePlannerRoutePointI} from './interfaces/servicecomponents.interfaces';

import /*embed*/ {ServicePlannerService} from "./services/serviceplanner.service";

import /*embed*/ {SignServiceOrderModalButtonComponent} from "./components/signserviceordermodalbutton";
import /*embed*/ {SignServiceOrderModalComponent} from "./components/signserviceordermodal";
import /*embed*/ {ServiceOrderSummaryComponent} from "./components/serviceordersummary";
import /*embed*/ {ServiceActivitiyTimelineAddServiceCall} from "./components/serviceactivitiytimelineaddservicecall";
import /*embed*/ {ServiceAddTicketButton} from "./components/serviceaddticketbutton";
import /*embed*/ {ServiceAddTicketActionButton} from "./components/serviceaddticketactionbutton";
import /*embed*/ {ServiceCategoryManagerComponent} from "./components/servicecategorymanager";
import /*embed*/ {ServiceSelectQueueButton} from "./components/serviceselectqueuebutton";
import /*embed*/ {ServiceSelectQueueModal} from "./components/serviceselectqueuemodal";
import /*embed*/ {ServiceMyTicketsDashlet} from "./components/servicemyticketsdashlet";
import /*embed*/ {ServiceMyQueuesTicketsDashlet} from "./components/servicemyqueuesticketsdashlet";
import /*embed*/ {ServiceMyQueuesTicketsDashletItem} from "./components/servicemyqueuesticketsdashletitem";
import /*embed*/ {ServiceTicketProlongButton} from "./components/serviceticketprolongbutton";
import /*embed*/ {ServiceTicketProlongModal} from "./components/serviceticketprolongmodal";
import /*embed*/ {ServiceTicketSLAIndicator} from "./components/serviceticketslaindicator";
import /*embed*/ {ServiceRequestFeedbackButton} from "./components/servicerequestfeedbackbutton";
import /*embed*/ {ServiceTicketCloseButton} from "./components/serviceticketclosebutton";
import /*embed*/ {ServiceTicketCloseModal} from "./components/serviceticketclosemodal";
import /*embed*/ {ServiceTicketView} from "./components/serviceticketview";
import /*embed*/ {ServiceTicketDetail} from "./components/serviceticketdetail";
import /*embed*/ {ServiceTicketContactDetail} from "./components/serviceticketcontactdetail";
import /*embed*/ {ServiceTicketAccountDetail} from "./components/serviceticketaccountdetail";
import /*embed*/ {ServiceActivitiyTimelineAddServiceNote} from "./components/serviceactivitiytimelineaddservicenote";
import /*embed*/ {ServiceTicketRelatedTickets} from "./components/serviceticketrelatedtickets";
import /*embed*/ {ServiceTicketRelatedTicketsTiles} from "./components/serviceticketrelatedticketstiles";
import /*embed*/ {fieldWarrantyIndicator} from './fields/fieldwarrantyindicator';
import /*embed*/ {fieldBooleanBullet} from './fields/fieldbooleanbullet';
import /*embed*/ {fieldServiceQueue} from './fields/fieldServiceQueue';

import /*embed*/ {ServiceOrderEffortItem} from "./components/serviceordereffortitem";
import /*embed*/ {ServiceOrderEffortItemDetails} from "./components/serviceordereffortitemdetails";
import /*embed*/ {ServiceOrderEffortPanel} from "./components/serviceordereffortpanel";
import /*embed*/ {ServiceOrderEquipmentItem} from "./components/serviceorderequipmentitem";
import /*embed*/ {ServiceOrderEquipmentPanel} from "./components/serviceorderequipmentpanel";
import /*embed*/ {ServiceOrderItemItem} from "./components/serviceorderitemitem";
import /*embed*/ {ServiceOrderItemPanel} from "./components/serviceorderitempanel";
import /*embed*/ {ServiceOrderItemPipe} from "./pipes/serviceorderitemspipe";
import /*embed*/ {ServiceOrderAddTypeSelector} from "./components/serviceorderaddtypeselector";
import /*embed*/ {ServiceOrderConfirmButton} from "./components/serviceorderconfirmbutton";
import /*embed*/ {ServiceOrderConfirmModal} from "./components/serviceorderconfirmmodal";
import /*embed*/ {ServiceOrderItemConfirmItem} from "./components/serviceorderitemconfirmitem";
import /*embed*/ {ServiceOrderItemConfirmationPanel} from "./components/serviceorderitemconfirmationpanel";
import /*embed*/ {ServiceOrderEffortConfirmationItem} from "./components/serviceordereffortconfirmationitem";
import /*embed*/ {ServiceOrderEffortConfirmationPanel} from "./components/serviceordereffortconfirmationpanel";
import /*embed*/ {ServicePlanner} from "./components/serviceplanner";
import /*embed*/ {ServicePlannerMapsModelPopover} from "./components/serviceplannermapsmodelpopover";
import /*embed*/ {ServicePlannerMapsModelPopoverDirection} from "./components/serviceplannermapsmodelpopoverdirection";
import {ModuleSpiceTimeline} from "../../include/spicetimeline/spicetimeline";

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
        ServiceTicketCloseButton,
        ServiceTicketCloseModal,
        ServiceTicketView,
        ServiceTicketDetail,
        ServiceTicketContactDetail,
        ServiceTicketAccountDetail,
        ServiceActivitiyTimelineAddServiceNote,
        ServiceTicketRelatedTickets,
        ServiceTicketRelatedTicketsTiles,
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
    ]
})
export class ServiceComponentsModule {
}
