/**
 * @module EvalancheModule
 */

import {Component,Injector} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {backend} from "../../../services/backend.service";

/**
 * exports targetlist to Evalanche
 */
@Component({
    selector: 'prospectlists-to-evalanche-button',
    templateUrl: './src/include/evalanche/templates/prospectlisttoevalanchebutton.html',
})
export class ProspectListsToEvalancheButton {
    private evalanche: any[] = [];
    private spice: any[] = [];
    private difference: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modal: modal,
        private injector: Injector,
        private backend: backend
    ) {}

    public execute() {
        let await = this.modal.await(this.language.getLabel('LBL_LOADING'));

        this.backend.postRequest(`/channels/emarketing/evalanche/${this.model.module}/${this.model.id}/stats`).subscribe(result => {
            await.emit(true);
            if(result) {
                this.spice = result.spice;
                this.evalanche = result.evalanche;
                this.difference = result.difference;
                this.modal.openModal('ProspectListsToEvalancheModal', true, this.injector).subscribe(modal => {
                modal.instance.spice = this.spice;
                modal.instance.evalanche = this.evalanche;
                modal.instance.difference = this.difference
                });
            }

        });

    }
}
