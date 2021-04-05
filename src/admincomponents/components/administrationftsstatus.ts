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
 * @module AdminComponentsModule
 */
import {Component, OnInit, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {modal} from "../../services/modal.service";
import {toast} from "../../services/toast.service";
import {helper} from "../../services/helper.service";
import set = Reflect.set;


@Component({
    selector: '[administration-ftsstatus]',
    templateUrl: './src/admincomponents/templates/administrationftsstatus.html'
})
export class AdministrationFTSStatus {

    /**
     * holds the stats and status retrieved from teh backend
     */
    private version: any = {};

    /**
     * holds the stats and status retrieved from teh backend
     */
    private stats: any = {
        docs: 0,
        size: 0
    };

    /**
     * indicates that we are loading the stats
     */
    private loading: boolean = false;

    /**
     * holds the information on all teh indices
     */
    private indices: any[] = [];

    constructor(
        private metadata: metadata,
        private language: language,
        private modal: modal,
        private backend: backend,
        private helper: helper,
        private toast: toast,
        private injector: Injector
    ) {
        this.loadstatus();
    }

    /**
     * gets the status details from teh backend
     */
    private loadstatus() {

        // set to loading
        this.loading = true;

        // reset the indices
        this.indices = [];

        this.backend.getRequest('fts/status').subscribe(
            response => {
                this.version = response.version;

                this.stats.docs = 0; // initialize
                // catch when no fts index is set yet
                if(response.stats._all.total.docs && response.stats._all.total.docs.count) {
                    this.stats.docs = response.stats._all.total.docs.count;
                }

                this.stats.size = 0;
                // catch when no fts index is set yet
                if(response.stats._all.total.store && response.stats._all.total.store.size_in_bytes) {
                    this.stats.size = this.helper.humanFileSize(response.stats._all.total.store.size_in_bytes);
                }


                for (let index in response.stats.indices) {
                    this.indices.push({
                        name: index,
                        docs: response.stats.indices[index].total.docs.count,
                        size: this.helper.humanFileSize(response.stats.indices[index].total.store.size_in_bytes),
                        blocked: (response.settings && response.settings[index] && response.settings[index].settings.index.blocks?.read_only_allow_delete) ? true : false
                    });
                }

                // sort the indices
                this.indices.sort((a, b) => a.name > b.name ? 1 : -1);

                // no longer loading
                this.loading = false;

            },
            error => {
                this.loading = false;
                this.toast.sendToast('Error loading Status', "error");
            });
    }

    /**
     * unlocks the complete index from a lock entry
     * @private
     */
    private unlock() {
        this.backend.putRequest('fts/unblock').subscribe(resp => {
            console.log(resp);
            this.loadstatus();
        });
    }

    /**
     * chesks if at least one index is locked
     * @private
     */
    get hasLocks() {
        return this.indices.find(i => i.blocked) ? true : false;
    }


}

