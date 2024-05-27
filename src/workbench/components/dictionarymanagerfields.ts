/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryDefinition, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {DomainField} from "../interfaces/domainmanager.interfaces";
import {isTemplateMiddle} from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";


@Component({
    selector: 'dictionary-manager-fields',
    templateUrl: '../templates/dictionarymanagerfields.html',
})
export class DictionaryManagerFields {

    /**
     * the curretn dictionaryitem
     */
    public dictionaryitem: DictionaryItem;

    public filterterm: string = '';

    public filterdbonly: boolean = false;

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryitems(): DictionaryItem[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        // get the active definition
        let definitions: DictionaryItem[] = [...this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition).filter(d => d.status == 'a')];
        definitions.forEach(s => {
            // get the domainfield and set non_db
            let domainField = this.getDomainFields(s.sysdomaindefinition_id, true);
            if(domainField[0]?.dbtype == 'non-db') s.non_db = 1;

            s.defined = true;
            s.cached = false;
            s.database = false;

            // get the additonbal domain fields
            s.addFields = this.getDomainFields(s.sysdomaindefinition_id, false);
            s.addFields.forEach(a => {
                // a.name = this.translateDomainField(a.name, s);
                a.defined = true;
                a.cached = false;
                a.database = false;
            })
        });

        // get the cached fields
        let cachedDef = this.dictionarymanager.dictionaryfields.find(f => f.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition);
        if(cachedDef?.fields) {
            cachedDef.fields.forEach(f => {
                let def = definitions.find(d => {
                    if(d.name == f.fieldname) return true;
                    return d.addFields && d.addFields.find(a => this.translateDomainField(a.name, d) == f.fieldname);
                });
                if (!def) {
                    definitions.push({
                        id: f.id,
                        name: f.fieldname,
                        scope: 'g',
                        status: 'a',
                        non_db: f.fielddefinition?.source == 'non-db' ? 1 : 0,
                        sequence: definitions.length + 1,
                        sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
                        sysdictionaryrelationship_id: f.sysdictionaryrelationship_id,
                        defined: !!f.sysdictionaryrelationship_id ? true : false,
                        cached: true,
                        database: false
                    })
                } else {
                    if(def.name == f.fieldname) {
                        def.cached = true;
                    } else {
                        def.addFields.find(a => this.translateDomainField(a.name, def) == f.fieldname).cached = true
                    }
                }
            })
        }

        // get the database fields
        this.dictionarymanager.dictionarydatabasefields.forEach(f =>{
            let def = definitions.find(d => {
                if(d.name == f.name) return true;
                return d.addFields && d.addFields.find(a => this.translateDomainField(a.name, d) == f.name);
            });
            if(!def){
                definitions.push({
                    id: '',
                    name: f.name,
                    scope: 'g',
                    status: 'a',
                    sequence: definitions.length + 1,
                    sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
                    defined: false,
                    cached: false,
                    database: true
                })
            } else {
                if(def.name == f.name) {
                    def.database = true;
                } else {
                    def.addFields.find(a => this.translateDomainField(a.name, def) == f.name).database = true
                }
            }
        })

        // filter and sort the result
        return definitions.filter(d => {
            if(this.filterdbonly && (d.non_db && !d.addFields)) return false;
            if(this.filterterm && d.name.indexOf(this.filterterm) == -1) return false;
            return true;
        }); // .sort((a, b) => a.name.localeCompare(b.name));

    }

    public getRowClass(item: DictionaryItem){
        // all OK
        if(item.defined && item.cached && (item.non_db || item.database)) return 'slds-theme--success';

        // db only
        if(item.database && !item.defined && !item.cached) return 'slds-theme--error';

        return 'slds-theme--warning';
    }

    /**
     * returns the fields for the domain
     *
     * @param domaindefinitionid might be null when a dictionary template is used as dictionary item
     * @private
     */
    public getDomainFields(domaindefinitionid: string|null, first: boolean = true): DomainField[] {
        let fields = this.dictionarymanager.domainfields.filter(df => df.sysdomaindefinition_id == domaindefinitionid).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
        if (fields) {
            return first ? fields.slice(0, 1) : fields.slice(1);
        } else {
            return [];
        }
    }

    /**
     * checks if we have any items to be repaired
     */
    get canRepair(){
        return this.dictionaryitems.filter(d => (!d.non_db && ! d.database) || (d.defined && !d.cached)).length > 0
    }

    /**
     * trigger the repair of the dictionary
     * @param definition
     */
    public repairDictionaryDefinition() {
        this.dictionarymanager.repairDictionary(this.dictionarymanager.currentDictionaryDefinition)
    }


    /**
     * trigger the reshuffle of the dictionary
     * @param definition
     */
    public reshuffleDictionaryDefinition() {
        this.dictionarymanager.reshuffleDictionary(this.dictionarymanager.currentDictionaryDefinition, this.dictionaryitems.map(i => i.name));
    }

    /**
     * reloads database fields and also the cached fields
     */
    public reload(){
        // load the database field
        this.dictionarymanager.loadDatabaseFields(this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).tablename);

        // load the cached fields
        this.dictionarymanager.loadDictionaryFields();
    }

    /**
     * checks if we have any items to be repaired
     */
    get canDelete(){
        return this.dictionaryitems.filter(item => item.database && !item.defined && !item.cached).length > 0
    }

    /**
     * trigger the repair of the dictionary
     * @param definition
     */
    public deleteDictionaryColumns() {
        this.modal.openModal('DictionaryManagerDeleteFieldsModal', true, this.injector).subscribe({
            next: (ref) => {
                ref.instance.items = this.dictionaryitems.filter(item => item.database && !item.defined && !item.cached);
            }
        })
    }

    /**
     * return the name of the template
     *
     * @param dictionarydefinitionid
     * @private
     */
    public getRefDefinitionName(dictionarydefinitionid: string) {
        return dictionarydefinitionid != this.dictionarymanager.currentDictionaryDefinition ? this.dictionarymanager.dictionarydefinitions.find(d => d.id == dictionarydefinitionid)?.name : '';
    }

    /**
     * return the name of the relationship
     *
     * @param dictionaryrelationshipid
     * @private
     */
    public getRelationshipName(dictionaryrelationshipid: string) {
        return this.dictionarymanager.dictionaryrelationships.find(r => r.id == dictionaryrelationshipid)?.relationship_name;
    }

    /**
     * translate the field name
     *
     * @param fieldName
     * @param $dictionaryId
     */
    public translateDomainField(fieldName, dictionaryItem) {
        return fieldName.replace('{sysdictionaryitems.name}', dictionaryItem.name);
    }

    public trackByFn(index, item) {
        return item.id;
    }


}
