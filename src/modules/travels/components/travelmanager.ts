import {Component, ComponentRef, Injector, OnInit} from '@angular/core';
import {navigationtab} from "../../../services/navigationtab.service";
import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {view} from "../../../services/view.service";
import {TravelAddTravelModal} from "./traveladdtravelmodal";
import {Router} from "@angular/router";
import {navigation} from "../../../services/navigation.service";
import {metadata} from "../../../services/metadata.service";

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
    public travels: any[] = [];

    public config: any;


    constructor(
        public model: model,
        private backend: backend,
        private navigationTab: navigationtab,
        public language: language,
        public metadata: metadata,
        private modal: modal,
        private toast: toast,
        public view: view,
        private injector: Injector,
        private navigation: navigation
    ) {
        this.model.module = 'Travels';

        // get the config
        this.config = this.metadata.getComponentConfig('TravelManager', 'Travels');

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
    private loadActiveUserTravels(autoselect = true) {
        this.travels = [];
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';

            let params: any = {};
            if(this.config.filter) params.filter = this.config.filter;

            this.backend.getRequest(`module/Travels/load`, params).subscribe({
                next: (response) => {

                    this.travels = response;

                    if (autoselect && this.travels.length == 1) {
                        this.selectTravel(this.travels[0]);
                    }

                    loadingRef.instance.self.destroy();
                }, error: (err) => {

                    loadingRef.instance.self.destroy();
                    this.toast.sendToast(this.language.getLabel('LBL_ERR_LOADING_TRAVELS'), 'error', this.language.getLabel(err.error.error.message));

                    this.navigation.closeObjectTab(this.navigationTab.objecttab.id);
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
            this.model.id = selectedTravel.id;
            this.model.getData();
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
                    if(resp) {
                        this.selectTravel(resp);
                        this.travels.push(resp);
                    } else {
                        this.resetCurrentModel()
                    }
                }
            })
        });
    }

    /**
     * resets the current model
     */
    public resetCurrentModel() {
        this.model.initialize();
        this.model.id = undefined;
        this.loadActiveUserTravels(false);
    }
}