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
 * @module ModuleSalesDocs
 */
import {Component, OnInit, SkipSelf, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";
import {model} from "../../../services/model.service";
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a modal window to select the type to convert a salesdocument to
 * this is defined in the syssalesdoctypesflow
 */
@Component({
    templateUrl: "./src/modules/salesdocs/templates/salesdocsconvertselecttype.html",
})
export class SalesDocsConvertSelectType {

    /**
     * reference to self added from teh modal service
     * @private
     */
    private self: any;

    /**
     * the available target types
     * @private
     */
    private targetTypes: any[] = [];

    private selectedType: string;

    constructor(public model: model, public modal: modal, private configuration: configurationService, private backend: backend, private injector: Injector) {
        this.determineTargets();
    }

    /**
     * loads teh target types from the flow
     * @private
     */
    private determineTargets() {
        let types = this.configuration.getData('salesdoctypes');
        let flows = this.configuration.getData('salesdoctypesflow');
        for (let target of flows.filter(f => f.from == this.model.getFieldValue('salesdoctype'))) {
            let type = types.find(t => t.name == target.to);
            this.targetTypes.push({
                type: target.to,
                label: type ? type.vname : target.to
            });
        }

        // set the first as selectd
        this.selectedType = this.targetTypes[0].type;
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * converts the salesdoc
     *
     * @private
     */
    private convert() {
        let loadmodal = this.modal.await('loading');
        this.backend.getRequest(`module/SalesDocs/${this.model.id}/convert/${this.selectedType}`).subscribe(
            targetData => {
                loadmodal.emit(true);
                this.modal.openModal('SalesDocsConvertModal', true, this.injector).subscribe(modalref => {
                    modalref.instance.targetData = targetData;
                });
                this.close();
            },
            err => {
                loadmodal.emit(true);
            });
    }

}
