/**
 * @module ModuleSpiceAttachments
 */
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {model} from "../../../services/model.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * Display edit fields for spice attachment
 */
@Component({
    selector: 'spice-attachments-set-folder-modal',
    templateUrl: '../templates/spiceattachmentssetfoldermodal.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentsSetFolderModal implements OnInit{
    /**
     * passed from the modal trigger
     */
    public attachment: any = {};

    public folders: any[] = [];

    /**
     * holds the new folder
     */
    public folderID: string

    /**
     * holds references of self to destroy the modal
     * @private
     */
    public self: any = {};

    constructor(
        public modelattachments: modelattachments,
        public backend: backend,
        public toast: toast,
    ) {
        this.folders = JSON.parse(JSON.stringify(this.modelattachments.folderTreeItems));
    }

    public ngOnInit() {
        this.folderID = this.attachment.folderId ?? 'root';
    }

    public handleChange(newFolder){
        this.folderID = newFolder;
    }

    get attachmentFolerID(){
        return this.attachment.folder_id ?? 'root';
    }

    get currentFolderID(){
        return this.modelattachments.folderId ?? 'root';
    }

    /**
     * close the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }

    /**
     * save the attachment changes
     * @private
     */
    public save() {
        const body = {
            folder_id: this.folderID == 'root' ? '' : this.folderID
        };

        this.backend.postRequest('common/spiceattachments/' + this.attachment.id, {}, body).subscribe({
            next: (res) => {
                if (!!res && !!res.success) {
                    this.attachment.folder_id = body.folder_id;
                    this.modelattachments.folderId = body.folder_id;
                    this.toast.sendToast('LBL_DATA_SAVED', 'success');
                } else {
                    this.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                }
                this.self.destroy();
            },
            error: () => {
                this.toast.sendToast('ERR_NETWORK', 'error');
                this.self.destroy();
            }
        });
    }

}
