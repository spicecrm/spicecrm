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
import {DictionaryDefinition, DictionaryIndex, DictionaryItem} from "../interfaces/dictionarymanager.interfaces";


@Component({
    selector: 'dictionary-manager-index-details',
    templateUrl: '../templates/dictionarymanagerindexdetails.html',
})
export class DictionaryManagerIndexDetails implements OnChanges {

    /**
     * the index id
     *
     * @private
     */
    @Input() public indexid: string;

    /**
     * the index data itself
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

    /**
     * for the foreign key
     */
    public dictionaryItemId: string;
    public dictionaryForeignDefinitionId: string;
    public dictionaryForeignItemId: string;

    constructor(public dictionarymanager: dictionarymanager, public metadata: metadata, public language: language, public modal: modal, public injector: Injector, public modelutilities: modelutilities) {

    }

    public ngOnChanges(changes: SimpleChanges) {
        if (this.indexid) {
            this.index = this.dictionarymanager.dictionaryindexes.find(i => i.id == this.indexid);
            this.availableDictionaryItems = this.dictionarymanager.getDictionaryDefinitionItems(this.dictionarymanager.currentDictionaryDefinition);

            switch(this.index.indextype){
                case 'foreign':
                    let indexitem = this.dictionarymanager.dictionaryindexitems.find(i => i.sysdictionaryindex_id == this.indexid);
                    this.dictionaryItemId = indexitem.sysdictionaryitem_id;
                    this.dictionaryForeignItemId = indexitem.sysdictionaryforeignitem_id;

                    let fItem = this.dictionarymanager.dictionaryitems.find(i => i.id == this.dictionaryForeignItemId);
                    this.dictionaryForeignDefinitionId = fItem.sysdictionarydefinition_id;

                    break;
                default:
                    // build the items array
                    this.indexDictionaryItems = [];
                    let indexitems = this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == this.indexid).sort((a, b) => a.sequence > b.sequence ? 1 : -1);
                    for (let indexitem of indexitems) {
                        let aitemIndex = this.availableDictionaryItems.findIndex(a => a.id == indexitem.sysdictionaryitem_id);
                        this.indexDictionaryItems.push(this.availableDictionaryItems.splice(aitemIndex, 1)[0]);
                    }
                    break;
            }

        } else {
            this.index = null;
        }
    }

    /**
     * a getter for the foreign dictioanry items
     */
    get foreignItems(): DictionaryItem[]{
        return this.dictionarymanager.getDictionaryDefinitionItems(this.dictionaryForeignDefinitionId).sort((a, b) => a.name.localeCompare(b.name));
    }

    get foreignDefinitions(): DictionaryDefinition[]{
        return this.dictionarymanager.dictionarydefinitions.filter(d => d.sysdictionary_type != 'template').sort((a, b) => a.name.localeCompare(b.name))
    }

    /**
     * for the drop of the field
     *
     * @param event
     */
    public onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);

        // get the current items
        let indexitems = this.dictionarymanager.dictionaryindexitems.filter(i => i.sysdictionaryindex_id == this.indexid);

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
                });
                handledItems.push(newid);
            }
            sequence++;
        }

        // delete all that are no longer found
        /*
        for (let indexitem of indexitems) {
            if (handledItems.indexOf(indexitem.id) < 0) {
                indexitem.deleted = 1;
            }
        }
        */

    }

}
