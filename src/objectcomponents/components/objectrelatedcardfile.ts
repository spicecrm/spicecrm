/**
 * @module ObjectComponents
 */
import {Component, Input, OnInit, Injector} from "@angular/core";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {modal} from "../../services/modal.service";
import {userpreferences} from "../../services/userpreferences.service";
import {helper} from "../../services/helper.service";
import {navigationtab} from "../../services/navigationtab.service";
import {Router} from "@angular/router";

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

    /**
     * disables the click event
     */
    @Input() public disabled: boolean = false;

    constructor(
        public modelattachments: modelattachments,
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

    /**
     * opens file/url in a new tab
     * module/:module/:moduleId/:attachment/:attachmentId
     */
    public openInTab() {
        // disable click event
        if(this.disabled) return;

        // disable preview for specific files
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

}
