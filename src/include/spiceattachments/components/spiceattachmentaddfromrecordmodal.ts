/**
 * @module ModuleSpiceAttachments
 */
import {
    ChangeDetectionStrategy,
    Component,
    ChangeDetectorRef,
    ComponentRef,
    Renderer2, Injector, Input, ElementRef, Output, SkipSelf
} from '@angular/core';
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {modal} from "../../../services/modal.service";
import {toast} from "../../../services/toast.service";
import {metadata} from "../../../services/metadata.service";
import {Observable, Subject} from "rxjs";
import {backend} from "../../../services/backend.service";
import {broadcast} from "../../../services/broadcast.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-attachment-add-from-record-modal',
    templateUrl: '../templates/spiceattachmentaddfromrecordmodal.html',
    providers: [modelattachments],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceAttachmentAddFromRecordModal {

    public self: ComponentRef<SpiceAttachmentAddFromRecordModal>;

    public parent: model;

    public selectedFilesCount: number = 0;

    /**
     * holds all files
     */
    public files: any = [];


    constructor(
        @SkipSelf() public emailAttachments: modelattachments,
        public modelattachments: modelattachments,
        public language: language,
        public model: model,
        public backend: backend,
        public toast: toast,
        public modal: modal,
        public cdRef: ChangeDetectorRef,
        public broadcast: broadcast,
    ) {
    }

    public ngAfterViewInit() {
        this.setModelData();

        this.loadFiles();

    }

    /**
     * clones the attachments
     */
    public save() {

        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {

            // retrieve selected files from frontend
            const selected = this.modelattachments.files.filter(file => file.selected);

            // clone attachments from Email to parent bean
            this.cloneAttachmentsFromBean(this.parent, selected).subscribe(res => {
                this.emailAttachments.getAttachments().subscribe({
                    next: () => {
                        loadingRef.instance.self.destroy();
                        this.close();
                    }
                });

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
        this.modelattachments.files.forEach(f=> f.selected = val);
        this.selectedFilesCount = val ? this.modelattachments.files.filter(file=>file.selected).length : 0;
    }

    /**
     * @return true if all attachments are selected
     */
    get selectAll() {
        return this.modelattachments.files.length == this.selectedFilesCount;
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    public loadFiles() {
        this.modelattachments.getAttachments().subscribe(res => {
            this.cdRef.detectChanges();
            this.files = res;
        });
    }

    public setModelData() {
        this.modelattachments.module = this.parent.data.parent_type;
        this.modelattachments.id = this.parent.data.parent_id;
    }

    public close() {
        this.self.destroy();
    }

    public toggleSelectFile(file: {selected: boolean}) {

        file.selected = !file.selected;

        if (file.selected) {
            this.selectedFilesCount++;
        } else {
            this.selectedFilesCount--;
        }
    }

}
