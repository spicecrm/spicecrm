/**
 * @module ModuleSAPIDOCs
 */
import {Component, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";

import {language} from "../../../services/language.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {metadata} from "../../../services/metadata.service";
import {backend} from "../../../services/backend.service";
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";
import {modelattachments} from "../../../services/modelattachments.service";

@Component({
    templateUrl: '../templates/esigndocumentatcionsfields.html',
    providers: [modelattachments],
})
export class ESignDocumentAtcionsFields extends fieldGeneric {

    /**
     * if the envelope is Completed active openmodel button
     */
    public isCompleted: boolean = false

    constructor(
        public model: model,
        public modal: modal,
        public view: view,
        public language: language,
        public metadata: metadata,
        public backend: backend,
        public router: Router,
        public modelattachments: modelattachments,
        public viewContainerRef: ViewContainerRef,
    ) {
        super(model, view, language, metadata, router);
        let status = this.model.getField('envelpoe_status')
        if (status == 'completed') {
            this.isCompleted = true
        }
    }

    /**
     * open the modal
     * @param GUID {envelope}
     */
    public openParticipantsModel(envelopeId) {
        this.modal.openModal('ESignDocumentParticipantsModel', true, this.viewContainerRef.injector).subscribe(participantsModal => {
            participantsModal.instance.envelope_id = envelopeId;
        });
    }

    /**
     * handle the preview of the file
     * @param GUID {envelope}
     * @param e
     */
    public previewFile(e, envelopeId) {
        // stop the event from bubbling
        e.preventDefault();
        e.stopPropagation();

        let module = 'ESignDocuments'
        this.backend.getRequest(`common/spiceattachments/module/${module}/${envelopeId}`).subscribe(
            fileData => {
                if (fileData.length > 0) {
                    this.modal.openModal('SystemObjectPreviewModal').subscribe(modalref => {

                        modalref.instance.name = fileData[0].filename;
                        modalref.instance.type = fileData[0].file_mime_type.toLowerCase();
                        this.modelattachments.module = module
                        this.modelattachments.id = envelopeId
                        this.modelattachments.getAttachment(fileData[0].id).subscribe(
                            file => {
                                modalref.instance.data = atob(file);
                            },
                            err => {
                                modalref.instance.loadingerror = true;
                            }
                        );
                    });
                }

            },
            err => {
                console.log(err)
            });
    }


}

