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

    private loaded: string;

    /**
     * the dbtypes
     */
    public dbtypes = ['varchar', 'text', 'date', 'datetime', 'int', 'double', 'bool'];

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
        for(let globalValidationValue of globalValidationValues){
            if(validationValues.findIndex(v => v.minvalue == globalValidationValue.minvalue) == -1){
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
                    if (table[field].options && table[field].type.includes('enum') && !this.domaindefinitions.find(d => d.name == dtable.toLowerCase() + '_' + field)) {

                        let definitionId = this.modelutilities.generateGuid();
                        this.domaindefinitions.push({
                            id: definitionId,
                            name: dtable.toLowerCase() + '_' + field,
                            scope: 'g',
                            fieldtype: table[field].type,
                            status: 'a',
                            deleted: 0
                        });

                        let validationid = this.modelutilities.generateGuid();
                        this.domainfieldvalidations.push({
                            id: validationid,
                            name: table[field].options,
                            validation_type: 'enum',
                            scope: 'g',
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
                            scope: 'g',
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
                                scope: 'g',
                                status: 'a',
                                deleted: 0
                            });

                            if (option && !this.language.languagedata.applang[('VAL_' + table[field].options + '_' + option).toUpperCase()]) {
                                let labelid = this.modelutilities.generateGuid();
                                this.languagelabels.push({
                                    id: labelid,
                                    name: ('VAL_' + table[field].options + '_' + option).toUpperCase()
                                });
                                for (let language in apl) {
                                    if (apl[language][table[field].options] && apl[language][table[field].options][option]) {
                                        this.languagetranslations.push({
                                            id: this.modelutilities.generateGuid(),
                                            syslanguagelabel_id: labelid,
                                            syslanguage: language,
                                            translation_default: apl[language][table[field].options][option]
                                        });

                                        if (language == this.language.currentlanguage) {
                                            this.language.addLabel(('VAL_' + table[field].options + '_' + option).toUpperCase(), apl[language][table[field].options][option]);
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
