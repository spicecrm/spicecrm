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
 * @module ObjectComponents
 */
import {Component, OnInit, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {language} from "../../../services/language.service";
import {modal} from "../../../services/modal.service";
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {BonusCardNewButton} from "./bonuscardnewbutton";
import {modelutilities} from "../../../services/modelutilities.service";

@Component({
    selector: "bonus-cards-new-related-button",
    templateUrl: "./src/modules/bonusprograms/templates/bonuscardnewrelatedbutton.html",
    providers: [model]
})
export class BonusCardNewRelatedButton extends BonusCardNewButton {

    /**
     * set to true to disabled the button .. based on the ACL Check fdor the model
     */
    public disabled: boolean = true;

    constructor(public language: language,
                public metadata: metadata,
                public modal: modal,
                public toast: toast,
                public backend: backend,
                public model: model,
                @SkipSelf() public parentModel: model,
                public modelUtilities: modelutilities,
                private relatedModels: relatedmodels) {
        super(language, metadata, modal, toast, backend, model, parentModel, modelUtilities);

    }

    /**
     * add a new card with the program
     */
    public addNew(program: { id: string, name: string, date_end: string, date_start: string }) {

        this.model.id = undefined;
        let presets;

        if (!!program) {
            presets = {
                bonusprogram_id: program.id,
                bonusprogram_name: program.name,
                purchase_date: this.modelUtilities.backend2spice(this.model.module, 'purchase_date', program.date_start),
                valid_until: this.modelUtilities.backend2spice(this.model.module, 'valid_until', program.date_end),
            };
        }

        if (!this.parentModel.data.id) {
            this.parentModel.data.id = this.parentModel.id;
        }

        this.model.addModel('', this.parentModel, presets).subscribe(response => {
            if (response != false) {
                this.relatedModels.addItems([response]);
            }
        });
    }
}
