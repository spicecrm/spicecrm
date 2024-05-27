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

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryrelationships() {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.dictionaryrelationships.filter(r => r.deleted == 0 && (r.lhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition || r.rhs_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition || r.join_sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryRelationshipsForTemplates(): any[] {
        let relatedRelationships: any[] = [];

        for(let item of this.dictionarymanager.dictionaryitems.filter(d =>  d.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)){
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
     * prompts the user and deletes the dictionary definition
     *
     * @param event
     * @param id
     */
    public editDictionaryRelationship(event: MouseEvent, relationship: Relationship) {
        event.stopPropagation();
        /*
        this.modal.openModal('DictionaryManagerRelationshipsDetails', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.dictionaryRelationship = relationship;
            }
        })
         */

        let relType = this.dictionarymanager.dictionaryrelationshiptypes.find(rt => rt.name == relationship.relationship_type);
        this.modal.openModal(relType.component_edit, true, this.injector).subscribe(modalRef => {
            modalRef.instance.dictionaryRelationship = relationship;
        });
    }

    /**
     * prompts the user and deletes the dictionary definition
     *
     * @param event
     * @param id
     */
    public deleteDictionaryRelationship(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                this.backend.deleteRequest(`dictionary/relationship/${id}`).subscribe({
                    next: (res) => {
                        // remove the relationship
                        this.dictionarymanager.dictionaryrelationships = this.dictionarymanager.dictionaryrelationships.filter(f => f.id != id);
                        // reset the current selection
                        if (this.dictionarymanager.currentDictionaryRelationship == id) {
                            this.dictionarymanager.currentDictionaryRelationship == null;
                            this.currentRelationship = null;
                        }
                    }
                })
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


    /**
     * sets the status and write the cahced entries ont eh backend
     *
     * @param item
     * @param status
     */
    public setStatus(relationship, status) {
        let loadingModal;
        switch (status) {
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/relationship/${relationship.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        relationship.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/relationship/${relationship.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        relationship.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                relationship.status = status;
        }
    }

    public trackByFn(e, i) {
        return i;
    }
}
