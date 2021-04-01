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
    Component, OnInit, Input, NgZone, Output, EventEmitter, ViewChild, ViewContainerRef, Renderer2, Injector
} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachment-file',
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentfile.html',
})
export class SpiceAttachmentFile {


    /**
     * the file
     *
     * @private
     */
    @Input() private file: any = {};


    /**
     * if we are editing and thus can unlink files
     *
     * @private
     */
    @Input() private editmode: boolean = true;

    /**
     * the modalatatchments service
     * passed in as input since the container knows if self or parent element
     */
    @Input() private modelattachments: modelattachments;

    constructor(private userpreferences: userpreferences, private modal: modal, private toast: toast, private helper: helper, private injector: Injector) {

    }

    get humanFileSize() {
        return this.modelattachments.humanFileSize(this.file.filesize);
    }

    get filedate() {
        return this.file.date ? this.file.date.format(this.userpreferences.getDateFormat()) : '';
    }

    get uploading() {
        return this.file.hasOwnProperty('uploadprogress');
    }

    get progressbarstyle() {
        return {
            width: this.file.uploadprogress + '%'
        };
    }

    private downloadFile() {
        if (!this.uploading) {
            this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
        }
    }

    /**
     * handle the preview of the file
     *
     * @param e
     */
    private previewFile(e) {
        // stop the event from bubbling
        e.preventDefault();
        e.stopPropagation();

        if (this.uploading) {
            this.toast.sendToast('upload still in progress', "info");
            return;
        }

        if (this.file.file_mime_type) {
            let fileTypeArray = this.file.file_mime_type.toLowerCase().split("/");
            // check the application
            switch (fileTypeArray[0].trim()) {
                case "image":
                    this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                        modalref.instance.imgname = this.file.filename;
                        modalref.instance.imgtype = this.file.file_mime_type.toLowerCase();
                        this.modelattachments.getAttachment(this.file.id).subscribe(
                            file => {
                                modalref.instance.imgsrc = 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + file;
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
                        modalref.instance.name = this.file.filename;
                        modalref.instance.type = this.file.file_mime_type.toLowerCase();
                        this.modelattachments.getAttachment(this.file.id).subscribe(
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
                                modalref.instance.name = this.file.filename;
                                modalref.instance.type = this.file.file_mime_type.toLowerCase();
                                this.modelattachments.getAttachment(this.file.id).subscribe(
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
                            let nameparts = this.file.filename.split('.');
                            let type = nameparts.splice(-1, 1)[0];
                            switch (type.toLowerCase()) {
                                case 'msg':
                                    this.modal.openModal('EmailPreviewModal', true, this.injector).subscribe(modalref => {
                                        modalref.instance.name = this.file.filename;
                                        modalref.instance.type = this.file.file_mime_type.toLowerCase();
                                        modalref.instance.file = this.file;
                                    });
                                    break;
                                default:
                                    this.downloadFile();
                                    break;
                            }
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
     * action to delete the file
     */
    private deleteFile() {
        if (this.editmode) {
            this.modelattachments.deleteAttachment(this.file.id);
        }
    }
}
