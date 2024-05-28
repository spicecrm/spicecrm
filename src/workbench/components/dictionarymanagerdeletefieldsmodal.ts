/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

@Component({
    selector: 'dictionary-manager-deletefields-modal',
    templateUrl: '../templates/dictionarymanagerdeletefieldsmodal.html',
})
export class DictionaryManagerDeleteFieldsModal {

    private self: any;

    public items: DictionaryItem[] = [];

    constructor(public dictionarymanager: dictionarymanager, public backend: backend, public modal: modal) {

    }

    get canDelete(){
        return this.items.filter(i => i.selected).length > 0;
    }

    public delete(){
        let fields = this.items.filter(i => i.selected).map(i => i.name);
        let tablename = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).tablename;
        this.backend.deleteRequest(`dictionary/columns/${tablename}`, {fields}).subscribe({
            next: (res) => {
                this.close();
            }
        })
    }

    public close(){
        this.self.destroy();
    }

}
