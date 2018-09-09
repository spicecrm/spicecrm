import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-date-time-duration',
    templateUrl: './src/objectfields/templates/fielddatetimeduration.html',
    providers: [popup]
})
export class fieldDateTimeDuration extends fieldGeneric {
    showDatePicker: boolean = false;
    showTimePicker: boolean = false;
    errorMessage: String = '';
    popupSubscription: any = undefined;
    clickListener: any = undefined;
    dropdownTimes: Array<any> = [];
    durationHours: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    durationMinutes: Array<string> = ['0', '15', '30', '45'];
    dateFormat: string = 'DD.MM.YYYY';
    timeFormat: string = 'HH:mm';
    private isValid: boolean = true;

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private popup: popup, private renderer: Renderer, private elementRef: ElementRef) {
        super(model, view, language, metadata, router);
        let i = 0;
        while (i < 24) {
            let timeString = '';
            if (i < 10)
                timeString += '0' + i + ':';
            else
                timeString = i + ':';

            this.dropdownTimes.push(timeString + '00');
            this.dropdownTimes.push(timeString + '15');
            this.dropdownTimes.push(timeString + '30');
            this.dropdownTimes.push(timeString + '45');

            i++;
        }
    }

    get fieldstart() {
        return this.fieldconfig['field_start'] ? this.fieldconfig['field_start'] : 'date_start';
    }

    get fieldend() {
        return this.fieldconfig['field_end'] ? this.fieldconfig['field_end'] : 'date_end';
    }

    get fieldminutes() {
        return this.fieldconfig['field_minutes'] ? this.fieldconfig['field_minutes'] : 'duration_minutes';
    }

    get fieldhours() {
        return this.fieldconfig['field_hours'] ? this.fieldconfig['field_hours'] : 'duration_hours';
    }

    get minutes() {
        let minutes = 0;
        if (this.model.data[this.fieldhours])
            minutes += parseInt(this.model.data[this.fieldhours]) * 60;
        if (this.model.data[this.fieldminutes])
            minutes += parseInt(this.model.data[this.fieldminutes]);

        return minutes;
    }

    get editDate() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = new moment(this.model.data[this.fieldstart]);
                return date.format(this.dateFormat);
            }
            else
                return '';
        } catch (e) {
            return '';
        }
    }

    set editDate(e: string) {
        let setDate = moment(e, this.dateFormat, true);
        if (setDate.isValid()) {

            // set the time
            setDate.hour(this.model.data[this.fieldstart].hour());
            setDate.minute(this.model.data[this.fieldstart].minute());

            // move the start Date
            this.model.setField(this.fieldstart, setDate);

            // move the end date as well
            this.model.data[this.fieldend] = new moment(setDate).add(this.minutes, 'm');

            this.isValid = true;
            this.errorMessage = '';
        } else {
            // if (e.length !== 10) {
            this.isValid = false;
            this.errorMessage = e + ' is not a valid date';
        }
    }

    get editTime() {
        try {
            if (this.model.data[this.fieldstart]) {
                return this.model.data[this.fieldstart].format(this.timeFormat);
            }
            else return '';
        } catch (e) {
            return '';
        }
    }

    set editTime(value) {
        let setTime = new moment(value, this.timeFormat, true)
        if (setTime.isValid()) {
            // set the date
            setTime.year(this.model.data[this.fieldstart].year());
            setTime.month(this.model.data[this.fieldstart].month());
            setTime.date(this.model.data[this.fieldstart].date());

            // set the start date
            this.model.setField(this.fieldstart, setTime);

            // move the end date as well
            this.model.data[this.fieldend] = new moment(setTime).add(this.minutes, 'm');

            this.isValid = true;
            this.errorMessage = '';
        } else {
            this.isValid = false;
            this.errorMessage = value + ' is not a valid time';
        }
    }

    get editDurationHours() {
        return this.model.data[this.fieldhours];
    }

    set editDurationHours(hours) {
        this.model.setField(this.fieldhours, hours);
    }

    get editDurationMinutes() {
        return this.model.data[this.fieldminutes];
    }

    set editDurationMinutes(minutes) {
        this.model.setField(this.fieldminutes, minutes);
    }

    getDisplay() {
        if (this.model.data.date_start) {
            if (!this.model.data.date_end) {
                this.model.data[this.fieldend] = new moment(this.model.data.date_start).add(this.minutes, 'm');
            }

            return this.model.data.date_start.format(this.dateFormat + ' ' + this.timeFormat) + ' - ' + this.model.data.date_end.format(this.dateFormat + ' ' + this.timeFormat);
        }
    }

    /*
     * toggle the datepicker and subscribe to the close event
     */
    toggleDatePicker() {
        this.showDatePicker = !this.showDatePicker;
        if (this.showDatePicker) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
            this.popupSubscription = this.popup.closePopup$.subscribe(event => {
                this.showDatePicker = false;
                this.clickListener();
                this.popupSubscription.unsubscribe();
            })
        } else {
            this.popupSubscription.unsubscribe();
        }
    }

    toggleTimePicker() {
        this.showTimePicker = !this.showTimePicker;
        if (this.showTimePicker) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickListener();
            this.showDatePicker = false;
            this.showTimePicker = false;
        }
    }

    // overwrite get Field Class
    getFieldClass() {
        let classes: Array<string> = [];
        if (!this.isValid) classes.push('slds-has-error');
        return classes;
    }

    setTime(value) {
        this.editTime = value;
        this.showTimePicker = false;
        this.clickListener();
    }

}