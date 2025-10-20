import {Component, Injector} from '@angular/core';
import {view} from "../../services/view.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: 'mailboxes-spice-gateway-manager',
    templateUrl: '../templates/mailboxesspicegatewaymanager.html',
    standalone: false
})
export class MailboxesSpiceGatewayManager {

    constructor(public view: view,
                private modal: modal,
                private injector: Injector,
                public model: model) {

        if (!this.model.getField('settings')) {
            this.model.setField('settings', {});
        }
    }

    /**
     * test the connection to the spice gateway
     */
    public testConnection() {
        this.modal.openModal("MailboxesmanagerTestModal", true, this.injector);
    }
}