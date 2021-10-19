/**
 * @module ModuleEmails
 */
import {Component, EventEmitter, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {toast} from '../../../services/toast.service';
import {backend} from "../../../services/backend.service";


/**
 * a modal window to allow picking email addresses found for the parent bean of an email and add to the email address fields
 */
@Component({
    selector: 'email-parent-addresses-modal',
    templateUrl: './src/modules/emails/templates/emailparentaddressesmodal.html'
})
export class EmailParentAddressesModal implements OnInit {

    /**
     * reference to the modal self
     *
     * @private
     */
    private self: any;

    /**
     * the loadedaddresses
     *
     * @private
     */
    private addresses: any[] = [];

    /**
     * an eent emitter for the selected addresses
     *
     * @private
     */
    private addAddresses: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor(
        public model: model,
        public modal: modal,
        public toast: toast,
        private backend: backend
    ) {

    }

    /**
     * load the parent email addresses
     */
    public ngOnInit() {
        let await = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`module/EmailAddresses/${this.model.getField('parent_type')}/${this.model.getField('parent_id')}`).subscribe(
            addresses => {
                this.addresses = addresses;
                if (this.addresses.length == 0) {
                    this.toast.sendToast('LBL_NO_EMAILADDRESSES_FOUND', 'info');
                    this.close();
                }
                await.emit(true);
            },
            () => {
                this.toast.sendToast('LBL_SYSTEM_ERROR', 'error');
                await.emit(true);
                this.close();
            }
        );
    }

    /**
     * a getter that cheks that at least ine email address is selected
     */
    get canAdd() {
        return this.addresses.filter(a => a.selected).length > 0;
    }

    /**
     * adds the selected email addresses
     *
     * @private
     */
    private add() {
        this.addAddresses.emit(this.addresses.filter(a => a.selected));
        this.close();
    }

    /**
     * closes the modal
     *
     * @private
     */
    private close() {
        this.self.destroy();
    }

}
