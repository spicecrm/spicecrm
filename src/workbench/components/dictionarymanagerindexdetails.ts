/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
