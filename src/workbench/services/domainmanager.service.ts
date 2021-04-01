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
 * @module WorkbenchModule
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';

@Injectable()
export class domainmanager {

    /**
     * the loaded list of domains
     */
    public domaindefinitions: any[] = [];

    /**
     * the loaded domain fields
     */
    public domainfields: any[] = [];

    /**
     * the loaded domain field validations
     */
    public domainfieldvalidations: any[] = [];

    /**
     * the loaded domain field validation values
     */
    public domainfieldvalidationvalues: any[] = [];

    /**
     * the currently seleted domain element
     */
    public currentDomainDefinition: string;

    /**
     * the urrently selected domain field
     */
    public currentDomainField: string;

    private languagelabels: any[] = [];
    private languagetranslations: any[] = [];
    private languagecustomlabels: any[] = [];
    private languagecustomtranslations: any[] = [];

    private loaded: string;

    /**
     * the dbtypes
     */
    public dbtypes = ['non-db','varchar', 'char', 'text', 'mediumtext', 'longtext', 'date', 'datetime', 'int', 'bigint', 'double', 'bool'];

    /**
     * holds the fieldtypes
     */
    public fieldtypes: string[] = [];

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {
        this.loadDomains();

        for (let filedtype in this.metadata.fieldTypeMappings) {
            this.fieldtypes.push(filedtype);
        }
        this.fieldtypes.sort();

    }

    /**
     * load the domains
     */
    private loadDomains() {
        this.backend.getRequest('system/dictionary/domains').subscribe(res => {
            this.domaindefinitions = res.domaindefinitions;
            this.domainfields = res.domainfields;
            this.domainfieldvalidations = res.domainfieldvalidations;
            this.domainfieldvalidationvalues = res.domainfieldvalidationvalues;

            this.loaded = JSON.stringify(res);
        });
    }

    /**
     * fina  validatzion by ID and return the record
     * @param validationid
     */
    public getValidationById(validationid) {
        return this.domainfieldvalidations.find(v => v.id == validationid);
    }


    /**
     * returns validation values filtered by validationid
     *
     * @param validationid
     */
    public getValdiationValuesdById(validationid) {
        let validationValues = this.domainfieldvalidationvalues.filter(v => v.sysdomainfieldvalidation_id == validationid && v.scope == 'c');
        let globalValidationValues = this.domainfieldvalidationvalues.filter(v => v.sysdomainfieldvalidation_id == validationid && v.scope != 'c');
        for (let globalValidationValue of globalValidationValues) {
            if (validationValues.findIndex(v => v.enumvalue == globalValidationValue.enumvalue) == -1) {
                validationValues.push(globalValidationValue);
            }
        }
        return validationValues;
    }

    /**
     * returns a status color
     *
     * @param status
     */
    public getStatusColor(status) {
        switch (status) {
            case 'a':
                return 'slds-icon-text-success';
            case 'i':
                return 'slds-icon-text-light';
            default:
                return 'slds-icon-text-warning';
        }
    }

    /**
     * save the settings
     */
    public save() {
        let changes: any = this.determineChangedRecords();

        if (this.languagelabels.length > 0) {
            changes.languagelabels = this.languagelabels;
            changes.languagetranslations = this.languagetranslations;
        }
        if (this.languagecustomlabels.length > 0) {
            changes.languagecustomlabels = this.languagecustomlabels;
            changes.languagecustomtranslations = this.languagecustomtranslations;
        }

        this.backend.postRequest('system/dictionary/domains', {}, changes).subscribe(res => {

        });

    }

    /**
     * check which records are changed
     */
    private determineChangedRecords() {
        let loaded = JSON.parse(this.loaded);
        let changed = {
            domaindefinitions: [],
            domainfields: [],
            domainfieldvalidations: [],
            domainfieldvalidationvalues: []
        };

        for (let item in changed) {
            for (let rec of this[item]) {
                let dd = loaded[item].find(d => d.id == rec.id);
                if (!dd || (dd && JSON.stringify(dd) != JSON.stringify(rec))) {
                    changed[item].push(rec);
                }
            }
        }

        return changed;

    }

    public generateENUMSFromModules() {
        this.backend.getRequest('system/dictionary/domains/appliststrings').subscribe(apl => {
            for (let dtable in this.metadata.fieldDefs) {
                let table = this.metadata.fieldDefs[dtable];
                for (let field in table) {
                    if (table[field].options && (apl.en_us.global[table[field].options] || apl.en_us.custom[table[field].options]) && table[field].type.includes('enum') && !this.domaindefinitions.find(d => d.name == dtable.toLowerCase() + '_' + field)) {

                        let scope = apl.en_us.global[table[field].options] ? 'g' : 'c';

                        let definitionId = this.modelutilities.generateGuid();
                        this.domaindefinitions.push({
                            id: definitionId,
                            name: dtable.toLowerCase() + '_' + field,
                            scope: scope,
                            fieldtype: table[field].type,
                            status: 'a',
                            deleted: 0
                        });

                        let validationid = this.modelutilities.generateGuid();
                        this.domainfieldvalidations.push({
                            id: validationid,
                            name: table[field].options,
                            validation_type: 'enum',
                            scope: scope,
                            status: 'a',
                            deleted: 0
                        });

                        this.domainfields.push({
                            id: this.modelutilities.generateGuid(),
                            name: field,
                            dbtype: table[field].type == 'enum' ? 'varchar' : 'text',
                            len: table[field].len ? table[field].len : '255',
                            sysdomaindefinition_id: definitionId,
                            sysdomainfieldvalidation_id: validationid,
                            scope: scope,
                            status: 'a',
                            deleted: 0
                        });

                        let options = this.language.languagedata.applist[table[field].options];
                        let i = 0;
                        for (let option in options) {
                            this.domainfieldvalidationvalues.push({
                                id: this.modelutilities.generateGuid(),
                                sysdomainfieldvalidation_id: validationid,
                                label: option ? ('VAL_' + table[field].options + '_' + option).toUpperCase() : '',
                                minvalue: option,
                                sequence: i,
                                comment: '',
                                scope: scope,
                                status: 'a',
                                deleted: 0
                            });

                            if (option && !this.language.languagedata.applang[('VAL_' + table[field].options + '_' + option).toUpperCase()]) {
                                let labelid = this.modelutilities.generateGuid();
                                if (scope == 'g') {
                                    this.languagelabels.push({
                                        id: labelid,
                                        name: ('VAL_' + table[field].options + '_' + option).toUpperCase()
                                    });
                                } else {
                                    this.languagecustomlabels.push({
                                        id: labelid,
                                        name: ('VAL_' + table[field].options + '_' + option).toUpperCase()
                                    });
                                }

                                for (let language in apl) {
                                    if (apl[language].global[table[field].options] && apl[language].global[table[field].options][option]) {
                                        this.languagetranslations.push({
                                            id: this.modelutilities.generateGuid(),
                                            syslanguagelabel_id: labelid,
                                            syslanguage: language,
                                            translation_default: apl[language].global[table[field].options][option]
                                        });

                                        if (language == this.language.currentlanguage) {
                                            this.language.addLabel(('VAL_' + table[field].options + '_' + option).toUpperCase(), apl[language].global[table[field].options][option]);
                                        }
                                    }
                                    if (apl[language].custom[table[field].options] && apl[language].custom[table[field].options][option]) {
                                        this.languagecustomtranslations.push({
                                            id: this.modelutilities.generateGuid(),
                                            syslanguagelabel_id: labelid,
                                            syslanguage: language,
                                            translation_default: apl[language].custom[table[field].options][option]
                                        });

                                        if (language == this.language.currentlanguage) {
                                            this.language.addLabel(('VAL_' + table[field].options + '_' + option).toUpperCase(), apl[language].custom[table[field].options][option]);
                                        }
                                    }
                                }
                            }
                            i++;
                        }
                    }

                }
            }
        });
    }
}
