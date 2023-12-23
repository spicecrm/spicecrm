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
    Output, EventEmitter, OnInit
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

import {language} from "../../services/language.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modal} from "../../services/modal.service";
import {take} from "rxjs/operators";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

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
export class SystemInputDate implements OnInit, ControlValueAccessor {


    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * set to false to not display the calendar button at the bottom
     */
    @Input() public showCalendarButton: boolean = true;

    /**
     * an optional holiday calendar that displays holidays
     */
    @Input() public holidayCalendarId: string;

    /**
     * set to true by default to disable picking of holidays
     */
    @Input() public holidaysDisabled: boolean = true;

    /**
     * holds holidays loaded
     */
    private holidays: any[] = [];

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
     * holds if the value is edited (the input field is "dirty")
     *
     * @public
     */
    @Input() public isDirty = false;

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
     * sets  minimum for the datepicker
     */
    @Input() public minDate;

    /**
     * set a maximum for the datepicker
     */
    @Input() public maxDate;

    @Input() public id: string;

    @Input() public showClear = false;

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

    /**
     * an array with the ensbled weekdays, 0 equals sunday
     */
    @Input() public enabledDays: number[] = [0, 1, 2, 3, 4, 5, 6];

    /**
     * set to false to hide error message on the input
     * the valid emitted can enable e.g. field to handle the message
     */
    @Input() displayError: boolean = true;

    /**
     * emits the validity status
     */
    @Output() valid: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public elementref: ElementRef,
                public renderer: Renderer2,
                public userpreferences: userpreferences,
                public modal: modal,
                public cdref: ChangeDetectorRef,
                public backend: backend,
                public config: configurationService,
                private elementRef: ElementRef) {
    }

    public ngOnInit(){
        this.loadHolidays()
    }

    public loadHolidays(){
        if(this.holidayCalendarId){
            let cachedHolidays = this.config.getData('holidays');
            if(cachedHolidays && cachedHolidays[this.holidayCalendarId]){
                this.holidays = cachedHolidays[this.holidayCalendarId]
            } else {
                this.backend.getRequest(`module/SystemHolidayCalendars/${this.holidayCalendarId}/holidays`).subscribe({
                    next: (holidays) => {
                        if(!cachedHolidays) cachedHolidays = [];
                        cachedHolidays[this.holidayCalendarId] = holidays;
                        this.config.setData('holidays', cachedHolidays)
                        this.holidays = holidays;
                    }
                })
            }
        }
    }

    /**
     * checks if the date is a holiday
     * @param date
     */
    public isHoliday(date){
        if(!date) return false;
        let df = date.format('YYYY-MM-DD');
        return !!this.holidays.find(h => h.holiday_date.substr(0, 10) == df)
    }

    public isEnabledDay(date){
        if(!date) return true;
        return this.enabledDays.indexOf(parseInt(date.format('d'), 10)) >= 0;
    }

    get isValid() {
        return this._date.valid && (!this._date.moment || !this.minDate || this._date.moment.isSameOrAfter(this.minDate)) && (!this._date.moment || !this.maxDate || this._date.moment.isSameOrBefore(this.maxDate)) && (!this.holidaysDisabled || !this.isHoliday(this._date.moment)) && this.isEnabledDay(this._date.moment);
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

        // emit the validity
        this.valid.emit(this.isValid);

    }

    get canclear() {
        return this.showClear && !!this._date.display;
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
        this.valid.emit(true);

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
            this.valid.emit(true);

            // emit the value to the ngModel directive
            if (typeof this.onChange === 'function') {
                this.onChange(this._date.moment);
            }
        }

        this.valid.emit(this.isValid);
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

    public emitBlur() {
        this.elementRef.nativeElement.dispatchEvent(new Event('blur',{bubbles: true}));
    }

}
