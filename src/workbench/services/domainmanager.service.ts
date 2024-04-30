/**
 * @module WorkbenchModule
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {modal} from '../../services/modal.service';
import {toast} from '../../services/toast.service';
import {
    DomainDefinition,
    DomainField,
    DomainValidation,
    DomainValidationValue
} from "../interfaces/domainmanager.interfaces";

@Injectable()
export class domainmanager {

    /**
     * the loaded list of domains
     */
    public domaindefinitions: DomainDefinition[] = [];

    /**
     * the loaded domain fields
     */
    public domainfields: DomainField[] = [];

    /**
     * the loaded domain field validations
     */
    public domainfieldvalidations: DomainValidation[] = [];

    /**
     * the loaded domain field validation values
     */
    public domainfieldvalidationvalues: DomainValidationValue[] = [];

    /**
     * the currently seleted domain element
     */
    public currentDomainDefinition: string;

    /**
     * the currently selected domain field
     */
    public currentDomainField: string;

    /**
     * the currently selected scope field
     */
    public currentDomainScope: string;

    public languagelabels: any[] = [];
    public languagetranslations: any[] = [];
    public languagecustomlabels: any[] = [];
    public languagecustomtranslations: any[] = [];

    public loaded: string;

    /**
     * the dbtypes
     */
    public dbtypes = ['non-db','varchar', 'char', 'text', 'shorttext', 'mediumtext', 'longtext', 'date', 'datetime', 'int', 'tinyint', 'bigint', 'double', 'bool', 'float', 'json', 'enum', 'blob', 'longblob'];

    /**
     * holds the fieldtypes
     */
    public fieldtypes: string[] = [];

    constructor(public backend: backend, public metadata: metadata, public modal: modal, public toast: toast, public language: language, public modelutilities: modelutilities) {
        this.loadDomains();

        for (let filedtype in this.metadata.fieldTypeMappings) {
            this.fieldtypes.push(filedtype);
        }
        this.fieldtypes.sort();

    }

    /**
     * reload current language data after changes
     */
    public reloadLanguageData() {
        this.language.loadLanguage();
    }

    /**
     * load the domains
     */
    public loadDomains() {
        let awaitLoad = this.modal.await('LBL_LOADING');
        this.backend.getRequest('dictionary/domains').subscribe({
            next: (res) => {
                this.domaindefinitions = res.domaindefinitions;
                this.domainfields = res.domainfields;
                this.domainfieldvalidations = res.domainfieldvalidations;
                this.domainfieldvalidationvalues = res.domainfieldvalidationvalues;

                this.loaded = JSON.stringify(res);
                awaitLoad.emit(true);
            },
            error: () => {
                awaitLoad.emit(true);
            }
        });
    }

    /**
     * returns the current definition
     */
    public getCurrentDefinition(){
        return this.currentDomainDefinition ? this.domaindefinitions.find(d => d.id == this.currentDomainDefinition) : undefined;
    }

    /**
     * fina  validation by ID and return the record
     * @param validationid
     */
    public getValidationById(validationid) {
        return this.domainfieldvalidations.find(v => v.id == validationid);
    }


    /**
     * returns validation values filtered by validationid
     * catch the case when no domainfieldvalidationvalues cached yet and we have a string instead od an array
     * @param validationid
     */
    public getValidationValuesdById(validationid) {
        if (!Array.isArray(this.domainfieldvalidationvalues)) this.domainfieldvalidationvalues = [];
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

        this.backend.postRequest('dictionary/domains', {}, changes).subscribe({
            next: () => {
                this.toast.sendToast('LBL_SAVED', 'success');
            },
            error: () => {
                this.toast.sendToast('ERROR saving domains', 'error');
            }

        });

    }

    /**
     * check which records are changed
     */
    public determineChangedRecords() {
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

    /**
    public generateENUMSFromModules() {
        if (!Array.isArray(this.domainfieldvalidationvalues)) this.domainfieldvalidationvalues = [];
        this.backend.getRequest('dictionary/domains/appliststrings').subscribe(apl => {
            for (let dtable in this.metadata.fieldDefs) {
                let table = this.metadata.fieldDefs[dtable];
                for (let field in table) {
                    if (table[field].options && (apl.en_us.global[table[field].options] || apl.en_us.custom[table[field].options]) && table[field].type.includes('enum') && !this.domaindefinitions.find(d => d.name == dtable.toLowerCase() + '_' + field)) {

                        let scope: 'g'|'c' = apl.en_us.global[table[field].options] ? 'g' : 'c';

                        let definitionId = this.modelutilities.generateGuid();
                        this.domaindefinitions.push({
                            id: definitionId,
                            name: dtable.toLowerCase() + '_' + field,
                            scope: scope,
                            fieldtype: table[field].type,
                            status: 'a'
                        });

                        let validationid = this.modelutilities.generateGuid();
                        this.domainfieldvalidations.push({
                            id: validationid,
                            name: table[field].options,
                            validation_type: 'enum',
                            scope: scope,
                            status: 'a',
                            sort_flag: 'asc',
                            order_by: 'sequence'
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
                            exclude_from_index: false,
                            required: 0,
                            sequence: 0
                        });

                        let options = this.language.languagedata.applist[table[field].options];
                        let i = 0;
                        for (let option in options) {
                            this.domainfieldvalidationvalues.push({
                                id: this.modelutilities.generateGuid(),
                                sysdomainfieldvalidation_id: validationid,
                                label: option ? ('LBL_' + table[field].options + '_' + option).toUpperCase() : '',
                                enumvalue: option,
                                sequence: i,
                                description: '',
                                scope: scope,
                                status: 'a',
                                valuetype: 'string'
                            });

                            if (option && !this.language.languagedata.applang[('LBL_' + table[field].options + '_' + option).toUpperCase()]) {
                                let labelid = this.modelutilities.generateGuid();
                                if (scope == 'g') {
                                    this.languagelabels.push({
                                        id: labelid,
                                        name: ('LBL_' + table[field].options + '_' + option).toUpperCase()
                                    });
                                } else {
                                    this.languagecustomlabels.push({
                                        id: labelid,
                                        name: ('LBL_' + table[field].options + '_' + option).toUpperCase()
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
                                            this.language.addLabel(('LBL_' + table[field].options + '_' + option).toUpperCase(), apl[language].global[table[field].options][option]);
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
                                            this.language.addLabel(('LBL_' + table[field].options + '_' + option).toUpperCase(), apl[language].custom[table[field].options][option]);
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
     */
}
