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
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Subject} from 'rxjs';
import {CanActivate} from '@angular/router';

import {configurationService} from './configuration.service';
import {broadcast} from './broadcast.service';
import {session} from './session.service';
import {metadata} from './metadata.service';
import {Observable} from 'rxjs';
import {cookie} from './cookie.service';

/**
 * @ignore
 */
declare var _: any;

/**
 * the language service is the central service that handles the translation and interporetaiton of language ´labels
 */
@Injectable()
export class language {
    /**
     * interla object that holds all language labels retrieved from the backend in the current language
     */
    public languagedata: any = {};

    /**
     * the current language e.g. 'en_us'
     */
    private _currentlanguage: string = '';

    /**
     * an event emitter that is triggered if the language service has switched languages and teh language translations have been reloaded.
     */
    public currentlanguage$: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if true enable inline editing for labels
     */
    public inlineEditEnabled: boolean = false;

    constructor(
        private http: HttpClient,
        private configurationService: configurationService,
        private session: session,
        private metadata: metadata,
        private cookie: cookie
    ) {
    }

    /**
     * a settter for the current language
     *
     * @param language the language to set the srvice to
     */
    set currentlanguage(language) {
        if(typeof language !== 'string' || language === null) {
            language = this.getDefaultLanguage();
        }
        this._currentlanguage = language;

        this.cookie.setValue('spiceuilanguage', language);
    }

    /**
     * a getter for the current language
     */
    get currentlanguage() {
        return this._currentlanguage;
    }

    /**
     * a loader function that is called from the loader service initially to load the language
     *
     * @param loadhandler the loadhandler from the loader service
     */
    public getLanguage(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('languageData' + this.session.authData.sessionId)] && sessionStorage[window.btoa('languageData' + this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            let response = this.session.getSessionData('languageData');
            this.languagedata = response;
            if (this.currentlanguage == '') {
                this.currentlanguage = response.languages.default;
            }
            loadhandler.next('getLanguage');
        } else {
            this.loadLanguage().subscribe(() => {
                loadhandler.next('getLanguage');
            });
        }
    }

    /**
     * loads the language as set in the current language
     */
    public loadLanguage(): Observable<any> {
        let retSubject = new Subject();

        if (this.currentlanguage == '') {
            if (this.cookie.getValue('spiceuilanguage')) {
                this.currentlanguage = this.cookie.getValue('spiceuilanguage');
            }
        }

        this.http.get(
            this.configurationService.getBackendUrl() + '/language/'+this.currentlanguage,
            {headers: this.session.getSessionHeader(), observe: "response", params: {setPreferences: '1'}}
        ).subscribe(
            (res: any) => {
                let response = res.body;
                this.session.setSessionData('languageData', response);
                this.languagedata = response;

                if (this.currentlanguage == '') {
                    this.currentlanguage = response.languages.default;
                }

                // emit that the language has changed
                this.currentlanguage$.emit(this.currentlanguage);

                retSubject.next(true);
                retSubject.complete();
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
    private getNestedLabel(label, length: 'default' | 'long' | 'short' = 'default') {
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
    private getNestedTags(label) {
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
        if (Array.isArray(replacements)) replArray = replacements;
        else replArray = new Array(replacements);
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

                if (this.languagedata.applist.moduleListSingular[module]) {
                    return this.languagedata.applist.moduleListSingular[module] || module;
                }
            } else {
                if (module_defs.module_label) {
                    return this.getLabel(module_defs.module_label, '', labellength);
                }
            }
            return this.languagedata.applist.moduleList[module] || module;
        } catch (e) {
            return module;
        }
    }

    /**
     * public function that checks if for the module a LBL_SEARCH_{MODULE} LABEL is defined .. if not concatenates LBL_SEARCH and the module name
     * @param module
     */
    public getModuleCombinedLabel(label, module) {
        if(!module) return 'no module defined';
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
     * returns the options that are possible for fields of type enum
     *
     * @param module the module as deined in sysmodules
     * @param fieldname the name of the field
     * @param formatted if the values shoudl be returned properly so the enum fields can use the output
     */
    public getFieldDisplayOptions(module: string, fieldname: string, formatted: boolean = false): any[] {
        let options = this.metadata.getFieldOptions(module, fieldname);
        if (options !== false) {
            try {
                let ret = this.languagedata.applist[options];
                // format the return value for the use in enum fields...
                if (formatted) {
                    let tmp_ret = ret;
                    ret = [];
                    for (let option in tmp_ret) {
                        ret.push({
                            value: option,
                            display: tmp_ret[option],
                        });
                    }
                }
                return ret;
            } catch (e) {
                return [];
            }
        } else {
            return [];
        }
    }

    /**
     * returns the options that are possible for a given app_list_strings entry. used for the display if no options are defined in the metadata or if they options are derived dynamically
     *
     * @param {string} idx = index in dictionary
     * @param {boolean} formatted
     */
    public getDisplayOptions(idx: string, formatted: boolean = false) {
        let ret = this.languagedata.applist[idx];
        // format the return value for the use in enum fields...
        if (formatted) {
            let tmp_ret = ret;
            ret = [];
            for (let option in tmp_ret) {
                ret.push({
                    value: option,
                    display: tmp_ret[option],
                });
            }
        }
        return ret;
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
                return this.languagedata.applist[options][value] ? this.languagedata.applist[options][value] : value;
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
                default_language: language.language_code == this.languagedata.languages.default
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

        if (!langfound) this.languagedata.languages.available.push(languagedata);
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
            this.configurationService.getBackendUrl() + '/syslanguages/setdefault/' + language, {},
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
                if (label.toLocaleLowerCase().indexOf(searchTerm) < 0) {
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
    public compareStrings( a: string, b: string ): number {
        return a.localeCompare( b, this._currentlanguage.slice( 0, 2 ));
    }

    /**
     * Sorts an array of strings.
     * It compares case-insensitive, using the current language selected by the user.
     *
     * @param array The array of strings to sort.
     */
    public sortArray( array: string[], reverse = false ): void {
        array.sort( ( a, b ) => this.compareStrings( a, b ) * ( reverse?-1:1 ));
    }

    /**
     * Sorts an array of objects, by the given property.
     * It compares case-insensitive, using the current language selected by the user.
     *
     * @param array The array of objects to sort.
     * @param property The property to be used for sorting.
     */
    public sortObjects( array: object[], property: string, reverse = false ): void {
        array.sort( ( a, b ) => this.compareStrings( a[property], b[property] ) * ( reverse?-1:1 ));
    }

    /**
     * Capitalize the first letter in a string.
     *
     * @param string The string.
     */
    public ucFirst( string ): string {
        return string.charAt(0).toLocaleUpperCase( this._currentlanguage.slice( 0, 2 )) + string.slice(1);
    }

    /**
     * Uncapitalize the first letter in a string.
     *
     * @param string The string.
     */
    public lcFirst( string ): string {
        return string.charAt(0).toLocaleLowerCase( this._currentlanguage.slice( 0, 2 )) + string.slice(1);
    }

}
