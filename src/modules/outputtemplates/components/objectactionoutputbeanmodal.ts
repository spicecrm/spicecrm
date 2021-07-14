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
import {Component, Directive, EventEmitter, Input, Output, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {backend} from "../../../services/backend.service";
import {trigger, transition, animate, style, state} from '@angular/animations';
import {ObjectActionOutputBeanModalEmailContent} from "./objectactionoutputbeanmodalemailcontent";

@Component({
    selector: 'object-action-output-bean-modal',
    templateUrl: './src/modules/outputtemplates/templates/objectactionoutputbeanmodal.html',
    providers: [view],
    animations: [
        trigger('slideInOut', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '100%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
        trigger('slideInOut2', [
            state('open', style({width: '50%'})),
            state('closed', style({width: '0%'})),
            transition('open <=> closed', [
                animate('200ms'),
            ])
        ]),
    ]
})
export class ObjectActionOutputBeanModal {


    /**
     * this is the child component (the email content )
     */
        // @ViewChild(ObjectActionOutputBeanModalEmailContent, {static: true}) public emailContent;
    @ViewChild(ObjectActionOutputBeanModalEmailContent) public emailContent: ObjectActionOutputBeanModalEmailContent;

    public modalTitle: string;
    public forcedFormat: 'html' | 'pdf';
    public noDownload = false;
    public handBack: EventEmitter<any>;
    public buttonText: string;
    public contentForHandBack: string;

    /**
     * the window itsel .. resp the containing modal container
     */
    public self: any = undefined;

    /**
     * the list of templates
     */
    private templates = [];

    /**
     * the selected template
     */
    private _selected_template = null;

    /**
     * the selected output format
     */
    private _selected_format: 'html' | 'pdf' = 'pdf';

    /**
     * the response of the compiler
     */
    private compiled_selected_template: string = '';

    /**
     * flag is the oputput is loading
     */
    private loading_output: boolean = false;


    /**
     * fieldset of the email area
     */
    private fieldset_email: string = '';

    /**
     * the pdf file
     */
    public file: File;

    /**
     * list of files thazt shoudl eb added to the email when adding the wmail from the preview
     */
    public filelist: any[] = [];

    /**
     * flag to show the email-content
     */
    private showsendemail: boolean = false;

    /**
     * expanded email-content flag
     */
    private expanded: boolean = false;

    /**
     * keeps a flag if the email panel has been initialized
     * this is set so we can avoid that the email pnale is loaded automatically wasting bandwith if we donot need it
     *
     * @private
     */
    private emailInitialized: boolean = false;

    /**
     * the blobURL. This is handled internally. When the data is sent this is created so the object can be rendered in the modal
     */
    private blobUrl: any;

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public modal: modal,
        public view: view,
        public backend: backend,
        public sanitizer: DomSanitizer,
        public viewContainerRef: ViewContainerRef
    ) {
        // get the fieldset of the email area
        let componentconfig = this.metadata.getComponentConfig('ObjectActionOutputBeanModal');
        this.fieldset_email = componentconfig.fieldset_email;
    }

    public ngOnInit() {
        this.setModalData();
        this.setSelectedTemplate();

        // if no template is set and we only have one select this
        if (!this.selected_template && this.templates.length == 1) {
            this.selected_template = this.templates[0];
            this.rendertemplate();
        }
    }

    /**
     * If there is no modal window title given from outside, use the default title
     * If there is no button text given from outside, use the default text
     * Set the output format in case it is given from outside
     */
    private setModalData() {
        if (!this.modalTitle) this.modalTitle = this.language.getLabel(this.language.getLabel('LBL_OUTPUT_TEMPLATE'));
        if (!this.buttonText) this.buttonText = this.language.getLabel(this.noDownload ? 'LBL_OK' : 'LBL_DOWNLOAD');
        if (this.forcedFormat) this._selected_format = this.forcedFormat;
    }

    /**
     * see if we have a relate to an output template
     */
    private setSelectedTemplate() {
        let fields = this.metadata.getModuleFields(this.model.module);
        for (let field in fields) {
            if (fields[field].type == 'relate' && fields[field].module == 'OutputTemplates') {
                let template = this.templates.find(template => template.id == this.model.getFieldValue(fields[field].id_name));
                if (template) {
                    this.selected_template = template;
                }
                break;
            }
        }
    }

    set selected_template(val) {
        this._selected_template = val;
        this.rendertemplate();
    }

    get selected_template() {
        return this._selected_template;
    }

    get selected_format(): 'pdf' | 'html' {
        return this._selected_format;
    }

    set selected_format(format) {
        this._selected_format = format;
        this.expanded = false;
        this.rendertemplate();
    }

    get sanitizedTemplated() {
        return this.sanitizer.bypassSecurityTrustHtml(this.compiled_selected_template);
    }

    /**
     * backend call to render the template and return the content
     */
    private rendertemplate() {
        this.loading_output = true;

        this.blobUrl = null;
        this.compiled_selected_template = null;

        switch (this.selected_format) {
            case 'pdf':
                this.backend.getRequest(`module/OutputTemplates/${this.selected_template.id}/convert/${this.model.id}/to/pdf/base64`).subscribe(
                    pdf => {
                        let blob = this.datatoBlob(atob(pdf.content));
                        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
                        this.contentForHandBack = pdf.content;
                        this.setEmailAttachmentData();
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
            case 'html':
                // compile the template to show the user...
                this.backend.getRequest(`module/OutputTemplates/${this.selected_template.id}/compile/${this.model.id}`).subscribe(
                    res => {
                        this.compiled_selected_template = res.content;
                        this.contentForHandBack = res.content;
                        this.setEmailAttachmentData();
                        this.loading_output = false;
                    },
                    err => {
                        this.loading_output = false;
                    }
                );
                break;
        }
    }

    /**
     * called from reload button to re render the template
     */
    private reload() {
        this.rendertemplate();
    }

    public close() {
        this.self.destroy();
    }

    public create() {
        if (this.handBack) this.handBack.emit({name: this.selected_template.name, content: this.contentForHandBack});
        if (this.noDownload) this.close();
        else {
            // generate a link element for the download
            let a = document.createElement("a");
            document.body.appendChild(a);

            // generate a blob file from the content
            // base64 decode in case wehave a PDF
            let blob = this.datatoBlob(this.selected_format == 'pdf' ? atob(this.contentForHandBack) : this.contentForHandBack);
            let blobUrl =URL.createObjectURL(blob);

            // set as href and set the type
            a.href = blobUrl;
            a.type = this.selected_format == 'pdf' ? 'application/pdf' : 'text/html';

            // genereate a filename
            let fileName = this.model.module + '_' + this.model.data.summary_text + '.' + this.selected_format;
            a.download = fileName;

            // start download and then remove the element from the document again
            a.click();
            a.remove();
        }
    }

    /**
     * a setter for the data
     *
     * @param data the raw data of the object being passed in. When the data is pased in the bloburl is created
     */
    set data(data) {
        let blob = this.datatoBlob(data);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(blob));
    }

    /**
     * internal function to translate the data to a BLOL URL
     *
     * @param byteCharacters the file data
     * @param contentType the type
     * @param sliceSize optional parameter to change performance
     */
    private datatoBlob(byteCharacters, contentType = '', sliceSize = 512) {
        let byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    // --------------------------------EMAIL SECTION -------------------------------------
    /**
     * open/close email-content
     */
    private openEmailArea() {
        if (!this.emailInitialized) {
            this.emailInitialized = true;
            this.setEmailAttachmentData();
        }

        this.expanded = !this.expanded;
    }

    /**
     * set the filelist for the email attachment panel and reset the email-content
     */
    private setEmailAttachmentData() {
        if(this.emailInitialized) {
            this.filelist = [{
                size: this.contentForHandBack.length,
                name: this.model.module + '_' + this.model.data.summary_text + '.' + this.selected_format,
                type: "application/" + this.selected_format,
                filecontent: this.contentForHandBack
            }];
        }
    }

    /**
     * the email has been sent and the modal window will destroy itself
     */
    public emailSent() {
        this.close();
    }

    /**
     * call the child method that will send the mail
     */
    private sendEmail() {
        this.emailContent.sendEmail();
    }
}
