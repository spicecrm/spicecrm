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
import {
    Component,
    OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';

/**
 * a simple config editor that allows editing config settings for a specific subtree
 */
@Component({
    selector: 'administration-configeditor',
    templateUrl: './src/admincomponents/templates/administrationconfigeditor.html'
})
export class AdministrationConfigEditor implements OnInit {

    /**
     * the config from the admin item in the settings
     */
    private componentconfig: any = {};

    /**
     * the values that are held and set
     */
    private configvalues: any = {};

    /**
     * an indicator if the config paramaters are loading
     */
    private loading: boolean = true;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal
    ) {

    }

    /**
     * loads the config settings
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('configurator/editor/' + this.componentconfig.category).subscribe(data => {
                this.configvalues = data;
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });

    }

    /**
     * simnple getter to return the config items
     */
    get items() {
        let items = [];

        for (let field of this.componentconfig.items) {
            if (field.hidden !== true) items.push(field);
        }

        return items;
    }

    /**
     * the save function
     */
    private save() {
        this.loading = true;
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';
            this.backend.postRequest('configurator/editor/' + this.componentconfig.category, [], this.configvalues).subscribe(data => {
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

}