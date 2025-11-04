/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, OnDestroy, OnInit
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
import {Subscription} from "rxjs";
import {DictionaryManagerFieldDefinitionModal} from "./dictionarymanagerfielddefinitionmodal";

@Component({
    selector: 'dictionary-manager-fields',
    templateUrl: '../templates/dictionarymanagerfields.html',
    standalone: false
})
export class DictionaryManagerFields implements OnInit, OnDestroy {

    /**
     * the curretn dictionaryitem
     */
    public dictionaryitem: DictionaryItem;
    public dictionaryitems: DictionaryItem[];

    public filterterm: string = '';

    public filterdbonly: boolean = false;

    private subscription: Subscription = new Subscription();

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    public ngOnInit() {
        this.dictionaryitems = this.buildDictionaryitems();
        this.subscription = this.dictionarymanager.currentDictionaryFields$.subscribe(
            () => this.dictionaryitems = this.buildDictionaryitems()
        );
    }

    public ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * gets all non deleted entries sorted by name
     */
    public buildDictionaryitems(): DictionaryItem[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        // get the active definition
        let definitions: DictionaryItem[] = [...this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition).filter(d => d.status == 'a')];
        definitions.forEach(s => {
            // get the domainfield and set non_db
            let domainField = this.getDomainFields(s.sysdomaindefinition_id, true);
            if(domainField[0]?.dbtype == 'non-db') s.non_db = 1;

            s.defined = true;
            s.database = false;


            // get the additonbal domain fields
            s.addFields = this.getDomainFields(s.sysdomaindefinition_id, false).map(a => {
                a.defined = true;
                a.database = false;
                return a;
            });
        });

        // push legacy vardef fields
        const vardefDictionary = this.dictionarymanager.vardefFields[this.dictionarymanager.getCurrentDefinition().name];

        if (vardefDictionary) {

            Object.values(vardefDictionary.fields).forEach((f: any) => {

                const def = definitions.find(d => {
                    if (d.name == f.name) return true;
                    return d.addFields && d.addFields.find(a => this.translateDomainField(a.name, d) == f.name);
                });

                if (!def && !!f.name) {
                    definitions.push({
                        id: this.modelutilities.generateGuid(),
                        name: f.name,
                        scope: 'g',
                        status: 'a',
                        non_db: f.source == 'non-db' ? 1 : 0,
                        sequence: definitions.length + 1,
                        sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
                        sysdictionaryrelationship_id: null,
                        defined: false,
                        isVardef: true,
                        database: false,
                    })
                }
            });
        }

        // get the database fields
        this.dictionarymanager.dictionarydatabasefields.forEach(f => {
            let def = definitions.find(d => {
                if (d.name == f.name) return true;
                return d.addFields && d.addFields.find(a => this.translateDomainField(a.name, d) == f.name);
            });
            if (!def) {
                definitions.push({
                    id: '',
                    name: f.name,
                    scope: 'g',
                    status: 'a',
                    sequence: definitions.length + 1,
                    sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
                    defined: false,
                    database: true
                })
            } else {
                if (def.name == f.name) {
                    def.database = true;
                } else {
                    def.addFields.find(a => this.translateDomainField(a.name, def) == f.name).database = true
                }
            }
        });

        // filter and sort the result
        return definitions.filter(d => {
            if(this.filterdbonly && (d.non_db && !d.addFields)) return false;
            return true;
        }); // .sort((a, b) => a.name.localeCompare(b.name));

    }

    public filterDictionaryItems(): any[] {
        return this.dictionaryitems.filter(item => {
            const name = item?.name.toLowerCase();
            const domain = this.dictionarymanager.getDomainName(item.sysdomaindefinition_id)?.toLowerCase();
            const type = this.getDomainType(item.sysdomaindefinition_id)?.toLowerCase();
            const source = item.sysdictionarydefinition_id !== this.dictionarymanager.currentDictionaryDefinition
                ? this.getRefDefinitionName(item.sysdictionarydefinition_id).toLowerCase()
                : this.getRelationshipName(item.sysdictionaryrelationship_id)?.toLowerCase();

            const searchTerm = this.filterterm.toLowerCase();

            const searchArr = [name, domain, type, source];

            return searchArr.some(search => search?.includes(searchTerm));
        });
    }

    public getRowClass(item: DictionaryItem){
        // all OK
        if(item.defined && (item.non_db || item.database)) return 'slds-theme--success';

        // db only
        if(item.database && !item.defined && !item.isVardef) return 'slds-theme--error';

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
     * returns the fields for the type
     *
     * @param domaindefinitionid might be null when a dictionary template is used as dictionary item
     */
    public getDomainType(domaindefinitionid: string|null) {
        const matchingField = this.dictionarymanager.domainfields.find(df => df.sysdomaindefinition_id === domaindefinitionid);
        return matchingField?.fieldtype
    }

    /**
     * checks if we have any items to be repaired
     */
    get canRepair(){
        return this.dictionaryitems.filter(d => (!d.non_db && ! d.database) || (d.defined)).length > 0
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
    }

    /**
     * checks if we have any items to be repaired
     */
    get canDelete(){
        return this.dictionaryitems.filter(item => item.database && !item.defined).length > 0
    }

    /**
     * trigger the repair of the dictionary
     * @param definition
     */
    public deleteDictionaryColumns() {
        this.modal.openModal('DictionaryManagerDeleteFieldsModal', true, this.injector).subscribe({
            next: (ref) => {
                ref.instance.items = this.dictionaryitems.filter(item => item.database && !item.defined);
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
     * @param dictionaryItem
     */
    public translateDomainField(fieldName, dictionaryItem): string {
        return this.dictionarymanager.translateDomainFieldName(fieldName, dictionaryItem);
    }

    public trackByFn(index, item) {
        return item.id;
    }

    /**
     * open field definition modal
     * @param item
     */
    public openFieldDefinitionModal(item : DictionaryItem) {

        this.modal.openStaticModal(DictionaryManagerFieldDefinitionModal, true, this.injector).subscribe(modalRef => {
            modalRef.instance.dictionaryItem = item;
            if (item.isVardef) {
                modalRef.instance.definition = this.dictionarymanager.vardefFields[this.dictionarymanager.getCurrentDefinition().name].fields[item.name];
            }
        });
    }
}
