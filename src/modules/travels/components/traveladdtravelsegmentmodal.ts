import {Component, ComponentRef, OnInit, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import moment from "moment/moment";
import {userpreferences} from "../../../services/userpreferences.service";
import {modal} from "../../../services/modal.service";
import {Subject} from "rxjs";

@Component({
    selector: 'travel-add-travel-segment-modal',
    templateUrl: '../templates/traveladdtravelsegmentmodal.html',
    providers: [model]
})

/**
 * temporary component
 * creating manually a TravelMileage Bean
 * related to the selected Travel
 */
export class TravelAddTravelSegmentModal implements OnInit {

    /**
     * observable subject
     */
    public mileageResponseSubject: Subject<any> = new Subject<any>();

    /**
     * holds self instance of the modal
     */
    public self: ComponentRef<TravelAddTravelSegmentModal>;

    /**
     * the componentset id defined in config
     * */
    public fieldset: string = '';

    constructor(
        public model: model,
        @SkipSelf() public parent: model,
        private modal: modal,
        private metadata: metadata,
        public view: view,
        private userpreferences: userpreferences
    ) {
        this.model.module = 'TravelSegments';
        this.loadConfig();
    }

    ngOnInit() {
        this.model.initialize();

        this.model.startEdit(false);
        this.setFields()
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    /**
     * loads the config
     */
    public loadConfig() {
        const componentConfig = this.metadata.getComponentConfig('TravelAddTravelSegmentModal', this.model.module);
        this.fieldset = componentConfig?.fieldset;
    }

    /**
     * set pre-defined values for specific fields
     */
    public setFields() {
        this.model.setFields({
            date_start: moment({hour: this.userpreferences.toUse.calendar_day_start_hour}),
            date_end: moment({hour: this.userpreferences.toUse.calendar_day_end_hour}),
            currency_id: this.userpreferences.toUse.currency,

            employee_id: this.userpreferences.session.authData.user.parent_id,
            employee_name: this.userpreferences.session.authData.user.parent_name,
            travel_id: this.parent.data.id,
            travel_name: this.parent.data.name
        })
    }

    /**
     * save TravelSegment
     */
    public save() {
        const isSaving = this.modal.await('LBL_SAVING_DATA');

        if (this.model.validate()) {
            this.model.save(true).subscribe({
                next: res => {
                    this.mileageResponseSubject.next(this.model.data);
                    this.mileageResponseSubject.complete()
                    isSaving.next(true);
                    isSaving.complete();
                    this.close();
                },
                error: () => {
                    isSaving.next(false);
                    isSaving.complete();
                    this.close();
                }
            });
        }
    }

    /**
     * closes and destroys the modal
     */
    public close() {
        this.view.isEditable = false;
        this.view.setViewMode();
        this.self.destroy()
    }
}