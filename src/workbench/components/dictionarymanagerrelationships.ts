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
import {Relationship} from "../interfaces/dictionarymanager.interfaces";


@Component({
    selector: 'dictionary-manager-relationships',
    templateUrl: '../templates/dictionarymanagerrelationships.html',
})
export class DictionaryManagerRelationships {

    public currentRelationship: Relationship;

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryrelationships() {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.dictionaryrelationships.filter(r => r.deleted == 0 && (r.lhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition || r.rhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryRelationshipsForTemplates(): any[] {
        let relatedRelationships: any[] = [];

        for(let item of this.dictionarymanager.dictionaryitems.filter(d => d.deleted == 0 && d.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)){
            let relRelationships = this.dictionarymanager.dictionaryrelationships.filter(d => d.deleted == 0 && (d.lhs_sysdictionarydefinition_id == item.sysdictionary_ref_id || d.rhs_sysdictionarydefinition_id == item.sysdictionary_ref_id));
            if(relRelationships.length > 0) {
                relatedRelationships.push({
                    relatedTemplateId: item.sysdictionary_ref_id,
                    relationships: relRelationships
                });
            }
        }

        return relatedRelationships;
    }


    /**
     * translates the template name
     * @param indexname
     */
    public translateRelationshipName(indexname: string){
        return indexname.replace('{tablename}', this.dictionarymanager.getCurrentDefinition().tablename);
    }

    /**
     * react to the click to add a new dictionary definition
     */
    public addDictionaryRelationship(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerRelationshipAdd', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    public deleteDictionaryRelationship(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.dictionarymanager.dictionaryrelationships.find(f => f.id == id).deleted = 1;
                if (this.dictionarymanager.currentDictionaryRelationship == id) {
                    this.dictionarymanager.currentDictionaryRelationship == null;
                    this.currentRelationship = null;
                }
            }
        });
    }

    /**
     * determines the side of the relationship
     *
     * @param relationship
     */
    public isLeft(relationship: Relationship) {
        return relationship.lhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition;
    }

    /**
     * sets the current active id
     *
     * @param id
     */
    public setActiveId(id) {
        this.dictionarymanager.currentDictionaryRelationship = id;
        this.currentRelationship = this.dictionarymanager.dictionaryrelationships.find(r => r.id == id);
    }


}
