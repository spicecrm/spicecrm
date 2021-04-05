/*
SpiceUI 2021.01.001

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
import {
    Component, OnInit
} from '@angular/core';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';

/**
 * renders a modal with the GDPR Details
 */
@Component({
    templateUrl: './src/objectcomponents/templates/objectgdprmodal.html',
    providers: [view]
})
export class ObjectGDPRModal implements OnInit {

    /**
     * holds the componentconfig to be reetireved on ngInit
     */
    private componentconfig: any = {}

    /**
     * @ignore
     *
     * reference to self to allow destroying itself
     */
    private self: any = {};

    /**
     * the gdpr log as returned from the reference call
     */
    public gdprRelatedLog: any[] = [];

    /**
     * the gdpr log as returned from the reference call
     */
    public gdprAuditLog: any[] = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        this.view.isEditable = false;
    }

    /**
     * loads the componentconfig
     */
    public ngOnInit(): void {
        this.componentconfig = this.metadata.getComponentConfig('ObjectGDPRModal', this.model.module);
    }

    get fieldset() {
        return this.componentconfig.fieldset;
    }

    /**
     * hides the modal
     */
    private hideGDPRLog() {
        this.self.destroy();
    }

    /**
     * consturcts a data object fromt he audit record so the field can be rendered properly
     *
     * @param data the audit data record
     */
    private getModelData(data) {
        let dataObject = {
            module: this.model.module,
            id: this.model.id
        };
        dataObject[data.field_name] = this.model.utils.backend2spice(this.model.module, data.field_name, data.value);

        return dataObject;
    }
}
