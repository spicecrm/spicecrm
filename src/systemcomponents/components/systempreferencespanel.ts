/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleUsers
 */
import {Component, Input, OnChanges} from '@angular/core';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {currency} from '../../services/currency.service';

/** @ignore */
declare var moment: any;

/**
 * render a panel to manage the default preferences
 */
@Component({
    selector: 'system-preferences-panel',
    templateUrl: './src/systemcomponents/templates/systempreferencespanel.html'
})
export class SystemPreferencesPanel implements OnChanges {

    /**
     * holds a list of currency signification digits
     * @protected
     */
    protected currencySignificantDigitsList: string[] = ['1', '2', '3', '4', '5', '6'];
    /**
     * holds a list of the thousand delimiters
     * @protected
     */
    protected thousandDelimiterList: string[] = [',', '.'];
    /**
     * holds a list of time formats
     * @protected
     */
    protected timeFormatList: Array<{ name: string, value: string }> = [
        {name: moment().format('HH:mm'), value: 'H:i'},
        {name: moment().format('hh:mma'), value: 'h:ia'},
        {name: moment().format('hh:mmA'), value: 'h:iA'},
        {name: moment().format('hh:mm a'), value: 'h:i a'},
        {name: moment().format('hh:mm A'), value: 'h:i A'},
        {name: moment().format('HH.mm'), value: 'H.i'},
        {name: moment().format('hh.mma'), value: 'h.ia'},
        {name: moment().format('hh.mmA'), value: 'h.iA'},
        {name: moment().format('hh.mm a'), value: 'h.i a'},
        {name: moment().format('hh.mm A'), value: 'h.i A'}
    ];
    protected dateFormatList: Array<{ name: string, value: string }> = [
        {name: moment().format('YYYY-MM-DD'), value: 'Y-m-d'},
        {name: moment().format('MM-DD-YYYY'), value: 'm-d-Y'},
        {name: moment().format('DD-MM-YYYY'), value: 'd-m-Y'},
        {name: moment().format('Y/MM/DD'), value: 'Y/m/d'},
        {name: moment().format('MM/DD/YYYY'), value: 'm/d/Y'},
        {name: moment().format('DD/MM/YYYY'), value: 'd/m/Y'},
        {name: moment().format('YYYY.MM.DD'), value: 'Y.m.d'},
        {name: moment().format('DD.MM.YYYY'), value: 'd.m.Y'},
        {name: moment().format('MM.DD.YYYY'), value: 'm.d.Y'}
    ];
    /**
     * holds a list of currencies
     * @protected
     */
    protected currencyList: any[] = [];
    /**
     * holds the preferences from parent
     */
    @Input() private preferences: any = {};
    /**
     * holds the start days options for calendar
     */
    private weekDayStartList = ['Sunday', 'Monday'];
    /**
     * holds the week days count for calendar
     * @private
     */
    private weekDaysCountList = [5, 6, 7];
    /**
     * holds a list of the day hours for calendar
     * @private
     */
    private dayHoursList = [];
    /**
     * holds the reminder time options
     * @private
     */
    private reminderTimeOptions = this.language.getDisplayOptions('reminder_time_options', true);
    /**
     * holds a list of the delimiters
     * @private
     */
    private exportDelimiterList = [',', ';'];
    /**
     * holds a list of charsets
     */
    private charsetList = [
        'BIG-5', 'CP1251', 'CP1252', 'EUC-CN', 'EUC-JP', 'EUC-KR', 'EUC-TW', 'ISO-2022-JP',
        'ISO-2022-KR', 'ISO-8859-1', 'ISO-8859-2', 'ISO-8859-3', 'ISO-8859-4', 'ISO-8859-5',
        'ISO-8859-6', 'ISO-8859-7', 'ISO-8859-8', 'ISO-8859-9', 'ISO-8859-10', 'ISO-8859-13',
        'ISO-8859-14', 'ISO-8859-15', 'KOI8-R', 'KOI8-U', 'SJIS', 'UTF-8'];
    /**
     * holds a list of formatting numbers examples
     * @private
     */
    private formattingOfNumbersList = [
        {
            show: '1.000.000,00',
            num_grp_sep: '.',
            dec_sep: ','
        },
        {
            show: '1,000,000.00',
            num_grp_sep: ',',
            dec_sep: '.'
        }
    ];
    /**
     * holds the name formats
     * @private
     */
    private nameFormats: Array<{ name: string, example: string }> = [];

    /**
     * holds the example text for the name
     * @private
     */
    private nameExampleText: string;
    /**
     * holds the local numbers formatting
     * @private
     */
    private numbersFormatting: { show: string, num_grp_sep: string, dec_sep: string };
    /**
     * holds the local data format
     * @private
     */
    private dateFormat: string = '';
    /**
     * holds the local time format
     * @private
     */
    private timeFormat: string = '';

    constructor(
        private backend: backend,
        private view: view,
        private toast: toast,
        private currency: currency,
        private language: language) {
        this.loadInitialValues();
    }

    /**
     * set local values
     */
    public ngOnChanges() {
        if (!this.preferences) return;

        this.setDateFormat(this.preferences.datef);
        this.setTimeFormat(this.preferences.timef);
        this.setNameExampleText(this.preferences.default_locale_name_format);
        this.setNumbersFormatting(
            this.formattingOfNumbersList.find(f => f.dec_sep == this.preferences.dec_sep && f.num_grp_sep == this.preferences.num_grp_sep)
        );
    }

    /**
     * load initial values
     * @private
     */
    private loadInitialValues() {
        this.view.isEditable = true;

        this.setNameFormats();

        this.currencyList = this.currency.getCurrencies();

        for (let i = 0; i < 24; i++) {
            this.dayHoursList.push(i);
        }
    }

    /**
     * loads the name formats
     * @private
     */
    private setNameFormats() {

        const formats = [
            's f l', 'f l', 's l', 'l, s f', 'l, f', 's l, f', 'l s f', 'l f s'
        ];
        const labels = {
            t: 'LBL_LOCALE_NAME_EXAMPLE_TITLE',
            f: 'LBL_LOCALE_NAME_EXAMPLE_FIRST',
            l: 'LBL_LOCALE_NAME_EXAMPLE_LAST',
            s: 'LBL_LOCALE_NAME_EXAMPLE_SALUTATION',
        };
        this.nameFormats = formats.map(format => {
            return {
                name: format,
                example: format.replace(/t|f|l|s/g, key => this.language.getLabel(labels[key]))
            };
        });
    }

    /**
     * set the date format
     * @param value
     * @private
     */
    private setDateFormat(value: string) {
        this.preferences.datef = value;
        this.dateFormat = !value ? '' : moment().format(
            value.replace('Y', 'YYYY').replace('m', 'MM').replace('d', 'DD')
        );
    }

    /**
     * set the time format
     * @param value
     * @private
     */
    private setTimeFormat(value: string) {
        this.preferences.timef = value;
        this.timeFormat = !value ? '' : moment().format(
            value.replace('H', 'HH').replace('h', 'hh').replace('i', 'mm')
        );
    }

    /**
     * set formatting of numbers
     * @param value
     */
    private setNumbersFormatting(value: { show: string, num_grp_sep: string, dec_sep: string }) {
        this.numbersFormatting = value;
        this.preferences.num_grp_sep = !value ? null : value.num_grp_sep;
        this.preferences.dec_sep = !value ? null : value.dec_sep;
    }

    /**
     * set the name example text
     * @param name
     * @private
     */
    private setNameExampleText(name: string) {
        this.preferences.default_locale_name_format = name;

        if (!name || !this.nameFormats) return this.nameExampleText = '';

        this.nameFormats.some(format => {
            if (name === format.name) {
                this.nameExampleText = format.example;
                return true;
            }
        });
    }
}
