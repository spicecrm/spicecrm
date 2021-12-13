/**
 * @module ModuleDocuments
 */
import {Component, EventEmitter, OnDestroy, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {Subscription} from "rxjs";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'document-create-revision-button',
    templateUrl: '../templates/documentcreaterevisionbutton.html'
})
export class DocumentCreateRevisionButton implements OnDestroy{

    public templates: any[] = [];
    public forcedFormat: 'html'|'pdf';
    public modalTitle: string;
    public noDownload: boolean;
    public handBack: EventEmitter<string>;
    public buttonText: string;
    public subscriptions = new Subscription();

    /**
     * holds the action config
     */
    public actionconfig: {modal_actionset: string};

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
        public configuration: configurationService,
        public viewContainerRef: ViewContainerRef,
        public relatedmodels: relatedmodels
    ) {

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
                        this.backend.postRequest(`module/Documents/${this.model.id}/revisionfrombase64`, '', {
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

    public execute() {
        let waitingModal: any;

        let outPutTemplates = this.configuration.getData('OutputTemplates');
        if (outPutTemplates && outPutTemplates[this.model.module]) {
            this.templates = outPutTemplates[this.model.module];
            this.openOutput();
        } else {
            outPutTemplates = {};
            this.modal.openModal('SystemLoadingModal', false).subscribe(waitingModal => {
                waitingModal.instance.messagelabel = 'Loading Templates';
                this.backend.getRequest('module/OutputTemplates/formodule/'+this.model.module, {}).subscribe(
                    (data: any) => {
                        // kill the watign modal
                        waitingModal.instance.self.destroy();
                        // set the templates
                        this.configuration.setData('OutputTemplates', data);

                        // set the templates internally
                        this.templates = data;

                        // open the output
                        this.openOutput();
                    },
                    (error: any) => {
                        waitingModal.instance.self.destroy();
                    }
                );
            });
        }
    }

}
