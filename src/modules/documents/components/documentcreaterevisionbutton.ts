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
 * @module ModuleDocuments
 */
import {Component, EventEmitter, OnDestroy, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {ObjectActionOutputBeanButton} from "../../../modules/outputtemplates/components/objectactionoutputbeanbutton";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'document-create-revision-button',
    templateUrl: './src/modules/documents/templates/documentcreaterevisionbutton.html'
})
export class DocumentCreateRevisionButton extends ObjectActionOutputBeanButton implements OnDestroy{

    private subscriptions = new Subscription();

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected viewContainerRef: ViewContainerRef,
        protected relatedmodels: relatedmodels
    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }

    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('DocumentCreateRevisionModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                let documentEmitter = new EventEmitter<any>();
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = 'LBL_CREATE_REVISION';
                outputModal.instance.handBack = documentEmitter;
                this.subscriptions.add(
                    documentEmitter.subscribe(document => {
                        this.backend.postRequest(`module/Documents/${this.model.id}/revisionFromBase64`, '', {
                            file_name: document.name + '.pdf',
                            file: document.content,
                            file_mime_type: 'application/pdf',
                            documentrevisionstatus: 'r'
                        }).subscribe(handled => {
                            this.relatedmodels.getData();
                        })
                    })
                );
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }

    /**
     * cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
