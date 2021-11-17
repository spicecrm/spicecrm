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
 * @module ObjectComponents
 */
import {Component, EventEmitter, Output, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";

import {ObjectActionOutputBeanButton} from "./objectactionoutputbeanbutton";
import {modal} from "../../../services/modal.service";
import {configurationService} from "../../../services/configuration.service";
import {toast} from "../../../services/toast.service";
import {outputModalService} from "../services/outputmodal.service";

@Component({
    selector: 'object-action-mark-sent-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionmarksentbeanbutton.html'
})
export class ObjectActionMarkSentBeanButton extends ObjectActionOutputBeanButton {

    /**
     * emit the action to the container
     */
    @Output() public actionemitter = new EventEmitter<{close: boolean, name: string}>();

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected toast: toast,
        protected outputModalService: outputModalService,
        protected viewContainerRef: ViewContainerRef
    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }

    public execute() {

        if (!this.outputModalService.selectedTemplate) return;

        const templateId = this.outputModalService.selectedTemplate.id;

        this.backend.postRequest(`module/Letters/${this.model.id}/marksent/${templateId}`, null, this.model.data).subscribe(res => {

            this.actionemitter.emit({close: true, name: 'marksent'});

            if (res?.success) {
                this.toast.sendToast(this.language.getLabel('LETTER_MARKED_AS_SENT'), 'success');
            } else {
                this.toast.sendToast(this.language.getLabel('ERR_FAILED_TO_EXECUTE'), 'error');
            }
        });
    }
}
