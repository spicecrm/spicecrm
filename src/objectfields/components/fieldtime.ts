import {Component, ElementRef, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

declare var moment: any;

@Component({
    selector: 'field-time',
    templateUrl: './src/objectfields/templates/fieldtime.html',
    providers: [popup]
})
export class fieldTime extends fieldGeneric {
    @ViewChild('timefield', {read: ViewContainerRef}) timefield: ViewContainerRef;

    showDatePicker: boolean = false;
    showTimePicker: boolean = false;
    private isValid: boolean = true;
    errorMessage: String = '';
    popupSubscription: any = undefined;
    clickListener: any = undefined;
    dropdownTimes: Array<any> = [];

    dateFormat: string = 'DD.MM.YYYY';
    timeFormat: string = 'HH:mm';

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

    /*
     get the positon for the time dropdown
     */
    get timefieldStyle() {
        let rect = this.timefield.element.nativeElement.getBoundingClientRect();
        return {
            left: rect.left,
            top: rect.top + rect.height
        }
    }


    get displayTime() {
        try {
            if (this.model.data[this.fieldname]) {
                let date = this.model.data[this.fieldname];
                if (date.isValid()) {

                    return date.format(this.timeFormat);
                }
                else
                    return '';
            }
            else
                return '';
        } catch (e) {
            return '';
        }
    }

    get editTime() {

        try {
            if (this.model.data[this.fieldname]) {
                let time = new moment(this.model.data[this.fieldname]);
                if (time.isValid())
                    return time.format('HH:mm');
                else
                    return '';
            }
            else return '';
        } catch (e) {
            return '';
        }
    }

    set editTime(value) {
        let setTime = new moment(value, this.timeFormat, true);
        setTime.second(0);
        if (setTime.isValid()) {
            // set the date
            if (this.model.data[this.fieldname] && !isNaN(this.model.data[this.fieldname].year())) {
                setTime.year(this.model.data[this.fieldname].year());
                setTime.month(this.model.data[this.fieldname].month());
                setTime.date(this.model.data[this.fieldname].date());
            }


            this.value = setTime;

            // set the data so rules and emitter get triggered
            this.model.setFieldValue(this.fieldname, setTime);

            this.isValid = true;
            this.errorMessage = '';
        } else {
            this.isValid = false;
            this.errorMessage = value + ' is not a valid time';
        }
    }

    setTime(value) {
        this.editTime = value;
        this.showTimePicker = false;
    }
}