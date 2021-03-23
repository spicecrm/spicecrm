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
    templateUrl: './src/workbench/templates/dictionarymanagerindexes.html',
})
export class DictionaryManagerIndexes {

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryIndexes(): DictionaryIndex[] {

        // return an empty array when no DictionaryDefinition is set
        if (!this.dictionarymanager.currentDictionaryDefinition) return [];

        return this.dictionarymanager.dictionaryindexes.filter(d => d.deleted == 0 && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition).sort((a, b) => a.name.localeCompare(b.name) ? 1 : -1);
    }

    /**
     * gets all non deleted entries sorted by name
     */
    get dictionaryIndexesForTemplates(): any[] {
        let relatedindexes: any[] = [];

        for(let item of this.dictionarymanager.dictionaryitems.filter(d => d.deleted == 0 && d.sysdictionary_ref_id && d.sysdictionarydefinition_id == this.dictionarymanager.currentDictionaryDefinition)){
            let relIndexes = this.dictionarymanager.dictionaryindexes.filter(d => d.deleted == 0 && d.sysdictionarydefinition_id == item.sysdictionary_ref_id);
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
     * react to the click to add a new dictionary definition
     */
    private addIndex(event: MouseEvent) {
        event.stopPropagation();
        this.modal.openModal('DictionaryManagerIndexAdd', true, this.injector);
    }

    /**
     * prompts the user and delets the dictionary definition
     *
     * @param event
     * @param id
     */
    private deleteIndex(event: MouseEvent, id: string) {
        event.stopPropagation();
        this.modal.prompt('confirm', this.language.getLabel('MSG_DELETE_RECORD', '', 'long'), this.language.getLabel('MSG_DELETE_RECORD')).subscribe(answer => {
            if (answer) {
                let di = this.dictionarymanager.dictionaryindexes.find(f => f.id == id).deleted = 1;
            }
        });
    }

    /**
     * returns a list of index fields
     * @param indexid
     * @private
     */
    private getIndexFields(indexid: string): string {
        let indexfields = [];

        for (let field of this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == indexid && i.deleted == 0).sort((a, b) => a.sequence > b.sequence ? 1 : -1)) {
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
    private setActiveId(id) {
        this.dictionarymanager.currentDictionaryIndex = id;
    }
}
