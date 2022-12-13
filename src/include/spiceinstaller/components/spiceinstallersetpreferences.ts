/**
 * @module SpiceInstaller
 */

import { Component, Input } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from '@angular/router';
import {configurationService} from '../../../services/configuration.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";
import { spiceinstaller, stepObject } from "../services/spiceinstaller.service";

/** @ignore */
declare var moment: any;

@Component({
    selector: 'spice-installer-set-preferences',
    templateUrl: '../templates/spiceinstallersetpreferences.html'
})
export class SpiceInstallerSetPreferences {

    @Input() public selfStep: stepObject;

    public languages: any = [];
    public loading = false;

    /**
     * holds a list of currency signification digits
     * @public
     */
    public currencySignificantDigitsList: number[] = [1,2,3,4,5,6];

    /**
     * holds a list of the thousand delimiters
     * @public
     */
    public thousandDelimiterList: string[] = [',', '.'];

    public now = moment();

    /**
     * holds a list of time formats
     * @public
     */
    public timeFormatList: { name: string, value: string }[];

    /**
     * holds a list of date formats
     * @public
     */
    public dateFormatList: { name: any, value: string }[];

    /**
     * holds a list of currencies
     * @public
     */
    public currencyList: any[] = [];

    /**
     * holds the start days options for calendar
     * @public
     */
    public weekDayStartList = ['Sunday', 'Monday'];

    /**
     * holds the week days count for calendar
     * @public
     */
    public weekDaysCountList = [5, 6, 7];

    /**
     * holds a list of the delimiters
     * @public
     */
    public exportDelimiterList = [',', ';'];

    /**
     * holds a list of charsets
     * @public
     */
    public charsetList = [
        'BIG-5', 'CP1251', 'CP1252', 'EUC-CN', 'EUC-JP', 'EUC-KR', 'EUC-TW', 'ISO-2022-JP',
        'ISO-2022-KR', 'ISO-8859-1', 'ISO-8859-2', 'ISO-8859-3', 'ISO-8859-4', 'ISO-8859-5',
        'ISO-8859-6', 'ISO-8859-7', 'ISO-8859-8', 'ISO-8859-9', 'ISO-8859-10', 'ISO-8859-13',
        'ISO-8859-14', 'ISO-8859-15', 'KOI8-R', 'KOI8-U', 'SJIS', 'UTF-8'];

    /**
     * holds a list of formatting numbers examples
     * @public
     */
    public numberDelimitationsList = [
        { show: '1.000.000,00', num_grp_sep: '.', dec_sep: ',' },
        { show: '1,000,000.00', num_grp_sep: ',', dec_sep: '.' },
        { show: '1 000 000,00', num_grp_sep: ' ', dec_sep: ',' }
    ];

    /**
     * getter the preference of number delimitation
     * @public
     */
    public get numberDelimitation(): any {
        const found = this.numberDelimitationsList.find( f => f.dec_sep == this.spiceinstaller.configObject.preferences.dec_sep && f.num_grp_sep == this.spiceinstaller.configObject.preferences.num_grp_sep );
        return found ? found : undefined;
    }

    /**
     * setter the preference of number delimitation
     * @public
     */
    public set numberDelimitation( value: { show: string, num_grp_sep: string, dec_sep: string } ) {
        this.spiceinstaller.configObject.preferences.dec_sep = value.dec_sep;
        this.spiceinstaller.configObject.preferences.num_grp_sep = value.num_grp_sep;
    }

    public updateNumberDelimitationsList() {
        for ( let item of this.numberDelimitationsList ) {
            item.show = '1'+item.num_grp_sep+'000'+item.num_grp_sep+'000'+item.dec_sep+'0'
                .repeat( typeof this.spiceinstaller.configObject.preferences.currency_significant_digits !== 'undefined' ? this.spiceinstaller.configObject.preferences.currency_significant_digits : 2 );
        }
    };

    public browserLanguages = {'de':'de_DE','en':'en_us'};

    constructor(
        public toast: toast,
        public http: HttpClient,
        public router: Router,
        public configurationService: configurationService,
        public backend: backend,
        public spiceinstaller: spiceinstaller
    ) {
        this.setDateTimeExamples();

        // pre-set language by browser/system language
        let browserLanguage = navigator.language;
        if ( this.browserLanguages[browserLanguage] ) this.spiceinstaller.configObject.language = this.browserLanguages[browserLanguage];

        // pre-set timezone by guessing it with moment
        this.spiceinstaller.configObject.preferences.timezone = moment.tz.guess();

        // pre-set some preferences in case the browser speaks german
        if ( browserLanguage === 'de' ) this.preSetPreferences();

        // checks the reference
        this.checkReference();
        // loads the languages
        this.http.get(`${this.spiceinstaller.systemurl}/install/getlanguages`).subscribe((result: any) => {
            this.languages = result.languages;
        });

        this.spiceinstaller.jumpSubject.subscribe( fromTo => {
            if ( fromTo.from === this.selfStep ) {
                if ( this.selfStep.completed || fromTo.to?.pos < this.selfStep.pos ) this.spiceinstaller.jump( fromTo.to );
                else this.setPreferences();
            }
        });
    }


    /**
     * backend call to reference server
     */

    public checkReference() {
        this.loading = true;
        this.http.get(`${this.spiceinstaller.systemurl}/install/checkreference`).subscribe(result => {
            this.loading = false;
            if (!result) {
                this.toast.sendToast('cannot connect to reference server', "error");
            }
        });
    }

    /**
     * sets the chosen language and saves it in the configuration body
     */
    public setPreferences() {
        this.spiceinstaller.selectedStep.completed = true;
        this.spiceinstaller.jumpSubject.next({ from: this.selfStep, to: this.selfStep.next })
    }

    public preSetPreferences() {
        this.spiceinstaller.configObject.preferences.datef = 'd.m.Y';
        this.spiceinstaller.configObject.preferences.timef = 'H:i';
        this.spiceinstaller.configObject.preferences.export_charset = 'UTF-8';
        this.spiceinstaller.configObject.preferences.currency_significant_digits = 2;
        this.spiceinstaller.configObject.preferences.dec_sep = ',';
        this.spiceinstaller.configObject.preferences.num_grp_sep = '.';
        this.spiceinstaller.configObject.preferences.distance_unit_system = 'METRIC';
        this.spiceinstaller.configObject.preferences.week_day_start = 'Monday';
        this.spiceinstaller.configObject.preferences.week_days_count = 5;
    }

    public setDateTimeExamples() {
        if ( this.now.format('MM-DD') === this.now.format('DD-MM')) this.now = moment( moment().format('YYYY-12-31'));
        this.dateFormatList = [
            {name: this.now.format('YYYY-MM-DD'), value: 'Y-m-d'},
            {name: this.now.format('MM-DD-YYYY'), value: 'm-d-Y'},
            {name: this.now.format('DD-MM-YYYY'), value: 'd-m-Y'},
            {name: this.now.format('Y/MM/DD'), value: 'Y/m/d'},
            {name: this.now.format('MM/DD/YYYY'), value: 'm/d/Y'},
            {name: this.now.format('DD/MM/YYYY'), value: 'd/m/Y'},
            {name: this.now.format('YYYY.MM.DD'), value: 'Y.m.d'},
            {name: this.now.format('DD.MM.YYYY'), value: 'd.m.Y'},
            {name: this.now.format('MM.DD.YYYY'), value: 'm.d.Y'}
        ];
        this.timeFormatList = [
            {name: this.now.format('HH:mm'), value: 'H:i'},
            {name: this.now.format('hh:mma'), value: 'h:ia'},
            {name: this.now.format('hh:mmA'), value: 'h:iA'},
            {name: this.now.format('hh:mm a'), value: 'h:i a'},
            {name: this.now.format('hh:mm A'), value: 'h:i A'},
            {name: this.now.format('HH.mm'), value: 'H.i'},
            {name: this.now.format('hh.mma'), value: 'h.ia'},
            {name: this.now.format('hh.mmA'), value: 'h.iA'},
            {name: this.now.format('hh.mm a'), value: 'h.i a'},
            {name: this.now.format('hh.mm A'), value: 'h.i A'}
        ];
    }

}
