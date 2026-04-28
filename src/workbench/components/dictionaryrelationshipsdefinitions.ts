/**
 * @module WorkbenchModule
 */
import {
    Component, EventEmitter, Injector, Output, ViewChild, ViewContainerRef
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {
    DictionaryDefinition,
    DictionaryIndex,
    Relationship,
    RelationshipPolymorph
} from "../interfaces/dictionarymanager.interfaces";
import {DictionaryRelationships} from "./dictionaryrelationships";

/**
 * list the available dictionary definitions
 */
@Component({
    selector: 'dictionary-relationships-definitions',
    templateUrl: '../templates/dictionaryrelationshipsdefinitions.html',
    standalone: false
})
export class DictionaryRelationshipsDefinitions {

    /**
     * a filter term to filter the list by
     *
     * @private
     */
    public definitionfilterterm: string;

    /**
     * a type to filter the list by
     *
     * @private
     */
    public definitionfiltertype: string = '';
    /**
     * a filter for the scopes
     */
    public definitionfilterscope: ''|'g'|'c' = '';
    /**
     * a filter fot the status
     */
    public definitionfilterstatus: ''|'i' | 'd' | 'a' = '';

    @Output() public expanded: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public dictionarymanager: dictionarymanager,
                public metadata: metadata,
                public language: language,
                public modal: modal,
                public injector: Injector,
                public modelutilities: modelutilities,
                public backend: backend) {
    }


    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryrelationships(): Relationship[] {

        return this.dictionarymanager.dictionaryrelationships.filter(r => {
            // if we have a type filter apply it
            if(this.definitionfiltertype && r.relationship_type != this.definitionfiltertype) return false;
            // if we have a term filter apply it
            if(this.definitionfilterterm && !(r.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0 || (r.name && r.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0) )) return false;
            // if scope is set apply scope Filter
            if(this.definitionfilterscope != '' && r.scope != this.definitionfilterscope) return false;
            // if scope is set apply status Filter
            if(this.definitionfilterstatus != '' && r.status != this.definitionfilterstatus) return false;
            // otherwise list it
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));

    }

    /**
     * returns the polymorphs
     *
     * @param relationship
     */
    public getPolymorphDefinitions(relationship): RelationshipPolymorph[]    {
        return this.dictionarymanager.dictionaryrelationshippolymorphs.filter(p => p.relationship_id == relationship.id).sort((a, b) => this.dictionarymanager.getDictionaryDefinitionTableName(a.lhs_sysdictionarydefinition_id).localeCompare(this.dictionarymanager.getDictionaryDefinitionTableName(b.lhs_sysdictionarydefinition_id)));
    }

    /**
     * sets the status and also creates or drops the index
     *
     * @param index
     * @param status
     */
    public setStatus(relationship, status){
        let loadingModal;
        switch(status){
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/relationship/${relationship.id}/activate`).subscribe({
                    next: () => {
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

    /**
     * prompts the user and delets the relationship
     *
     * @param event
     * @param id
     */
    public delete(id: string) {
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let deleteModal = this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`dictionary/relationship/${id}`).subscribe({
                    next: (res) => {
                        let i = this.dictionarymanager.dictionaryrelationships.findIndex(f => f.id == id);
                        this.dictionarymanager.dictionaryrelationships.splice(i, 1);
                        deleteModal.emit(true);
                    },
                    error: () => {
                        deleteModal.emit(true);
                    }
                });
            }
        });
    }

    /**
     * open edit the relationship
     */
    public editRelationship(relationship: Relationship) {
        /*
        this.modal.openModal('DictionaryManagerIndexEdit', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.index = index;
            }
        });
        */

        let relType = this.dictionarymanager.dictionaryrelationshiptypes.find(rt => rt.name == relationship.relationship_type);
        this.modal.openModal(relType.component_edit, true, this.injector).subscribe(modalRef => {
            modalRef.instance.dictionaryRelationship = relationship;
        });
    }

}
