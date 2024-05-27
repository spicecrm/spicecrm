/**
 * @module WorkbenchModule
 */
import {Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {
    DictionaryDatabaseField,
    DictionaryDefinition,
    DictionaryIndex,
    DictionaryIndexItem,
    DictionaryItem,
    Relationship, RelationshipField, RelationshipPolymorph,
    RelationshipRelateField,
    RelationshipType
} from "../interfaces/dictionarymanager.interfaces";
import {DomainDefinition, DomainField} from "../interfaces/domainmanager.interfaces";
import {configurationService} from "../../services/configuration.service";
import {toast} from "../../services/toast.service";
import {navigation} from "../../services/navigation.service";
import {Observable, Subject} from "rxjs";

@Injectable()
export class dictionarymanager {

    /**
     * reserved words in PL(SQL
     *
     * removed PACKAGE since this is widely used
     * removed DATE as it might be a compound field
     *
     * todo: determine what we do with these fields
     *
     */
        // public reservedwords = ['ALL', 'ALTER', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 'AT', 'AUTHID', 'AVG', 'BEGIN', 'BETWEEN', 'BINARY_INTEGER', 'BODY', 'BOOLEAN', 'BULK', 'BY', 'CHAR', 'CHAR_BASE', 'CHECK', 'CLOSE', 'CLUSTER', 'COALESCE', 'COLLECT', 'COMMENT', 'COMMIT', 'COMPRESS', 'CONNECT', 'CONSTANT', 'CREATE', 'CURRENT', 'CURRVAL', 'CURSOR', 'DAY', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DELETE', 'DESC', 'DISTINCT', 'DO', 'DROP', 'ELSE', 'ELSIF', 'END', 'EXCEPTION', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXIT', 'EXTENDS', 'EXTRACT', 'FALSE', 'FETCH', 'FLOAT', 'FOR', 'FORALL', 'FROM', 'FUNCTION', 'GOTO', 'GROUP', 'HAVING', 'HEAP', 'HOUR', 'IF', 'IMMEDIATE', 'IN', 'INDEX', 'INDICATOR', 'INSERT', 'INTEGER', 'INTERFACE', 'INTERSECT', 'INTERVAL', 'INTO', 'IS', 'ISOLATION', 'JAVA', 'LEVEL', 'LIKE', 'LIMITED', 'LOCK', 'LONG', 'LOOP', 'MAX', 'MIN', 'MINUS', 'MINUTE', 'MLSLABEL', 'MOD', 'MODE', 'MONTH', 'NATURAL', 'NATURALN', 'NEW', 'NEXTVAL', 'NOCOPY', 'NOT', 'NOWAIT', 'NULL', 'NULLIF', 'NUMBER', 'NUMBER_BASE', 'OCIROWID', 'OF', 'ON', 'OPAQUE', 'OPEN', 'OPERATOR', 'OPTION', 'OR', 'ORDER', 'ORGANIZATION', 'OTHERS', 'OUT', 'PARTITION', 'PCTFREE', 'PLS_INTEGER', 'POSITIVE', 'POSITIVEN', 'PRAGMA', 'PRIOR', 'PRIVATE', 'PROCEDURE', 'PUBLIC', 'RAISE', 'RANGE', 'RAW', 'REAL', 'RECORD', 'REF', 'RELEASE', 'RETURN', 'REVERSE', 'ROLLBACK', 'ROW', 'ROWID', 'ROWNUM', 'ROWTYPE', 'SAVEPOINT', 'SECOND', 'SELECT', 'SEPERATE', 'SET', 'SHARE', 'SMALLINT', 'SPACE', 'SQL', 'SQLCODE', 'SQLERRM', 'START', 'STDDEV', 'SUBTYPE', 'SUCCESSFUL', 'SUM', 'SYNONYM', 'SYSDATE', 'TABLE', 'THEN', 'TIME', 'TIMESTAMP', 'TIMEZONE_ABBR', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TIMEZONE_REGION', 'TO', 'TRIGGER', 'TRUE', 'TYPE', 'UI', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'USER', 'VALIDATE', 'VALUES', 'VARCHAR', 'VARCHAR2', 'VARIANCE', 'VIEW', 'WHEN', 'WHENEVER', 'WHERE', 'WHILE', 'WITH', 'WORK', 'WRITE', 'YEAR', 'ZONE'];
    public reservedwords = [];

    /**
     * keyword words in PL(SQL
     * todo: determine what we do with these fields
     */
    public keywords = [];


    /**
     * sets the allowed change scope
     */
    public changescope: 'all' | 'custom' | 'none' = 'none';

    /**
     * the loaded list of domains
     */
    public domaindefinitions: DomainDefinition[] = [];

    /**
     * the loaded list of domains
     */
    public domainfields: DomainField[] = [];

    /**
     * the loaded list of dictionaryDefinitions
     */
    public dictionarydefinitions: DictionaryDefinition[] = [];

    /**
     * the dictionary items
     */
    public dictionaryitems: DictionaryItem[] = [];

    /**
     * the dictionary items
     */
    public dictionaryfields: any[] = [];

    /**
     * the loaded list of dictionaryDefinitions
     */
    public dictionarydatabasefields: DictionaryDatabaseField[] = [];

    /**
     * the dictionary relationshiptypes
     */
    public dictionaryrelationshiptypes: RelationshipType[] = [];

    /**
     * the dictionary relationships
     */
    public dictionaryrelationships: Relationship[] = [];

    /**
     * the dictionary relationships
     */
    public dictionaryrelationshippolymorphs: RelationshipPolymorph[] = [];

    /**
     * the additonal relationship fields for the n:m relationships
     */
    public dictionaryrelationshipfields: RelationshipField[] = [];

    /**
     * the dictionary relationships
     */
    public dictionaryrelationshiprelatefields: RelationshipRelateField[] = [];

    /**
     * the dictionary relationships
     */
    public dictionaryindexes: DictionaryIndex[] = [];

    /**
     * the dictionary relationships
     */
    public dictionaryindexitems: DictionaryIndexItem[] = [];

    /**
     * the currently selected dictionary element
     */
    public currentDictionaryDefinition: string;

    /**
     * the currently selected dictionary item
     */
    public currentDictionaryItem: string;

    /**
     * the currently selected dictionary index
     */
    public currentDictionaryIndex: string;

    /**
     * the currently selected relationship
     */
    public currentDictionaryRelationship: string;

    /**
     * the JSON with the loaded definitons to determine the changes
     */
    public loaded: string;

    /**
     * settings loaded from teh backedn
     */
    public settings: any;

    constructor(public backend: backend,
                public metadata: metadata,
                public language: language,
                public modelutilities: modelutilities,
                public navigation: navigation,
                public toast: toast,
                public modal: modal,
                public configurationService: configurationService) {
        this.loadDictionaryDefinitions();
        this.loadDictionaryFields();
        this.loadWords();

        // set teh change scope
        this.changescope = this.configurationService.getCapabilityConfig('core').edit_mode;
    }


    /**
     * update the input relationship in the relationship array
     * @param relationship
     */
    public updateRelationshipInArray(relationship: Relationship) {
        const idx = this.dictionaryrelationships.findIndex(r => r.id == relationship.id);
        this.dictionaryrelationships[idx] = {...relationship};
        // trigger the change detection
        this.dictionaryrelationships= [...this.dictionaryrelationships];

    }

    /**
     * push a new relationship to the relationship array
     * @param relationship
     */
    public pushNewRelationshipToArray(relationship: Relationship) {
        this.dictionaryrelationships = [...this.dictionaryrelationships, {...relationship}];
    }

    /**
     * called from the navigation service to prompt navigate away modal
     */
    public isDirty() {

        let changed = false;

        if(!this.loaded) return changed;

        const loaded = JSON.parse(this.loaded);

        const keys = [
            'dictionarydefinitions',
            'dictionaryitems',
            'dictionaryrelationships',
            'dictionaryrelationshiprelatefields',
            'dictionaryindexes',
            'dictionaryindexitem'
        ];

        keys.forEach(key => {

            if (!Array.isArray(this[key])) return;

            this[key].forEach(rec => {
                const existing = loaded[key].find(d => d.id == rec.id);
                if (!existing || (existing && JSON.stringify(existing) != JSON.stringify(rec))) {
                    changed = true;
                }
            });
        });

        return changed;
    }

    /**
     * the currently selected dictionary definition scope
     */
    get currentDictionaryScope(): 'c'|'g'{
        return this.currentDictionaryDefinition ? this.dictionarydefinitions.find(i => i.id == this.currentDictionaryDefinition).scope : 'g';
    }

    /**
     * renders a modal that prompts confimration and enables dropping of the item
     *
     * @param messge
     */
    public promptDelete(messge:string): Observable<string>{
        let retSubject = new Subject<string>();
        this.modal.openModal('DictionaryManagerDeleteModal').subscribe({
            next: (componentRef) => {
                componentRef.instance.message = messge;
                componentRef.instance.responseSubject = retSubject;
            }
        })
        return retSubject.asObservable();
    }

    /**
     * returns true if the current definition is a template
     */
    public currentIsTemplate(){
        return  this.currentDictionaryDefinition && this.dictionarydefinitions.find(d => d.id == this.currentDictionaryDefinition)?.sysdictionary_type == 'template';
    }

    /**
     * returns the current definition object
     */
    public getCurrentDefinition(){
        if(!this.currentDictionaryDefinition)  return null;

        return this.dictionarydefinitions.find(d => d.id == this.currentDictionaryDefinition);
    }

    /**
     * load the domains
     */
    public loadDictionaryDefinitions() {
        let awaitModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest('dictionary/definitions').subscribe({
            next: (res) => {

                this.domaindefinitions = res.domaindefinitions;
                this.domainfields = res.domainfields;
                this.dictionarydefinitions = res.dictionarydefinitions;
                this.dictionaryitems = res.dictionaryitems;
                this.dictionaryrelationshiptypes = res.dictionaryrelationshiptypes;
                this.dictionaryrelationships = res.dictionaryrelationships;
                this.dictionaryrelationshippolymorphs = res.dictionaryrelationshippolymorphs;
                this.dictionaryrelationshiprelatefields = res.dictionaryrelationshiprelatefields;
                this.dictionaryrelationshipfields = res.dictionaryrelationshipfields;
                this.dictionaryindexes = res.dictionaryindexes;
                this.dictionaryindexitems = res.dictionaryindexitems;

                // add the settings if we have them
                this.settings = res.settings;

                this.loaded = JSON.stringify(res);
                awaitModal.emit(true);
            },
            error: () =>{
                awaitModal.emit(true);
            }
        });
    }

    /**
     * load the fields
     */
    public loadDictionaryFields() {
        this.backend.getRequest('dictionary/fields').subscribe({
            next: (fields) => {
                this.dictionaryfields = fields
            }
        });
    }

    /**
     * load the fields sotred in the database
     */
    public loadDatabaseFields(dictionaryname) {
        this.dictionarydatabasefields = [];
        // check if we have a template
        if(this.currentIsTemplate()) return;
        this.backend.getRequest(`dictionary/columns/${dictionaryname}`).subscribe({
            next: (fields) => {
                this.dictionarydatabasefields = fields
            }
        });
    }

    /**
     * returns the reserved words for all database types
     */
    public loadWords() {
        if (!this.configurationService.getData('spicewords')) {
            this.backend.getRequest('dictionary/spicewords').subscribe(res => {
                this.reservedwords = res.reservedwords;
                this.keywords = res.keywords;
                this.configurationService.setData('spicewords', res);
            });
        } else {
            this.reservedwords = this.configurationService.getData('spicewords').reservedwords;
            this.keywords = this.configurationService.getData('spicewords').keywords;
        }
    }


    /**
     * returns based on the scope if an item can be changed
     * @param scope
     */
    public canChange(scope: string) {
        return true;

        // if we have all ... we can change
        if (this.changescope == 'all') return true;

        // if we have custom we can only change custom
        if (this.changescope == 'custom' && scope == 'c') {
            // this.currentDictionaryScope = 'c';
            return true;
        }

        // otherwise no change
        return false;
    }

    /**
     * returns the default scope for the new entries
     */
    get defaultScope() {
        return this.changescope == 'all' ? 'g' : 'c';
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
     * returns the domain name for the given id
     *
     * @param domainid
     */
    public getDomainName(domainid) {
        let d = this.domaindefinitions.find(d => d.id == domainid);
        return d ? d.name : domainid;
    }

    /**
     * returns the domain name for the given id
     *
     * @param domainid
     */
    public getDictionaryDefinitionName(refid) {
        let d = this.dictionarydefinitions.find(d => d.id == refid);
        return d ? d.name : refid;
    }


    /**
     * returns the dictionary item name for the given id
     *
     * @param domainid
     */
    public getDictionaryItemName(refid) {
        let d = this.dictionaryitems.find(d => d.id == refid);
        return d ? d.name : refid;
    }


    /**
     * returns all items (recurisively for a given id
     *
     * @param refid
     */
    public getDictionaryDefinitionItems(refid) {
        let itemsArray: any[] = [];

        for (let item of this.dictionaryitems.filter(i => i.sysdictionarydefinition_id == refid).sort((a, b) => a.sequence > b.sequence ? 1 : -1)) {
            if (item.sysdictionary_ref_id && item.sysdictionary_ref_id != refid) {
                itemsArray = itemsArray.concat(this.getDictionaryDefinitionItems(item.sysdictionary_ref_id));
            } else if (!item.sysdictionary_ref_id) {
                itemsArray.push(item);
            }
        }

        return itemsArray;
    }

    /**
     * save the settings
     */
    public save() {
        let changes = this.determineChangedRecords();
        this.backend.postRequest('dictionary/definitions', {}, changes).subscribe({
            next: res => {
                this.loaded = JSON.stringify(res);
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }

    /**
     * check which records are changed
     */
    public determineChangedRecords() {
        let loaded = JSON.parse(this.loaded);
        let changed = {
            dictionarydefinitions: [],
            dictionaryitems: [],
            dictionaryrelationships: [],
            dictionaryrelationshiprelatefields: [],
            dictionaryindexes: [],
            dictionaryindexitems: []
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
     *
     * @param definition
     */
    public repairDictionary(definitionid) {
        let awaitModal =  this.modal.await('LBL_EXECUTING');
        let definition = this.dictionarydefinitions.find(d => d.id == definitionid)
        this.backend.putRequest(`dictionary/definition/${definitionid}/repair`).subscribe({
            next: (result) => {
                if (result.success) {
                    this.handleAfterActivate();
                    this.toast.sendToast(this.language.getLabel('LBL_DICTIONARY_REPAIRED'), 'success', result.sql, !result.sql);
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_NO_DATA'), 'error', result.msg);
                }
                awaitModal.emit(true);
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERROR repairing dictonaray'), 'error');
                awaitModal.emit(true);
            }
        });
    }

    /**
     *
     * @param definition
     */
    public reshuffleDictionary(definitionid, fields) {
        let awaitModal =  this.modal.await('LBL_EXECUTING');
        let definition = this.dictionarydefinitions.find(d => d.id == definitionid)
        this.backend.putRequest(`dictionary/definition/${definitionid}/reshuffle`, {}, fields).subscribe({
            next: (result) => {
                if (result.success) {
                    this.toast.sendToast(this.language.getLabel('LBL_DICTIONARY_reshuffled'), 'success', result.sql, !result.sql);
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_NO_DATA'), 'error', result.msg);
                }
                awaitModal.emit(true);
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERROR reshuffling dictonaray'), 'error');
                awaitModal.emit(true);
            }
        });
    }

    /**
     *
     * @param definition
     */
    public repairDictionaryOld(definitionid) {
        let awaitModal =  this.modal.await('LBL_REPAIRING');
        let definition = this.dictionarydefinitions.find(d => d.id == definitionid)
        this.backend.postRequest('admin/repair/dictionary', {}, {dictionaries: [definition.name]}).subscribe({
            next: (result) => {
                if (result.success) {
                    this.toast.sendToast(this.language.getLabel('LBL_DICTIONARY_REPAIRED'), 'success', result.sql, !result.sql);
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_NO_DATA'), 'error', result.msg);
                }
                awaitModal.emit(true);
            },
            error: () => {
                this.toast.sendToast(this.language.getLabel('ERROR repairing dictonaray'), 'error');
                awaitModal.emit(true);
            }
        });
    }

    /**
     * reload fielddefs frontend cache
     */
    public handleAfterActivate() {
        this.configurationService.reloadTaskData('fielddefs');
    }

    /**
     * repair template related dictionaries
     */
    public repairTemplateRelatedDictionaries() {
        this.modal.confirm('MSG_REPAIR_DICTIONARY_TEMPLATE_RELATED_DICTIONARIES', 'MSG_REPAIR_DICTIONARY_TEMPLATE_RELATED_DICTIONARIES').subscribe(answer => {

            if (!answer) return;

            const reparing = this.modal.await('LBL_REPAIRING');
            this.backend.putRequest(`dictionary/template/${this.currentDictionaryDefinition}/repairrelated`).subscribe({
                next: () => {
                    reparing.next(true);
                    reparing.complete();
                    this.toast.sendToast('LBL_DICTIONARY_REPAIRED', 'success');
                },
                error: err => {
                    reparing.next(true);
                    reparing.complete();
                    this.toast.sendToast(`${this.language.getLabel('ERROR repairing dictionary')}: ${err.error.error.message}`, 'error');
                }
            });

        });
    }

    ngOnDestroy(): void {
    }

}
