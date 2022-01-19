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
    templateUrl: '../templates/prospectlisttoevalanchebutton.html',
})
export class ProspectListsToEvalancheButton {
    public evalanche: any[] = [];
    public spice: any[] = [];
    public difference: any[] = [];

    constructor(
        public language: language,
        public metadata: metadata,
        public model: model,
        public modal: modal,
        public injector: Injector,
        public backend: backend
    ) {}

    public execute() {
        let loading = this.modal.await(this.language.getLabel('LBL_LOADING'));

        this.backend.postRequest(`/channels/emarketing/evalanche/${this.model.module}/${this.model.id}/stats`).subscribe(result => {
            loading.emit(true);
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
