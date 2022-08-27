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
    templateUrl: '../templates/emailparentaddressesmodal.html'
})
export class EmailParentAddressesModal implements OnInit {

    /**
     * reference to the modal self
     *
     * @private
     */
    public self: any;

    /**
     * the loadedaddresses
     *
     * @private
     */
    public addresses: any[] = [];

    /**
     * an eent emitter for the selected addresses
     *
     * @private
     */
    public addAddresses: EventEmitter<any[]> = new EventEmitter<any[]>();

    constructor(
        public model: model,
        public modal: modal,
        public toast: toast,
        public backend: backend
    ) {

    }

    /**
     * load the parent email addresses
     */
    public ngOnInit() {
        let loading = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`module/EmailAddresses/${this.model.getField('parent_type')}/${this.model.getField('parent_id')}`).subscribe(
            addresses => {
                this.addresses = addresses;
                if (this.addresses.length == 0) {
                    this.toast.sendToast('LBL_NO_RELATED_EMAILADDRESSES_FOUND', 'info');
                    this.close();
                }
                loading.emit(true);
            },
            () => {
                this.toast.sendToast('LBL_NO_RELATED_EMAILADDRESSES_FOUND', 'error');
                loading.emit(true);
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
    public add() {
        this.addAddresses.emit(this.addresses.filter(a => a.selected));
        this.close();
    }

    /**
     * closes the modal
     *
     * @private
     */
    public close() {
        this.self.destroy();
    }

}
