/**
 * @module ModuleSpiceAttachments
 */
import {Component, Input, Injector} from '@angular/core';
import {helper} from "../../../services/helper.service";
import {modal} from "../../../services/modal.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {navigationtab} from "../../../services/navigationtab.service";
import {Router} from "@angular/router";

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'spice-attachment-file',
    templateUrl: '../templates/spiceattachmentfile.html',
})
export class SpiceAttachmentFile {

    /**
     * the file
     */
    @Input() public file: any = {};

    /**
     * if we are editing and thus can unlink files
     */
    @Input() public editmode: boolean = true;

    /**
     * the modalatatchments service
     * passed in as input since the container knows if self or parent element
     */
    @Input() public modelattachments: modelattachments;

    /**
     * disables the preview click
     */
    @Input() public disabled: boolean = false;

    /**
     * a paramater to be set to force the previe of the attachments ina  modal
     */
    @Input() public forceModalPreview: boolean = false;

    constructor(
        public userpreferences: userpreferences,
        public modal: modal,
        public toast: toast,
        public helper: helper,
        public injector: Injector,
        public navigationtab: navigationtab,
        public router: Router) {
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

    public preview(e){
        if(this.forceModalPreview){
            this.previewFile(e);
        } else {
            this.openInTab();
        }
    }

    /**
     * opens file/url in a new tab
     * module/:module/:moduleId/:attachment/:attachmentId
     */
    public openInTab() {
        // disable click event
        if(this.disabled) return;

        let fileTypeArray = this.file.file_mime_type.toLowerCase().split("/");

        // disable preview for specific files
        const applicationFile = fileTypeArray[0] == 'application' && fileTypeArray[1] != 'pdf' && fileTypeArray[1] != 'msg';
        const csvFile = fileTypeArray[0] == 'text' && fileTypeArray[1] == 'csv';
        if(applicationFile || csvFile) return this.downloadFile();

        let routePrefix = '';
        if (this.navigationtab?.tabid) {
            routePrefix = '/tab/' + this.navigationtab.tabid;
        }
        this.router.navigate([`${routePrefix}/attachment/${this.file.id}/${this.modelattachments.module}/${this.modelattachments.id}`]);
    }

    /**
     * handle the preview of the file
     * @param e
     */
    public previewFile(e) {
        // disable click event
        if(this.disabled) return;

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
                            break;
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

    /**
     * action to delete the file
     */
    public deleteFile() {
        if (this.editmode) {
            this.modelattachments.deleteAttachment(this.file.id);
        }
    }
}
