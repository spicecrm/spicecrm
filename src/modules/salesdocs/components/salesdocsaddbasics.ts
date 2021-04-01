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
    Component, Injector
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {configurationService} from '../../../services/configuration.service';

/**
 * renders a modal that allws picking the basic paramaters for the salesdoc when adding a new sales document
 */
@Component({
    templateUrl: './src/modules/salesdocs/templates/salesdocsaddbasics.html',
    providers: [view]
})
export class SalesDocsAddBasics {

    /**
     * for the modal the reference to self
     */
    private self: any;

    /**
     * the fieldset to be rendered - loaded from the module conf
     */
    private fieldset: string = '';

    constructor(private metadata: metadata, private language: language, private view: view, private modal: modal, private injector: Injector, private model: model, private configuration: configurationService ) {
        // set the basics for the view
        this.view.isEditable = true;
        this.view.setEditMode();

        // load the fieldset to be rendered
        this.fieldset = this.metadata.getComponentConfig('SalesDocsAddBasics', 'SalesDocs').fieldset;
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * continues to the next step and closes the modal
     */
    private next() {
        this.self.destroy();
        // this.modal.openModal('SalesDocsAddMain', true, this.injector);
        this.modal.openModal("ObjectEditModal", true, this.injector).subscribe(editModalRef => {
            editModalRef.instance.model.isNew = true;
            // Field "salesdocparty" in table "salesdoctypes" is either "B" (for Business) or "C" (for Customer).
            // The field "salesdocparty" in the module SalesDocs wants "I" (for Individual) instead of "C". Here is the mapping:
            let salesdocType = this.model.getField('salesdoctype');
            let typeData = this.configuration.getData('salesdoctypes').find( typeRecord => typeRecord.name === salesdocType );
            editModalRef.instance.model.setField('salesdocparty', typeData.salesdocparty ? typeData.salesdocparty : 'C');
        });
    }

    /**
     * only allow to continue when the salesdocztype is set
     */
    get canContinue() {
        return this.model.getField('salesdoctype');
    }
}
