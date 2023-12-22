import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {userpreferences} from "../../services/userpreferences.service";
import {language} from "../../services/language.service";
import {Subscription} from "rxjs";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

declare var moment: any;

@Component({
    selector: 'system-input-cron-expression',
    templateUrl: '../templates/systeminputcronexpression.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => SystemInputCronExpression),
        multi: true
    }]
})

export class SystemInputCronExpression implements OnInit, ControlValueAccessor {
    /**
     * to use the component only in read only model
     */
    @Input() public readOnly = false;
    /**
     * emit the whole expression object on change instead of the parsed string
     * @private
     */
    @Input() private asObject = false;
    /**
     * holds the local cron expression object
     */
    public expression: {
        hours: string,
        minutes: string,
        monthDay: string,
        month: string,
        weekDay: string
        stringValue: string,
        displayValue?: string,
        recurrence?: 'daily' | 'weekly' | 'monthly' | 'annually' | 'everyWeekday' | 'custom' | 'cron',
        every?: 'minutes' | 'hours' | 'days' | 'months' | 'weekdays' | 'daysAt' | 'monthsAt'
        everyQuantity?: number,
        everyAtValue?: any,
    } = {
        minutes: '',
        hours: '',
        monthDay: '',
        month: '',
        weekDay: '',
        stringValue: ''
    };
    /**
     * holds the moment weekdays
     */
    public weekdays = [];
    /**
     * holds the moment weekdays
     */
    public months = [];
    /**
     * holds the every labels for display value
     * @private
     */
    public everyLabels = {
        minutes: 'LBL_MINUTE{s}',
        hours: 'LBL_HOUR{s}',
        days: 'LBL_DAY{s}',
        months: 'LBL_MONTH{s}',
        weekdays: 'LBL_WEEKDAY{s}',
        daysAt: 'LBL_DAY{s}_AT',
        monthsAt: 'LBL_MONTH{s}_AT',
    };
    /**
     * holds the recurrence labels for display value
     * @private
     */
    public recurrenceLabels = {
        daily: 'LBL_DAILY',
        weekly: 'LBL_WEEKLY',
        monthly: 'LBL_MONTHLY',
        annually: 'LBL_ANNUALLY',
        everyWeekday: 'LBL_EVERY_WEEKDAY'
    };
    /**
     * holds rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();
    /**
     * holds the expression string
     */
    public value: string;
    /**
     * change emitter by ngModel
     * @private
     */
    public onChange: (value: any) => void;

    constructor(public language: language,
                public userPreferences: userpreferences) {
    }

    /**
     * write local value passed my ngModel input
     * @param val
     */
    writeValue(val: string) {
        this.value = val;
        this.setLocalValue(val);

        if (this.readOnly) {
            this.setDisplayValue();
        }
    }
    /**
     * register the onChange function from angular
     * @param fn
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(): void {
        return;
    }
    setDisabledState?(): void {
        return;
    }

    /**
     * set weekdays
     * initialize value if new
     * set local value
     * subscribe to field changes
     * subscribe to language changes
     */
    public ngOnInit() {
        this.setSelectOptionsFromMoment();
        this.setLocalValue(this.value);
        this.subscribeToLanguageChanges();
    }

    /**
     * reset every at value
     */
    public resetEveryAtValue() {
        this.expression.everyAtValue = undefined;
    }

    /**
     * reset every quantity
     */
    public resetEveryQuantity() {
        this.expression.everyQuantity = undefined;
    }

    /**
     * call to set the field value on default recurrence and reset every quantity
     */
    public onRecurrenceSet() {

        this.setExpressionProperties('*');

        this.expression.every = undefined;
        this.expression.everyQuantity = undefined;
        this.expression.everyAtValue = undefined;

        if (!this.expression.recurrence) {
            this.expression.stringValue = '';
            this.onChange(this.asObject ? this.getExpressionProperties() : '');

            return;
        }

        switch (this.expression.recurrence) {
            case 'custom':
                this.expression.every = 'minutes';
                this.expression.everyQuantity = 1;
                break;
            case 'cron':
                break;
            default:
                this.setDefaultRecurrenceEveryAtValue();
                this.resetEveryQuantity();
        }

        this.setFieldValue();
    }

    /**
     * call to set the field value and reset the every at value
     */
    public onEverySet() {

        this.setExpressionProperties('*');
        this.resetEveryAtValue();

        if (this.expression.every == 'weekdays') {
            this.resetEveryQuantity();
            if (!this.expression.everyAtValue) this.expression.everyAtValue = {};
        }
        if (this.expression.every == 'daysAt') {
            this.expression.everyAtValue = moment().hour(0).minute(0).tz(this.userPreferences.toUse.timezone);
        }
        if (this.expression.everyQuantity != undefined && this.expression.every != 'daysAt' && this.expression.every != 'monthsAt') {
            this.setFieldValue();
        }

    }

    /**
     * set the default recurrence every at value
     * @private
     */
    public setDefaultRecurrenceEveryAtValue() {

        switch (this.expression.recurrence) {
            case 'daily':
                this.expression.everyAtValue = moment(moment().utc().hour(0).minute(0));
                break;
            case 'weekly':
                this.expression.everyAtValue = '0';
                break;
            case 'monthly':
                this.expression.everyAtValue = '1';
                break;
            case 'annually':
                this.expression.everyAtValue = '1';
                break;
        }
    }

    /**
     * subscribe to language changes to reset the labels
     * @private
     */
    public subscribeToLanguageChanges() {
        this.subscriptions.add(
            this.language.currentlanguage$.subscribe(() => {
                this.setSelectOptionsFromMoment();
            })
        );
    }

    /**
     * set the weekdays from moment
     * @private
     */
    public setSelectOptionsFromMoment() {
        this.weekdays = moment.weekdays();
        this.months = moment.months();
    }

    /**
     * set the field value from the local value
     * @private
     */
    public setFieldValue() {

        switch (this.expression.recurrence) {
            case 'custom':
                this.setCustomExpression();
                break;
            case 'cron':
                break;
            default:
                this.setExpressionByRecurrenceUnit();
        }
        this.expression.stringValue = `${this.expression.minutes}::`;
        this.expression.stringValue += `${this.expression.hours}::`;
        this.expression.stringValue += `${this.expression.monthDay}::`;
        this.expression.stringValue += `${this.expression.month}::`;
        this.expression.stringValue += `${this.expression.weekDay}`;
        this.onChange(this.asObject ? this.getExpressionProperties() : this.expression.stringValue);
    }

    /**
     * set the expression values from the custom input values
     * @private
     */
    public setCustomExpression() {

        if (isNaN(this.expression.everyQuantity) && this.expression.every != 'weekdays') {
            return;
        }

        if (this.expression.everyQuantity < 1) this.expression.everyQuantity = 1;

        switch (this.expression.every) {
            case 'minutes':
                if (this.expression.everyQuantity > 59) this.expression.everyQuantity = 59;
                this.expression.minutes = `*/${this.expression.everyQuantity}`;
                break;
            case 'hours':
                if (this.expression.everyQuantity > 23) this.expression.everyQuantity = 23;
                this.expression.minutes = '0';
                this.expression.hours = `*/${this.expression.everyQuantity}`;
                break;
            case 'days':
                if (this.expression.everyQuantity > 31) this.expression.everyQuantity = 31;

                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.monthDay = `*/${this.expression.everyQuantity}`;
                break;
            case 'daysAt':
                if (!moment.isMoment(this.expression.everyAtValue)) break;
                if (this.expression.everyQuantity > 31) this.expression.everyQuantity = 31;

                this.expression.hours = `${this.expression.everyAtValue.utc().hour()}`;
                this.expression.minutes = `${this.expression.everyAtValue.utc().minute()}`;
                this.expression.monthDay = `*/${this.expression.everyQuantity}`;
                break;
            case 'months':
                if (this.expression.everyQuantity > 12) this.expression.everyQuantity = 12;
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.month = `*/${this.expression.everyQuantity}`;
                break;
            case 'monthsAt':
                if (this.expression.everyAtValue < 1) this.expression.everyAtValue = 1;
                if (this.expression.everyAtValue > 31) this.expression.everyAtValue = 31;
                if (this.expression.everyQuantity > 12) this.expression.everyQuantity = 12;

                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.monthDay = `${this.expression.everyAtValue}`;
                this.expression.month = `*/${this.expression.everyQuantity}`;
                break;
            case 'weekdays':
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.weekDay = this.expression.everyAtValue.join(',');
                break;
        }
    }

    /**
     * reset the expression properties to *
     * @private
     */
    public setExpressionProperties(val: string) {
        this.expression.minutes = val;
        this.expression.hours = val;
        this.expression.monthDay = val;
        this.expression.month = val;
        this.expression.weekDay = val;
    }


    /**
     * get expression properties
     * @private
     */
    public getExpressionProperties() {
        return {
            minutes: this.expression.minutes,
            hours: this.expression.hours,
            monthDay: this.expression.monthDay,
            month: this.expression.month,
            weekDay: this.expression.weekDay
        }
    }

    /**
     * set the expression properties by the recurrence unit
     * @private
     */
    public setExpressionByRecurrenceUnit() {

        switch (this.expression.recurrence) {
            case 'daily':
                this.expression.minutes = `${this.expression.everyAtValue.utc().minute()}`;
                this.expression.hours = `${this.expression.everyAtValue.utc().hour()}`;
                break;
            case 'weekly':
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.weekDay = this.expression.everyAtValue;
                break;
            case 'everyWeekday':
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.weekDay = '1-5';
                break;
            case 'monthly':
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.monthDay = this.expression.everyAtValue;
                break;
            case 'annually':
                this.expression.minutes = '0';
                this.expression.hours = '0';
                this.expression.month = this.expression.everyAtValue;
                this.expression.monthDay = '1';
                break;
        }
    }

    /**
     * set the local cron expression value from the field value
     * @private
     */
    public setLocalValue(val: string) {
        if (!val || val == this.expression?.stringValue) return;
        const valArray = val.split('::');
        if (valArray.length != 5) return;

        this.parseExpressionFromString(val);
    }

    /**
     * parse expression from string
     * @param val
     * @private
     */
    public parseExpressionFromString(val: string) {

        if (!!this.expression) {
            this.expression.every = undefined;
            this.resetEveryAtValue();
            this.resetEveryQuantity();
        }

        const valArray = val.split('::');

        this.expression = {
            minutes: valArray[0],
            hours: valArray[1],
            monthDay: valArray[2],
            month: valArray[3],
            weekDay: valArray[4],
            stringValue: val
        };

        this.setRecurrenceAtFromInput(val);

        if (this.expression.recurrence == 'custom') {
            this.setEveryValueFromExpression();
        }
    }

    /**
     * set recurrence value from the expression string
     * @param val
     * @private
     */
    public setRecurrenceAtFromInput(val: string) {

        const isDaily = !isNaN(+(this.expression.minutes + this.expression.hours)) && val.endsWith('::*::*::*');
        const isWeekly = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.weekDay)) && this.expression.month == '*' && this.expression.monthDay == '*';
        const isEveryWeekDay = val == '0::0::*::*::1-5';
        const isMonthly = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.monthDay)) && val.endsWith('::*::*');
        const isAnnually = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.month)) && this.expression.monthDay == '*' && val.endsWith('::*');

        if (isDaily) {
            this.expression.recurrence = 'daily';
            this.expression.everyAtValue = moment(moment.utc().hour(+this.expression.hours).minute(+this.expression.minutes)).tz(this.userPreferences.toUse.timezone);

        } else if (isWeekly) {
            this.expression.recurrence = 'weekly';
            this.expression.everyAtValue = this.expression.weekDay;

        } else if (isEveryWeekDay) {
            this.expression.recurrence = 'everyWeekday';
            this.expression.everyAtValue = moment(moment.utc().hour(0).minute(0)).tz(this.userPreferences.toUse.timezone);

        } else if (isMonthly) {
            this.expression.recurrence = 'monthly';
            this.expression.everyAtValue = this.expression.monthDay;

        } else if (isAnnually) {
            this.expression.recurrence = 'annually';
            this.expression.everyAtValue = this.expression.month;

        } else {
            this.expression.recurrence = 'custom';
        }
    }

    /**
     * set every value from the expression used in set local value
     * @private
     */
    public setEveryValueFromExpression() {

        const min = this.expression.minutes;
        const hour = this.expression.hours;
        const monthDay = this.expression.monthDay;
        const month = this.expression.month;
        const weekDay = this.expression.weekDay;

        if (month == '*' && weekDay == '*') {
            if (min.startsWith('*') && hour == '*' && monthDay == '*') {
                this.expression.every = 'minutes';
                this.expression.everyQuantity = min == '*' ? 1 : +min.substring(2);
            }
            if (hour.startsWith('*/') && +min == 0 && monthDay == '*') {
                this.expression.every = 'hours';
                this.expression.everyQuantity = +hour.substring(2);
            }
            if (monthDay.startsWith('*/') && +min == 0 && +hour == 0) {
                this.expression.every = 'days';
                this.expression.everyQuantity = +monthDay.substring(2);
            }
            if (monthDay.startsWith('*/') && +hour > -1 && +min > -1) {
                this.expression.every = 'daysAt';
                this.expression.everyQuantity = +monthDay.substring(2);
                this.expression.everyAtValue = moment(moment.utc().hour(+hour).minute(+min)).tz(this.userPreferences.toUse.timezone);
            }
        } else {
            if (month.startsWith('*/') && +min == 0 && +hour == 0 && weekDay == '*') {
                if (monthDay == '*') {
                    this.expression.every = 'months';
                }
                if (+monthDay > 0) {
                    this.expression.every = 'monthsAt';
                    this.expression.everyAtValue = +monthDay;
                }
                this.expression.everyQuantity = +month.substring(2);
            }
            if (!isNaN(+weekDay.split(',')[0]) && +min == 0 && +hour == 0 && month == '*' && monthDay == '*') {
                this.expression.every = 'weekdays';
                this.expression.everyAtValue = weekDay.split(',');
            }
        }

        if (this.expression.every == undefined) {
            this.expression.recurrence = 'cron';
        }
    }

    /**
     * set the display value
     * @private
     */
    public setDisplayValue() {

        if (!this.expression.recurrence) {
            return this.expression.displayValue = '';
        }

        if (this.expression.recurrence == 'cron') {
            return this.expression.displayValue = this.expression.stringValue;
        }

        if (this.expression.recurrence != 'custom') {
            this.expression.displayValue = `${this.language.getLabel(this.recurrenceLabels[this.expression.recurrence])} `;

            switch (this.expression.recurrence) {
                case 'daily':
                case 'everyWeekday':
                    this.expression.displayValue += `${this.language.getLabel('LBL_AT_HOUR', '', 'short')} `;
                    break;
                case 'weekly':
                    this.expression.displayValue += `${this.language.getLabel('LBL_DAY', '', 'short')} `;
                    break;
                case 'annually':
                    this.expression.displayValue += `${this.language.getLabel('LBL_MONTH', '', 'short')} `;
                    break;
                default:
                    this.expression.displayValue += `${this.language.getLabel('LBL_ON_DATE', '', 'short')} `;
            }

            switch (this.expression.recurrence) {
                case 'daily':
                case 'everyWeekday':
                    if (!moment.isMoment(this.expression.everyAtValue)) break;
                    this.expression.displayValue += `${this.expression.everyAtValue.tz(this.userPreferences.toUse.timezone).format(this.userPreferences.getTimeFormat())} ${this.language.getLabel('LBL_O_CLOCK')}`;
                    break;
                case 'monthly':
                    this.expression.displayValue += ` ${this.expression.everyAtValue}${this.language.getLabel(
                        this.expression.everyAtValue == 1 || this.expression.everyAtValue == 21 || this.expression.everyAtValue == 31 ? 'LBL_ST_DAY'
                            : this.expression.everyAtValue == 2 || this.expression.everyAtValue == 22 ? 'LBL_ND_DAY'
                                : this.expression.everyAtValue == 3 || this.expression.everyAtValue == 23 ? 'LBL_RD_DAY' : ''
                    )}`;
                    break;
                case 'weekly':
                    this.expression.displayValue += ` ${this.weekdays[this.expression.everyAtValue]}`;
                    break;
                case 'annually':
                    this.expression.displayValue += ` ${this.months[this.expression.everyAtValue - 1]}`;
                    break;
                default:
                    this.expression.displayValue += `${this.expression.everyAtValue}`;
            }
            return;
        }

        this.expression.displayValue = `${this.language.getLabel('LBL_EVERY')} `;

        const everyAtVal = this.expression.everyAtValue;

        if (this.expression.every && this.expression.every != 'weekdays') {
            const everyLabel = this.language.getLabel(
                this.everyLabels[this.expression.every].replace('{s}', this.expression.everyQuantity > 1 ? 'S' : '')
            );
            this.expression.displayValue += `${this.expression.everyQuantity} ${everyLabel}`;
        }

        if (!!this.expression.everyAtValue) {
            if (this.expression.every == 'monthsAt') {
                this.expression.displayValue += ` ${this.expression.everyAtValue}${this.language.getLabel(
                    everyAtVal == 1 || everyAtVal == 21 || everyAtVal == 31 ? 'LBL_ST_DAY'
                        : everyAtVal == 2 || everyAtVal == 22 ? 'LBL_ND_DAY'
                            : everyAtVal == 3 || everyAtVal == 23 ? 'LBL_RD_DAY' : 'LBL_TH_DAY'
                )}`;

            } else if (this.expression.every == 'daysAt' && moment.isMoment(this.expression.everyAtValue)) {
                this.expression.displayValue += ` ${everyAtVal.tz(this.userPreferences.toUse.timezone).format(this.userPreferences.getTimeFormat())} ${this.language.getLabel('LBL_O_CLOCK')}`;
            } else if (this.expression.every == 'weekdays') {
                this.expression.displayValue += ` ${this.expression.everyAtValue.map(e => this.weekdays[e]).join(', ')}`;
            }
        }
    }
}