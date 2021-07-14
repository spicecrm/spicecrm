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
 * @module ObjectFields
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {configurationService} from '../../services/configuration.service';
import {session} from '../../services/session.service';
import {toast} from '../../services/toast.service';
import {helper} from '../../services/helper.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {Subject, Observable} from 'rxjs';

@Component({
    selector: 'field-file',
    templateUrl: './src/objectfields/templates/fieldfile.html'
})
export class fieldFile extends fieldGeneric {

    @ViewChild('fileupload', {read: ViewContainerRef, static: false}) private fileupload: ViewContainerRef;
    private showUploadModal: boolean = false;
    private theFile: string = '';
    private theProgress: number = 0;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private configurationService: configurationService,
        private session: session,
        private toast: toast,
        private modal: modal,
        private backend: backend,
        private helper: helper
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * returns the human readable file size
     *
     * @param filesize
     */
    public humanFileSize(filesize) {
        let thresh = 1024;
        let bytes: number = filesize;
        if (Math.abs(filesize) < thresh) {
            return bytes + " B";
        }
        let units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while (Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1) + " " + units[u];
    }

    /**
     * handles the upload of the file
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     *
     * @param files
     */
    private doupload(files) {
        this.showUploadModal = true;
        this.theFile = files[0].name;
        this.uploadAttachmentsBase64(files).subscribe((retVal: any) => {
            if (retVal.progress) {
                this.theProgress = retVal.progress.loaded / retVal.progress.total * 100;
            } else if (retVal.complete) {
                this.value = retVal.filename ? retVal.filename : this.theFile;
                // set the filetype
                this.model.setField('file_mime_type', retVal.filetype);
            }
        }, error => {

            this.closeUploadPopup();
        }, () => this.closeUploadPopup());
    }

    private removeFile() {
        this.value = '';
        this.model.setField('file_mime_type', '');
    }

    private closeUploadPopup() {
        this.showUploadModal = false;
    }

    /**
     * uploads the attachment to the server
     *
     * @param files
     */
    public uploadAttachmentsBase64(files): Observable<any> {
        if (files.length === 0) {
            return;
        }

        let retSub = new Subject<any>();
        let maxSize = this.configurationService.getSystemParamater('upload_maxsize');

        for (let file of files) {

            // check max filesize
            if (maxSize && file.size > maxSize) {
                this.toast.sendToast(this.language.getLabelFormatted('LBL_EXCEEDS_MAX_UPLOADFILESIZE', [file.name, this.humanFileSize(maxSize)]), 'error');
                retSub.error(true);
                continue;
            }

            this.readFile(file).subscribe(filecontent => {
                let request = new XMLHttpRequest();
                let resp: any = {};
                request.onreadystatechange = (scope: any = this) => {
                    if (request.readyState == 4) {
                        try {
                            let retVal = JSON.parse(request.response);
                            retSub.next({complete: true, filename: retVal.filename, filetype: retVal.filetype});
                            retSub.complete();
                        } catch (e) {
                            resp = {
                                status: "error",
                                data: "Unknown error occurred: [" + request.responseText + "]"
                            };
                        }
                    }
                };

                request.upload.addEventListener("progress", e => {
                    retSub.next({progress: {total: e.total, loaded: e.loaded}});
                }, false);

                request.open('POST', this.configurationService.getBackendUrl() + '/module/' + this.model.module + '/' + this.model.id + '/noteattachment', true);
                request.setRequestHeader("OAuth-Token", this.session.authData.sessionId);
                request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

                let fileBody = {
                    file: file.filecontent,
                    filename: file.name,
                    filemimetype: file.type
                };

                request.send(JSON.stringify(fileBody));
            });
        }

        return retSub.asObservable();
    }

    /**
     * the html5 file reader for the drop or upload action
     *
     * @param file
     */
    private readFile(file): Observable<any> {
        let responseSubject = new Subject<any>();
        let reader = new FileReader();
        /* tslint:disable:no-string-literal */
        reader['file'] = file;
        /* tslint:enable:no-string-literal */
        reader.onloadend = (e) => {
            let filecontent = reader.result.toString();
            filecontent = filecontent.substring(filecontent.indexOf('base64,') + 7);
            /* tslint:disable:no-string-literal */
            let file = reader['file'];
            /* tslint:enable:no-string-literal */
            file.filecontent = filecontent;
            responseSubject.next(file);
            responseSubject.complete();
        };
        reader.readAsDataURL(file);
        return responseSubject.asObservable();
    }

    private getBarStyle() {
        return {
            width: this.theProgress + '%'
        };
    }

    /**
     * helper function to convert Base64 String to BLOB for the download
     *
     * @param b64Data
     * @param contentType
     * @param sliceSize
     */
    private b64toBlob(b64Data, contentType = '', sliceSize = 512) {

        let byteCharacters = atob(b64Data);
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

    /**
     * doanloads the attachment via ajax request
     */
    private downloadAttachment() {
        this.backend.getRequest('module/' + this.model.module + '/' + this.model.id + '/noteattachment').subscribe(fileData => {
            let blob = this.b64toBlob(fileData.file, fileData.file_mime_type);
            let blobUrl = URL.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.href = blobUrl;
            a.download = fileData.filename;
            a.type = fileData.file_mime_type;
            a.click();
            a.remove();
        });
    }

    /**
     * a preview window for the file. if there is not a file type that can be previewed the file is downloaded
     */
    private previewFile() {

        if (this.model.getFieldValue('file_mime_type')) {
            let fileTypeArray = this.model.getFieldValue('file_mime_type').split("/");
            // check the application
            switch (fileTypeArray[0]) {
                case "image":
                    this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                        modalref.instance.imgname = this.value;
                        modalref.instance.imgtype = this.model.getFieldValue('file_mime_type');
                        this.backend.getRequest('module/' + this.model.module + '/' + this.model.id + '/noteattachment').subscribe(file => {
                            modalref.instance.imgsrc = 'data:' + this.model.getFieldValue('file_mime_type') + ';base64,' + file.file;
                        });
                    });
                    break;
                case 'text':
                case 'audio':
                case 'video':
                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                        modalref.instance.name = this.value;
                        modalref.instance.type = this.model.getFieldValue('file_mime_type');
                        this.backend.getRequest('module/' + this.model.module + '/' + this.model.id + '/noteattachment').subscribe(file => {
                            modalref.instance.data = atob(file.file);
                        });

                    });
                    break;
                case "application":
                    switch (fileTypeArray[1]) {
                        case 'pdf':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = this.value;
                                modalref.instance.type = this.model.getFieldValue('file_mime_type');
                                this.backend.getRequest('module/' + this.model.module + '/' + this.model.id + '/noteattachment').subscribe(file => {
                                    modalref.instance.data = atob(file.file);
                                });
                            });
                            break;
                        default:
                            this.downloadAttachment();
                            break;
                    }
                    break;
                default:
                    this.downloadAttachment();
                    break;
            }
        } else {
            this.downloadAttachment();
        }
    }

    /**
     * stop default propagation for the event
     *
     * @param event
     */
    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length == 1 && event.dataTransfer.items[0].kind === 'file') || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    /**
     * handle the drop event when a file is dropped
     *
     * @param files
     */
    private onDrop(files: FileList) {
            this.doupload(files);
    }

}
