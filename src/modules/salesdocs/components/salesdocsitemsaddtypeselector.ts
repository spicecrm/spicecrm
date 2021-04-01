/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleSalesDocs
 */
import {
    OnInit,
    Component,
    EventEmitter,
    Output
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';
import {model} from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddtypeselector.html'
})
export class SalesDocsItemsAddTypeSelector implements OnInit {

    /**
     * reference to self for the modal to allow closing the modal
     *
     * @type {undefined}
     */
    private self: any = undefined;

    /**
     * an eventEmitter for the selcted item type
     */
    @Output() private itemTypeSelected: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the types that match the model available types
     *
     * @type {Array}
     */
    private availableItemTypes: any[] = [];

    /**
     * the selected item type
     */
    private itemType: string = '';

    constructor(private metadata: metadata, private language: language, private model: model, private configuration: configurationService) {

    }

    public ngOnInit() {
        let typesData = this.configuration.getData('salesdoctypes').find(typeRecord => typeRecord.name == this.model.getField('salesdoctype'));
        let itemTypesData = this.configuration.getData('salesdocitemtypes');
        if (typesData) {
            // set the available types
            for (let availableItemType of typesData.itemtypes) {
                let itemTypeDetails = itemTypesData.find(a => a.name == availableItemType);
                if (itemTypeDetails) {
                    this.availableItemTypes.push(itemTypeDetails);
                    if (!this.itemType) {
                        this.itemType = itemTypeDetails.name;
                    }
                }
            }
        } else {
            this.availableItemTypes = [];
        }

        // if we only have one item .. emit this right away and do not prompt the user
        if (this.availableItemTypes.length == 1) {
            this.add();
        }
    }

    /**
     * close the modal
     */
    private close() {
        this.itemTypeSelected.emit(false);
        this.self.destroy();
    }

    /**
     * add the item type
     */
    private add() {
        this.itemTypeSelected.emit(this.itemType);
        this.self.destroy();
    }
}
