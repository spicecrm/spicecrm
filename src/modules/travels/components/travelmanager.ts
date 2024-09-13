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
     * weather buttons or data should be hidden
     */
    public hideRelatedTravelData: boolean = true;

    /**
     * weather add icon should be hidden
     */
    public hideAddButton: boolean = true;

    constructor(
        public model: model,
        private backend: backend,
        private navigationTab: navigationtab,
        public language: language,
        private modal: modal,
        private toast: toast,
        public view: view,
        private injector: Injector,
        private navigation: navigation
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
     * set height for centering the button
     */
    public setHeight() {
        return {
            height: this.view.layout.screenwidth == 'small' && this.futureTravels.length == 0 ? '90%' : undefined
        }
    }

    /**
     * retrieve travels for the Employee/logged-in User
     * @private
     */
    private loadActiveUserTravels() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            loadingRef.instance.messagelabel = 'LBL_LOADING';

            this.backend.getRequest(`module/Travels/load`).subscribe({
                next: (response) => {

                    if (response.travels?.now) this.nowTravels = [...response.travels?.now];
                    if (response.travels?.future) this.futureTravels = [...response.travels?.future];

                    if (this.nowTravels.length == 1) {
                        this.selectTravel(this.nowTravels[0]);
                    } else {
                        this.futureTravels = this.nowTravels.concat(this.futureTravels);
                        this.hideAddButton = false;
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
            this.hideRelatedTravelData = false;
            this.hideAddButton = true;
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
                        this.nowTravels.push(resp);
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
        this.hideRelatedTravelData = true;
        this.hideAddButton = false;
        this.model.initialize();
        this.model.id = undefined;
    }
}