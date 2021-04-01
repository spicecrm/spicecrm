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
 * @module SpiceTextsModule
 */
import {Component, Input} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {modal} from "../../../services/modal.service";
import {relatedmodels} from "../../../services/relatedmodels.service";
import {configurationService} from "../../../services/configuration.service";

declare var _;

@Component({
    selector: 'spice-texts-add-button',
    templateUrl: './src/include/spicetexts/templates/spicetextsaddbutton.html',
    providers: [model]
})

export class SpiceTextsAddButton {

    @Input() public parent: any;
    @Input() public spiceTexts: any[] = [];

    constructor(private model: model,
                private modal: modal,
                private configurationService: configurationService,
                private language: language,
                private metadata: metadata,
                private relatedModels: relatedmodels) {
        this.model.module = 'SpiceTexts';
    }

    get sysTextIds() {
        let sysTextIds = this.configurationService.getData('systextids');
        return sysTextIds ? _.values(sysTextIds).filter(text => text.module == this.parent.module) : [];
    }

    get canAdd(){
        return this.metadata.checkModuleAcl('SpiceTexts', 'create') && !this.allTranslated;
    }

    get allTranslated() {
        return this.relatedModels.isloading || this.sysTextIds.length == 0 ||
            (this.spiceTexts.length >= (this.sysTextIds.length * this.language.getAvialableLanguages().length));
    }

    private addModel() {
        if (!this.parent || this.allTranslated) {
            return;
        }

        this.modal.openModal("SpiceTextsAddModal", true).subscribe(ref => {
            if (ref) {
                ref.instance.spiceTexts = this.spiceTexts;
                ref.instance.sysTextIds = this.sysTextIds;
                ref.instance.parent = this.parent;
                ref.instance.response.subscribe(response => {
                    if (response && typeof response == 'object') {
                        this.relatedModels.items.push(response);
                    }
                });
            }
        });
    }
}
