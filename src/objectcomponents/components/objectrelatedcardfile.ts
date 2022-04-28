/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit, Injector} from "@angular/core";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from "../../services/userpreferences.service";
import {helper} from "../../services/helper.service";

@Component({
    selector: "[object-related-card-file]",
    templateUrl: "../templates/objectrelatedcardfile.html"
})
export class ObjectRelatedCardFile {

    @Input() public file: any = {};

    /**
     * holds the big thumbnail value
     */
    @Input() public bigThumbnail: boolean = false;

    constructor(public modelattachments: modelattachments, public userpreferences: userpreferences, public modal: modal, public toast: toast, public helper: helper, public injector: Injector) {

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

    public downloadFile() {
        if (!this.uploading) {
            this.modelattachments.downloadAttachment(this.file.id, this.file.filename);
        }
    }

    public previewFile() {
        if (this.uploading) {
            this.toast.sendToast('upload still in progress', "info");
            return;
        }

        if (this.file.file_mime_type) {
            let fileTypeArray = this.file.file_mime_type.toLowerCase().split("/");
            // check the application
            switch (fileTypeArray[0].trim()) {
                case "image":
                    switch (fileTypeArray[1]) {
                        case 'svg+xml':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = this.file.filename;
                                modalref.instance.type = this.file.file_mime_type.toLowerCase();
                                this.modelattachments.getAttachment(this.file.id).subscribe({
                                    next: (file) => {
                                        modalref.instance.data = atob(file);
                                    },
                                    error: (err) => {
                                        modalref.instance.loadingerror = true;
                                    }
                                });
                            });
                            break;
                        default:
                            this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                                modalref.instance.imgname = this.file.filename;
                                modalref.instance.imgtype = this.file.file_mime_type.toLowerCase();
                                this.modelattachments.getAttachment(this.file.id).subscribe({
                                    next: (file) => {
                                        modalref.instance.imgsrc = 'data:' + this.file.file_mime_type.toLowerCase() + ';base64,' + file;
                                    },
                                    error: (err) => {
                                        modalref.instance.loadingerror = true;
                                    }
                                });
                            });
                    }
                    break;
                case 'text':
                case 'audio':
                case 'video':
                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                        modalref.instance.name = this.file.filename;
                        modalref.instance.type = this.file.file_mime_type.toLowerCase();
                        this.modelattachments.getAttachment(this.file.id).subscribe({
                            next: (file) => {
                                modalref.instance.data = atob(file);
                            },
                            error: (err) => {
                                modalref.instance.loadingerror = true;
                            }
                        });
                    });
                    break;
                case "application":
                    switch (fileTypeArray[1]) {
                        case 'pdf':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = this.file.filename;
                                modalref.instance.type = this.file.file_mime_type.toLowerCase();
                                this.modelattachments.getAttachment(this.file.id).subscribe({
                                    next: (file) => {
                                        modalref.instance.data = atob(file);
                                    },
                                    error: (err) => {
                                        modalref.instance.loadingerror = true;
                                    }
                                });
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
}
