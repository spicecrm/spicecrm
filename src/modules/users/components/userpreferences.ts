/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {broadcast} from "../../../services/broadcast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {currency} from '../../../services/currency.service';
import {Subject} from "rxjs";
import { session } from '../../../services/session.service';
import { model } from '../../../services/model.service';
import { configurationService } from '../../../services/configuration.service';

/**
 * @ignore
 */
declare var _: any;
/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: "user-preferences",
    templateUrl: "./src/modules/users/templates/userpreferences.html",
    styles: [
            `.slds-button--icon {
            color: #eeeeee
        }

        .slds-button--icon:hover {
            color: #5B5B5B
        }`
    ],
    providers: [view]
})
export class UserPreferences {

    /**
     * the preferences loaded
     */
    private preferences: any = {};

    /**
     * a list of dashboards that is available for selection
     */
    private dashboards: any[] = [];

    /**
     * the default preferences to be laoded
     */
    private names = [
        "export_delimiter",
        "default_export_charset",
        "currency",
        "default_currency_significant_digits",
        "datef",
        "timef",
        "timezone",
        "num_grp_sep",
        "dec_sep",
        "default_locale_name_format",
        "week_day_start",
        "week_days_count",
        "calendar_day_start_hour",
        "calendar_day_end_hour",
        "reminder_time",
        "home_dashboard",
        "home_dashboardset",
        "home_assistant",
        "help_icon",
        "navigation_paradigm",
        "distance_unit_system"
    ];

    /**
     * availabel startdays for the calendar
     */
    private weekDayStartList = ["Sunday", "Monday"];
    private visibilityOptions = ["visible", "hidden"];
    private weekDaysCountList = [5,6,7];
    private dayHoursList = [];
    private reminderTimeOptions = this.language.getDisplayOptions('reminder_time_options');

    private expanded = {loc: true, exp: true, other: true, calendar: true, home: true};
    private exportDelimiterList = [",", ";"];

    /**
     * list of charsets
     */
    private charsetlist = [
        "BIG-5", "CP1251", "CP1252", "EUC-CN", "EUC-JP", "EUC-KR", "EUC-TW", "ISO-2022-JP",
        "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5",
        "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-10", "ISO-8859-13",
        "ISO-8859-14", "ISO-8859-15", "KOI8-R", "KOI8-U", "SJIS", "UTF-8"];
    private currencySignificantDigitsList: string[] = ["1", "2", "3", "4", "5", "6"];
    private thousandDelimiterList: string[] = [",", "."];

    private dateFormatList: object[];
    private timeFormatList: object[];

    private currencyList: any[] = [];
    private dashboardSets: any[] = [];

    /**
     * examples for the formatting of numbers
     */
    private formattingsOfNumbers = [
        {
            show: "1.000.000,00",
            num_grp_sep: ".",
            dec_sep: ","
        },
        {
            show: "1,000,000.00",
            num_grp_sep: ",",
            dec_sep: "."
        }
    ];

    private prefsLoaded = new Subject<string>();

    private timezones: object;
    private timezoneKeys: string[];

    private cannotPrefs: boolean;
    private handlingWithForeignPrefs: boolean;

    /**
     * inidcates if the preferences are being loaded
     */
    private loading: boolean = true;

    constructor(
        private backend: backend,
        private view: view,
        private toast: toast,
        private currency: currency,
        private language: language,
        private prefservice: userpreferences,
        private session: session,
        private model: model,
        private broadcast: broadcast,
        private configurationService: configurationService ) {

        this.view.isEditable = true;

        this.dateFormatList = this.prefservice.getPossibleDateFormats();
        this.timeFormatList = this.prefservice.getPossibleTimeFormats();

        this.handlingWithForeignPrefs = this.session.authData.userId !== this.model.data.id;

        // Only the user himself can view/edit the preferences, or the admin if enableSettingUserPrefsByAdmin is set (true) in config.php:
        this.cannotPrefs = this.handlingWithForeignPrefs && ( !this.session.isAdmin || !this.configurationService.getSystemParamater('enableSettingUserPrefsByAdmin'));

        this.prefservice.needFormats();
        this.backend.getRequest('/timezones').subscribe( response => {
            this.timezones = response;
            this.timezoneKeys = Object.keys( this.timezones );
        } );
        this.currencyList = this.currency.getCurrencies();

        if ( !this.handlingWithForeignPrefs ) {

            this.prefsLoaded.subscribe( () => {
                this.preferences = _.pick( this.prefservice.unchangedPreferences.global, this.names );

                // preferences are loaded
                this.loading = false;
            } );
            this.prefservice.getPreferences( this.prefsLoaded );

        } else {

            if ( !this.cannotPrefs ) {
                this.backend.getRequest( 'user/' + this.model.data.id + '/preferences/global', {} ).subscribe( prefs => {
                    this.preferences = prefs;

                    // set loaded to true
                    this.loading = false;
                },
                    error => {
                        this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message);
                        if ( error.status === 403 ) this.cannotPrefs = true; // Error should not happen, but in case it does ...
                    });
            }

        }

        for (let i = 0; i < 24; i++) {
            this.dayHoursList.push(i);
        }

        this.backend.getList("Dashboards", [{sortfield: "name", sortdirection: "DESC"}], ["name", "id"], {limit: -99})
            .subscribe((dashboards: any) => {
                this.dashboards = dashboards.list;
            });

        this.backend.getList("DashboardSets", [{sortfield: "name", sortdirection: "DESC"}], ["name", "id"], {limit: -99})
            .subscribe((dashboardSets: any) => {
                this.dashboardSets = dashboardSets.list;
            });
    }

    get datef() {
        return this.preferences.datef ? moment().format(this.prefservice.jsDateFormat2momentDateFormat(this.preferences.datef)): "";
    }

    get timef() {
        return this.preferences.timef ? moment().format(this.prefservice.jsTimeFormat2momentTimeFormat(this.preferences.timef)): "";
    }

    get formattingOfNumbers(): string {
        if (!this.preferences.num_grp_sep || !this.preferences.dec_sep) {
            return "";
        }
        return "1"
            + this.preferences.num_grp_sep + "000"
            + this.preferences.num_grp_sep + "000"
            + this.preferences.dec_sep + ("0".repeat(this.preferences.default_currency_significant_digits ? this.preferences.default_currency_significant_digits : 2));
    }

    private setFormattingOfNumbers(val: number | string) {
        if (val === '-') {
            this.preferences.num_grp_sep = this.preferences.dec_sep = null;
        } else {
            this.preferences.num_grp_sep = this.formattingsOfNumbers[val].num_grp_sep;
            this.preferences.dec_sep = this.formattingsOfNumbers[val].dec_sep;
        }
    }

    private cancel() {
        this.view.setViewMode();
    }

    private save() {

        if ( this.handlingWithForeignPrefs ) {
            this.backend.postRequest('user/'+this.model.data.id+'/preferences/global', {}, this.preferences).subscribe(
                savedprefs => {
                    this.preferences = savedprefs;
                    this.view.setViewMode();
                },
                error => {
                    this.toast.sendToast(this.language.getLabel("LBL_ERROR") + " " + error.status, "error", error.error.error.message);
                }
            );
        } else {
            this.prefservice.setPreferences( this.preferences ).subscribe( () => {
                this.toast.sendToast( this.language.getLabel( "LBL_DATA_SAVED" ), "success" );
                this.preferences = _.pick( this.prefservice.unchangedPreferences.global, this.names );

                // broadcast that the references have been saved
                this.broadcast.broadcastMessage('userpreferences.save');
            });
            this.view.setViewMode();
        }
    }

    private togglePanel(panel) {
        this.expanded[panel] = !this.expanded[panel];
    }

    private getTabStyle(tab) {
        if (!this.expanded[tab]) {
            return {
                height: "0px",
                transform: "rotateX(90deg)"
            };
        }
    }

    private getExampleText(name: string): string {
        let exampleText = '';
        if (this.prefservice.formats.nameFormats) {
            this.prefservice.formats.nameFormats.some((row, index) => {
                if (name === row.name) {
                    exampleText = row.example;
                    return true;
                }
            });
        }
        return exampleText;
    }

    private change( event, pref ) {
        this.preferences[pref] = ( event.srcElement.value === '-' ? null : event.srcElement.value );
    }

    private getDashboardSetData(id) {
        return this.dashboardSets.find(dashboardSet => dashboardSet.id == id);
    }

    private getDashboardData(id) {
        return this.dashboards.find(dashboard => dashboard.id == id);
    }
}
