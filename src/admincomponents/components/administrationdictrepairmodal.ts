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
import {Component} from '@angular/core';
import {Md5} from "ts-md5";
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";
import {modal} from "../../services/modal.service";


@Component({
    selector: 'administration-dict-repair-modal',
    templateUrl: './src/admincomponents/templates/administrationdictrepairmodal.html'
})
export class AdministrationDictRepairModal {

    /**
     * flag for synchronisation
     * @private
     */
    private synced:boolean = false;
    /**
     * array container for the statements
     * @private
     */
    private sql: any =[];
    /**
     * whole untouched sql string
     * @private
     */
    private wholeSQL: string;
    /**
     * array container of database errors from backend
     * @private
     */
    private dbErrors: any = [];
    /**
     * modal reference
     * @private
     */
    private self: any = {};
    constructor(private backend: backend, private toast: toast, private language: language, private modal: modal) {
    }

    /**
     * destroy modal instance
     * @private
     */
    private close() {
        this.self.destroy();
    }

    /**
     * execute db repair and save the response
     */
    private doRepair() {
        this.modal.openModal('SystemLoadingModal').subscribe(loadingRef => {
            const selectedQueries = this.sql.filter(query => query.selected);
        this.backend.postRequest('repair/database', {}, {selectedQueries}).subscribe((result: any) => {
            if (!result.response) {
                this.dbErrors = result.errors;
            } else if (result.synced) {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_ALREADY_SYNCED'), 'success');
                this.close();
            } else {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_SYNCED'), 'success');
                this.close();
            }
            loadingRef.instance.self.destroy();
        },
        (err: any) => {
                switch (err.status) {
                    case 500:
                        this.toast.sendAlert(err.message, 'error');
                        this.close();
                        loadingRef.instance.self.destroy();
                        break;
                }
            });
        });
    }



    /**
     * copy the whole SQL to clipboard
     */
    private copy2clipboard() {
        navigator.clipboard.writeText(this.wholeSQL).then(success => {
            this.toast.sendToast(this.language.getLabel('LBL_COPIED_TO_CLIPBOARD'), "info");
        });
    }

    /**
     * selects all the queries
     */
    private selectAll() {
     this.sql.forEach(query => {query.selected = true});
    }

}
