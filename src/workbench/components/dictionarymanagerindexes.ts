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
import {DictionaryIndex, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

/**
 * displays the indexes related to the dictionary definition selected
 */
@Component({
    selector: 'dictionary-manager-indexes',
    templateUrl: '../templates/dictionarymanagerindexes.html',
})
export class DictionaryManagerIndexes {

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryIndexes(): DictionaryIndex[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        let objectIndexes =  this.dictionarymanager.dictionaryindexes.filter(d => d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition);

        return objectIndexes.sort((a, b) => a.name.localeCompare(b.name) ? 1 : -1);
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryIndexesForTemplates(): any[] {
        let relatedindexes: any[] = [];

        for(let item of this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)){
            let relIndexes = this.dictionarymanager.dictionaryindexes.filter(d => d.sysdictionarydefinition_id == item.sysdictionary_ref_id);
            if(relIndexes.length > 0) {
                relatedindexes.push({
                    relatedTemplateId: item.sysdictionary_ref_id,
                    indexes: relIndexes
                });
            }
        }

        return relatedindexes;
    }

    /**
     * returns the status of the current definiton
     *
     * we can only activate when the definition is active as well
     */
    get definitionStatus(){
        return this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).status;
    }

    /**
     * sets the status and also cfreates or drops the index
     *
     * @param index
     * @param status
     */
    public setStatus(index, status){
        let loadingModal;
        switch(status){
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/index/${index.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        index.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/index/${index.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        index.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                index.status = status;
        }
    }

    public translateIndexName(indexname: string){
        return indexname.replace('{tablename}', this.dictionarymanager.getCurrentDefinition().tablename);
    }

    /**
     * react to the click to add a new dictionary definition
     */
    public addIndex(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerIndexAddType', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    public deleteIndex(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let deleteModal = this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`dictionary/index/${id}`).subscribe({
                    next: (res) => {
                        let i = this.dictionarymanager.dictionaryindexes.findIndex(f => f.id == id);
                        this.dictionarymanager.dictionaryindexes.splice(i, 1);
                        // handle the items
                        this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == id).forEach(i => {
                            let index = this.dictionarymanager.dictionaryindexitems.findIndex(ti => ti.id == i.id);
                            this.dictionarymanager.dictionaryindexitems.splice(index, 1);
                        })
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
     * returns a list of index fields
     * @param indexid
     * @private
     */
    public getIndexFields(indexid: string): string {
        let indexfields = [];

        for (let field of this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == indexid).sort((a, b) => a.sequence > b.sequence ? 1 : -1)) {
            let name = this.dictionarymanager.dictionaryitems.find(di => di.id == field.sysdictionaryitem_id)?.name;
            if (name) indexfields.push(name);
        }

        return indexfields.join();
    }

    /**
     * sets the current active id
     *
     * @param id
     */
    public setActiveId(id) {
        this.dictionarymanager.currentDictionaryIndex = id;
    }
}
