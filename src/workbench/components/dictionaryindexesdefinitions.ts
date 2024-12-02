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
import {DictionaryDefinition, DictionaryIndex} from "../interfaces/dictionarymanager.interfaces";

/**
 * list the available dictionary definitions
 */
@Component({
    selector: 'dictionary-indexes-definitions',
    templateUrl: '../templates/dictionaryindexesdefinitions.html',
})
export class DictionaryIndexesDefinitions {

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


    public _isExpanded: boolean = false;

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
    get dictionaryindexesdefinitions(): DictionaryIndex[] {

        return this.dictionarymanager.dictionaryindexes.filter(d => {
            // no indexes from templates
            if(this.dictionarymanager.dictionarydefinitions.find(def => def.id == d.sysdictionarydefinition_id).sysdictionary_type == 'template') return false;
            // if we have a type filter apply it
            if(this.definitionfiltertype && d.indextype != this.definitionfiltertype) return false;
            // if we have a term filter apply it
            if(this.definitionfilterterm && !(d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0 || (d.name && d.name.toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0) || (this.dictionarymanager.getDictionaryDefinitionTableName(d.sysdictionarydefinition_id).toLowerCase().indexOf(this.definitionfilterterm.toLowerCase()) >= 0))) return false;
            // if scope is set apply scope Filter
            if(this.definitionfilterscope != '' && d.scope != this.definitionfilterscope) return false;
            // if scope is set apply status Filter
            if(this.definitionfilterstatus != '' && d.status != this.definitionfilterstatus) return false;
            // otherwise list it
            return true;
        }).sort((a, b) => a.name.localeCompare(b.name));

    }

    /**
     * sets the status and also creates or drops the index
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
    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    public delete(id: string) {
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
     * open edit dictionary definition
     */
    public editDictionaryIndex(index: DictionaryIndex) {
        this.modal.openModal('DictionaryManagerIndexEdit', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.index = index;
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

}
