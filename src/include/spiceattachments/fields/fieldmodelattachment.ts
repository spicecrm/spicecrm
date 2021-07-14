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
 * @module ModuleSpiceAttachments
 */
import {
    Component, Injector, ViewChild, ViewContainerRef
} from '@angular/core';
import {Router} from "@angular/router";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {helper} from "../../../services/helper.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {Observable, Subject} from "rxjs";


/**
 * renders a field to upload files in a model itself
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/fieldmodelattachment.html',
    providers: [modelattachments]
})
export class fieldModelAttachment extends fieldGeneric {

    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: false}) private fileupload: ViewContainerRef;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private injector: Injector,
        private modelattachments: modelattachments,
        private modal: modal,
        private helper: helper,
        private backend: backend
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * retrieves the first files in teh modelattachments service
     * since the field always provides its own service and can only handel one file per definition
     * always the first file is the one of relevance
     */
    get file() {
        return this.modelattachments.files[0];
    }

    /**
     * returns if the file in the attachment service is uplaoding
     */
    get uploading() {
        return this.file?.hasOwnProperty('uploadprogress');
    }

    /**
     * used in the upload to render the upload progress
     */
    get progressbarstyle() {
        return {
            width: this.file.uploadprogress + '%'
        };
    }

    /**
     * returns the mime type
     */
    get mime_type() {
        return this.model.getFieldValue(this.prefix + '_mime_type');
    }

    /**
     * determines the field prefix. It is assumed this field is used for the field_name field so it has to end with _name by defualt
     * this wll be also defined with the domain to be used for the file
     * the method extracts the prefix without the '_' so file_name will return file
     */
    get prefix() {
        // legacy handling supporting the module where the fieldname is still filename
        // and it is one file
        if (this.fieldname == 'filename') {
            return 'file';
        }

        // parse the prefix out of the filename
        return this.fieldname.substring(0, this.fieldname.length - 5);
    }

    /**
     * a specific kethod to retrieve the attachment for a bean
     * also handles legacy methods where the file is stored with the bean id and not the MD5 in the backend
     */
    public getAttachment(): Observable<any> {
        let retSubject = new Subject();
        // somewhat ugly logic to get the prefix from the field .. it has to end with name
        this.backend.getRequest(`common/spiceattachments/module/${this.model.module}/${this.model.id}/byfield/${this.prefix}`).subscribe(
            fileData => {
                retSubject.next(fileData.file);
                retSubject.complete();
            },
            err => {
                retSubject.error(err);
                retSubject.complete();
            }
        );

        return retSubject.asObservable();
    }

    /**
     * previews the file
     * @param e
     */
    private previewFile(e) {
        // stop the event from bubbling
        e.preventDefault();
        e.stopPropagation();

        if (this.mime_type) {
            let fileTypeArray = this.mime_type.toLowerCase().split("/");
            // check the application
            switch (fileTypeArray[0].trim()) {
                case "image":
                    this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                        modalref.instance.imgname = this.value;
                        modalref.instance.imgtype = this.mime_type.toLowerCase();
                        this.getAttachment().subscribe(
                            file => {
                                modalref.instance.imgsrc = 'data:' + this.mime_type.toLowerCase() + ';base64,' + file;
                            },
                            err => {
                                modalref.instance.loadingerror = true;
                            }
                        );
                    });
                    break;
                case 'text':
                case 'audio':
                case 'video':
                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                        modalref.instance.name = this.value;
                        modalref.instance.type = this.mime_type.toLowerCase();
                        this.getAttachment().subscribe(
                            file => {
                                modalref.instance.data = atob(file);
                            },
                            err => {
                                modalref.instance.loadingerror = true;
                            }
                        );
                    });
                    break;
                case "application":
                    switch (fileTypeArray[1]) {
                        case 'pdf':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = this.value;
                                modalref.instance.type = this.mime_type.toLowerCase();
                                this.getAttachment().subscribe(
                                    file => {
                                        modalref.instance.data = atob(file);
                                    },
                                    err => {
                                        modalref.instance.loadingerror = true;
                                    }
                                );
                            });
                            break;
                        default:
                            this.downloadFile();
                            break;
                    }
                    break;
                default:
                    this.downloadFile();
                    break;
            }
        }
    }

    /**
     * unlinks the file from teh bean
     * @private
     */
    private removeFile() {
        // unset the file link
        if (this.modelattachments.files.length > 0) this.modelattachments.files = [];

        let modelValues: any = {};

        // somewhat ugly logic to get the prefix from the field .. it has to end with name
        modelValues[this.fieldname] = undefined;
        modelValues[this.prefix + '_size'] = undefined;
        modelValues[this.prefix + '_mime_type'] = undefined;
        modelValues[this.prefix + '_md5'] = undefined;

        // update the model
        this.model.setFields(modelValues);
    }

    /**
     * handles the drop event iof a file is dropped onto the file upload field
     * @param files
     * @private
     */
    private onDrop(files) {
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * hanmdles if the dialog to select a file is opened and the field fires
     *
     * @private
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     * downloads teh file via AJAX
     *
     * @private
     */
    private downloadFile() {
        this.modelattachments.downloadAttachmentForField(this.model.module, this.model.id, this.prefix, this.value);
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files).subscribe(
            progressdata => {
                let x = 1;
            },
            err => {
                let x = 1;
            },
            () => {
                let file = this.modelattachments.files[0];
                let modelValues: any = {};

                // somewhat ugly logic to get the prefix from the field .. it has to end with name
                modelValues[this.fieldname] = file.filename;
                modelValues[this.prefix + '_size'] = file.filesize;
                modelValues[this.prefix + '_mime_type'] = file.file_mime_type;
                modelValues[this.prefix + '_md5'] = file.filemd5;

                // update the model
                this.model.setFields(modelValues);
            }
        );
    }

}
