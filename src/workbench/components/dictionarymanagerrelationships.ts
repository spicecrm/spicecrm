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
    templateUrl: './src/workbench/templates/dictionarymanagerrelationships.html',
})
export class DictionaryManagerRelationships {

    private currentRelationship: Relationship;

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

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
     * react to the click to add a new dictionary definition
     */
    private addDictionaryRelationship(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerRelationshipAdd', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    private deleteDictionaryRelationship(event: MouseEvent, id: string) {
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
    private isLeft(relationship: Relationship) {
        return relationship.lhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition;
    }

    /**
     * sets the current active id
     *
     * @param id
     */
    private setActiveId(id) {
        this.dictionarymanager.currentDictionaryRelationship = id;
        this.currentRelationship = this.dictionarymanager.dictionaryrelationships.find(r => r.id == id);
    }


}
