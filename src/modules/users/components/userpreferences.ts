/**
 * @module ModuleUsers
 */
import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {currency} from '../../../services/currency.service';
import {Subject} from "rxjs";
import { session } from '../../../services/session.service';
import { model } from '../../../services/model.service';

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

    private preferences: any = {};
    private dashboards: any[] = [];
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
        "home_dashboard",
        "home_assistant",
        "help_icon",
    ];
    private weekDayStartList = ["Sunday", "Monday"];
    private visibilityOptions = ["visible", "hidden"];
    private weekDaysCountList = [5,6,7];
    private dayHoursList = [];

    private expanded = {loc: true, exp: true, other: true, calendar: true, home: true};
    private exportDelimiterList = [",", ";"];
    private charsetlist = [
        "BIG-5", "CP1251", "CP1252", "EUC-CN", "EUC-JP", "EUC-KR", "EUC-TW", "ISO-2022-JP",
        "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5",
        "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-10", "ISO-8859-13",
        "ISO-8859-14", "ISO-8859-15", "KOI8-R", "KOI8-U", "SJIS", "UTF-8"];
    private currencySignificantDigitsList: string[] = ["1", "2", "3", "4", "5", "6"];
    private thousandDelimiterList: string[] = [",", "."];
    private dateFormatList = [
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y-m-d")), value: "Y-m-d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m-d-Y")), value: "m-d-Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d-m-Y")), value: "d-m-Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y/m/d")), value: "Y/m/d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m/d/Y")), value: "m/d/Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d/m/Y")), value: "d/m/Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("Y.m.d")), value: "Y.m.d"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("d.m.Y")), value: "d.m.Y"},
        {name: moment().format(this.prefservice.jsDateFormat2momentDateFormat("m.d.Y")), value: "m.d.Y"}
    ];
    private timeFormatList = [
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("H:i")), value: "H:i"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:ia")), value: "h:ia"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:iA")), value: "h:iA"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:i a")), value: "h:i a"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h:i A")), value: "h:i A"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("H.i")), value: "H.i"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.ia")), value: "h.ia"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.iA")), value: "h.iA"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.i a")), value: "h.i a"},
        {name: moment().format(this.prefservice.jsTimeFormat2momentTimeFormat("h.i A")), value: "h.i A"}
    ];
    private currencyList: any[] = [];
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

    private canPrefs: boolean;

    constructor(
        private backend: backend,
        private view: view,
        private toast: toast,
        private currency: currency,
        private language: language,
        private prefservice: userpreferences,
        private session: session,
        private model: model ) {

        this.view.isEditable = true;

        this.canPrefs = this.session.authData.userId === this.model.data.id; // only the user himself can view/edit the preferences
        if ( this.canPrefs ) {

            this.prefsLoaded.subscribe( () => {
                this.preferences = _.pick( this.prefservice.unchangedPreferences.global, this.names );
            } );
            this.prefservice.getPreferences( this.prefsLoaded );

            this.prefservice.needFormats();

            this.backend.getRequest( "/timezones" ).subscribe( response => {
                this.timezones = response;
                this.timezoneKeys = Object.keys( this.timezones );
            } );
            this.currencyList = this.currency.getCurrencies();

        }

        for (let i = 0; i < 24; i++) {
            this.dayHoursList.push(i);
        }

        this.backend.getList("Dashboards", "name", "DESC", ["name", "id"], {limit: -1})
            .subscribe((dashboards: any) => {
                this.dashboards = dashboards.list;
            });
    }

    get datef() {
        return this.preferences.datef ? moment().format(this.prefservice.jsDateFormat2momentDateFormat(this.preferences.datef)): "";
    }

    get timef() {
        return this.preferences.timef ? moment().format(this.prefservice.jsTimeFormat2momentTimeFormat(this.preferences.timef)): "";
    }

    get homeDashboardName() {
        let dashboard = this.dashboards.find(dashboard => dashboard.id == this.preferences.home_dashboard);
        return dashboard ? dashboard.name : '-- Default Dashboard --';
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
        this.prefservice.setPreferences( this.preferences ).subscribe(() => {
            this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success");
            this.preferences = _.pick(this.prefservice.unchangedPreferences.global, this.names);
        });
        this.view.setViewMode();
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

}
