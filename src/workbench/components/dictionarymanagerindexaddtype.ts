/**
 * @module WorkbenchModule
 */
import {
    Component, Injector
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {modal} from '../../services/modal.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryIndex, DictionaryIndexItem, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

/**
 * redners a modal to add an index and choose the type
 */
@Component({
    templateUrl: '../templates/dictionarymanagerindexaddtype.html',
})
export class DictionaryManagerIndexAddType {

    /**
     * reference to self
     *
     * @private
     */
    public self: any;

    public indextype: string = '';

    public primaryindexdefined: boolean = false;

    constructor(public dictionarymanager: dictionarymanager, public injector: Injector, public modal: modal) {
        // determine if a primary index is defined
        this.primaryindexdefined = this.dictionarymanager.dictionaryindexes.filter(i => i.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition && i.indextype == 'primary').length > 0
    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    public add(){
        this.modal.openModal('DictionaryManagerIndexAdd', true, this.injector).subscribe({
            next: (ref) => {
                ref.instance.index.indextype = this.indextype;
            }
        })
        this.close();
    }

}
