/**
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
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
/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'field-date-span',
    templateUrl: '../templates/fielddatespan.html'
})
export class fieldDateSpan extends fieldGeneric implements OnInit {

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
     * initialize and subscribe to the model data changes so we can calculate a duration if we have one
     */
    public ngOnInit() {
        super.ngOnInit();

        this.subscriptions.add(
            this.model.data$.subscribe((data) => {
                if (this.startDate && this.endDate) {
                    this.duration = moment.duration(this.endDate.diff(this.startDate));
                }
            })
        );
    }

    get fieldstart() {
        return this.fieldconfig.date_start ? this.fieldconfig.date_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.date_end ? this.fieldconfig.date_end : 'date_end';
    }

    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    set startDate(date) {
        // build the fields object
        let fields: any = {};
        fields[this.fieldstart] = date;

        if (this.duration) {
            // calculate the new end date
            let newEndDate = new moment(date).add(this.duration.asSeconds(), 's');

            // add the end date
            fields[this.fieldend] = newEndDate;
        }

        // set the fields on the model
        this.model.setFields(fields);
    }

    get endDate() {
        return this.model.getField(this.fieldend);
    }

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
}
