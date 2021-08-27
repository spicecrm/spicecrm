/**
 * @module WorkbenchModule
 */
import {
    Component, Injector, Input, OnChanges, SimpleChanges
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {broadcast} from '../../services/broadcast.service';
import {modal} from '../../services/modal.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';


import {dictionarymanager} from '../services/dictionarymanager.service';
import {DictionaryIndex, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";


@Component({
    selector: 'dictionary-manager-index-details',
    templateUrl: './src/workbench/templates/dictionarymanagerindexdetails.html',
})
export class DictionaryManagerIndexDetails implements OnChanges {

    /**
     * the index id
     *
     * @private
     */
    @Input() private indexid: string;

    /**
     * the index data itself
     *
     * @private
     */
    private index: DictionaryIndex;

    /**
     * the list of available index fields
     *
     * @private
     */
    private availableDictionaryItems: DictionaryItem[] = [];

    /**
     * the list of fields in teh index
     *
     * @private
     */
    private indexDictionaryItems: DictionaryItem[] = [];

    constructor(private dictionarymanager: dictionarymanager, private metadata: metadata, private language: language, private modal: modal, private injector: Injector, private modelutilities: modelutilities) {

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.indexid) {
            this.index = this.dictionarymanager.dictionaryindexes.find(i => i.id == this.indexid);
            this.availableDictionaryItems = this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition);

            // build the items array
            this.indexDictionaryItems = [];
            let indexitems = this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == this.indexid && i.deleted == 0).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
            for (let indexitem of indexitems) {
                let aitemIndex = this.availableDictionaryItems.findIndex(a => a.id == indexitem.sysdictionaryitem_id);
                this.indexDictionaryItems.push(this.availableDictionaryItems.splice(aitemIndex, 1)[0]);
            }

        } else {
            this.index = null;
        }
    }


    /**
     * for the drop of the field
     *
     * @param event
     */
    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);

        // get the current items
        let indexitems = this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == this.indexid && i.deleted == 0);

        // resequence the items
        let sequence = 0;
        let handledItems = [];
        for (let indexDictionaryItem of this.indexDictionaryItems) {
            let item = indexitems.find(i => i.sysdictionaryitem_id == indexDictionaryItem.id);
            if (item) {
                item.sequence = sequence;
                handledItems.push(item.id);
            } else {
                let newid = this.modelutilities.generateGuid();
                this.dictionarymanager.dictionaryindexitems.push({
                    id: newid,
                    scope: this.index.scope,
                    status: this.index.status,
                    sysdictionaryindex_id: this.index.id,
                    sysdictionaryitem_id: indexDictionaryItem.id,
                    sequence: sequence,
                    deleted: 0,
                });
                handledItems.push(newid);
            }
            sequence++;
        }

        // delete all that are no longer found
        for (let indexitem of indexitems) {
            if (handledItems.indexOf(indexitem.id) < 0) {
                indexitem.deleted = 1;
            }
        }

    }

}
