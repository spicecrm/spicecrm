import {Component} from "@angular/core";
import {language} from "../../../services/language.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {Subject} from "rxjs";

declare var _: any;

@Component({
    selector: "user-preferences",
    templateUrl: "./src/modules/users/templates/userpreferences.html",
    styles: [
        `.slds-button--icon {color: #eeeeee}
        .slds-button--icon:hover {color: #5B5B5B}`
    ],
    providers: [view]
})
export class UserPreferences {

    private preferences: any = {};

    private names = ["export_delimiter", "default_export_charset", "currency", "default_currency_significant_digits", "datef", "timef", "timezone", "num_grp_sep", "dec_sep"];

    private expanded = { loc: true, exp: true };
    private exportDelimiterList = [",",";"];
    private charsetlist = [
        "BIG-5", "CP1251", "CP1252", "EUC-CN", "EUC-JP", "EUC-KR", "EUC-TW", "ISO-2022-JP",
        "ISO-2022-KR", "ISO-8859-1", "ISO-8859-2", "ISO-8859-3", "ISO-8859-4", "ISO-8859-5",
        "ISO-8859-6", "ISO-8859-7", "ISO-8859-8", "ISO-8859-9", "ISO-8859-10", "ISO-8859-13",
        "ISO-8859-14", "ISO-8859-15", "KOI8-R", "KOI8-U", "SJIS", "UTF-8"];
    private currencySignificantDigitsList: Array<string> = ["1", "2", "3", "4", "5", "6"];
    private thousandDelimiterList: Array<any> = [",","."];
    private dateFormatList = [
        {name: "2010-12-23", value: "Y-m-d"},
        {name: "12-23-2010", value: "m-d-Y"},
        {name: "23-12-2010", value: "d-m-Y"},
        {name: "2010/12/23", value: "Y/m/d"},
        {name: "12/23/2010", value: "m/d/Y"},
        {name: "23/12/2010", value: "d/m/Y"},
        {name: "2010.12.23", value: "Y.m.d"},
        {name: "23.12.2010", value: "d.m.Y"},
        {name: "12.23.2010", value: "m.d.Y"}
    ];
    private timeFormatList = [
        {name: "23:00", value: "H:i"},
        {name: "11:00pm", value: "h:ia"},
        {name: "11:00PM", value: "h:iA"},
        {name: "11:00 pm", value: "h:i a"},
        {name: "11:00 PM", value: "h:i A"},
        {name: "23.00", value: "H.i"},
        {name: "11.00pm", value: "h.ia"},
        {name: "11.00PM", value: "h.iA"},
        {name: "11.00 pm", value: "h.i a"},
        {name: "11.00 PM", value: "h.i A"},
    ];
    private currencyList = [
        {name: "US Dollars : $", value: "-99"},
        {name: "Euros : €", value: "-98"}
    ];
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
    private timezoneKeys: Array<any>;

    constructor(
        private backend: backend,
        private view: view,
        private toast: toast,
        private language: language,
        private prefservice: userpreferences ) {

            this.prefsLoaded.subscribe( () => {
                this.preferences = _.pick( this.prefservice.unchangedPreferences.global, this.names );
            });
            this.prefservice.getPreferences( this.prefsLoaded );
            this.backend.getRequest("/timezones").subscribe( response => {
                this.timezones = response;
                this.timezoneKeys = Object.keys(this.timezones);
            });
            this.view.isEditable = true;

    }

    private setFormattingOfNumbers( val: number|string ) {
        if ( val === "" ) {
            this.preferences.num_grp_sep = this.preferences.dec_sep = "";
        } else {
            this.preferences.num_grp_sep = this.formattingsOfNumbers[val].num_grp_sep;
            this.preferences.dec_sep = this.formattingsOfNumbers[val].dec_sep;
        }
    }

    get formattingOfNumbers(): string {
        if ( !this.preferences.num_grp_sep || !this.preferences.dec_sep ) { return ""; }
        return "1"
            + this.preferences.num_grp_sep + "000"
            + this.preferences.num_grp_sep + "000"
            + this.preferences.dec_sep + ( "0".repeat( this.preferences.default_currency_significant_digits ? this.preferences.default_currency_significant_digits : 2 ));
    }

    private cancel() {
        this.view.setViewMode();
    }

    private save() {
        this.prefservice.setPreferences( this.preferences, true ).subscribe( () => {
            this.toast.sendToast(this.language.getLabel("LBL_DATA_SAVED"), "success");
            this.preferences = _.pick( this.prefservice.unchangedPreferences.global, this.names );
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
}
