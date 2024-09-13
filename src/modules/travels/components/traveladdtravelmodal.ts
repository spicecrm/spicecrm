import {Component, ComponentRef, OnInit} from '@angular/core';
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {metadata} from "../../../services/metadata.service";
import {view} from "../../../services/view.service";
import {userpreferences} from "../../../services/userpreferences.service";
import moment from "moment";
import {Subject} from "rxjs";

@Component({
    selector: 'travel-add-travel-modal',
    templateUrl: '../templates/traveladdtravelmodal.html'
})

/**
 * configurable modal
 * where you can create a new Travel Bean
 */
export class TravelAddTravelModal implements OnInit {

    /**
     * holds self instance of the modal
     */
    public self: ComponentRef<TravelAddTravelModal>;

    /**
     * the componentset id defined in config
     * */
    public fieldset: string = '';

    /**
     * holds the current date
     */
    public currentDate: any = moment();

    /**
     * holds the end date
     */

    public endDate: any = moment();
    /**
     * holds the start date
     */
    public startDate: any = moment();

    /**
     * holds the start hour from user preferences
     */

    public startHour: number = 0;
    /**
     * holds the end hour from user preferences
     */
    public endHour: number = 23;

    /**
     * observable subject
     */
    public responseSubject: Subject<any> = new Subject<any>();

    constructor(
        public model: model,
        private modal: modal,
        private metadata: metadata,
        public view: view,
        private userpreferences: userpreferences
    ) {
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
     * set pre-defined values for specific fields
     */
    public setFields() {
        this.model.setFields({
            // set date with start time from User Preferences
            date_start: moment({hour: this.userpreferences.toUse.calendar_day_start_hour}),
            date_end: moment({hour: this.userpreferences.toUse.calendar_day_end_hour}),

            // fill out the rest of the fields
            employee_id: this.userpreferences.session.authData.user.parent_id,
            employee_name: this.userpreferences.session.authData.user.parent_name,
            currency_id: this.userpreferences.toUse.currency
        })

    }

    /**
     * loads the config
     */
    public loadConfig() {
        const componentConfig = this.metadata.getComponentConfig('TravelAddTravelModal', this.model.module);
        this.fieldset = componentConfig?.fieldset;
    }

    /**
     * saves the Travel
     */
    public save() {
        const isSaving = this.modal.await('LBL_SAVING_DATA');

        if (this.model.validate()) {
            this.model.save(true).subscribe({
                next: res => {
                    this.responseSubject.next(this.model.data);
                    this.responseSubject.complete()
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
        this.model.cancelEdit();
        this.view.isEditable = false;
        this.view.setViewMode();
        this.responseSubject.next(false);
        this.responseSubject.complete()
        this.self.destroy()
    }
}