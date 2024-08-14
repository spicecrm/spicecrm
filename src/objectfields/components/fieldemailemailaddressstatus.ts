/**
 * @module ObjectFields
 */
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {modal} from "../../services/modal.service";

@Component({
    selector: 'field-email-emailaddress-status',
    templateUrl: '../templates/fieldemailemailaddressstatus.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldEmailEmailAddressStatus {
    /**
     * holds the status of the email address
     */
    @Input() public status: 'opted_in' | 'pending' | 'opted_out';

    @Output() private status$ = new EventEmitter<'opted_in' | 'pending' | 'opted_out'>();

    constructor(private modal: modal) {
    }

    /**
     * @return opt in status color class
     */
    get statusColor() {
        switch (this.status) {
            case 'opted_in':
                return 'slds-icon-text-success';
            case 'pending':
                return 'slds-icon-text-warning';
            case 'opted_out':
                return 'slds-icon-text-error';
            default:
                return 'slds-icon-text-light';
        }
    }

    /**
     * @return opt in status color class
     */
    get statusIcon() {
        switch (this.status) {
            case 'opted_in':
                return 'success';
            case 'pending':
                return 'warning';
            case 'opted_out':
                return 'error';
            default:
                return 'routing_offline';
        }
    }

    /**
     * @return opt in status label
     */
    get statusLabel() {
        switch (this.status) {
            case 'opted_in':
                return 'LBL_OPTED_IN';
            case 'pending':
                return 'LBL_PENDING';
            case 'opted_out':
                return 'LBL_OPTED_OUT';
            default:
                return 'LBL_OPT_IN_STATUS';
        }
    }

    public openSetStatusModal() {

        const options = [
            {value: 'opted_in', display: 'LBL_OPTED_IN'},
            {value: 'pending', display: 'LBL_PENDING'},
            {value: 'opted_out', display: 'LBL_OPTED_OUT'}
        ];

        this.modal.prompt('input', null, 'LBL_EMAIL_ADDRESSES', 'default', this.status, options, 'radio')
            .subscribe(answer => {
                if (!answer) return;
                this.status$.emit(answer);
            });
    }
}
