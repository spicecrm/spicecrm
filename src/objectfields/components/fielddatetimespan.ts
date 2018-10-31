import {Component, ElementRef, Renderer, OnInit} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';

declare var moment: any;

@Component({
    selector: 'field-date-time-span',
    templateUrl: './src/objectfields/templates/fielddatetimespan.html'
})
export class fieldDateTimeSpan extends fieldGeneric implements OnInit {
    private isValid: boolean = true;
    private errorMessage: String = '';

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

        return parseInt(hours, 10) * 60 + parseInt(minutes, 10) * 60;
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
        this.model.data[this.fieldend].seconds(0);
        this.model.data[this.fieldstart].seconds(0);

        let duration = moment.duration(this.model.data[this.fieldend].diff(this.model.data[this.fieldstart]));
        let hours = Math.floor(duration.asHours());
        let minutes = duration.asMinutes() - 60 * hours;

        this.model.data[this.fieldhours] = hours;
        this.model.data[this.fieldminutes] = minutes;
    }
}
