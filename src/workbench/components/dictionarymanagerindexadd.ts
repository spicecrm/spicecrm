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
import {DictionaryIndex, DictionaryIndexItem, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";

/**
 * redners a modal to add an index
 */
@Component({
    templateUrl: '../templates/dictionarymanagerindexadd.html',
})
export class DictionaryManagerIndexAdd {

    /**
     * reference to self
     *
     * @private
     */
    public self: any;

    /**
     * the index to be created
     *
     * @private
     */
    public index: DictionaryIndex;

    /**
     * the list of available index fields
     *
     * @private
     */
    public availableDictionaryItems: DictionaryItem[] = [];

    /**
     * the list of fields in teh index
     *
     * @private
     */
    public indexDictionaryItems: DictionaryItem[] = [];

    constructor(public dictionarymanager: dictionarymanager, public injector: Injector, public modelutilities: modelutilities) {

        let tablename = this.dictionarymanager.dictionarydefinitions.find(d => d.id == this.dictionarymanager.currentDictionaryDefinition).tablename;

        this.index = {
            id: this.modelutilities.generateGuid(),
            name: `idx_${tablename}_`,
            sysdictionarydefinition_id: this.dictionarymanager.currentDictionaryDefinition,
            deleted: 0,
            status: 'd',
            scope:  this.dictionarymanager.defaultScope,
            indextype: 'index'
        };

        this.availableDictionaryItems = this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition);
    }

    /**
     * close the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

    /**
     * add the index and the items
     *
     * @private
     */
    public add() {
        this.dictionarymanager.dictionaryindexes.push({...this.index});

        let sequence = 0;
        for(let item of this.indexDictionaryItems){
            this.dictionarymanager.dictionaryindexitems.push({
                id: this.modelutilities.generateGuid(),
                scope: this.index.scope,
                status: this.index.status,
                sysdictionaryindex_id: this.index.id,
                sysdictionaryitem_id: item.id,
                sequence: sequence,
                deleted: 0,
            });
            sequence++;
        }

        this.close();
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }


}
