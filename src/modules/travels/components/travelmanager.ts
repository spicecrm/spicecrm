import {Component, ComponentRef, Injector, OnInit} from '@angular/core';
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {view} from "../../../services/view.service";
import {TravelAddTravelModal} from "./traveladdtravelmodal";
import {SpiceAttachmentAddImageModal} from "../../../include/spiceattachments/components/spiceattachmentaddimagemodal";

@Component({
    selector: 'travel-manager',
    templateUrl: '../templates/travelmanager.html',
    providers: [model, view]
})

export class TravelManager implements OnInit {

    /**
     * holds travels happening
     * between today and end date of the Travel
     */
    public nowTravels: any[] = [];

    /**
     * holds travels in the future
     */
    public futureTravels: any[] = [];

    /**
     * weather data is being loaded
     */
    public loading: boolean = false;

    constructor(
        public model: model,
        private backend: backend,
        private navigationTab: navigationtab,
        public language: language,
        private modal: modal,
        private toast: toast,
        public view: view,
        private injector: Injector,
    ) {
        this.model.module = 'Travels';
        this.loadActiveUserTravels();
    }

    ngOnInit() {
        this.navigationTab.setTabInfo({
            displayname: this.language.getLabel('LBL_TRAVEL_MANAGER'),
            displaymodule: 'Travels'
        });
    }

    /**
     * retrieve travels for the Employee/logged-in User
     * @private
     */
    private loadActiveUserTravels() {
        this.loading = true;

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';

            this.backend.getRequest(`module/Travels/load`).subscribe({
                next: (response) => {

                    if (response.travels?.now) this.nowTravels = [...response.travels?.now];
                    if (response.travels?.future) this.futureTravels = [...response.travels?.future];

                    if (this.nowTravels.length > 1) {
                        this.futureTravels = this.nowTravels.concat(this.futureTravels);
                    } else {
                        this.selectTravel(this.nowTravels[0]);
                    }

                    loadingRef.instance.self.destroy();
                    this.loading = false;
                }, error: (err) => {
                    loadingRef.instance.self.destroy();
                    this.loading = false;
                    this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_TRAVELS'), 'error', err);
                }
            })
        });
    }

    /**
     * retrieve data for selected travel
     * @param selectedTravel
     */
    public selectTravel(selectedTravel) {
        if (selectedTravel?.id) {
            this.loading = true;
            this.model.id = selectedTravel.id;
            this.model.getData();
            this.loading = false;
        }
    }

    /**
     * create a new Travel
     */
    public createNewTravel() {
        this.modal.openModal('TravelAddTravelModal', true, this.injector).subscribe((modalRef: ComponentRef<TravelAddTravelModal>) => {

            // wait for modal to finish saving the Travel
            modalRef.instance.responseSubject.subscribe({
                next: (resp) => {
                    this.selectTravel(resp);
                    this.nowTravels.push(resp);
                }
            })
        });
    }

    /**
     * resets the current model
     */
    public resetCurrentModel() {
        this.loading = true;
        this.model.initialize();
        this.model.id = undefined;
        this.loading = false;

    }
}