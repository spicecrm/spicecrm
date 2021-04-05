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
    templateUrl: './src/workbench/templates/dictionarymanagerindexadd.html',
})
export class DictionaryManagerIndexAdd {

    /**
     * reference to self
     *
     * @private
     */
    private self: any;

    /**
     * the index to be created
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

    constructor(private dictionarymanager: dictionarymanager, private injector: Injector, private modelutilities: modelutilities) {

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
    private close() {
        this.self.destroy();
    }

    /**
     * add the index and the items
     *
     * @private
     */
    private add() {
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
    private onFieldDrop(event) {
        let previousItem = event.previousContainer.data.splice(event.previousIndex, 1);
        event.container.data.splice(event.currentIndex, 0, previousItem[0]);
    }


}
