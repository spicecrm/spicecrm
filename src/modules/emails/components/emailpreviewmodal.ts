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
 * @module SystemComponents
 */
import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modelattachments} from '../../../services/modelattachments.service';

/**
 * a modal that renders and provides a preview for an object
 */
@Component({
    templateUrl: './src/modules/emails/templates/emailpreviewmodal.html',
    providers: [model, view]
})
export class EmailPreviewModal implements OnInit {

    /**
     * reference to the modal itself
     */
    private self: any = {};

    /**
     * the type of the object that will be passed in
     */
    @Input() private type: string = '';

    /**
     * the name of the object. This is displayed in the header
     */
    @Input() private name: string = '';

    /**
     * the id of the attachment for the email
     */
    private file: any;

    /**
     * the fieldset to be rendered
     */
    private fieldset: string;

    /**
     * if the email is beiong loaded
     */
    private isLoading: boolean = true;

    constructor(private language: language, private metadata: metadata, private sanitizer: DomSanitizer, private backend: backend, private model: model, private view: view, private modelattachments: modelattachments) {
        this.model.module = 'Emails';

        let componentConfig = this.metadata.getComponentConfig('EmailPreviewModal', this.model.module);
        this.fieldset = componentConfig.fieldset;
    }

    /**
     * handles closing the modal
     */
    private closeModal() {
        this.self.destroy();
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    public ngOnInit() {
        this.backend.getRequest('module/Emails/msg/' + this.file.id + '/preview').subscribe(response => {
            this.model.setFields(this.model.utils.backendModel2spice('Emails', response));
            this.isLoading = false;
        });
    }

    private download(){
        this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
    }

}
