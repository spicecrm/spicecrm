/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

        this.backend.postRequest(`Evalanche/${this.model.module}/${this.model.id}/stats`).subscribe(result => {
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
