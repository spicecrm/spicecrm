/**
 * @module ObjectComponents
 */
import {Component, ElementRef, Injector, Input} from "@angular/core";
import {language} from "../../services/language.service";
import {modelattachments} from "../../services/modelattachments.service";
import {broadcast} from "../../services/broadcast.service";
import {modal} from '../../services/modal.service';
import {Router} from "@angular/router";
import {navigationtab} from "../../services/navigationtab.service";
import {toast} from "../../services/toast.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders the action menu for the attachment
 */
@Component({
    selector: "object-file-action-menu",
    templateUrl: "../templates/objectfileactionmenu.html"
})
export class ObjectFileActionMenu {

    @Input() public file: any;

    public currentUser: '';

    constructor(public broadcast: broadcast,
                public modelattachments: modelattachments,
                public language: language,
                public elementRef: ElementRef,
                public modalservice: modal,
                public injector: Injector,
                public router: Router,
                public navigationtab: navigationtab,
                public toast: toast,
                public modal: modal,
                public metadata: metadata) {
        this.currentUser = this.metadata.session.authData.user.id;
    }

    get uploading() {
        return this.file.hasOwnProperty('uploadprogress');
    }
    /**
     * determines where the menu is opened
     */
    public getDropdownLocationClass() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if (window.innerHeight - rect.bottom < 100) {
            return "slds-dropdown--bottom";
        }
    }

    /**
     * check ACL and ownership for delete and hide the button if false
     */
    get hidden(): boolean {
        return !this.metadata.checkModuleAcl('Application', "manageattachments") && this.currentUser != this.file.user_id;
    }

    /**
     * action to delete the file
     *
     */
    public deleteFile() {
        this.modalservice.confirm(this.language.getLabel('QST_DELETE_FILE'), this.language.getLabel('QST_DELETE_FILE', null, 'short')).subscribe((answer) => {
            if (answer) this.modelattachments.deleteAttachment(this.file.id);
        });
    }

    /**
     * triggers the download of the file
     */
    public downloadFile() {
        this.modelattachments.downloadAttachment(this.file.id, this.file.name);
    }

    /**
     * open edit modal and fill in the input data
     */
    public edit() {
        this.modalservice.openModal('SpiceAttachmentsEditModal', true, this.injector).subscribe(
            modalRef => {
                modalRef.instance.attachment = this.file;
                modalRef.instance.inputData = {
                    text: this.file.text,
                    display_name: this.file.display_name,
                    category_ids: !this.file.category_ids ? [] : this.file.category_ids.split(',')
                };
            }
        );
    }

    /**
     * handle the preview of the file
     */
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

}
