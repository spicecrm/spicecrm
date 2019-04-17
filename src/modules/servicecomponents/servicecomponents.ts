/**
 * @module ServiceComponentsModule
 */
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {metadata} from '../../services/metadata.service';

import {ObjectFields}      from '../../objectfields/objectfields';
import {GlobalComponents}      from '../../globalcomponents/globalcomponents';
import {ObjectComponents}      from '../../objectcomponents/objectcomponents';
import {SystemComponents}      from '../../systemcomponents/systemcomponents';
import {VersionManagerService} from "../../services/versionmanager.service";

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


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ObjectFields,
        GlobalComponents,
        ObjectComponents,
        SystemComponents,
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
        ServiceTicketSLAIndicator
        ]
    })
export class ServiceComponentsModule {
    readonly version = '1.0';
    readonly build_date = '/*build_date*/';

    constructor(
        public metadata: metadata,
        private vms: VersionManagerService,
    ) {
        this.vms.registerModule(this);
    }
}