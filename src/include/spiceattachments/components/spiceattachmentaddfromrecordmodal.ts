/**
 * @module ModuleSpiceAttachments
 */
import {
    ChangeDetectionStrategy,
    Component,
    ChangeDetectorRef,
    ComponentRef,
    Injector,
    SkipSelf
} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {Observable, Subject} from "rxjs";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";
import {SpiceAttachmentsPanel} from "./spiceattachmentspanel";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-attachment-add-from-record-modal',
    templateUrl: '../templates/spiceattachmentaddfromrecordmodal.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SpiceAttachmentAddFromRecordModal {

    public self: ComponentRef<SpiceAttachmentAddFromRecordModal>;

    public parent: model;
    /**
     * holds all files
     */
    public files: any = [];

    /**
     * when true, displays the selected files
     */
    public showSelected: boolean = false;

    public filesToPreview: any[] = [];

    public visibleFiles: any[] = [];


    constructor(
        private attachmentsPanelComponent: SpiceAttachmentsPanel,
        @SkipSelf() public emailAttachments: modelattachments,
        public modelattachments: modelattachments,
        public language: language,
        public model: model,
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public cdRef: ChangeDetectorRef,
        public broadcast: broadcast,
        public injector: Injector
    ) {
    }

    public ngAfterViewInit() {
        this.setModelData();
        this.loadFiles();

        this.modelattachments.folderId$.subscribe({
            next: () => {
                this.visibleFiles = this.modelattachments.files;
            }
        })
    }

    get selectedFilesWithFolderPath() {
        this.modelattachments._files.filter(f => f.selected && f.file_mime_type != 'folder' && f.folder_id).forEach(file => {
            file.display_name = this.buildFolderPath(file) + '/' + file.filename;
        })
        return this.modelattachments._files.filter(f => f.selected && f.file_mime_type != 'folder');
    }

    /**
     * clones the attachments
     */
    public save() {

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {

            // clone attachments from Email to parent bean
            this.cloneAttachmentsFromBean(this.parent, this.selectedFilesWithFolderPath).subscribe(res => {
                this.attachmentsPanelComponent.loadFiles();
                loadingRef.instance.self.destroy();
                this.close();

                if (res) {
                    this.toast.sendToast('LBL_SUCCESS', 'success');
                } else {
                    this.toast.sendToast('LBL_ERROR', 'error');
                }
            });
        });
    }

    public cloneAttachmentsFromBean(parentModel: model, selectedFiles, categoryId?: string): Observable<any> {
        let retSubject = new Subject();

        const body = {
            categoryId: categoryId,
            selectedFiles: selectedFiles
        };

        this.backend.postRequest(`common/spiceattachments/module/${this.parent.module}/${this.parent.id}/clone/${this.parent.data.parent_type}/${this.parent.data.parent_id}`, {}, body, this.modelattachments.httpRequestsRefID).subscribe({
            next: response => {
                for (let attId in response) {
                    if (!this.modelattachments.files.find(a => a.id == attId)) {
                        response[attId].date = new moment(response[attId].date);
                        this.files.push(response[attId]);
                    }
                }

                // close the subject
                retSubject.next(this.files);
                retSubject.complete();
            },
            error: error => {
                // close the subject
                retSubject.error(error);
                retSubject.complete();
            }

        });
        return retSubject.asObservable();
    }

    /**
     * select/deselect all attachments based on the checkbox boolean value
     * @param val
     */
    set selectAll(val) {
        this.modelattachments.files.forEach(file => {
            file.selected = val;

            const selectFilesInFolder = (folderId) => {
                this.modelattachments._files.forEach(f => {
                    if (f.folder_id == folderId) {
                        f.selected = val;
                        if (f.file_mime_type == 'folder') {
                            selectFilesInFolder(f.id);
                        }
                    }
                });
            };

            if (file.file_mime_type == 'folder') {
                selectFilesInFolder(file.id);
            }
        });
    }

    /**
     * true if all files are selected in the given folder
     */
    get selectAll() {
        return this.modelattachments.files.every(file => file.selected);
    }

    get selectedFilesSize() {
        const totalSize = this.selectedFiles.total.reduce((acc, file) => {
            if (file.file_mime_type == 'folder') return acc;

            const rawSize = (file as any)?.filesize ?? (file as any)?.file_size ?? (file as any)?.size ?? 0;
            const numericSize = Number(rawSize);
            return acc + (isNaN(numericSize) ? 0 : numericSize);
        }, 0);
        return this.modelattachments.humanFileSize(totalSize);
    }

    get isFolderSelected() {
        return this.modelattachments.files.some(f => f.file_mime_type == 'folder' && f.selected);
    }

    get selectedFiles() {
        return {
            total: this.showSelected ? this.modelattachments._files.filter(f => f.selected && f.file_mime_type != 'folder') : this.modelattachments._files.filter(f => f.selected),
            folders: this.modelattachments._files.filter(f => f.file_mime_type == 'folder' && f.selected)
        }
    }

    get indeterminate() {
        let hasSelectedFiles = this.modelattachments._files.some(f => f.selected);
        return hasSelectedFiles && (this.modelattachments.files.filter(f => f.selected).length < this.modelattachments.files.length);
    }

    public getIndeterminateFile(file) {
        if (file.file_mime_type != 'folder') return false;

        const getAllFilesInFolder = (folderId) => {
            let files = [];
            this.modelattachments._files.forEach(f => {
                if (f.folder_id == folderId) {
                    files.push(f);
                    if (f.file_mime_type == 'folder') {
                        files = files.concat(getAllFilesInFolder(f.id));
                    }
                }
            });
            return files;
        };

        const allFiles = getAllFilesInFolder(file.id);

        if (allFiles.length == 0) {
            file.selected = false;
            return false;
        }

        const selectedCount = allFiles.filter(f => f.selected).length;

        if (selectedCount == allFiles.length) {
            file.selected = true;
        } else if (selectedCount == 0) {
            file.selected = false;
        }

        return selectedCount > 0 && selectedCount < allFiles.length;
    }

    get label(): string {
        return this.showSelected ? 'LBL_SELECTED_FILES' : 'LBL_ADD_FROM_RECORD';
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    public loadFiles() {
        this.modelattachments.getAttachments().subscribe({
            next: (res) => {
                this.cdRef.detectChanges();
                this.files = res;
                this.visibleFiles = this.modelattachments.files;
            }
        });
    }

    public setModelData() {
        this.modelattachments.module = this.parent.data.parent_type;
        this.modelattachments.id = this.parent.data.parent_id;
    }

    private buildFolderPath(file: any): string | null {
        let parts: string[] = [];
        let currentFolderId = file.folder_id;
        while (currentFolderId) {
            const folder = this.modelattachments._files.find(ff => ff.id == currentFolderId && ff.file_mime_type == 'folder');
            if (!folder) break;
            parts.unshift(folder.filename);
            currentFolderId = folder.folder_id;
        }
        return parts.length ? parts.join('/') : null;
    }

    public toggleShowSelected(): void {
        this.showSelected = !this.showSelected
        if (this.showSelected) {
            const selectedFiles = this.modelattachments._files.filter(f => f.selected && f.file_mime_type != 'folder');
            this.filesToPreview = selectedFiles.map(f => {
                if (!f.folder_id) return f;

                const path = this.buildFolderPath(f);

                if (path) {
                    f.display_name = `${path}/${f.filename}`;
                }
                return f;
            });
        }

        this.visibleFiles = this.showSelected ? this.filesToPreview : this.modelattachments.files;
    }

    public openFolder(file) {
        if(file.file_mime_type != 'folder') return;

        this.modelattachments.folderId = file.id;
        this.visibleFiles = this.modelattachments.files;
    }

    public resetFolderId() {
        this.modelattachments.folderId = null;
        this.visibleFiles = this.modelattachments.files
    }

    public close() {
        this.self.destroy();
    }

    public toggleSelect(file) {
        file.selected = !file.selected;

        const selectFilesInFolder = (folderId, val) => {
            this.modelattachments._files.forEach(f => {
                if (f.folder_id == folderId) {
                    f.selected = val;
                    if (f.file_mime_type == 'folder') {
                        selectFilesInFolder(f.id, val);
                    }
                }
            });
        };

        if (file.file_mime_type == 'folder') {
            selectFilesInFolder(file.id, file.selected);
        }
    }
}