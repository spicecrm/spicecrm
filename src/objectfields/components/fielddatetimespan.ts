import {Component, ElementRef, Renderer} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-date-time-span',
    templateUrl: './app/objectfields/templates/fielddatetimespan.html',
    providers: [popup]
})
export class fieldDateTimeSpan extends fieldGeneric
{
    showDatePicker: boolean = false;
    datePickerDate: string = '';
    showStartTimePicker: boolean = false;
    showEndTimePicker: boolean = false;
    private isValid: boolean = true;
    errorMessage: String = '';
    popupSubscription: any = undefined;
    clickListener: any = undefined;
    dropdownTimes: Array<any> = [];
    dateFormat: string = 'DD.MM.YYYY';
    timeFormat: string = 'HH:mm';

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


    /*
     constructor(private el: ElementRef, private model: model, private view: view, private language: language, private metadata: metadata) {
     }
     */

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

    /*
     * toggle the datepicker and subscribe to the close event
     */
    toggleDatePicker(type) {
        this.datePickerDate = 'date_' + type.toLowerCase();
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

    toggleTimePicker(type) {
        this['show' + type + 'TimePicker'] = !this['show' + type + 'TimePicker'];
        if (this['show' + type + 'TimePicker']) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.clickListener();
            this.showDatePicker = false;
            this.showStartTimePicker = false;
            this.showEndTimePicker = false;
        }
    }

    // overwrite get Field Class
    getFieldClass() {
        let classes: Array<string> = [];
        if (!this.isValid) classes.push('slds-has-error');
        return classes;
    }

    set editStartDate(e: string)
    {
        let setDate = moment(e, this.dateFormat, true);
        if (setDate.isValid()) {

            // set the time
            setDate.hour(this.model.data[this.fieldstart].hour());
            setDate.minute(this.model.data[this.fieldstart].minute());

            // get the current diff to date start
            let diff = moment.duration(this.model.data[this.fieldstart].diff(setDate));

            // move the start Date
            this.model.setField(this.fieldstart,  setDate);

            // move the end date as well
            this.model.data[this.fieldend].subtract(diff);

            this.isValid = true; this.errorMessage = '';
        } else {
            // if (e.length !== 10) {
            this.isValid = false;
            this.errorMessage = e + ' is not a valid date';
        }
    }

    get editStartDate() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = new moment(this.model.data.date_start);
                return date.format(this.dateFormat);
            }
            else
                return '';
        } catch (e) {
            return '';
        }
    }

    set editEndDate(e: string) {
        let setDate = moment(e, this.dateFormat, true);
        if (setDate.isValid()) {

            // set the time
            setDate.hour(this.model.data[this.fieldend].hour());
            setDate.minute(this.model.data[this.fieldend].minute());

            // calculate Duration
            this.calculateDuration();

            if(setDate.isBefore(this.model.data[this.fieldstart])){
                this.isValid = false;
                this.errorMessage = 'enddate cannot be before startdate';
            } else {

                this.model.setField(this.fieldend, setDate);
                this.isValid = true;
                this.errorMessage = '';
            }
        } else {
            // if (e.length !== 10) {
            this.isValid = false;
            this.errorMessage = e + ' is not a valid date';
        }
    }

    get editEndDate() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = new moment(this.model.data.date_end);
                return date.format(this.dateFormat);
            }
            else
                return '';
        } catch (e) {
            return '';
        }
    }

    get editStartTime() {
        try {
            if (this.model.data[this.fieldstart]) {
                return this.model.data[this.fieldstart].format(this.timeFormat);
            }
            else return '';
        } catch (e) {
            return '';
        }
    }

    set editStartTime(value) {
        let setTime = new moment(value, this.timeFormat, true)
        if(setTime.isValid()){
            // set the date
            setTime.year(this.model.data[this.fieldstart].year());
            setTime.month(this.model.data[this.fieldstart].month());
            setTime.date(this.model.data[this.fieldstart].date());

            // get the current diff to date start
            let diff = moment.duration(this.model.data[this.fieldstart].diff(setTime));

            // set the start date
            this.model.setField(this.fieldstart, setTime);

            // move the end date as well
            this.model.data.date_end.subtract(diff);

            this.isValid = true;
            this.errorMessage = '';
        } else {
            this.isValid = false;
            this.errorMessage = value + ' is not a valid time';
        }
    }

    get editEndTime() {
        try {
            if (this.model.data[this.fieldend]) {
                return this.model.data[this.fieldend].format(this.timeFormat);
            } else if (this.model.data[this.fieldminutes] || this.model.data[this.fieldhours]){
                this.model.data[this.fieldend] = new moment( this.model.data[this.fieldstart]);
                this.model.data[this.fieldend].add( parseInt(this.model.data[this.fieldhours]) * 60 + parseInt(this.model.data[this.fieldminutes]), 'm');
                return this.model.data[this.fieldend].format(this.timeFormat);
            }
            else return '';
        } catch (e) {
            return '';
        }
    }

    set editEndTime(value) {

        let setTime = new moment(value, this.timeFormat, true)
        if(setTime.isValid()){
            // set the date
            setTime.year(this.model.data[this.fieldend].year());
            setTime.month(this.model.data[this.fieldend].month());
            setTime.date(this.model.data[this.fieldend].date());

            // set the tiem on the model
            this.model.setField(this.fieldend, setTime);

            // calculate Duration
            this.calculateDuration();

            // set valdiity status
            if(setTime.isBefore(this.model.data[this.fieldstart])){
                this.isValid = false;
                this.errorMessage = 'enddate cannot be before startdate';
            } else {
                this.isValid = true;
                this.errorMessage = '';
            }
        } else {
            this.isValid = false;
            this.errorMessage = value + ' is not a valid time';
        }
    }

    set pickerDate(date : any) {

        if(this.datePickerDate == 'date_start')
            this.editStartDate = date.format(this.dateFormat);

        else
            this.editEndDate = date.format(this.dateFormat);

    }

    get pickerDate(){
        if(this.datePickerDate == 'date_start')
            return new moment(this.model.data[this.fieldstart]);
        else
            return new moment(this.model.data[this.fieldend]);
    }

    setTime(type, value) {

        if(type.toLowerCase() == 'start')
            this.editStartTime = value;
        else
            this.editEndTime = value;

        this['show' + type + 'TimePicker'] = false;
        this.clickListener();
    }

    private calculateDuration(){

        // set the seconds to 0
        this.model.data[this.fieldend].seconds(0);
        this.model.data[this.fieldstart].seconds(0);

        let duration = moment.duration(this.model.data[this.fieldend].diff(this.model.data[this.fieldstart]));
        let hours = Math.floor(duration.asHours());
        let minutes = duration.asMinutes() - 60*hours;

        this.model.data[this.fieldhours] = hours;
        this.model.data[this.fieldminutes] = minutes;
    }
}