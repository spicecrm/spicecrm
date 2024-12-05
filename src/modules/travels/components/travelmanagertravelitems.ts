import {Component, Input, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {language} from "../../../services/language.service";
import moment from "moment";
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'travel-manager-travel-items',
    templateUrl: '../templates/travelmanagertravelitems.html'
})

export class TravelManagerTravelItems implements OnInit {

    /**
     * holds the currently selected travel
     */
    @Input() selectedTravel: any;

    /**
     * loading related data
     */
    public loading: boolean = false;

    /**
     * holds TravelMileages related to selected Travel
     */
    public travelMileages: any = [];

    /**
     * holds TravelSegments related to selected Travel
     */
    public travelSegments: any = [];

    /**
     * holds TravelReceipts related to selected Travel
     */
    public travelReceipts: any = [];

    /**
     * holds the subscriptions to unsubscribe
     */
    public subscriptions: Subscription = new Subscription();

    constructor(
        public model: model,
        private modal: modal,
        private backend: backend,
        private toast: toast,
        private language: language,
        public broadcast: broadcast,
        public router: Router,
        public navigationtab: navigationtab
    ) {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );
    }

    ngOnInit() {
        this.loadTravelData();
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * update data related to the travel
     * @param message
     */
    public handleMessage(message){


        switch (message.messagetype) {
            case 'model.save':

                // manipulate data in frontend due to issues with moment on date fields
                const data = this.backend.modelutilities.spiceModel2backend(message.messagedata.module, JSON.parse(JSON.stringify(message.messagedata.data)))

                if(message.messagedata.module == 'TravelReceipts' && data.parent_id == this.model.id) this.travelReceipts.push(data);
                if(message.messagedata.module == 'TravelSegments' && data.travel_id == this.model.id) this.travelSegments.push(data);
                if(message.messagedata.module == 'TravelMileages' && data.travel_id == this.model.id) this.travelMileages.push(data);
                break;
        }
    }

    /**
     * load data related to the current Travel:
     * TravelReceipts, TravelSegments, TravelSegments
     * @private
     */
    private loadTravelData() {
        this.loading = true;

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';

            this.backend.getRequest(`module/Travels/${this.model.id}/loadTravelData`).subscribe({
                next: (response) => {

                    this.travelSegments = [...response.travelData.segments];
                    this.travelReceipts = [...response.travelData.receipts];
                    this.travelMileages = [...response.travelData.mileages];

                    loadingRef.instance.self.destroy();
                    this.loading = false;
                }, error: (err) => {
                    loadingRef.instance.self.destroy();
                    this.loading = false;
                    this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_TRAVELS'), 'error', err.message);
                }
            })
        });
    }

    public openItem(module, id){
        let objectlink = "/module/" + module + "/" + id;
        // if we have a tabid and it is not th emain tab add it
        if (this.navigationtab?.tabid) objectlink = '/tab/' + this.navigationtab?.tabid + '/' + objectlink;
        // navigate to the route
        this.router.navigate([objectlink]);
    }

}