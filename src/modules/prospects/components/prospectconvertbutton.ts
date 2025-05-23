/**
 * @module ModuleProspects
 */
import {Component, Optional, Injector, ComponentRef} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';
import {navigationtab} from '../../../services/navigationtab.service';
import {ProspectConvertModal} from "./prospectconvertmodal";

/**
 * renders a button to convert the account
 *
 * the button is used as component in an actionset
 */
@Component({
    selector: 'prospect-convert-button',
    templateUrl: '../templates/prospectconvertbutton.html',
    standalone: false
})
export class ProspectConvertButton {

    constructor(
        public injector: Injector,
        public language: language,
        public model: model,
        public router: Router,
        public toast: toast,
        public modal: modal,
        @Optional() public navigationtab: navigationtab) {
    }

    /**
     * triggers the execution
     */
    public execute() {
        if (this.model.getField('is_converted') === 'Converted') {
            this.toast.sendToast('Prospect already Converted', 'warning');
        } else {

            const options = [
                {
                    value: 'Contacts',
                    display: this.language.getModuleName('Contacts')
                },
                {
                    value: 'Leads',
                    display: this.language.getModuleName('Leads')
                },
            ];

            this.modal.prompt('input', 'LBL_MAKE_SELECTION', 'LBL_MODULE', null, null, options, true).subscribe({
                next:
                    (answer: false | 'Contacts' | 'Leads') => {
                    if (!answer) return;

                        this.modal.openModal('ProspectConvertModal', true, this.injector)
                            .subscribe((modalRef: ComponentRef<ProspectConvertModal>) => {
                                modalRef.instance.personModuleName = answer;
                            });
                }
            });
        }
    }

    // @ts-ignore
    /**
     * a getter for the disabled attribute used in the actionset that renders the button
     */
    get disabled() {
        return this.model.getFieldValue('is_converted') == 1 || !this.model.checkAccess('edit') ? true : false;
    }
}

