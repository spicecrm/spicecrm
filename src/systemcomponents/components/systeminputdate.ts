/**
 * @module SystemComponents
 */

// from https://github.com/kolkov/angular-editor
import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnDestroy,
    Renderer2,
    ChangeDetectorRef,
    Output, EventEmitter
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modal} from "../../services/modal.service";
import {take} from "rxjs/operators";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "system-input-date",
    templateUrl: "../templates/systeminputdate.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SystemInputDate),
            multi: true
        }
    ]
})
export class SystemInputDate implements ControlValueAccessor {


    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;
    public showCalendarButton: boolean = true;
    public _date: any = {
        display: '',
        moment: null,
        valid: true
    };

    /**
     * holds if the component is disabled
     *
     * @private
     */
    public isDisabled: boolean = false;

    /**
     * emits if the date is valid or not
     */
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();


    /**
     * an attribute that can be set and does not require the value true passed in
     *
     * @param value
     */
    @Input('disabled') set disabled(value) {
        if (value === false) {
            this.isDisabled = false;
        } else {
            this.isDisabled = true;
        }
    }

    /**
     * option to hide the error message
     */
    public hideErrorMessage: boolean = false;

    /**
     * an attribute that can be set and does not require the value true passed in
     *
     * @param value
     */
    @Input('system-input-date-hide-error') set hideError(value) {
        if (value === false) {
            this.hideErrorMessage = false;
        } else {
            this.hideErrorMessage = true;
        }
    }

    constructor(public elementref: ElementRef,
                public renderer: Renderer2,
                public userpreferences: userpreferences,
                public modal: modal,
                public cdref: ChangeDetectorRef) {
    }

    get isValid() {
        return this._date.valid;
    }

    get display() {
        return this._date.display ? this._date.display : '';
    }

    set display(value) {
        if (value) {
            // try to parse the value
            let newDate = moment(value, this.userpreferences.getDateFormat(), true);
            if (newDate.isValid()) {
                if (!this._date.moment) {
                    this._date.moment = new moment();
                }
                this._date.moment.year(newDate.year()).month(newDate.month()).date(newDate.date());
                this._date.valid = true;


                // emit the value to the ngModel directive
                if (typeof this.onChange === 'function') {
                    this.onChange(this._date.moment);
                }

            } else {
                this._date.display = value;
                this._date.valid = false;
            }
        } else {
            this.clear();
        }

        // emit if the date is valid
        this.valid.emit(this._date.valid);
    }

    get canclear() {
        return !!this._date.display;
    }

    /**
     * determines the side (left or right) for the dropdown depending how much space is left for the element
     */
    get dropdownside() {
        let erect = this.elementref.nativeElement.getBoundingClientRect();
        if (window.innerWidth - erect.left < 280) {
            return 'slds-dropdown_right';
        } else {
            return 'slds-dropdown_left';
        }
    }

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
            this._date.moment = new moment(value);
            this._date.display = this._date.moment.format(this.userpreferences.getDateFormat());
        } else {
            this.clear(false);
        }

        this.cdref.detectChanges();
    }

    public clear(notify = true) {
        this._date.moment = null;
        this._date.display = '';
        this._date.valid = true;

        // emit the value to the ngModel directive
        if (typeof this.onChange === 'function' && notify) {
            this.onChange(this._date.moment);
        }
    }

    public datePicked(value, fromCalendar?: boolean) {
        if (value) {
            if (!this._date.moment) {
                this._date.moment = new moment();
            }
            if (!moment.isMoment(value)) value = moment(value);

            this._date.moment.set('year', value.year());
            this._date.moment.set('month', value.month());
            this._date.moment.set('date', value.date());
            if (fromCalendar) {
                this._date.moment.set('hour', value.hour());
                this._date.moment.set('minute', value.minute());
            }
            this._date.display = this._date.moment.format(this.userpreferences.getDateFormat());
            this._date.valid = true;

            // emit the value to the ngModel directive
            if (typeof this.onChange === 'function') {
                this.onChange(this._date.moment);
            }
        }
    }

    public openCalendar() {
        this.modal.openModal('Calendar').subscribe(modalRef => {
            modalRef.instance.calendar.asPicker = true;
            modalRef.instance.calendar.pickerDate$
                .pipe(take(1))
                .subscribe(date => {
                    modalRef.instance.self.destroy();
                    this.datePicked(date, true);
                });
        });
    }

}
