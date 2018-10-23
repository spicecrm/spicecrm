import {EventEmitter, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {backend} from './backend.service';
import {toast} from './toast.service';
import {language} from './language.service';

declare var moment: any;
declare var _: any;

@Injectable()
export class userpreferences {

    public preferences: any = {
        global: {}
    };
    // toUse is a "shortcut" to preferences.global. For easier code.
    // The user preferences in toUse (like preferences.global) will be available anytime, even when the user hasn´t set the preferences yet.
    // Use toUse, if you need any preference, for example "toUse.dec_sep".
    public toUse: any;

    // unchangedPreferences stores the preferences as they are delivered by the KREST api. Don´t use this, when you need any value (use "toUse" instead).
    // Use this object when the user edits the preferences (record detail view of module "users").
    public unchangedPreferences: any = {
        global: {}
    };

    public preferencesComplete = true; // When false, indicates the need to ask the user for the preferences.

    private defaults = {
        currency: -99,
        datef: 'd.m.Y',
        dec_sep: ',',
        num_grp_sep: '.',
        timef: 'H:i',
        timezone: 'Europe/Vienna',
        default_currency_significant_digits: 2,
        default_locale_name_format: 'l, f'
    };

    public formats = {nameFormats: [], loaded: false};

    constructor(private backend: backend, private toast: toast, private l: language) {
        this.toUse = this.preferences.global;
    }

    public getPreferences(loadhandler: Subject<string>) {
        this.loadPreferences().subscribe(ret => {
            loadhandler.next('getPreferences');
        });
    }

    public loadPreferences(category = 'global'): Observable<any> {
        let retSubject: Subject<any> = new Subject<any>();

        this.backend.getRequest('user/preferences/' + category).subscribe(prefs => {
            this.preferences[category] = _.extendOwn(this.preferences[category], prefs);
            if (category === 'global') {
                this.unchangedPreferences.global = _.clone(prefs);
                this.completePreferencesWithDefaults();
            }
            retSubject.next(prefs);
        });

        return retSubject.asObservable();
    }

    // Completes the global preferences with default values.
    // This case shouldn´t happen, the global preferences of a user should always be set (by the user).
    // Just in case it´s not and to ensure proper work of the UI:
    private completePreferencesWithDefaults() {
        let uncomplete = false;
        _.each(this.defaults, (value, key) => {
            if (typeof this.preferences.global[key] === 'string') {
                if (!this.preferences.global[key]) {
                    this.preferences.global[key] = value;
                    uncomplete = true;
                }
            } else {
                if (this.preferences.global[key] === undefined || this.preferences.global[key] === null) {
                    this.preferences.global[key] = value;
                    uncomplete = true;
                }
            }
        });
        this.preferencesComplete = !uncomplete; // When false, indicates the need to ask the user for the preferences.
    }

    public getPreference(name, category = 'global') {
        try {
            return this.preferences[category][name];
        } catch (e) {
            return false;
        }
    }

    public setPreference(name, value, save = true, category = 'global') {
        if (save) {
            let prefs = {};
            prefs[name] = value;
            this.backend.postRequest('user/preferences/global', {}, prefs).subscribe(prefstatus => {
                this.preferences[category][name] = value;
                this.unchangedPreferences[category][name] = value;
                this.completePreferencesWithDefaults();
            });
        } else {
            this.preferences[category][name] = value;
            this.completePreferencesWithDefaults();
        }
    }

    public setPreferences(prefs, save = true, category = 'global') {
        if (save) {
            let saved = new Subject();
            this.backend.postRequest('user/preferences/global', {}, prefs).subscribe(
                savedprefs => {
                    _.extendOwn(this.preferences[category], savedprefs);
                    _.extendOwn(this.unchangedPreferences.global, savedprefs);
                    this.completePreferencesWithDefaults();
                    saved.next(true);
                },
                error => {
                    saved.error(error);
                }
            );
            return saved;
        } else {
            _.extendOwn(this.preferences[category], prefs);
            _.extendOwn(this.unchangedPreferences.global, prefs);
            this.completePreferencesWithDefaults();
        }
    }

    public getDateFormat() {
        if (this.toUse.datef) {
            let dateFormat: string = this.toUse.datef;
            return this.jsDateFormat2momentDateFormat(dateFormat);
        } else {
            return 'YYYY-MM-DD';
        }
    }

    public jsDateFormat2momentDateFormat( format: string ): string {
        return format ? format.replace('Y', 'YYYY').replace('m', 'MM').replace('d', 'DD') : format;
    }

    public getTimeFormat() {
        if (this.toUse.timef) {
            let timeFormat: string = this.toUse.timef;
            return this.jsTimeFormat2momentTimeFormat(timeFormat);
        } else {
            return 'YYYY-MM-DD';
        }
    }

    public jsTimeFormat2momentTimeFormat( format: string ): string {
        return format ? format.replace('H', 'HH').replace('h', 'hh').replace('i', 'mm') : format;
    }

    public needFormats() {
        if (!this.formats.loaded) {
            this.loadFormats();
        }
    }

    private loadFormats(): Observable<any> {
        let retSubject: Subject<boolean> = new Subject<boolean>();

        this.formats.nameFormats.length = 0;
        this.formats.loaded = false;
        this.backend.getRequest('user/preferencesformats').subscribe(formats => {
            for (let item of formats.nameFormats) {
                this.formats.nameFormats.push({name: item, example: this.translateNameFormat(item)});
            }
            this.formats.loaded = true;
            retSubject.next(true);
        });

        return retSubject.asObservable();
    }

    private translateNameFormat(format: string): string {
        let translation = '';
        for (let i = 0; i < format.length; i++) {
            switch (format.charAt(i)) {
                case 't':
                    translation += this.l.getLabel('LBL_LOCALE_NAME_EXAMPLE_TITLE');
                    break;
                case 'f':
                    translation += this.l.getLabel('LBL_LOCALE_NAME_EXAMPLE_FIRST');
                    break;
                case 'l':
                    translation += this.l.getLabel('LBL_LOCALE_NAME_EXAMPLE_LAST');
                    break;
                case 's':
                    translation += this.l.getLabel('LBL_LOCALE_NAME_EXAMPLE_SALUTATION');
                    break;
                default:
                    translation += format.charAt(i);
            }
        }
        return translation;
    }

    /*
     * formatting functions
     * http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
     */
    public formatMoney(i, n = this.toUse.default_currency_significant_digits, x = 3, grpSep = this.toUse.num_grp_sep, decSep = this.toUse.dec_sep) {
        let re = '\\d(?=(\\d{' + x + '})+' + (n > 0 ? '\\D' : '$') + ')';
        let num = i.toFixed(Math.max(0, ~~n));
        return num.replace('.', decSep).replace(new RegExp(re, 'g'), '$&' + grpSep);
    };

    public formatDate(d) {
        return moment(d).format(this.getDateFormat());
    }

    public formatDateTime(d) {
        return moment(d).format(this.getDateFormat()) + ' ' + moment(d).format('HH:mm:ss');
    }

}
