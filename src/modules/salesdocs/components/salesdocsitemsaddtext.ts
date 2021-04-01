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
    Component,
    EventEmitter,
    Output
} from '@angular/core';


import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsitemsaddtext.html',
    providers: [view, model]
})
export class SalesDocsItemsAddText {

    /**
     * reference to self for the modal
     */
    private self: any;


    private fieldset: string = '';

    /**
     * event emitter so the add process can subscribe
     */
    @Output() private additem: EventEmitter<any> = new EventEmitter<any>();

    constructor(private metadata: metadata, private language: language, private model: model, private view: view) {
        // prepare the model
        this.model.module = 'SalesDocItems';
        this.model.initialize();

        // set the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // determine the fieldset for the component
        this.fieldset = this.metadata.getComponentConfig('SalesDocsItemsAddText', this.model.module).fieldset;
    }

    /**
     * closes the modal and emits false
     */
    private close() {
        // emit the value
        this.additem.emit(false);

        // destroy the modal
        this.self.destroy();
    }

    /**
     * adds the text item and closes the modal
     */
    private add() {
        // check if valid and if yes save
        if (this.model.validate()) {
            // compose the items to be added
            let itemData = {
                name: this.model.getField('name'),
                description: this.model.getField('description'),
                acl: {
                    create: true,
                    edit: true
                }
            };

            this.additem.emit(itemData);

            // destroy the modal
            this.self.destroy();
        }
    }

}
