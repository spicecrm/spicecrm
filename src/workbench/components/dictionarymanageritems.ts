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
import {DictionaryManagerFilterItemsPipe} from "../pipes/dictionarymanagerfilteritems.pipe";
import {DictionaryManagerItemDetails} from "./dictionarymanageritemdetails";
import {moveItemInArray} from "@angular/cdk/drag-drop";


@Component({
    selector: 'dictionary-manager-items',
    templateUrl: '../templates/dictionarymanageritems.html',
    standalone: false,
    providers: [DictionaryManagerFilterItemsPipe]
})
export class DictionaryManagerItems {


    /**
     * the current dictionaryitem
     */
    public dictionaryitem: DictionaryItem;

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
                public modelutilities: modelutilities,
                private filterPipe: DictionaryManagerFilterItemsPipe) {

    }

    get canShuffle() {
        return this.dictionarymanager.canChange(this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition)?.scope);
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryitems() {
        return this.filterPipe.transform(
            this.dictionarymanager.dictionaryitems,
            this.dictionarymanager.currentDictionaryDefinition,
            this.dictionarymanager.currentDictionaryItem,
            this.filterterm
        );
    }

    public getTemplateItems(refId){
        if(!refId) return [];
        return this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionarydefinition_id == refId).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
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

        this.modal.openModal(item.sysdictionary_ref_id ? 'DictionaryManagerItemReferenceDetails' :  'DictionaryManagerItemDetails', true, this.injector).subscribe({
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
    public deleteDictionaryItem(item: DictionaryItem) {
        this.dictionarymanager.promptDelete('MSG_DELETE_DICTIONARYITEM').subscribe({
            next: (value) => {
                let params: any = {};
                if (value === 'drop') params.drop = 1;
                let deleteModal = this.modal.await('LBL_DELETING');
                this.backend.deleteRequest(`dictionary/item/${item.id}`, params).subscribe({
                    next: () => {
                        const itemIndex = this.dictionarymanager.dictionaryitems.findIndex(f => f.id == item.id);
                        this.dictionarymanager.dictionaryitems.splice(itemIndex, 1);

                        // trigger the change detection
                        this.dictionarymanager.dictionaryitems = this.dictionarymanager.dictionaryitems.slice();

                        deleteModal.emit(true);
                    },
                    error: () => {
                        this.dictionarymanager.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                        deleteModal.emit(true);
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
        moveItemInArray(values, curIndex, prevIndex);

        let savingModal = this.modal.await('LBL_SAVING');
        this.backend.postRequest('dictionary/items/sequence', {}, {items: values.map(v => v.id)}).subscribe({
            next: () => {
                // reindex the array resetting the sequence
                values.forEach((v, i) => v.sequence = i);
                this.dictionarymanager.dictionaryitems = this.dictionarymanager.dictionaryitems.slice();

                savingModal.emit(true);
            },
            error: () => {
                this.dictionarymanager.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
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
     * activate All
     */
    public activateAll(e: MouseEvent) {
        e.stopPropagation();
        e.preventDefault();
        this.modal.confirm('MSG_ACTIVATE_ALL', 'MSG_ACTIVATE_ALL').subscribe({
            next: (res) => {
                const draftItems = this.filterPipe.transform(
                    this.dictionarymanager.dictionaryitems,
                    this.dictionarymanager.currentDictionaryDefinition,
                    this.dictionarymanager.currentDictionaryItem,
                    this.filterterm,
                    true
                );
                if (res) draftItems.forEach(d => d.status = 'a');
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
                        this.dictionarymanager.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
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
                        this.dictionarymanager.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                        loadingModal.emit(true);
                    }
                })
                break;
            default:
                item.status = status;
        }
    }

    /**
     * customize dictionary item
     * @param item
     */
    public customizeItem(item: DictionaryItem) {

        if (this.dictionarymanager.changescope == 'none' || !!item.sysdictionary_ref_id) return;

        this.dictionarymanager.currentDictionaryItem = undefined;

        const customItem = {...item}
        customItem.id = this.modelutilities.generateGuid();
        customItem.scope = 'c';
        customItem.status = 'd';
        customItem.sequence = this.dictionarymanager.dictionaryitems.filter(d => d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).length;

        this.modal.openStaticModal(DictionaryManagerItemDetails, true, this.injector).subscribe({
            next: (modalRef) => {
                modalRef.instance.dictionaryitem = customItem;
                modalRef.instance.isCustomizing = true;
            }
        });
    }

}
