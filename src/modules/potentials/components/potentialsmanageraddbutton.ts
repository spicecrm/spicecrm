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
 * @module ModulePotentials
 */
import {Component, Input} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";

import {language} from "../../../services/language.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'potentials-manager-add-button',
    templateUrl: "./src/modules/potentials/templates/potentialsmanageraddbutton.html",
    providers: [model]
})
export class PotentialsManagerAddButton {

    /**
     * the parent for the new button
     */
    @Input() private parentModel: any;

    /**
     * the product group id
     */
    @Input() private productgroup_id: string = '';
    /**
     * the product group name
     */
    @Input() private productgroup_name: string = '';

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model,
    ) {
        this.model.module = 'Potentials';
    }

    /**
     * checks if a potential exists or can be added
     *
     * @param productgroup_id the id of the prodzuctgroup of this record
     */
    get canAddPotential() {

        // check if we can add
        if (!this.metadata.checkModuleAcl('Potentials', 'create')) return true;

        // if related models are loading disable buttons
        if (this.relatedmodels.isloading) return true;

        // otherewise check if we have a record
        let related = this.relatedmodels.items.find(record => record.productgroup_id == this.productgroup_id);
        if (related) {
            return true;
        } else {
            return false;
        }
    }

    private addPotential() {
        let setData = {
            productgroup_id: this.productgroup_id,
            productgroup_name: this.productgroup_name,
            name: this.productgroup_name
        };

        this.model.addModel('', this.parentModel, setData);
    }

}
