/**
 * @module WorkbenchModule
 */
import {
    Component
} from '@angular/core';
import {modal} from '../../services/modal.service';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

@Component({
    selector: 'dictionary-manager-clone-definition-modal',
    templateUrl: '../templates/dictionarymanagerclonedefinitionmodal.html',
})
export class DictionaryManagerCloneDefinitionModal{

    /**
     * reference to the modal self
     */
    public self: any;

    public definition: string;

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public modal: modal, public modelutilities: modelutilities) {

    }

    get definitions(){
        return this.dictionarymanager.dictionarydefinitions.filter(d => !!d.name && d.id != this.dictionarymanager.currentDictionaryDefinition).sort((a, b) => a.name.localeCompare(b.name));
    }

    /**
     * clones the records and saves the data
     */
    public save(){
        let newItems = [];
        for(let item of this.dictionarymanager.dictionaryitems.filter(i => i.sysdictionarydefinition_id == this.definition)){
            let newItem: DictionaryItem = JSON.parse(JSON.stringify(item));
            // set id, parent and status
            newItem.id = this.modelutilities.generateGuid();
            newItem.sysdictionarydefinition_id = this.dictionarymanager.currentDictionaryDefinition;
            newItem.status = 'd';
            newItems.push(newItem)
        }

        // add all new items in bulk
        if(newItems.length > 0){
            let savemodal = this.modal.await('LBL_SAVING');
            this.backend.postRequest('dictionary/items', {}, {items: newItems}).subscribe({
                next: () => {
                    this.dictionarymanager.dictionaryitems = this.dictionarymanager.dictionaryitems.concat(newItems);
                    savemodal.emit(true);
                    this.close();
                },
                error: (e) => {
                    savemodal.emit(true);
                }
            })
        }


    }

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

}
