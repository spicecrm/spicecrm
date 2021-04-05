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
 * @module ObjectComponents
 */
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';

/**
 * renders the button for the Audit log. This is uised in the standard actionsets
 */
@Component({
    selector: 'object-action-auditlog-button',
    templateUrl: './src/objectcomponents/templates/objectactionauditlogbutton.html'
})
export class ObjectActionAuditlogButton implements OnInit {

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public disabled: boolean = true;

    /**
     * defautls to true and is set in ngOnInit checking if the module is audit enabled
     */
    public hidden: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private modal: modal, private ViewContainerRef: ViewContainerRef) {
    }

    /**
     * checks if the module is audit enabled and if enables the button
     */
    public ngOnInit() {
        if (this.metadata.getModuleDefs(this.model.module).audited) {
            this.disabled = false;
            this.hidden = false;
        }
    }

    /**
     * the method to execute the button action
     */
    public execute() {
        this.modal.openModal('ObjectActionAuditlogModal', true, this.ViewContainerRef.injector);
    }
}
