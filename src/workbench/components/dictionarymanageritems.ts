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
import {DictionaryItem} from "../interfaces/dictionarymanager.interfaces";


@Component({
    selector: 'dictionary-manager-items',
    templateUrl: './src/workbench/templates/dictionarymanageritems.html',
})
export class DictionaryManagerItems {

    /**
     * the curretn dictionaryitem
     */
    private dictionaryitem: DictionaryItem;


    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

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

        return this.dictionarymanager.dictionaryitems.filter(d => d.deleted == 0 && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    }

    /**
     * react to the click to add a new dictionary definition
     */
    private addDictionaryItem(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerAddItemModal', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    private deleteDictionaryItem(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.dictionarymanager.dictionaryitems.find(f => f.id == id).deleted = 1;
                if (this.dictionarymanager.currentDictionaryDefinition == id) {
                    this.dictionarymanager.currentDictionaryDefinition == null;
                }
            }
        });
    }


    /**
     * handles the drop event and resets the sequence fiels
     * @param event
     */
    private drop(event) {
        // get the values and reshuffle
        let values = this.dictionaryitems;
        let previousItem = values.splice(event.previousIndex, 1);
        values.splice(event.currentIndex, 0, previousItem[0]);

        // reindex the array resetting the sequence
        let i = 0;
        for (let item of values) {
            item.sequence = i;
            i++;
        }
    }

    /**
     * sets the current active id
     *
     * @param id
     */
    private setActiveId(id) {
        this.dictionarymanager.currentDictionaryItem = id;
        this.dictionaryitem = this.dictionarymanager.dictionaryitems.find(i => i.id == id);
    }


}
