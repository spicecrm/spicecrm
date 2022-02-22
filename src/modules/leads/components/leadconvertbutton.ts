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
    templateUrl: '../templates/leadconvertbutton.html'
})
export class LeadConvertButton {

    constructor(public injector: Injector, public language: language, public model: model, public router: Router, public toast: toast, public modal: modal, @Optional() public navigationtab: navigationtab) {
    }

    /**
     * triggers the excecution
     */
    public execute() {
        if (this.model.getField('status') === 'Converted') {
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
