/**
 * @module WorkbenchModule
 */
import {
    Component, Input, OnInit
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
    standalone: false
})
export class DictionaryManagerItemDetails implements OnInit {

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

    /**
     * the list of the domains
     */
    public domains: any[] = [];
    /**
     * if set to true from the parent, push the custom item to the items array and remove the global item after saving
     */
    public isCustomizing: boolean = false;

    constructor(public dictionarymanager: dictionarymanager,
                private modal: modal,
                private backend: backend,
                public metadata: metadata,
                public language: language) {

    }

    /**
     * initialize and create a backup
     * set some defsult property values
     */
    public ngOnInit() {
        // create a backup
        this.backup = JSON.stringify(this.dictionaryitem);

        for (let domain of this.dictionarymanager.domaindefinitions) {
            if(domain.name) {
                this.domains.push({
                    id: domain.id,
                    name: domain.name
                });
            }
        }

        // sort the domain name alphabetically
        this.domains.sort((a, b) => a.name.localeCompare(b.name) > 0 ? 1 : -1);

        // set default values
        this.setItemDefaultValues();
    }


    /**
     * Will set some default values on specific dictionaryitem properties
     */
    public setItemDefaultValues(){
        if(typeof this.dictionaryitem.duplicate_merge === "undefined"){
            this.dictionaryitem.duplicate_merge = 1;
        }
    }

    /**
     * save the values
     */
    public save(){

        if (!this.canSave) return;


        let saveModal = this.modal.await('LBL_SAVING');

        const toSave = {...this.dictionaryitem};
        delete toSave.addFields;
        delete toSave.isVardef;
        delete toSave.database;
        delete toSave.defined;

        this.backend.postRequest(`dictionary/item/${toSave.id}`, {}, toSave).subscribe({
            next: () => {
                saveModal.emit(true);
                saveModal.complete();

                if (this.isCustomizing) {
                    this.dictionarymanager.dictionaryitems = [...this.dictionarymanager.dictionaryitems, this.dictionaryitem];
                }
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
        let changed = true;
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

    /**
     * reset duplicate merge if the item is non-db
     */
    public onNonDBSet(nonDB: 1 | 0) {
        if (nonDB == 1) {
            this.dictionaryitem.duplicate_merge = 0;
        }
    }
}
