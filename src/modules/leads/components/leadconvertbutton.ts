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
 * @module ModuleLeads
 */
import {Component, Optional, Injector} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {navigationtab} from '../../../services/navigationtab.service';

/**
 * renders a button to convert the account
 *
 * the button is used as component in an actionset
 */
@Component({
    selector: 'lead-convert-button',
    templateUrl: './src/modules/leads/templates/leadconvertbutton.html'
})
export class LeadConvertButton {

    constructor(private injector: Injector, private language: language, private model: model, private router: Router, private toast: toast, private modal: modal, @Optional() private navigationtab: navigationtab) {
    }

    /**
     * triggers the excecution
     */
    private execute() {
        if (this.model.data.status === 'Converted') {
            this.toast.sendToast('Lead already Converted', 'warning');
        } else if (this.model.getFieldValue('account_id')) {
            this.modal.openModal('LeadConvertOpportunityModal', true, this.injector);
        } else if (this.model.getField('lead_type') == 'b2c') {
            this.modal.openModal('LeadConvertConsumerModal', true, this.injector);
        } else {
            let routeprefix = '';
            if (this.navigationtab?.tabid) {
                routeprefix = '/tab/' + this.navigationtab.tabid;
            }
            this.router.navigate([`${routeprefix}/module/Leads/${this.model.id}/convert`]);
        }
    }

    /**
     * a getter for the disabled attribute used in the actionset that renderes the button
     */
    get disabled() {
        return this.model.getFieldValue('status') === 'Converted' || !this.model.checkAccess('edit') ? true : false;
    }
}
