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
import {Component, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from '../../services/modal.service';
import {toast} from "../../services/toast.service";
import {currency} from "../../services/currency.service";

@Component({
    selector: 'administration-general-setting',
    templateUrl: './src/admincomponents/templates/administrationgeneralsettings.html',
})

export class AdministrationGeneralSettings implements OnInit {
    /**
     * array to catch the settings
     */
    private settings: any = {
        system: {
            name: '',
            site_url: '',
            unique_key: ''
        },
        advanced: {
            developerMode: false,
            stack_trace_errors: false,
            dump_slow_queries: false,
            slow_query_time_msec: 0,
            upload_maxsize: 0
        },
        logger: {
            level: '',
            file: {
                name: 'spicecrm',
                ext: '',
                maxLogs: 10,
                maxSize: 10,
                suffix: ''
            }
        }
    };

    /**
     * available options from backend
     */
    private options: any = [];

    /**
     * currencies
     */

    private currencies: any = [];
    /**
     * loading boolean
     */
    private loading: boolean = true;

    constructor(
        private metadata: metadata,
        private language: language,
        private backend: backend,
        private modal: modal,
        private toast: toast,
        private currency: currency,
    ) {

    }

    /**
     * backend get request for the contents of the config table, loads the currencies
     */
    public ngOnInit() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.getRequest('admin/generalsettings').subscribe(data => {
                this.settings = data;
                this._loglevels = this.settings.logger.level.split(',');
                this.loading = false;
                modalRef.instance.self.destroy();
            });
        });
    }

    /**
     * save the settings
     */
    private save() {
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            this.backend.postRequest('admin/writesettings', {}, this.settings).subscribe(response => {
                if (response.status) {
                    this.toast.sendToast(this.language.getLabel('LBL_SUCCESS'), 'success');
                } else {
                    this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
                }
            });
            modalRef.instance.self.destroy();
        });
    }

    private _loglevels = [];

    get loglevels() {
        return this._loglevels;
    }

    set loglevels(levels) {
        this._loglevels = levels;
        this.settings.logger.level = levels.join(',');
    }

    /**
     * getter to strip the MB from the max size
     */
    get maxSize(){
        return this.settings.logger.file.maxSize?.replace('MB', '');
    }

    /**
     *setter to add the MB to the max size
     *
     * @param maxSize
     */
    set maxSize(maxSize){
        this.settings.logger.file.maxSize = maxSize + 'MB';
    }
}
