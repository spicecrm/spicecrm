import {Component, ComponentRef, EventEmitter, OnDestroy} from '@angular/core';

@Component({
    selector: 'administration-backup-manager-preview-modal',
    templateUrl: '../templates/administrationbackupmanagerpreviewmodal.html'
})

export class AdministrationBackupManagerPreviewModal implements OnDestroy {
    /**
     * content of the backup file
     */
    public fileContent: string;

    /**
     * reference to the modal itself
     */
    public self: ComponentRef<this>;

    /**
     * file name / date of the file creation. For the modal header display
     */
    public fileCreated: string;

    /**
     * file path
     */
    public filePath: string;

    /**
     * delete event emitter
     */
    public delete$: EventEmitter<void> = new EventEmitter<void>();

    /**
     * close the modal
     */
    public close() {
        this.self.destroy();
    }

    /**
     * emit the delete action
     */
    public delete() {
        this.delete$.emit();
    }

    public ngOnDestroy() {
        this.delete$.complete();
    }
}