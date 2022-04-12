/**
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    Component, ElementRef, EventEmitter,
    forwardRef, Input,
    OnDestroy, Output,
    Renderer2
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: "system-input-time",
    templateUrl: "../templates/systeminputtime.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputTime),
            multi: true
        }
    ]
})
export class SystemInputTime implements OnDestroy, ControlValueAccessor {
    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public _time: any = {
        display: '',
        moment: null,
        offset: 0,
        valid: true
    };
    public dropdownValues: any[] = [];

    /**
     * emits if the date is valid or not
     */
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

    // for the dropdown
    public isOpen: boolean = false;

    // public clickListener: any;
    public readonly minutes_interval = 30;

    /**
     * option to hide the error message
     */
    public hideErrorMessage: boolean = false;

    /**
     * an attribute that can be set and does not require the value true passed in
     *
     * @param value
     */
    @Input('system-input-time-hide-error') set hideError(value) {
        if (value === false) {
            this.hideErrorMessage = false;
        } else {
            this.hideErrorMessage = true;
        }
    }

    constructor(
        public elementref: ElementRef,
        public renderer: Renderer2,
        public userpreferences: userpreferences,
        public language: language
    ) {
        this.dropdownValues = this.getDropdownValues();
    }

    public ngOnDestroy() {
        /*if (this.clickListener) {
            this.clickListener();
        }*/
    }

    get isValid() {
        return this._time.valid;
    }

    public getDropdownValues() {
        let addMinutes = 0;
        let retArray = [];
        while (addMinutes <= 1440) {
            let start = new moment().hour(0).minute(0).second(0);
            start.add(addMinutes, 'minutes');
            retArray.push({
                offset: addMinutes,
                display: start.format(this.userpreferences.getTimeFormat()),
                current: false
                // current: start.isSame(this._time.moment, 'hour') && start.isSame(this._time.moment, 'minute')
            });
            addMinutes += this.minutes_interval;
        }
        return retArray;
    }

    public getDropDownValueByOffset(offset) {
        return this.dropdownValues.find(e => e.offset == offset);
    }

    public getNextDropDownValue() {
        return this.getDropDownValueByOffset(this._time.offset + this.minutes_interval);
    }

    public setDisplayToNextDropDownValue() {
        this.display = this.getNextDropDownValue().display;
    }

    public setDisplayToPreviousDropDownValue() {
        this.display = this.getDropDownValueByOffset(this._time.offset - this.minutes_interval).display;
    }

    get display() {
        return this._time.display;
    }

    set display(value) {
        if (value) {
            // try to parse the value
            let newDate = moment(value, this.userpreferences.getTimeFormat(), true);
            if (newDate.isValid()) {
                if (!this._time.moment) {
                    this._time.moment = new moment();
                }

                this._time.moment.set('hour', newDate.hour());
                this._time.moment.set('minute', newDate.minute());
                this._time.valid = true;
                this._time.offset = this.calculateOffset(this._time.moment);
                this._time.display = value;

                // close the dropdown
                this.closeDropDown();

                // emit the value to the ngModel directive
                this.onChange(this._time.moment);
            } else {
                // if only the hours are given... like "1", "22"...
                if (typeof value == 'string' && value.length <= 2 && value.length > 0) {
                    if (parseInt(value, 10) < 10) {
                        value = `0${value}:00`;
                    } else {
                        value = `${value}:00`;
                    }
                    this.display = value;
                    return;
                }
                this._time.valid = false;
            }
        } else {
            this.clear();
        }

        // emit the validity
        this.valid.emit(this._time.valid);
    }

    get canclear() {
        return this._time.display ? true : false;
    }

    public clear(broadcast = true) {
        if (!this._time.moment) {
            this._time.moment = new moment();
        }

        this._time.moment = null;
        this._time.display = '';
        this._time.valid = true;

        // emit the value to the ngModel directive
        if (typeof this.onChange === 'function' && broadcast) {
            this.onChange(this._time.moment);
        }
    }

    public toggleDropDown() {

        this.isOpen = !this.isOpen;
        // check if we are active already
        if (this.isOpen) {
            // listen to the click event if it is ousoide of the current elements scope
            // this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
        }
    }

    public closeDropDown() {
        // close the dropdown
        this.isOpen = false;
        /*if (this.clickListener) {
            this.clickListener();
        }*/
    }

    /*
        public onDocumentClick(event: MouseEvent) {
            if (this.isOpen && !this.elementref.nativeElement.contains(event.target)) {
                this.isOpen = false;
                this.clickListener();
            }
        }
    */
    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        // this._time = value ? value : '';
        if (value && value.isValid && value.isValid()) {
            this._time.moment = new moment(value);
            this._time.offset = this.calculateOffset(this._time.moment);
            this._time.display = this._time.moment.format(this.userpreferences.getTimeFormat());
        } else {
            this.clear(false);
        }
    }

    /**
     * not really needed?!
     * @deprecated
     * @param value
     */
    public selectValue(value) {

        if (!this._time.moment) {
            this._time.moment = new moment();
        }

        this._time.moment.hour(0).minute(0).second(0);
        this._time.moment.add(value, 'minutes');
        this._time.offset = value;
        this._time.display = this._time.moment.format(this.userpreferences.getTimeFormat());

        // emit the value to the ngModel directive
        if (typeof this.onChange === 'function') {
            this.onChange(this._time.moment);
        }

        // close the dropdown
        this.closeDropDown();
    }

    /**
     * returns the nearest possible offset...
     * @param date
     * @returns {any}
     */
    public calculateOffset(date) {
        let mins = date.hour() * 60 + date.minute();
        return Math.floor(mins / this.minutes_interval) * this.minutes_interval;
    }
}
