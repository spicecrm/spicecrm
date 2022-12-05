/**
 * @module ObjectFields
 */
import {AfterViewInit, Component, OnInit} from '@angular/core';
import {userpreferences} from "../../services/userpreferences.service";
import {fieldGeneric} from './fieldgeneric';
import {view} from "../../services/view.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {Router} from "@angular/router";

/**
 * @ignore
 */
declare var moment: any;

/**
 * renders a field with a date time span
 */
@Component({
    selector: 'field-date-time-span',
    templateUrl: '../templates/fielddatetimespan.html'
})
export class fieldDateTimeSpan extends fieldGeneric implements OnInit {

    /**
     * inidcates that we have a valid field
     *
     * @private
     */
    public isValid: boolean = true;

    /**
     * collected error messages
     *
     * @private
     */
    public errorMessage: string = '';

    /**
     * the duration, held intrnally so we can move the end date when the start date moves
     *
     * @private
     */
    public duration: any;

    /**
     * indicate if the start date is valid
     */
    public startDateValid: boolean = true;

    /**
     * indicate if the end date is valid
     */
    public endDateValid: boolean = true;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);

    }

    /**
     * subscribe to the model data$ changes to have an accurate and up to date duration
     */
    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe((data) => {
                if (this.startDate && this.endDate) {
                    let duration = 0;
                    if(typeof this.endDate === 'string') {
                        duration = moment(this.endDate).diff(this.startDate);
                    } else {
                        duration = this.endDate.diff(this.startDate);
                    }
                    this.duration = moment.duration(duration);
                }
            })
        );
    }

    /**
     * a getter to get if the fields houdl be vertical (default) or horizontal
     */
    get vertical() {
        return this.fieldconfig.horizontal !== true;
    }

    get showToDate() {
        if (this.startDate && this.endDate) {
            return !this.startDate.isSame(this.endDate, 'day');
        }
        return true;
    }

    /**
     * returns the name fo the start field date
     */
    get fieldstart() {
        return this.fieldconfig.date_start ? this.fieldconfig.date_start : 'date_start';
    }

    /**
     * returns the name fo the end field date
     */
    get fieldend() {
        return this.fieldconfig.date_end ? this.fieldconfig.date_end : 'date_end';
    }

    /**
     * getter for the start date
     */
    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    /**
     * setter for the start date so we can calulate and update the end time
     *
     * @param date
     */
    set startDate(date) {
        // build the fields object
        let fields: any = {};
        fields[this.fieldstart] = date;

        if (this.duration) {
            // calculate the new end date
            let newEndDate = new moment(date).add(this.duration.asSeconds(), 's');

            // add the end date
            fields[this.fieldend] = newEndDate;
        } else if (!this.model.getField(this.fieldend)) {
            fields[this.fieldend] = new moment(date);
        }

        // set the fields on the model
        this.model.setFields(fields);
    }

    /**
     * getter for the end date
     */
    get endDate() {
        return this.model.getField(this.fieldend);
    }

    /**
     * setter for the start date also checks that we have a valid span with the start before the end
     */
    set endDate(date) {
        // if startdate is not set .. set it ...
        if (!this.model.getFieldValue(this.fieldstart)) {
            this.startDate = new moment(date);
        }

        if (date.isBefore(this.model.getFieldValue(this.fieldstart))) {
            this.isValid = false;
            this.errorMessage = 'enddate cannot be before startdate';
            this.model.setFieldMessage('error', 'enddate cannot be before startdate', this.fieldname, 'sequencecheck');
            // this.calculateEndDate();
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'sequencecheck');
            this.model.setField(this.fieldend, date);
            this.isValid = true;
        }
    }


    /**
     * sets wither start or end date valid or invalid
     *
     * @param date
     * @param valid
     */
    public setDateValid(date: 'start' | 'end', valid) {
        switch (date) {
            case 'start':
                this.startDateValid = valid;
                break;
            case 'end':
                this.endDateValid = valid;
                break;
        }

        if(!this.endDateValid || !this.startDateValid){
            this.model.setFieldMessage('error', this.language.getLabel('LBL_INPUT_INVALID'), this.fieldname, 'validitycheck');
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'validitycheck');
        }
    }

    get stati() {
        let stati = this.model.getFieldStati(this.fieldname);

        if (stati.editable && (!this.view.isEditable || this.fieldconfig.readonly)) {
            stati.editable = false;
        }

        // add required flag if set via fieldconfig
        if (this.fieldconfig.required) {
            stati.required = true;
        }

        return stati;
    }
}
