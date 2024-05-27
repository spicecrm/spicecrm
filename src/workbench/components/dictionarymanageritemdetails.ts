/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";
import {modal} from "../../services/modal.service";
import {backend} from "../../services/backend.service";

/**
 * renders the details form for the dircitonary item
 */
@Component({
    selector: 'dictionary-manager-item-details',
    templateUrl: '../templates/dictionarymanageritemdetails.html',
})
export class DictionaryManagerItemDetails implements OnInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    /**
     * the item to be edited
     */
    @Input() public dictionaryitem: DictionaryItem;

    /**
     * a JSON reprensetnation of the original item
     * @private
     */
    private backup: string;

    constructor(public dictionarymanager: dictionarymanager,
                private modal: modal,
                private backend: backend,
                public metadata: metadata,
                public language: language) {

    }

    /**
     * initialize and create a backup
     */
    public ngOnInit() {
        // create a backup
        this.backup = JSON.stringify(this.dictionaryitem);
    }

    /**
     * save the values
     */
    public save(){

        if (!this.canSave) return;


        let saveModal = this.modal.await('LBL_SAVING');

        const toSave = {...this.dictionaryitem};
        delete toSave.addFields;
        delete toSave.cached;
        delete toSave.database;
        delete toSave.defined;

        this.backend.postRequest(`dictionary/item/${this.dictionaryitem.id}`, {}, toSave).subscribe({
            next: () => {
                saveModal.emit(true);
                saveModal.complete();
                this.close();
            },
            error: () => {
                saveModal.emit(true);
                saveModal.complete();
            }
        });

        this.self.destroy();
    }

    /**
     * returns if we detect changes
     */
    get canSave(){
        let changed = false;
        let backup = JSON.parse(this.backup);
        Object.keys(backup).forEach(k => {
            if(backup[k] != this.dictionaryitem[k]) {
                changed = true;
                return true;
            }
        })
        return changed;
    }

    /**
     * close the modal
     */
    public close(){
        // set back the values from teh backup
        this.dictionaryitem = JSON.parse(this.backup);
        this.self.destroy();
    }
}
