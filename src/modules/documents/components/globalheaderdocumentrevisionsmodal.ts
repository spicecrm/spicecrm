import {Component, ComponentRef, EventEmitter, OnInit, Input, SkipSelf} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {Observable, Subject, Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";
import {session} from "../../../services/session.service";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html',
    providers: [model, modelattachments]
})
export class GlobalHeaderDocumentRevisionsModal implements OnInit {

    public self: ComponentRef<GlobalHeaderDocumentRevisionsModal>;

    public fieldset: string = '';

    /**
     * the documentrevisions coming from the button
     */
    @Input() public relatedRevisions: any;

    public componentconfig: any;
    // public relatedRevisions = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public modelattachments: modelattachments,
        public session: session,
    ) {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
    }


    public ngOnInit() {
        // this.model.module = 'DocumentRevisions'
        // get the config
        let exampleArray = this.relatedRevisions;
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderDocumentRevisionsModal', 'DocumentRevisions');
        this.fieldset = componentconfig.fieldset;
    }


    /**
     * process one step by rendering the modal component
     *
     * @param id
     */
    process(id) {
        let retSubject = new Subject();
        let relatedRevision = this.relatedRevisions.find(s => s.id == id);
        this.backend.getRequest(`common/spiceattachments/module/${this.model.module}/${relatedRevision.id}/byfield/file`).subscribe(
            fileData => {
                retSubject.next(fileData.file);
                    let fileTypeArray = fileData.file_mime_type.toLowerCase().split("/");
                    // check the application
                    switch (fileTypeArray[0].trim()) {
                        case "image":
                            this.modal.openModal('SystemImagePreviewModal').subscribe(modalref => {
                                modalref.instance.imgname = fileData.file_name;
                                modalref.instance.imgtype = fileData.file_mime_type.toLowerCase();
                                modalref.instance.imgsrc = 'data:' + fileData.file_mime_type.toLowerCase() + ';base64,' + fileData;
                            });
                            break;
                        case 'text':
                        case 'audio':
                        case 'video':
                            this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                modalref.instance.name = fileData.file_name;
                                modalref.instance.type = fileData.file_mime_type.toLowerCase();
                                modalref.instance.data = atob(fileData.file);
                            });
                            break;
                        case "application":
                            switch (fileTypeArray[1]) {
                                case 'pdf':
                                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {
                                        modalref.instance.name = fileData.file_name;
                                        modalref.instance.type = fileData.file_mime_type.toLowerCase();
                                        modalref.instance.data = atob(fileData.file);
                                    });
                                    break;
                                default:
                                    this.modelattachments.downloadAttachmentForField(this.model.module, relatedRevision.id, 'file');
                                    break;
                            }
                            break;
                        default:
                            this.modelattachments.downloadAttachmentForField(this.model.module, relatedRevision.id, 'file');
                            break;
                    }
                retSubject.complete();
            },
            err => {
                retSubject.error(err);
                retSubject.complete();
            }
        );
        return retSubject;
    }

    acceptance(id) {
        let body = {userid: this.session.authData.userId};
        this.backend.postRequest(`/module/documentrevisions/${id}/revisionaccepted`, '', body)
    }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }
}
