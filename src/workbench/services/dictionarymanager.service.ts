/**
 * @module WorkbenchModule
 */
import {EventEmitter, Injectable} from "@angular/core";
import {backend} from '../../services/backend.service';
import {language} from '../../services/language.service';
import {modelutilities} from '../../services/modelutilities.service';
import {metadata} from '../../services/metadata.service';

@Injectable()
export class dictionarymanager {

    /**
     * the loaded list of domains
     */
    public domaindefinitions: any[] = [];

    /**
     * the loaded list of dictionaryDefinitions
     */
    public dictionarydefinitions: any[] = [];

    /**
     * the dictionary items
     */
    public dictionaryitems: any[] = [];

    /**
     * the dictionary items
     */
    public dictionaryrelations: any[] = [];

    /**
     * the currently seleted domain element
     */
    public currentDictionaryDefinition: string;

    /**
     * the currently selected item
     */
    public currentDictionaryItem: string;

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
        this.backend.getRequest('system/dictionary/definitions').subscribe(res => {

            this.domaindefinitions = res.domaindefinitions;
            this.dictionarydefinitions = res.dictionarydefinitions;
            this.dictionaryitems = res.dictionaryitems;

            this.loaded = JSON.stringify(res);
        });
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
    public getTemplateName(refid) {
        let d = this.dictionarydefinitions.find(d => d.id == refid);
        return d ? d.name : refid;
    }

    private setActivItem(id){

    }

    /**
     * save the settings
     */
    public save() {
        let changes = this.determineChangedRecords();
        this.backend.postRequest('system/dictionary/definitions', {}, changes);
    }

    /**
     * check which records are changed
     */
    private determineChangedRecords() {
        let loaded = JSON.parse(this.loaded);
        let changed = {
            dictionarydefinitions: [],
            dictionaryitems: []
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
