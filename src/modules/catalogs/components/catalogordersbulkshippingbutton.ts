/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

/**
 * @ignore
 */
declare var moment: any;


import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {popup} from '../../../services/popup.service';
import {backend} from "../../../services/backend.service";
import {modal} from "../../../services/modal.service";
import {modellist} from "../../../services/modellist.service";

@Component({
    templateUrl: './src/modules/catalogs/templates/catalogordersbulkshippingbutton.html',
})
export class CatalogOrdersBulkShippingButton {

    private sending: boolean = false;

    constructor(private language: language, private model: model, private backend: backend, private toast: toast, private metadata: metadata, private modellist: modellist, private modal: modal) {
    }

    public execute() {
        if(!this.disabled) {
            if (!this.sending) {
                this.sending = true;
                this.modal.openModal("SystemLoadingModal").subscribe(modal => {
                    modal.instance.messagelabel = "LBL_PROCESSING";
                    let selectedIds = this.modellist.getSelectedIDs();
                    if(selectedIds.length > 25) {
                        this.toast.sendToast(this.language.getLabel("LBL_TO_MANY_SELECTED"));
                    } else {
                        this.backend.postRequest('module/CatalogOrders/bulkshipping', null, {selectedIds: selectedIds}).subscribe((results: any) => {
                            this.sending = false;
                            this.toast.sendToast(this.language.getLabel("LBL_PROCESSED"));
                            modal.instance.self.destroy();
                            this.modellist.reLoadList();
                        },
                        error => {
                            this.toast.sendToast(this.language.getLabel("LBL_FAILED"));
                            modal.instance.self.destroy();
                            this.modellist.reLoadList();
                        });
                    }
                });
            }
        }
    }

    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }


}
