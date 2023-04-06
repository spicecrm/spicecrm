/**
 * @module ObjectComponents
 */
import {Component, ViewContainerRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    templateUrl: '../templates/esigndocumentsactionbutton.html',
    providers: [relatedmodels]
})
export class ESignDocumentsActionButton {

    /**
     * the list fo the didsctionary items
     */
    public templates: any[] = [];

    /**
     * the participants to be displayed. Loaded initially and then handled by the field itself
     */
    public participants: any[] = [];

    public modalTitle: string;

    /**
     * holds the action config
     */
    public actionconfig: any;

    constructor(
        public language: language,
        public model: model,
        public modal: modal,
        public backend: backend,
        public configuration: configurationService,
        public viewContainerRef: ViewContainerRef,
        public relatedModels: relatedmodels
    ) {
    }

    /**
     * loads the output templates either from the configuration service if they are loaded already or from the backend
     */
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
                this.backend.getRequest('module/OutputTemplates/formodule/' + this.model.module, {}).subscribe(
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

    /**
     * call the parent open output with live compile
     */
    public openOutput() {
        if (this.actionconfig.participantsLink && this.actionconfig.participantsModule) {

            const loading = this.modal.await('LBL_LOADING');

            this.relatedModels.id = this.model.id;
            this.relatedModels.module = this.model.module;
            this.relatedModels.relatedModule = this.actionconfig.participantsModule;
            this.relatedModels.linkName = this.actionconfig.participantsLink;// load more items
            this.relatedModels.loaditems = 100;
            this.relatedModels.getData().subscribe(bool => {

                if (!bool) return;

                if (this.templates.length > 0) {
                    // sort the templates
                    this.templates.sort((a, b) => a.name > b.name ? 1 : -1);

                    // open the modal
                    this.modal.openModal(this.actionconfig.modalcomponent, true, this.viewContainerRef.injector).subscribe(outputModal => {

                        outputModal.instance.relatedParticipants = this.relatedModels.items

                        loading.next(true);
                        loading.complete();
                    });
                } else {
                    this.modal.info('No Templates Found', 'there are no Output templates defined for the Module');
                }

            });
        }
    }
}

