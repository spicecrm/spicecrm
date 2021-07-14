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
import { Component, EventEmitter, ViewContainerRef } from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    selector: 'object-action-output-bean-button',
    templateUrl: './src/modules/outputtemplates/templates/objectactionoutputbeanbutton.html'
})
export class ObjectActionOutputBeanButton {

    public templates: any[] = [];
    public forcedFormat: 'html'|'pdf';
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected viewContainerRef: ViewContainerRef
    ) {

    }

    public execute() {
        let waitingModal: any;

        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.templates = outPutTemplates[this.model.module];
            this.openOutput();
        } else {
            outPutTemplates = {};
            this.modal.openModal('SystemLoadingModal', false).subscribe(waitingModal => {
                waitingModal.instance.messagelabel = 'Loading Templates';
                this.backend.getRequest('module/OutputTemplates/formodule/'+this.model.module, {}).subscribe(
                    (data: any) => {
                        // kill the watign modal
                        waitingModal.instance.self.destroy();
                        // set the templates
                        this.configuration.setData('OutputTemplates', data);

                        // set the templates internally
                        this.templates = data;

                        // open the output
                        this.openOutput();
                    },
                    (error: any) => {
                        waitingModal.instance.self.destroy();
                    }
                );
            });
        }
    }


    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('ObjectActionOutputBeanModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = this.modalTitle;
                outputModal.instance.noDownload = this.noDownload;
                outputModal.instance.handBack = this.handBack;
                outputModal.instance.buttonText = this.buttonText;
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }
}
