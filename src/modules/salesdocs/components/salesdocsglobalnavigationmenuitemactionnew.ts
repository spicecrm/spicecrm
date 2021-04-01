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
 * @module GlobalComponents
 */
import {
    Component,
    OnInit,
    Injector
} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {GlobalNavigationMenuItemActionNew} from "../../../globalcomponents/components/globalnavigationmenuitemactionnew";

declare var _: any;

@Component({
    selector: 'global-navigation-menu-item-action-new',
    templateUrl: './src/globalcomponents/templates/globalnavigationmenuitemactionnew.html'
})
export class SalesDocsGlobalNavigationMenuItemActionNew extends GlobalNavigationMenuItemActionNew implements OnInit {

    public actionconfig: any = {};

    constructor(public language: language, public model: model, public metadata: metadata, private modal: modal, private injector: Injector) {
        super(language, model, metadata);
    }

    public execute() {
        if (_.isEmpty(this.actionconfig)) {
            this.actionconfig = this.metadata.getComponentConfig('SalesdocsNewButton', this.model.module);
        }

        this.model.id = "";
        this.model.initialize();

        if (this.actionconfig.defaultsalesdoctype) {
            this.model.setField('salesdoctype', this.actionconfig.defaultsalesdoctype);
        }

        this.modal.openModal(this.actionconfig.modalcomponent ? this.actionconfig.modalcomponent : 'SalesDocsAddBasics', true, this.injector);
    }

}
