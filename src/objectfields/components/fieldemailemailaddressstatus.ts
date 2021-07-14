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
 * @module ObjectFields
 */
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
    selector: 'field-email-emailaddress-status',
    templateUrl: './src/objectfields/templates/fieldemailemailaddressstatus.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class fieldEmailEmailAddressStatus {
    /**
     * holds the status of the email address
     */
    @Input() public status: 'opted_in' | 'pending' | 'opted_out';

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
}
