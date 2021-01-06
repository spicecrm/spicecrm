/**
 * @module ModuleDocuments
 */
import {Component, EventEmitter, OnDestroy, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {ObjectActionOutputBeanButton} from "../../outputtemplates/components/objectactionoutputbeanbutton";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'document-create-revision-button',
    templateUrl: './src/modules/documents/templates/documentcreaterevisionbutton.html'
})
export class DocumentCreateRevisionButton extends ObjectActionOutputBeanButton implements OnDestroy{

    private subscriptions = new Subscription();

    constructor(
        protected language: language,
        protected model: model,
        protected modal: modal,
        protected backend: backend,
        protected configuration: configurationService,
        protected viewContainerRef: ViewContainerRef,
        protected relatedmodels: relatedmodels
    ) {
        super(language, model, modal, backend, configuration, viewContainerRef);
    }

    public openOutput() {
        if (this.templates.length > 0) {
            // sort the templates
            this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

            // open the modal
            this.modal.openModal('DocumentCreateRevisionModal', true, this.viewContainerRef.injector).subscribe(outputModal => {
                let documentEmitter = new EventEmitter<any>();
                outputModal.instance.templates = this.templates;
                outputModal.instance.modalTitle = 'LBL_CREATE_REVISION';
                outputModal.instance.handBack = documentEmitter;
                this.subscriptions.add(
                    documentEmitter.subscribe(document => {
                        this.backend.postRequest(`module/Documents/${this.model.id}/revisionFromBase64`, '', {
                            file_name: document.name + '.pdf',
                            file: document.content,
                            file_mime_type: 'application/pdf',
                            documentrevisionstatus: 'r'
                        }).subscribe(handled => {
                            this.relatedmodels.getData();
                        })
                    })
                );
            });
        } else {
            this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
        }
    }

    /**
     * cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
