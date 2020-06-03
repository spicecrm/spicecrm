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

import /*embed*/ {SignServiceOrderModalButtonComponent} from "./components/signserviceordermodalbutton";
import /*embed*/ {SignServiceOrderModalComponent} from "./components/signserviceordermodal";
import /*embed*/ {ServiceOrderSummaryComponent} from "./components/serviceordersummary";
import /*embed*/ {ServiceActivitiyTimelineAddServiceCall} from "./components/serviceactivitiytimelineaddservicecall";
import /*embed*/ {ServiceAddTicketButton} from "./components/serviceaddticketbutton";
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

import /*embed*/ {ServiceOrderEffortItem} from "./components/serviceordereffortitem";
import /*embed*/ {ServiceOrderEffortItemDetails} from "./components/serviceordereffortitemdetails";
import /*embed*/ {ServiceOrderEffortPanel} from "./components/serviceordereffortpanel";
import /*embed*/ {ServiceOrderEquipmentItem} from "./components/serviceorderequipmentitem";
import /*embed*/ {ServiceOrderEquipmentPanel} from "./components/serviceorderequipmentpanel";
import /*embed*/ {ServiceOrderItemItem} from "./components/serviceorderitemitem";
import /*embed*/ {ServiceOrderItemPanel} from "./components/serviceorderitempanel";
import /*embed*/ {ServiceOrderItemPipe} from "./pipes/serviceorderitemspipe";
import /*embed*/ {ServiceOrderAddTypeSelector} from "./components/serviceorderaddtypeselector";




@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        DirectivesModule,
        ObjectComponents,
        SystemComponents
    ],
    declarations: [
        SignServiceOrderModalButtonComponent,
        SignServiceOrderModalComponent,
        ServiceOrderSummaryComponent,
        ServiceActivitiyTimelineAddServiceCall,
        ServiceAddTicketButton,
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
        ServiceOrderAddTypeSelector
    ]
})
export class ServiceComponentsModule {
}
