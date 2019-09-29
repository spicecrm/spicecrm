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
    selector: 'field-date-time-span',
    templateUrl: './src/objectfields/templates/fielddatetimespan.html'
})
export class fieldDateTimeSpan extends fieldGeneric implements OnInit {
    private isValid: boolean = true;
    private errorMessage: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
    }

    get fieldstart() {
        return this.fieldconfig.field_start ? this.fieldconfig.field_start : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig.field_end ? this.fieldconfig.field_end : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig.field_minutes ? this.fieldconfig.field_minutes : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig.field_hours ? this.fieldconfig.field_hours : 'duration_hours';
    }

    public ngOnInit() {
        this.calculateEndDate();
    }

    get duration() {
        let hours = this.model.getFieldValue(this.fieldhours);
        let minutes = this.model.getFieldValue(this.fieldminutes);

        return parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    }

    get formattedStartDate() {
        return this.startDate ? this.startDate.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) : '';
    }

    get formattedEndDate() {
        return this.endDate ? this.endDate.format(this.userpreferences.getDateFormat() + ' ' + this.userpreferences.getTimeFormat()) : '';
    }

    get startDate() {
        return this.model.getField(this.fieldstart);
    }

    set startDate(date) {
        this.model.setField(this.fieldstart, date);
        this.calculateEndDate();
        // console.log('start set');
    }

    get endDate() {
        return this.model.getField(this.fieldend);
    }

    set endDate(date) {
        // if startdate is not set .. set it ...
        if (!this.model.getFieldValue(this.fieldstart)) {
            this.startDate = new moment(date).subtract(this.duration, 'minutes');
        }

        if (date.isBefore(this.model.getFieldValue(this.fieldstart))) {
            this.isValid = false;
            this.errorMessage = 'enddate cannot be before startdate';
            this.model.setFieldMessage('error', 'enddate cannot be before startdate', this.fieldname, 'sequencecheck');
            // this.calculateEndDate();
        } else {
            this.model.resetFieldMessages(this.fieldname, 'error', 'sequencecheck');
            this.model.setField(this.fieldend, date);
            this.calculateDuration();
            this.isValid = true;
        }
    }

    private calculateEndDate() {
        if (this.startDate && this.duration) {
            this.endDate = new moment(this.startDate).add(this.duration, 'minutes');
        }
    }

    private calculateDuration() {
        // set the seconds to 0
        this.model.getFieldValue(this.fieldend).seconds(0);
        this.model.getFieldValue(this.fieldstart).seconds(0);

        let duration = moment.duration(this.model.getFieldValue(this.fieldend).diff(this.model.getFieldValue(this.fieldstart)));
        let hours = Math.floor(duration.asHours());
        let minutes = duration.asMinutes() - 60 * hours;

        this.model.setFieldValue(this.fieldhours, hours);
        this.model.setFieldValue(this.fieldminutes, minutes);
    }
}
