import {Component, ComponentRef, EventEmitter, OnInit, Output, SkipSelf, Injector} from '@angular/core';
import {model} from "../../../services/model.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {modellist} from "../../../services/modellist.service";
import {modelattachments} from "../../../services/modelattachments.service";
import {view} from "../../../services/view.service";
import {Observable, Subject, Subscription} from "rxjs";
import {modal} from "../../../services/modal.service";

@Component({
    selector: 'global-header-document-revisions-modal',
    templateUrl: '../templates/globalheaderdocumentrevisionsmodal.html',
    providers: [model, view, modellist, modelattachments]
})
export class GlobalHeaderDocumentRevisionsModal implements OnInit {

    public self: ComponentRef<GlobalHeaderDocumentRevisionsModal>;

    public fieldset: string = '';

    public componentconfig: any;
    public relatedRevisions = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public modelattachments: modelattachments,
        public injector: Injector,
        public view: view,
        public modellist: modellist,
    ) {
        // this.model.module = 'DocumentRevisions';
        // this.model.initialize();
        // this.backend.getRequest(`/module/documentrevisions/relatedRevisions/${this.model.data.assigned_user_id}`).subscribe(
        //     res => {
        //         this.relatedRevisions = res;
        //         console.log('Test')

        // })

    }


    public ngOnInit() {
        this.model.module = 'DocumentRevisions';
        this.model.initialize();
        this.loadRelated();
        // this.model.module = 'DocumentRevisions'
        // get the config
        let componentconfig = this.metadata.getComponentConfig('GlobalHeaderDocumentRevisionsModal', 'DocumentRevisions');
        this.fieldset = componentconfig.fieldset;
    }



    public loadRelated(){

        this.backend.getRequest(`/module/documentrevisions/relatedRevisions/${this.model.data.assigned_user_id}`).subscribe(
            res => {
                this.relatedRevisions = res;


                // this.orgunits = beans.orgunits;
                // this.orgcharts = beans.orgcharts;
            })
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

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }
}
