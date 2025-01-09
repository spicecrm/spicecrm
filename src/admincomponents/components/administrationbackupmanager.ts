import {Component, ComponentRef, OnInit} from '@angular/core';
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {AdministrationBackupManagerPreviewModal} from "./administrationbackupmanagerpreviewmodal";

@Component({
    selector: 'administration-backup-manager',
    templateUrl: '../templates/administrationbackupmanager.html'
})

export class AdministrationBackupManager implements OnInit {
    /**
     * contains all backup files currently presented in the /backups folder
     */
    public backupFiles: { fileCreated: string, pathName: string }[] = [];

    /**
     * loading state
     */
    public loading: boolean = true;

    /**
     * count of the backup files
     */
    public _count: number;

    constructor(public backend: backend, public modal: modal, public toast: toast) {
    }

    /**
     * retrieve all backup files
     */
    public getBackupFiles() {
        this.backend.getRequest('configuration/backup/list')
            .subscribe({
                next: (res) => {
                    this.loading = false;
                    this.backupFiles = res;
                },
                error: () => {
                    this.loading = false;
                    this.toast.sendToast('LBL_ERROR_LOADING_DATA', 'error');
                }
            })
    }

    get count() {
        return this.backupFiles.length;
    }

    ngOnInit() {
        this.getBackupFiles();
    }

    /**
     * displays the file with the ability to delete it
     * @param filePath     full path of the file
     * @param fileCreated  date when the file has been created
     * @param action       action to be preformed
     */
    public manageFile(filePath: string, action: string, fileCreated?: string): void {
        let awaitModal = this.modal.await('LBL_LOADING');
        let body = {filePath: filePath, action: action}

        if (action == 'preview') {
            this.backend.postRequest('configuration/backup/manage', {}, body)
                .subscribe({
                    next: (res) => {
                        this.modal.openStaticModal(AdministrationBackupManagerPreviewModal).subscribe({
                            next: (modalRef: ComponentRef<AdministrationBackupManagerPreviewModal>) => {
                                awaitModal.emit();
                                awaitModal.complete();
                                modalRef.instance.fileContent = res.fileContent;
                                modalRef.instance.filePath = filePath;
                                modalRef.instance.fileCreated = fileCreated;
                                modalRef.instance.delete$.subscribe({
                                    next: () => {
                                        this.delete(filePath, modalRef.instance);
                                    }
                                })
                            }
                        })
                    },
                    error: () => {
                        awaitModal.emit();
                        awaitModal.complete();
                        this.toast.sendToast('LBL_ERROR')
                    }
                })
        } else {
            this.backend.getDownloadPostRequestFile('configuration/backup/manage', {}, body)
                .subscribe({
                    next: (res) => {
                        awaitModal.emit();
                        awaitModal.complete();
                        const a: HTMLAnchorElement = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = res;
                        a.type = 'application/sql'
                        a.download = `${fileCreated}.sql`;
                        a.click();
                        a.remove();
                    },
                    error: () => {
                        awaitModal.emit();
                        awaitModal.complete();
                        this.toast.sendToast('LBL_ERROR_DOWNLOADING', 'warning');
                    }
                })
        }


    }

    /**
     * deletes the selected file
     * @param filePath     full path of the file
     * @param modalInstance
     */
    public delete(filePath: string, modalInstance?: AdministrationBackupManagerPreviewModal): void {
        let params = {filePath: filePath};

        this.modal.confirm('MSG_DELETE_RECORD', 'LBL_DELETE')
            .subscribe({
                next: (res) => {
                    if (res) {
                        const awaitModal = this.modal.await('LBL_LOADING');

                        this.backend.deleteRequest('configuration/backup/delete', params)
                            .subscribe({
                                next: () => {
                                    let deletedItemIndex = this.backupFiles.findIndex(item => item.pathName === filePath);
                                    this.backupFiles.splice(deletedItemIndex, 1);
                                    if (modalInstance) {
                                        modalInstance.self.destroy();
                                    }
                                    awaitModal.emit(true);
                                    awaitModal.complete();
                                },
                                error: () => {
                                    awaitModal.emit(true);
                                    awaitModal.complete();
                                }
                            })
                    }
                }
            })
    }
}