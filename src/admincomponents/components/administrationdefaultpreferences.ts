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
 * @module AdminComponentsModule
 */
import {Component, OnInit} from "@angular/core";
import {backend} from "../../services/backend.service";
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {view} from "../../services/view.service";
import {configurationService} from "../../services/configuration.service";

/**
 * render the default preferences modal
 */
@Component({
    selector: 'administration-default-preferences',
    templateUrl: './src/admincomponents/templates/administrationdefaultpreferences.html',
    providers: [view]
})
export class AdministrationDefaultPreferences implements OnInit {
    /**
     * holds the loaded preferences
     * @private
     */
    private preferences: any = {};

    constructor(private backend: backend,
                private toast: toast,
                private language: language,
                private configuration: configurationService,
                private view: view,
                private modal: modal) {
    }

    public ngOnInit() {
        this.loadPreferences();
    }

    /**
     * load default preferences from backeend
     * @private
     */
    private loadPreferences() {
        const loadingModal = this.modal.await('LBL_LOADING');

        this.backend.getRequest('configuration/configurator/editor/default_preferences').subscribe(data => {
            this.preferences = data;
            loadingModal.emit();
            loadingModal.complete();
        });
    }

    /**
     * save changes
     * @private
     */
    private save() {
        const loadingModal = this.modal.await('LBL_SAVING_DATA');

        this.backend.postRequest('configuration/configurator/editor/default_preferences', [], { config: this.preferences }).subscribe(data => {
            this.configuration.setData('defaultuserpreferences', this.preferences);
            this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            this.view.setViewMode();
            loadingModal.emit();
            loadingModal.complete();
        });

    }
}
