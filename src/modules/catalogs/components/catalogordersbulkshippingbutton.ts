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
    templateUrl: '../templates/catalogordersbulkshippingbutton.html',
})
export class CatalogOrdersBulkShippingButton {

    public sending: boolean = false;

    constructor(public language: language, public model: model, public backend: backend, public toast: toast, public metadata: metadata, public modellist: modellist, public modal: modal) {
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
