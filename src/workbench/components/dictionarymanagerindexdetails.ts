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
            let indexitems = this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == this.indexid).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
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
    }

}
