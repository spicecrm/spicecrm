import {ChangeDetectorRef, Component, ComponentRef} from '@angular/core';
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {view} from "../../../services/view.service";
import {modal} from "../../../services/modal.service";
import {Observable, Subject} from "rxjs";
import {broadcast} from "../../../services/broadcast.service";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'email-clone-attachments-modal',
    templateUrl: '../templates/emailcloneattachmentsmodal.html',
    providers: [view]
})

/**
 * clones SpiceAttachments from an Email to a parent Bean
 * i.e. attachments from Email Bean to Contact Bean
 * renders attachments in SpiceAttachmentFile component
 */
export class EmailCloneAttachmentsModal {

    /**
     * holds self instance of the modal
     */
    public self: ComponentRef<EmailCloneAttachmentsModal>;

    /**
     * set a new parent property
     */
    public parent: model;

    /**
     * files linked to an Email AND the parent Bean
     */
    public linkedFiles: any = [];

    /**
     * filtered files linked ONLY to an Email
     * which are not linked to Parent bean
     */
    public filteredFiles: any = [];

    /**
     * holds all files linked to a parent Bean
     */
    public parentFiles: any = [];

    /**
     * holds parentCount of the parent Bean attachments
     */
    public parentCount: number = 0;

    /**
     * loading error
     */
    public showIllustration: boolean = false;

    /**
     * shows/hides already cloned files
     */
    public showArchive: boolean = false;


    constructor(
        public model: model,
        public backend: backend,
        public toast: toast,
        public modelattachments: modelattachments,
        public cdRef: ChangeDetectorRef,
        public modal: modal,
        public broadcast: broadcast
    ) {}

    /**
     * load files after view was loaded
     * when timeout exceeded set loading error true
     */
    public ngAfterViewInit() {
        this.loadFiles();
    }

    /**
     * load all files and filter them
     * based on filemd5 field value check if the file is already linked to the parent
     */
    public loadFiles() {
        this.getParentAttachments(this.parent).subscribe({
            next: (parentFiles) => {

                // filter out files NOT linked to parent Bean
                this.filteredFiles = this.modelattachments.files.filter(x => !this.parentFiles.some(y => y.filemd5 === x.filemd5));
                if(this.filteredFiles.length == 0) this.showIllustration = true;

                this.linkedFiles = this.modelattachments.files.filter(x => this.parentFiles.some(y => y.filemd5 === x.filemd5));

                this.cdRef.detectChanges();
            }, error: () => {
                this.showIllustration = true;
                this.toast.sendToast('LBL_ERROR', 'error');
            }
        });
    }

    /**
     * Is everything ready to save?
     */
    public get canSave(): boolean {
        return this.filteredFiles.filter(file => file.selected).length > 0;
    }

    /**
     * clones the attachments
     */
    public save() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {

            // retrieve selected files from frontend
            const selected = this.modelattachments.files.filter(file => file.selected);

            // clone attachments from Email to parent bean
            this.cloneAttachmentsFromEmail(this.parent, selected).subscribe(res => {
                loadingRef.instance.self.destroy();
                if (res) {
                    this.toast.sendToast('LBL_SUCCESS', 'success');
                    this.close();
                } else {
                    this.toast.sendToast('LBL_ERROR', 'error');
                }

            });
        });
    }

    /**
     * broadcasts the total number of files found
     * sends reload information
     */
    public broadcastAttachmentCount() {
        this.broadcast.broadcastMessage('attachments.cloned', {
            module: this.parent.module,
            id: this.parent.id,
            attachmentcount: this.parentCount,
            clonedFiles: this.parentFiles,
            reload: true
        });
    }

    /**
     * closes and destroys the modal
     */
    public close() {
        this.self.destroy()
    }

    // backend calls

    /**
     * retrieves attachments from a bean and its parent
     * @param parent Bean i.e. Contacts
     */
    public getParentAttachments(parent: any): Observable<any> {
        let retSubject = new Subject();

        // load attachments first
        this.modelattachments.getAttachments().subscribe(res => {

            // retrieve attachments for parent
            this.backend.getRequest(`common/spiceattachments/module/${parent.module}/${parent.id}`, {}, this.modelattachments.httpRequestsRefID).subscribe({
                next: response => {
                    for (let attId in response) {
                        this.parentFiles.push(response[attId]);
                    }
                    // close the subject
                    retSubject.next(this.parentFiles);
                    retSubject.complete();
                },
                error: error => {
                    // close the subject
                    retSubject.error(error);
                    retSubject.complete();
                }
            })
        });

        return retSubject.asObservable();
    }


    /**
     * clone attachments from Email to parent Bean
     * @param parentModel
     * @param selectedFiles - files to be cloned from Email
     * @param categoryId
     */
    public cloneAttachmentsFromEmail(parentModel: model, selectedFiles, categoryId?: string): Observable<any> {
        let retSubject = new Subject();

        const body = {
            categoryId: categoryId,
            selectedFiles: selectedFiles
        };

        this.backend.postRequest(`common/spiceattachments/module/${this.parent.module}/${this.parent.id}/clone/${this.model.module}/${this.model.id}`, {}, body, this.modelattachments.httpRequestsRefID).subscribe({
            next: response => {
                for (let attId in response) {
                    if (!this.filteredFiles.find(a => a.id == attId)) {
                        response[attId].date = new moment(response[attId].date);
                        this.parentFiles.push(response[attId]);
                    }
                }
                // set the parentCount
                this.parentCount = this.parentFiles.length;

                // broadcast the parentCount
                this.broadcastAttachmentCount();

                // close the subject
                retSubject.next(this.parentFiles);
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
}