/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, ViewChild
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {DictionaryManagerItemStatus} from "./dictionarymanageritemstatus";


@Component({
    selector: 'dictionary-manager-items',
    templateUrl: '../templates/dictionarymanageritems.html',
})
export class DictionaryManagerItems {


    /**
     * the current dictionaryitem
     */
    public dictionaryitem: DictionaryItem;

    /**
     * boolean if the details panel is expanded
     */
    public detailsExpanded: boolean = false;

    /**
     * a term to filter by
     */
    public filterterm: string;

    constructor(public dictionarymanager: dictionarymanager,
                public backend: backend,
                public metadata: metadata,
                public language: language,
                public modal: modal,
                public injector: Injector,
                public modelutilities: modelutilities) {

    }

    get canShuffle() {
        return this.dictionarymanager.canChange(this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition)?.scope);
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryitems() {
        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.dictionaryitems.filter(d => (d.id == this.dictionarymanager.currentDictionaryItem || !this.filterterm || d.name.toLowerCase().indexOf(this.filterterm.toLowerCase()) >= 0) && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    public getTemplateItems(refId){
        if(!refId) return [];
        return this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionarydefinition_id == refId).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    get itemsliststyle() {
        let height = this.detailsExpanded ? 458 : 79;
        return {
            height: `calc(100% - ${height}px`
        }
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
     * react to the click to add a new dictionary definition
     */
    public addDictionaryItem() {
        this.modal.openModal('DictionaryManagerAddItemModal', true, this.injector);
    }

    /**
     * open the clone modal
     */
    public cloneDefinition(){
        this.modal.openModal('DictionaryManagerCloneDefinitionModal', true, this.injector);
    }

    /**
     * edits the dictionary item
     *
     * @param event
     * @param id
     */
    public editDictionaryItem(item: DictionaryItem) {

        this.modal.openModal('DictionaryManagerItemDetails', true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.dictionaryitem = item;
            }
        })

    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    public deleteDictionaryItem(id: string) {
        this.dictionarymanager.promptDelete('MSG_DELETE_DICTIONARYITEM').subscribe({
            next: (value) => {
                let params: any = {};
                if(value == 'drop') params.drop = 1;
                let delteModal = this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`dictionary/item/${id}`, params).subscribe({
                    next: () => {
                        let di = this.dictionarymanager.dictionaryitems.findIndex(f => f.id == id);
                        this.dictionarymanager.dictionaryitems.splice(di, 1);
                        delteModal.emit(true);
                    },
                    error: () => {
                        delteModal.emit(true);
                    }
                })
            }
        })
    }

    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    public drop(event) {
        // get the values and reshuffle
        let values = this.dictionaryitems;
        let prevIndex = this.getSanitizedItemIndex(event.previousIndex);
        let curIndex = this.getSanitizedItemIndex(event.currentIndex);
        let previousItem = values.splice(prevIndex, 1);
        values.splice(curIndex, 0, previousItem[0]);

        let savingModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest('dictionary/items/sequence', {}, {items: values.map(v => v.id)}).subscribe({
            next: () => {
                // reindex the array resetting the sequence
                let i = 0;
                for (let item of values) {
                    item.sequence = i;
                    i++;
                }
                savingModal.emit(true);
            },
            error: () => {
                savingModal.emit(true);
            }
        })
    }

    /**
     * determine a sanitzioed index when draging and dropping items. This resolves subitems if theera re as discplayed based on the
     * ref and returns the proper index of the element id for the complete group
     *
     * @param itemIndex
     * @private
     */
    private getSanitizedItemIndex(itemIndex){
        let finalItems = [];
        for(let item of this.dictionaryitems){
            finalItems.push(item.id);
            for(let refItem of this.getTemplateItems(item.sysdictionary_ref_id)){
                finalItems.push(item.id);
            }
        }
        return this.dictionaryitems.findIndex(i => i.id == finalItems[itemIndex]);
    }

    /**
     * sets the current active id
     *
     * @param id
     */
    public setActiveId(id) {
        this.dictionarymanager.currentDictionaryItem = id;
        this.dictionaryitem = this.dictionarymanager.dictionaryitems.find(i => i.id == id);
    }

    /**
     * returns if there are any items thar are in status 'd'
     */
    get hasDraftItems() {
        return this.dictionaryitems.filter(d => d.status == 'd').length > 0;
    }

    /**
     * activate All
     */
    public activateAll(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.modal.confirm('MSG_ACTIVATE_ALL', 'MSG_ACTIVATE_ALL').subscribe({
            next: (res) => {
                if (res) this.dictionaryitems.filter(d => d.status == 'd').forEach(d => d.status = 'a');
            }
        })
    }

    /**
     * sets the status and write the cahced entries ont eh backend
     *
     * @param item
     * @param status
     * @param statusComponent
     */
    public setStatus(item, status, statusComponent: DictionaryManagerItemStatus) {
        let loadingModal;
        switch (status) {
            case 'a':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.postRequest(`dictionary/item/${item.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        item.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        this.modal.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                        statusComponent.status = item.status;
                        loadingModal.emit(true);
                    }
                })
                break;
            case 'i':
                loadingModal = this.modal.await('LBL_EXECUTING');
                this.backend.deleteRequest(`dictionary/item/${item.id}/activate`).subscribe({
                    next: () => {
                        this.dictionarymanager.handleAfterActivate();
                        item.status = status;
                        loadingModal.emit(true);
                    },
                    error: () => {
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                item.status = status;
        }
    }


}
