/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from 'rxjs';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {broadcast} from './broadcast.service';
import {metadata} from './metadata.service';
import {Observable} from 'rxjs';
import {StoreService} from "./store.service";
import {DomainValidation, DomainValidationValue} from "../workbench/interfaces/domainmanager.interfaces";

/**
 * @ignore
 */
declare var _: any;

/**
 * the language service is the central service that handles the translation and interporetaiton of language ´labels
 */
@Injectable({
    providedIn: 'root'
})
export class language {
    /**
     * interla object that holds all language labels retrieved from the backend in the current language
     */
    public languagedata: any = {};

    /**
     * the current language e.g. 'en_us'
     */
    public _currentlanguage: string = '';

    /**
     * an event emitter that is triggered if the language service has switched languages and teh language translations have been reloaded.
     */
    public currentlanguage$: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if true enable inline editing for labels
     */
    public inlineEditEnabled: boolean = false;

    public storeDBName: string = 'language';

    constructor(
        public http: HttpClient,
        public configurationService: configurationService,
        public session: session,
        public broadcast: broadcast,
        public storeService: StoreService,
        public metadata: metadata
    ) {

        this.storeService.initializeStores(this.storeDBName, ["languages", "applang"], 'language_code');

        // subscribe to the broadcast to catch the logout
        this.broadcast.message$.subscribe(message => this.handleLogout(message));
    }

    /**
     * a settter for the current language
     *
     * @param language the language to set the srvice to
     */
    set currentlanguage(language) {

        if (!language) language = this.getDefaultLanguage();

        this._currentlanguage = language;

        this.storeService.readStoreAll(this.storeDBName, 'languages').then(languages => {

            languages.forEach(l => {
                l.isCurrent = language == l.language_code;
                this.storeService.writeStore(this.storeDBName, 'languages', {language_code: l.language_code, data: l});
            });
        });
    }

    /**
     * a getter for the current language
     */
    get currentlanguage() {
        return this._currentlanguage;
    }

    /**
     * handle the message broadcast and if messagetype is logout reset the data
     *
     * @param message the message received
     */
    public handleLogout(message) {
        if (message.messagetype == 'logout') {
            this.clearDB();
        }
    }

    /**
     * clears the db
     *
     * @private
     */
    public clearDB() {
        this.storeService.clearDB(this.storeDBName, ["languages", "applang"]);
    }

    /**
     * a loader function that is called from the loader service initially to load the language
     *
     * @param loadhandler the loadhandler from the loader service
     */
    public getLanguage(loadhandler: Subject<string>) {

        this.storeService.readStoreAll(this.storeDBName, 'languages').
            then((languages) => {

                this.languagedata.languages = {available: languages};

                this._currentlanguage = languages.find(l => l.isCurrent)?.language_code;

                this.storeService.readStore(this.storeDBName, 'applang', this.currentlanguage).subscribe({
                    next: applang => this.languagedata.applang = applang,
                    error: () => false
                });

                loadhandler.next('getLanguage');
            }).
            catch(() => {
                this.loadLanguage().subscribe(() => {

                    // write to the database
                    this.languagedata.languages.available.forEach(language => {
                        language.isCurrent = language.language_code == this.currentlanguage;
                        this.storeService.writeStore(this.storeDBName, 'languages', {language_code: language.language_code, data: language});
                    });

                    loadhandler.next('getLanguage');
                });
            });
    }

    /**
     * switches the language
     * @param language
     */
    public switchLanguage(language): Observable<any> {
        let retSubject = new Subject();
        this.currentlanguage = language;

        // attempts to read from the store. if fails load from backend
        this.storeService.readStore(this.storeDBName, 'applang', language).subscribe({
            next: (applang) => {
                this.languagedata.applang = applang;
                this.currentlanguage$.emit(this.currentlanguage);

                retSubject.next(true);
                retSubject.complete();
            },
            error: () => {
                this.loadLanguage().subscribe({
                    next: () => {
                        retSubject.next(true);
                        retSubject.complete();
                    }
                });
            }
        })
        return retSubject.asObservable();
    }

    /**
     * loads the language as set in the current language
     */
    public loadLanguage(): Observable<any> {
        let retSubject = new Subject();

        // consturct the URL
        let url = this.configurationService.getBackendUrl() + '/system/language';
        if (this.currentlanguage) url += '/' + this.currentlanguage;

        // get the language
        this.http.get(
            url,
            {headers: this.session.getSessionHeader(), observe: "response"}
        ).subscribe({
                next: (res: any) => {
                    let response = res.body;
                    // this.session.setSessionData('languageData', response);

                    // set the response
                    this.languagedata = response;

                    // in case we have no language set .. set it
                    if (!this.currentlanguage) {
                        this.currentlanguage = response.language;
                    }

                    // write to the store
                    this.storeService.writeStore(this.storeDBName, 'applang', {language_code: this.currentlanguage, data: this.languagedata.applang});

                    // emit that the language has changed
                    this.currentlanguage$.emit(this.currentlanguage);

                    retSubject.next(true);
                    retSubject.complete();
                }
            }
        );

        return retSubject.asObservable();
    }

    /**
     *
     * returns the translation for a given label
     *
     * @param module the module for a specific module.Only used in legacy cases when the labels are not loaded from the database
     * @param label the label itsel e.g. 'LBL_OK'
     * @param length the length of the label
     *
     * The function can be used directly in teh template if the language service is provided
     *
     * ```html
     * <h2 class="slds-align-middle slds-text-heading_small">{{language.getLabel('LBL_FILTER')}}</h2>
     * ```
     *
     */
    public getLabel(label: string, module: string = '', length: 'default' | 'long' | 'short' = 'default'): string {
        try {
            if (module != '') {
                if (typeof (this.languagedata.mod) != "undefined" && this.languagedata.mod[module] != undefined && this.languagedata.mod[module][label]) {
                    return this.languagedata.mod[module][label] || label;
                } else {
                    return this.getAppLanglabel(label, length);
                }
            } else {
                return this.getAppLanglabel(label, length);
            }
        } catch (e) {
            return label;
        }
    }

    /**
     * @deprecated
     *
     * a method to return an application language label .. in the meantime deprecated
     *
     * @param label the label itsel e.g. 'LBL_OK'
     * @param length the length of the label
     */
    public getAppLanglabel(label: string, length: 'default' | 'long' | 'short' = 'default') {
        if (this.languagedata.applang[label]) {
            if (typeof (this.languagedata.applang[label]) == 'object') {
                return this.languagedata.applang[label][length] ? this.getNestedLabel(label, length) : this.getNestedLabel(label);
            } else {
                return this.getNestedLabel(label);
            }
        } else {
            return label;
        }
    }

    /**
     * an internal function the reolves nested labels. Labels can conatin other lebal in theji definiton
     *
     * e.g. if the translation is as follows "this is the label nesting {LABEL:LBL_NESTED} and other". In case a transation si lie that the nested labels are resolved and embedded
     *
     * @param label the label itsel e.g. 'LBL_OK'
     * @param length the length of the label
     */
    public getNestedLabel(label, length: 'default' | 'long' | 'short' = 'default') {
        let foundlabel;

        // try to find a label
        if (this.languagedata.applang[label]) {
            if (_.isObject(this.languagedata.applang[label])) {
                foundlabel = this.languagedata.applang[label][length] ? this.languagedata.applang[label][length] : this.languagedata.applang[label].default;
            } else if (_.isString(this.languagedata.applang[label])) {
                foundlabel = this.languagedata.applang[label];
            }
        }

        // check for nested labels
        if (foundlabel) {
            let matches = this.getNestedTags(foundlabel);
            if (matches) {
                for (let thismatch of matches) {
                    foundlabel = foundlabel.replace('{LABEL:' + thismatch + '}', this.getNestedLabel(thismatch, length));
                }
            }
        }

        // return the label
        return foundlabel ? foundlabel : label;
    }

    /**
     * finds and returns the nested label tags
     *
     * @param label the label
     */
    public getNestedTags(label) {
        let curpos = label.indexOf('{LABEL:');
        let matches = [];
        while (curpos >= 0) {
            if (curpos >= 0) {
                let endpos = label.indexOf('}', curpos);
                if (endpos >= 0) {
                    matches.push(label.substring(curpos + 7, endpos));
                    curpos = label.indexOf('{LABEL:', endpos);
                } else {
                    curpos = -1;
                }
            }
        }
        return matches;
    }

    /**
     * retursn a label and parses optional parameters in teh label
     *
     * @param label the label. paramater sin teh translation can be set as follow "file %s exceeds maximum upload file size of %s"
     * @param replacements an array of replament strings
     * @param length the length of the label to be renturned
     *
     * ```typescript
     * // check max filesize
     * if (maxSize && file.size > maxSize) {
     *            this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.humanFileSize(maxSize)]), 'error');
     *            continue;
     *       }
     * ```
     */
    public getLabelFormatted(label: string, replacements: any, length: 'default' | 'long' | 'short' = 'default') {
        let replArray: string[];
        if (Array.isArray(replacements)) {
            replArray = replacements;
        } else {
            replArray = new Array(replacements);
        }
        let x = 0;
        return this.getLabel(label, '', length)
            .replace(/%(s|%)/g, (...args) => {
                return args[1] === 's' ? replArray[x++] : (args[1] === '%') ? '%' : args[0];
            });
    }

    /**
     * returns the translated name of a module
     *
     * @param module the module as defined in sysmodules e.g. 'Accounts'
     * @param singular set to true to get he singular name
     * @param labellength the length of the label
     */
    public getModuleName(module, singular = false, labellength: 'default' | 'long' | 'short' = 'default') {
        try {
            let module_defs = this.metadata.getModuleDefs(module);
            if (singular) {
                if (module_defs.singular_label) {
                    return this.getLabel(module_defs.singular_label, '', labellength);
                }
            } else {
                if (module_defs.module_label) {
                    return this.getLabel(module_defs.module_label, '', labellength);
                }
            }
            return module;
        } catch (e) {
            return module;
        }
    }

    /**
     * public function that checks if for the module a LBL_SEARCH_{MODULE} LABEL is defined .. if not concatenates LBL_SEARCH and the module name
     * @param module
     */
    public getModuleCombinedLabel(label, module) {
        if (!module) return 'no module defined';
        if (this.languagedata.applang[label + '_' + module.toUpperCase()]) {
            return this.getLabel(label + '_' + module.toUpperCase());
        } else {
            return this.getLabel(label) + ' ' + this.getModuleName(module);
        }
    }

    /**
     * returns the display name of a specifis field in a module in the current language
     *
     * @param module the module as deined in sysmodules
     * @param fieldname the name of the field
     * @param fieldconfig an optional field config object if set ion the fieldset
     * @param length the length of the name to be returned
     */
    public getFieldDisplayName(module: string, fieldname: string, fieldconfig: any = {}, length: 'default' | 'long' | 'short' = 'default') {
        let label = '';
        if (fieldconfig.label) {
            if (fieldconfig.label.indexOf(':') > 0) {
                let labeldata = fieldconfig.label.split(':');
                label = this.getLabel(labeldata[1], labeldata[0]);
            } else {
                label = this.getLabel(fieldconfig.label, module, length);
            }
        } else {
            label = this.getLabel(this.metadata.getFieldlabel(module, fieldname), module, length);
        }

        // return the value
        if (label === '') {
            if (fieldconfig.label) {
                return fieldconfig.label;
            } else {
                return fieldname;
            }
        } else {
            return label;
        }
    }

    /**
     * returns the helpText of a specifis field in a module in the current language
     *
     * @param module the module as deined in sysmodules
     * @param fieldname the name of the field
     * @param fieldconfig an optional field config object if set ion the fieldset
     */
    public getFieldHelpText(module: string, fieldname: string, fieldconfig: any = {}) {
        let popupHelp = '';
        if (fieldconfig.popupHelp) {
            if (fieldconfig.popupHelp.indexOf(':') > 0) {
                let labeldata = fieldconfig.popupHelp.split(':');
                popupHelp = this.getLabel(labeldata[1], labeldata[0], 'default');
            } else {
                popupHelp = this.getLabel(fieldconfig.popupHelp, module, 'default');
            }
        } else {
            popupHelp = this.getLabel(this.metadata.getFieldHelpText(module, fieldname), module, 'default');
        }

        // return the value
        if (popupHelp === '') {
            if (fieldconfig.popupHelp) {
                return fieldconfig.popupHelp;
            } else {
                return fieldname;
            }
        } else {
            return popupHelp;
        }
    }

    /**
     *
     * @param values
     * @param formatted
     * @param sortedBy
     * @param includeInactiveOptions
     * @private
     */
    private prepareOptions(values: {[key: string]: DomainValidationValue}, formatted?: boolean, sortedBy?: {field: DomainValidation['order_by'], direction: DomainValidation['sort_flag']}, includeInactiveOptions?: boolean): EnumDisplayOptionArray | EnumDisplayOptionObject {

        if (!values) return formatted ? [] : {};

        try {
            // format the return value for the use in enum fields...
            if (formatted) {
                const optionsArray = [];
                for (let option in values) {

                    if (!includeInactiveOptions && values[option].status != 'a') continue;

                    optionsArray.push({
                        value: option,
                        display: this.getLabel(values[option].label),
                        status: values[option].status
                    });
                }

                return optionsArray.sort((a, b) => {

                    let compareResult: number;
                    if (!sortedBy.field) sortedBy.field = 'sequence';

                    switch (sortedBy.field) {
                        case 'enumvalue':
                            compareResult = values[a.value][sortedBy.field].localeCompare(values[b.value][sortedBy.field]);
                            break;
                        case 'label':
                            compareResult = this.getLabel(values[a.value][sortedBy.field]).localeCompare(this.getLabel(values[b.value][sortedBy.field]));
                            break;
                        case 'sequence':
                            compareResult = values[a.value][sortedBy.field] > values[b.value][sortedBy.field] ? 1 : -1;
                            break;
                    }

                    return sortedBy.direction == 'desc' ? -compareResult : compareResult;
                });
            } else {
                const optionsObject = {};
                Object.keys(values).forEach(key => optionsObject[key] = this.getLabel(values[key].label));
                return optionsObject;
            }
        } catch (e) {
            return formatted ? [] : {};
        }
    }

    /**
     * returns the options that are possible for fields of type enum
     * @param module the module as defined in sysmodules table
     * @param fieldname the name of the field
     * @param formatted if the values should be returned properly so the enum fields can use the output
     * @param includeInactiveOptions include options that are not active
     */
    public getFieldDisplayOptions(module: string, fieldname: string, formatted: true, includeInactiveOptions?: boolean): EnumDisplayOptionArray;
    public getFieldDisplayOptions(module: string, fieldname: string, formatted?: false | undefined): EnumDisplayOptionObject;
    public getFieldDisplayOptions(module: string, fieldname: string, formatted?: boolean, includeInactiveOptions?: boolean): EnumDisplayOptionArray | EnumDisplayOptionObject {
        let options = this.metadata.getFieldOptions(module, fieldname);
        if (options !== false) {
            const validation = this.metadata.getDomainValidationByName(options);
            return validation ? this.prepareOptions(validation.validationvalues, formatted, {field: validation.order_by, direction: validation.sort_flag}, includeInactiveOptions) : [];
        } else {
            return formatted ? [] : {};
        }
    }

    /**
     * returns the options that are possible for a given app_list_strings entry. used for the display if no options are defined in the metadata or if they options are derived dynamically
     * @param domainValidation
     * @param formatted
     * @param includeInactiveOptions
     */
    public getDisplayOptions(domainValidation: string, formatted: true, includeInactiveOptions?: boolean): EnumDisplayOptionArray;
    public getDisplayOptions(domainValidation: string, formatted?: false | undefined): EnumDisplayOptionObject;
    public getDisplayOptions(domainValidation: string, formatted?: boolean, includeInactiveOptions?: boolean): EnumDisplayOptionArray | EnumDisplayOptionObject {
        const validation = this.metadata.getDomainValidationByName(domainValidation);
        return this.prepareOptions(validation.validationvalues, formatted, {field: validation.order_by, direction: validation.sort_flag}, includeInactiveOptions);
    }

    /**
     * returns a translated label of the validation value
     * @param domainValidation
     * @param validationEnumValue
     */
    public getTranslatedDisplayOption(domainValidation: string, validationEnumValue: string): string {

        if (!domainValidation || !validationEnumValue) return undefined;

        const values = this.metadata.getDomainValidationValues(domainValidation);
        return this.getLabel(values[validationEnumValue].label);
    }

    /**
     * returns the value for a specific option in en enum field. if the value is not defined the value is returned as sent in
     *
     * @param module the module as deined in sysmodules
     * @param fieldname the name of the field
     * @param value the value in the option
     */
    public getFieldDisplayOptionValue(module: string, fieldname: string, value: string): string {
        let options = this.metadata.getFieldOptions(module, fieldname);
        if (options !== false) {
            try {
                return this.getLabel(this.metadata.getDomainValidationValues(options)[value].label);
            } catch (e) {
                return value;
            }
        } else {
            return value;
        }
    }

    /**
     * returns an object with the available languages in the systems
     *
     * @param systemonly if set to true onb the languages that are also loaded systemlanguages are returned
     */
    public getAvialableLanguages(systemonly = false): any {
        let languages = [];
        for (let language of this.languagedata.languages.available) {

            if (systemonly && (!language.system_language || language.system_language == 0)) continue;
            languages.push({
                language: language.language_code,
                text: language.language_name,
                system_language: language.system_language,
                communication_language: language.communication_language,
                default_language: language.language_code == this.languagedata.languages.default,
                display_label: this.getLabel('LANG_' + language.language_code.toUpperCase())
            });
        }
        return languages;
    }

    /**
     * adda a new language .. this is used internally with the package loader when new languages are loaded
     *
     * @param languagedata
     */
    public addAvailableLanguage(languagedata) {

        let langfound = false;
        this.languagedata.languages.available.some(language => {
            if (language.language_code == languagedata.language_code) {
                // set the relevant data
                language.system_language = languagedata.system_language;
                language.default_language = languagedata.default_language;

                if (languagedata.default_language) {
                    this.setDefaultLanguage(languagedata.language_code);
                }

                langfound = true;
                return true;
            }
        });

        if (!langfound) {
            this.languagedata.languages.available.push(languagedata);
            this.storeService.writeStore(this.storeDBName, 'languages', {language_code: languagedata.language_code, data: languagedata});
        }
    }

    /**
     * removees a defined language .. called from the package loader when an installed language is removed
     *
     * @param language the code of the language e.g. 'en_US'
     */
    public removeAvailableLanguage(language) {
        this.languagedata.languages.available.some(language => {
            if (language.language_code == language) {
                // set the relevant data
                language.system_language = false;
                return true;
            }
        });
    }

    /**
     * returns the default language set in the backend
     */
    public getDefaultLanguage() {
        return this.languagedata.languages.default;
    }

    /**
     * sets the default language. used in the package loader when a laguage is set as default
     *
     * @param language the language code e.g. en_US'
     */
    public setDefaultLanguage(language) {
        this.http.post(
            this.configurationService.getBackendUrl() + '/configuration/syslanguages/setdefault/' + language, {},
            {headers: this.session.getSessionHeader(), observe: "response"}
        ).subscribe(
            (res: any) => {
                let response = res.body;
                if (response.success) {
                    this.languagedata.languages.default = language;
                }
            }
        );
    }


    /**
     * returns the humanreadable name of the language. e.g. "English" for en_US'
     *
     * @param language the language code e.g. en_US'
     */
    public getLangText(language) {
        let langText = language;
        this.languagedata.languages.available.some((thislang) => {
            if (thislang.language_code == language) {
                langText = thislang.language_name;
                return true;
            }
        });
        return langText;
    }

    /**
     * a serach function that returns labels that match the passed in search term. Mainly used in the label selector to support fining labels when managing the configuration
     *
     * @param searchTerms a string with vlaues. in teh search the string is exploded by the ' ' and the sarch is performed for labels matching all of the terms
     * @param results optional paramater to pass in the number of matches to be returned
     */
    public searchLabel(searchTerms: string, results: number = 10) {
        let searchresults = [];

        let searchTermArray = searchTerms.toLowerCase().split(' ');

        for (let label in this.languagedata.applang) {
            let found = true;
            for (let searchTerm of searchTermArray) {
                if (this.languagedata.applang[label].default.toLocaleLowerCase().indexOf(searchTerm) < 0 && label.toLocaleLowerCase().indexOf(searchTerm) < 0) {
                    found = false;
                    break;
                }
            }

            if (found) {
                searchresults.push({
                    label,
                    translation: this.getAppLanglabel(label)
                });
            }

            if (searchresults.length >= results) break;
        }

        return searchresults;
    }

    /**
     * adds a label to the current language set. Used in the label manager to have the translation available without a need to reload from the backend
     *
     * @param label the name of the LABEL e.g. 'LBL_OK'
     * @param tdefault the default translation
     * @param tshort the short translation
     * @param tlong the long translation
     */
    public addLabel(label, tdefault = '', tshort = '', tlong = '') {
        this.languagedata.applang[label] = {
            default: tdefault,
            long: tlong,
            short: tshort
        };
    }

    /**
     * Compares two strings, case-insensitive, using the current language selected by the user
     *
     * @param a The first string.
     * @param b The second string.
     */
    public compareStrings(a: string, b: string): number {
        return a.localeCompare(b, this._currentlanguage.slice(0, 2));
    }

    /**
     * Sorts an array of strings.
     * It compares case-insensitive, using the current language selected by the user.
     *
     * @param array The array of strings to sort.
     */
    public sortArray(array: string[], reverse = false): void {
        array.sort((a, b) => this.compareStrings(a, b) * (reverse ? -1 : 1));
    }

    /**
     * Sorts an array of objects, by the given property.
     * It compares case-insensitive, using the current language selected by the user.
     *
     * @param array The array of objects to sort.
     * @param property The property to be used for sorting.
     */
    public sortObjects(array: object[], property: string, reverse = false): void {
        array.sort((a, b) => this.compareStrings(a[property], b[property]) * (reverse ? -1 : 1));
    }

    /**
     * Capitalize the first letter in a string.
     *
     * @param string The string.
     */
    public ucFirst(string): string {
        return string.charAt(0).toLocaleUpperCase(this._currentlanguage.slice(0, 2)) + string.slice(1);
    }

    /**
     * Uncapitalize the first letter in a string.
     *
     * @param string The string.
     */
    public lcFirst(string): string {
        return string.charAt(0).toLocaleLowerCase(this._currentlanguage.slice(0, 2)) + string.slice(1);
    }

}

// tslint:disable-next-line:max-classes-per-file
export type EnumDisplayOptionArray = { value: string, display: string, status: 'a' | 'i' }[];
export interface EnumDisplayOptionObject { [key: string]: string}
