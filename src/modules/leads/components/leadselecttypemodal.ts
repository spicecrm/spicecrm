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
 * @module ModuleLeads
 */
import {Component, Input, Output, EventEmitter, OnInit, Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {Observable, Subject} from "rxjs";
import {view} from "../../../services/view.service";

/**
 * a separet modal to display the steps for th elad comversion as well as the progress
 */
@Component({
    templateUrl: './src/modules/leads/templates/leadselecttypemodal.html',
    providers: [view]
})
export class LeadSelectTypeModal {

    /**
     * reference to the modal itsefl
     */
    private self: any;

    /**
     * the fieldset to be rendered
     */
    private fieldset: string;

    constructor(private injector: Injector, private metadata: metadata, private view: view, private language: language, private modal: modal, private model: model) {
        this.view.isEditable = true;
        this.view.setEditMode();

        this.fieldset = this.metadata.getComponentConfig('LeadSelectTypeModal', 'Leads').fieldset;
    }

    /**
     * simple getter to enable the create button
     */
    get cancreate() {
        return !!this.model.getField('lead_type');
    }

    /**
     * trigger creating the new lead
     */
    private create() {
        if(this.cancreate) {
            this.modal.openModal("ObjectEditModal", true, this.injector);
            this.close();
        }
    }

    /**
     * close the modal
     */
    private close() {
        this.self.destroy();
    }
}
