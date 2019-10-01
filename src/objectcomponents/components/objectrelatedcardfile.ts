/**
 * @module ObjectComponents
 */
import {Component, Input} from "@angular/core";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from "../../services/userpreferences.service";
import {helper} from "../../services/helper.service";

@Component({
    selector: "[object-related-card-file]",
    templateUrl: "./src/objectcomponents/templates/objectrelatedcardfile.html"
})
export class ObjectRelatedCardFile {

    @Input() private file: any = {};


    constructor(private modelattachments: modelattachments, private userpreferences: userpreferences, private modal: modal, private toast: toast, private helper: helper ) {

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

    private previewFile() {
        if (this.uploading) {
            this.toast.sendToast('upload still in progress', "info");
            return;
        }

        if (this.file.file_mime_type) {
            let fileTypeArray = this.file.file_mime_type.split("/");
            // check the application
            switch (fileTypeArray[0]) {
                case "image":
                    this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                        modalref.instance.imgname = this.file.filename;
                        modalref.instance.imgtype = this.file.file_mime_type;
                        this.modelattachments.getAttachment(this.file.id).subscribe(file => {
                            modalref.instance.imgsrc = 'data:' + this.file.file_mime_type + ';base64,' + file;
                        });
                    });
                    break;
                case 'text':
                case 'audio':
                case 'video':
                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                        modalref.instance.name = this.file.filename;
                        modalref.instance.type = this.file.file_mime_type;
                        this.modelattachments.getAttachment(this.file.id).subscribe(file => {
                            modalref.instance.data = atob(file);
                        });
                    });
                    break;
                case "application":
                    switch (fileTypeArray[1]) {
                        case 'pdf':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = this.file.filename;
                                modalref.instance.type = this.file.file_mime_type;
                                this.modelattachments.getAttachment(this.file.id).subscribe(file => {
                                    modalref.instance.data = atob(file);
                                });
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
}
