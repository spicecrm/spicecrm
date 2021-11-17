/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ObjectFields
 */
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {userpreferences} from "../../services/userpreferences.service";

/** @ignore */
declare var moment;

/**
 * handle rendering/setting cron tab expression
 */
@Component({
    selector: 'field-cron-interval',
    templateUrl: './src/objectfields/templates/fieldcroninterval.html'
})
export class fieldCronInterval extends fieldGeneric {
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
    private everyLabels = {
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
    private recurrenceLabels = {
        daily: 'LBL_DAILY',
        weekly: 'LBL_WEEKLY',
        monthly: 'LBL_MONTHLY',
        annually: 'LBL_ANNUALLY',
        everyWeekday: 'LBL_EVERY_WEEKDAY'
    };

    constructor(public model: model,
                public view: view,
                public language: language,
                private userPreferences: userpreferences,
                public metadata: metadata,
                public router: Router) {
        super(model, view, language, metadata, router);
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
        this.initializeValue();
        this.setLocalValue(this.value);
        this.subscribeToFieldChanges();
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
        if (this.expression.recurrence != 'custom' && this.expression.recurrence != 'cron') {
            this.setDefaultRecurrenceEveryAtValue();
            this.setFieldValue();
        } else {
            this.expression.every = 'minutes';
        }
        this.resetEveryQuantity();
    }

    /**
     * call to set the field value and reset the every at value
     */
    public onEverySet() {

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
    private setDefaultRecurrenceEveryAtValue() {

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
    private subscribeToLanguageChanges() {
        this.subscriptions.add(
            this.language.currentlanguage$.subscribe(() => {
                this.setSelectOptionsFromMoment();
                this.setDisplayValue();
            })
        );
    }

    /**
     * set the weekdays from moment
     * @private
     */
    private setSelectOptionsFromMoment() {
        this.weekdays = moment.weekdays();
        this.months = moment.months();
    }

    /**
     * subscribe to field changes to set the local value
     * @private
     */
    private subscribeToFieldChanges() {
        this.subscriptions.add(
            this.model.observeFieldChanges(this.fieldname).subscribe(val =>
                this.setLocalValue(val)
            )
        );
        this.subscriptions.add(
            this.model.canceledit$.subscribe(() =>
                this.setLocalValue(this.value)
            )
        );
    }

    /**
     * set the field value from the local value
     * @private
     */
    private setFieldValue() {

        this.resetExpressionProperties();

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
        this.value = this.expression.stringValue;

        this.setDisplayValue();
    }

    /**
     * set the expression values from the custom input values
     * @private
     */
    private setCustomExpression() {

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
    private resetExpressionProperties() {
        this.expression.minutes = '*';
        this.expression.hours = '*';
        this.expression.monthDay = '*';
        this.expression.month = '*';
        this.expression.weekDay = '*';
    }

    /**
     * set the expression properties by the recurrence unit
     * @private
     */
    private setExpressionByRecurrenceUnit() {

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
     * initialize the value if the model is new
     * @private
     */
    private initializeValue() {
        if (!this.model.isNew) return;
        this.value = '*::*::*::*::*';
    }

    /**
     * set the local cron expression value from the field value
     * @private
     */
    private setLocalValue(val: string) {
        if (!val || val == this.expression?.stringValue) return;
        const valArray = val.split('::');
        if (valArray.length != 5) return;

        this.parseExpressionFromString(val);
        this.setDisplayValue();
    }

    /**
     * parse expression from string
     * @param val
     * @private
     */
    private parseExpressionFromString(val: string) {

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
    private setRecurrenceAtFromInput(val: string) {

        const isDaily = !isNaN(+(this.expression.minutes + this.expression.hours)) && val.endsWith('::*::*::*');
        const isWeekly = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.weekDay)) && this.expression.month == '*' && this.expression.monthDay == '*';
        const isEveryWeekDay = val == '0::0::*::*::1-5';
        const isMonthly = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.monthDay)) && val.endsWith('::*::*');
        const isAnnually = !isNaN(+(this.expression.minutes + this.expression.hours + this.expression.monthDay + this.expression.monthDay)) && val.endsWith('::*');

        if (isDaily) {
            this.expression.recurrence = 'daily';
            this.expression.everyAtValue = moment(moment.utc().hour(+this.expression.hours).minute(+this.expression.minutes)).tz(this.userPreferences.toUse.timezone);

        } else if (isWeekly) {
            this.expression.recurrence = 'weekly';
            this.expression.everyAtValue = this.expression.weekDay;

        } else if (isEveryWeekDay) {
            this.expression.recurrence = 'everyWeekday';

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
    private setEveryValueFromExpression() {

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
    private setDisplayValue() {

        if (this.expression.recurrence == 'cron') {
            return this.expression.displayValue = this.expression.stringValue;
        }

        if (this.expression.recurrence != 'custom') {
            this.expression.displayValue = `${this.language.getLabel(this.recurrenceLabels[this.expression.recurrence])} `;
            this.expression.displayValue += `${this.language.getLabel(this.expression.recurrence == 'daily' ? 'LBL_AT_HOUR' : 'LBL_ON_DATE', '', 'short')} `;

            switch (this.expression.recurrence) {
                case 'daily':
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
                        : everyAtVal == 3 || everyAtVal == 23 ? 'LBL_RD_DAY' : ''
                )}`;

            } else if (this.expression.every == 'daysAt' && moment.isMoment(this.expression.everyAtValue)) {
                this.expression.displayValue += ` ${everyAtVal.tz(this.userPreferences.toUse.timezone).format(this.userPreferences.getTimeFormat())} ${this.language.getLabel('LBL_O_CLOCK')}`;
            } else if (this.expression.every == 'weekdays') {
                this.expression.displayValue += ` ${this.expression.everyAtValue.map(e => this.weekdays[e]).join(', ')}`;
            }
        }
    }
}
