/**
 * @module SystemComponents
 */
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';
import {currency} from '../../services/currency.service';
import { userpreferences } from '../../services/userpreferences.service';
import { configurationService } from '../../services/configuration.service';

/** @ignore */
declare var moment: any;

/**
 * render a panel to manage the preferences (for the user or the entire crm system)
 */
@Component({
    selector: 'system-preferences-panel',
    templateUrl: '../templates/systempreferencespanel.html'
})
export class SystemPreferencesPanel implements OnChanges, OnInit {

    /**
     * holds a list of currency signification digits
     * @public
     */
    public currencySignificantDigitsList: string[] = ['1', '2', '3', '4', '5', '6'];

    /**
     * holds a list of the thousand delimiters
     * @public
     */
    public thousandDelimiterList: string[] = [',', '.'];

    /**
     * holds a list of time formats
     * @public
     */
    public timeFormatList: { name: string, value: string }[] = [
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

    /**
     * holds a list of date formats
     * @public
     */
    public dateFormatList: { name: string, value: string }[] = [
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
     * @public
     */
    public currencyList: any[] = [];

    /**
     * holds the preferences from parent
     * @public
     */
    @Input() public preferences: any = {};

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
     * holds a list of the day hours for calendar
     * @public
     */
    public dayHoursList = [];

    /**
     * holds the reminder time options
     * @private
     */
    private reminderTimeOptions = {
        '-1': 'LBL_REMINDER_NONE',
        '60': 'LBL_REMINDER_1MINUTE',
        '300': 'LBL_REMINDER_5MINUTES',
        '600': 'LBL_REMINDER_10MINUTES',
        '900': 'LBL_REMINDER_15MINUTES',
        '1800': 'LBL_REMINDER_30MINUTES',
        '3600': 'LBL_REMINDER_1HOUR',
        '7200': 'LBL_REMINDER_2HOURS',
        '10800': 'LBL_REMINDER_3HOURS',
        '18000': 'LBL_REMINDER_5HOURS',
        '86400': 'LBL_REMINDER_1DAY'
    };

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
     * holds the name formats
     * @public
     */
    public nameFormats: { name: string, example: string }[] = [];

    /**
     * holds the example text for the name
     * @public
     */
    public display_name: string;

    /**
     * getter the preference of number delimitation
     * @public
     */
    public get numberDelimitation(): any {
        const found = this.numberDelimitationsList.find( f => f.dec_sep == this.preferences.dec_sep && f.num_grp_sep == this.preferences.num_grp_sep );
        return found ? found : undefined;
    }

    /**
     * setter the preference of number delimitation
     * @public
     */
    public set numberDelimitation( value: { show: string, num_grp_sep: string, dec_sep: string } ) {
        this.preferences.dec_sep = value.dec_sep;
        this.preferences.num_grp_sep = value.num_grp_sep;
        this.setDisplay_numberDelimitation();
    }

    /**
     * holds the display value for several preferences
     * @public
     */
    public display_dateFormat: string;
    public display_timeFormat: string;
    public display_reminderTime: string;
    public display_numberDelimitation: string;

    /**
     * Is the component displayed for the personal user preferences (or the general preferences for the system)?
     * @public
     */
    @Input() public isPersonalContext = false;

    /**
     * The preferences of the crm system.
     * @public
     */
    public defaultPreferences: any;

    /**
     * The names of the preferences.
     * @private
     */
    /*
    private preferencesNames = [ 'calendar_day_start_hour', 'calendar_day_end_hour', 'currency', 'datef', 'default_export_charset', 'default_locale_name_format',
        'dec_sep', 'default_currency_significant_digits', 'distance_unit_system', 'export_delimiter', 'help_icon',
        'home_assistant', 'num_grp_sep', 'reminder_time', 'timef', 'timezone', 'week_day_start', 'week_days_count',
    ];
     */
    private preferencesNames = [ 'calendar_day_start_hour', 'calendar_day_end_hour', 'currency', 'datef', 'export_charset', 'locale_name_format',
        'dec_sep', 'currency_significant_digits', 'distance_unit_system', 'export_delimiter', 'help_icon',
        'home_assistant', 'num_grp_sep', 'reminder_time', 'timef', 'timezone', 'week_day_start', 'week_days_count',
    ];

    /**
     * Indicator for loading activity.
     * @public
     */
    public isLoading = false;

    constructor(
        public backend: backend,
        public view: view,
        public toast: toast,
        public currency: currency,
        public language: language,
        public userpreferences: userpreferences,
        public configurationService: configurationService ) {
        this.setInitialValues();
    }

    public ngOnInit(): void {
        this.setDisplayValues();
    }

    public ngOnChanges(): void {
        if ( !this.preferences ) return;
        this.setDisplayValues();
    }

    /**
     * Set the display values of the preferences.
     * @public
     */
    public setDisplayValues(): void {
        this.setDisplay_reminderTime();
        this.setDisplay_dateFormat();
        this.setDisplay_timeFormat();
        this.setDisplay_name();
        this.setDisplay_numberDelimitation();
    }

    /**
     * A preference has been changed.
     * @public
     */
    public prefChanged(): void { 1; }

    /**
     * Sets initial values
     * @private
     */
    private setInitialValues(): void {
        this.view.isEditable = true;
        this.createNameFormats();
        this.currencyList = this.currency.getCurrencies();
        for (let i = 0; i < 24; i++) this.dayHoursList.push(i);
        this.defaultPreferences = this.configurationService.getData('defaultuserpreferences');
    }

    /**
     * Create the name formats
     * @private
     */
    private createNameFormats(): void {
        const formats = ['s f l', 'f l', 's l', 'l, s f', 'l, f', 's l, f', 'l s f', 'l f s', 's d f l a'];
        const labels = {
            t: 'LBL_LOCALE_NAME_EXAMPLE_TITLE',
            f: 'LBL_LOCALE_NAME_EXAMPLE_FIRST',
            l: 'LBL_LOCALE_NAME_EXAMPLE_LAST',
            s: 'LBL_LOCALE_NAME_EXAMPLE_SALUTATION',
            d: 'LBL_LOCALE_NAME_EXAMPLE_DEGREE_BEFORE',
            a: 'LBL_LOCALE_NAME_EXAMPLE_DEGREE_AFTER',
        };
        this.nameFormats = formats.map(format => {
            return {
                name: format,
                example: format.replace(/t|f|l|s|d|a/g, key => this.language.getLabel(labels[key]))
            };
        });
    }

    /**
     * set/update the display of the date format
     * @public
     */
    public setDisplay_dateFormat(): void {
        const value = this.getPrefValue('datef');
        this.display_dateFormat = !value ? '' : moment().format(
            value.replace('Y', 'YYYY').replace('m', 'MM').replace('d', 'DD')
        );
    }

    /**
     * set/update the display of the time format
     * @public
     */
    public setDisplay_timeFormat(): void {
        const value = this.getPrefValue('timef');
        this.display_timeFormat = !value ? '' : moment().format(
            value.replace('H', 'HH').replace('h', 'hh').replace('i', 'mm')
        );
    }

    /**
     * set/update the display of the reminder time
     * @public
     */
    public setDisplay_reminderTime(): void {
        const value = this.getPrefValue('reminder_time');
        this.display_reminderTime = !value ? '' : this.reminderTimeOptions[value];
    }

    /**
     * set/update the display of numbers format
     * @public
     */
    public setDisplay_numberDelimitation(): void {
        const value = this.getPrefValue('_numberDelimitation');
        this.display_numberDelimitation = value ? value.show : '';
    }

    /**
     * set/update the display of the name format
     * @public
     */
    public setDisplay_name(): void {
        this.display_name = '';
        // const value = this.getPrefValue('default_locale_name_format');
        const value = this.getPrefValue('locale_name_format');
        if ( value && this.nameFormats ) {
            this.nameFormats.some( format => {
                if ( value === format.name ) {
                    this.display_name = format.example;
                    return true;
                }
            });
        }
    }

    /**
     * Gets the value for a specific preference.
     * @param name Name of the preferences value
     * @public
     */
    public getPrefValue( name: string ): any {
        if ( name !== '_numberDelimitation' ) {
            return this.prefValueIsGlobalFallback( name ) ? this.defaultPreferences[name] : this.preferences[name];
        } else {
            const global = this.prefValueIsGlobalFallback( name );
            let found;
            if ( global ) {
                found = this.numberDelimitationsList.find( f =>
                    f.dec_sep == this.defaultPreferences.dec_sep && f.num_grp_sep == this.defaultPreferences.num_grp_sep );
            } else {
                found = this.numberDelimitationsList.find( f =>
                    f.dec_sep == this.preferences.dec_sep && f.num_grp_sep == this.preferences.num_grp_sep );
            }
            return found ? found : undefined;
        }
    }

    /**
     * Has a specific preference value to be retrieved from the system preferences, because not set in user preferences?
     * ( only in case the component is displayed for the user preferences ("isPersonalContext") )
     * @param name Name of the preferences value
     * @public
     */
    public prefValueIsGlobalFallback( name: string ): boolean {
        if ( !this.isPersonalContext || !this.defaultPreferences ) return false;
        if ( name !== '_numberDelimitation' ) {
            return !this.isSet( this.preferences[name] ) && this.isSet( this.defaultPreferences[name] );
        } else {
            return ( !this.isSet( this.preferences.num_grp_sep ) || !this.isSet( this.preferences.dec_sep ))
                && this.isSet( this.defaultPreferences.num_grp_sep ) && this.isSet( this.defaultPreferences.dec_sep );
        }
    }

    /**
     * Check if a preference value ist set or not. Pays attention to empty strings.
     * @param prefValue The preferences value to be checked.
     */
    public isSet( prefValue ): boolean {
        return ( prefValue !== undefined && ( typeof prefValue !== 'string' || prefValue.length !== 0 ));
    }

    /**
     * Are all preferences set? Or is at least one preference missing/unset?
     * @private
     */
    private atLeastOnePrefMissing(): boolean {
        return this.preferencesNames.some( prefName => {
            return !this.isSet( this.preferences[prefName] );
        });
    }

    /**
     * The preference reminder time has been changed, now do what to do.
     * @param eventData The data from the change event of the component fieldActivityReminder
     * @public
     */
    public reminderTimeChanged( eventData ): void {
        this.preferences.reminder_time = eventData.reminder_time;
        this.setDisplay_reminderTime();
    }

}
