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
        return  this.model.getFieldValue('status') === 'Converted' || !this.model.checkAccess('edit') ? true : false;
    }
}
