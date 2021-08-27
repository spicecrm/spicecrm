/**
 * @module WorkbenchModule
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';
import {
    DictionaryDefinition,
    DictionaryIndex, DictionaryIndexItem,
    DictionaryItem,
    Relationship,
    RelationshipRelateField
} from "../interfaces/dictionarymanager.interfaces";
import {DomainDefinition, DomainField} from "../interfaces/domainmanager.interfaces";

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
    public reservedWords = ['ALL', 'ALTER', 'AND', 'ANY', 'ARRAY', 'AS', 'ASC', 'AT', 'AUTHID', 'AVG', 'BEGIN', 'BETWEEN', 'BINARY_INTEGER', 'BODY', 'BOOLEAN', 'BULK', 'BY', 'CHAR', 'CHAR_BASE', 'CHECK', 'CLOSE', 'CLUSTER', 'COALESCE', 'COLLECT', 'COMMENT', 'COMMIT', 'COMPRESS', 'CONNECT', 'CONSTANT', 'CREATE', 'CURRENT', 'CURRVAL', 'CURSOR', 'DAY', 'DECIMAL', 'DECLARE', 'DEFAULT', 'DELETE', 'DESC', 'DISTINCT', 'DO', 'DROP', 'ELSE', 'ELSIF', 'END', 'EXCEPTION', 'EXCLUSIVE', 'EXECUTE', 'EXISTS', 'EXIT', 'EXTENDS', 'EXTRACT', 'FALSE', 'FETCH', 'FLOAT', 'FOR', 'FORALL', 'FROM', 'FUNCTION', 'GOTO', 'GROUP', 'HAVING', 'HEAP', 'HOUR', 'IF', 'IMMEDIATE', 'IN', 'INDEX', 'INDICATOR', 'INSERT', 'INTEGER', 'INTERFACE', 'INTERSECT', 'INTERVAL', 'INTO', 'IS', 'ISOLATION', 'JAVA', 'LEVEL', 'LIKE', 'LIMITED', 'LOCK', 'LONG', 'LOOP', 'MAX', 'MIN', 'MINUS', 'MINUTE', 'MLSLABEL', 'MOD', 'MODE', 'MONTH', 'NATURAL', 'NATURALN', 'NEW', 'NEXTVAL', 'NOCOPY', 'NOT', 'NOWAIT', 'NULL', 'NULLIF', 'NUMBER', 'NUMBER_BASE', 'OCIROWID', 'OF', 'ON', 'OPAQUE', 'OPEN', 'OPERATOR', 'OPTION', 'OR', 'ORDER', 'ORGANIZATION', 'OTHERS', 'OUT', 'PARTITION', 'PCTFREE', 'PLS_INTEGER', 'POSITIVE', 'POSITIVEN', 'PRAGMA', 'PRIOR', 'PRIVATE', 'PROCEDURE', 'PUBLIC', 'RAISE', 'RANGE', 'RAW', 'REAL', 'RECORD', 'REF', 'RELEASE', 'RETURN', 'REVERSE', 'ROLLBACK', 'ROW', 'ROWID', 'ROWNUM', 'ROWTYPE', 'SAVEPOINT', 'SECOND', 'SELECT', 'SEPERATE', 'SET', 'SHARE', 'SMALLINT', 'SPACE', 'SQL', 'SQLCODE', 'SQLERRM', 'START', 'STDDEV', 'SUBTYPE', 'SUCCESSFUL', 'SUM', 'SYNONYM', 'SYSDATE', 'TABLE', 'THEN', 'TIME', 'TIMESTAMP', 'TIMEZONE_ABBR', 'TIMEZONE_HOUR', 'TIMEZONE_MINUTE', 'TIMEZONE_REGION', 'TO', 'TRIGGER', 'TRUE', 'TYPE', 'UI', 'UNION', 'UNIQUE', 'UPDATE', 'USE', 'USER', 'VALIDATE', 'VALUES', 'VARCHAR', 'VARCHAR2', 'VARIANCE', 'VIEW', 'WHEN', 'WHENEVER', 'WHERE', 'WHILE', 'WITH', 'WORK', 'WRITE', 'YEAR', 'ZONE'];

    /**
     * sets the allowed change scope
     */
    public changescope: 'global' | 'custom' | 'none' = 'global';

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
     * the dictionary relationships
     */
    public dictionaryrelationships: Relationship[] = [];

    /**
     * the additonal relationship fields for the n:m relationships
     */
    public dictionaryrelationshipfields: any[] = [];

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
     * the currently seleted domain element
     */
    public currentDictionaryDefinition: string;

    /**
     * the currently selected item
     */
    public currentDictionaryItem: string;

    /**
     * the currently selected item
     */
    public currentDictionaryIndex: string;

    /**
     * the currently selected relationship
     */
    public currentDictionaryRelationship: string;

    /**
     * the JSON with the loaded definitons to determine the changes
     */
    private loaded: string;

    constructor(private backend: backend, private metadata: metadata, private language: language, private modelutilities: modelutilities) {
        this.loadDictionaryDefinitions();
    }

    /**
     * load the domains
     */
    private loadDictionaryDefinitions() {
        this.backend.getRequest('dictionary/definitions').subscribe(res => {

            this.domaindefinitions = res.domaindefinitions;
            this.domainfields = res.domainfields;
            this.dictionarydefinitions = res.dictionarydefinitions;
            this.dictionaryitems = res.dictionaryitems;
            this.dictionaryrelationships = res.dictionaryrelationships;
            this.dictionaryrelationshiprelatefields = res.dictionaryrelationshiprelatefields;
            this.dictionaryindexes = res.dictionaryindexes;
            this.dictionaryindexitems = res.dictionaryindexitems;

            this.loaded = JSON.stringify(res);
        });
    }

    /**
     * returns based on the scope if an item can be changed
     * @param scope
     */
    public canChange(scope: string) {
        // if we have all ... we can change
        if (this.changescope == 'global') return true;

        // if we have custom we can only change custom
        if (this.changescope == 'custom' && scope == 'c') return true;

        // otherwise no change
        return false;
    }

    /**
     * returns the default scope for the new entries
     */
    get defaultScope() {
        return this.changescope == 'global' ? 'g' : 'c';
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

        for (let item of this.dictionaryitems.filter(i => i.sysdictionarydefinition_id == refid && i.deleted == 0).sort((a, b) => a.sequence > b.sequence ? 1 : -1)) {
            if (item.sysdictionary_ref_id) {
                itemsArray = itemsArray.concat(this.getDictionaryDefinitionItems(item.sysdictionary_ref_id));
            } else {
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
        this.backend.postRequest('dictionary/definitions', {}, changes);
    }

    /**
     * check which records are changed
     */
    private determineChangedRecords() {
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
}
