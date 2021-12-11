/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';

/**
 * renders a button that loads the mailmerge modal and is only visible if the campaign type matches
 */
@Component({
    selector: 'campaigntask-mailmerge-button',
    templateUrl: '../templates/campaigntaskmailmergebutton.html'
})
export class CampaignTaskMailergeButton {

    constructor(public model: model, public injector: Injector, public modal: modal) {

    }

    /**
     * only for type mailmerge
     */
    get hidden() {
        return this.model.getField('campaigntask_type') != 'mailmerge';
    }

    /**
     * requires that an output template is selected
     */
    get disabled() {
        return !this.model.getField('output_template_id') || this.model.isEditing || this.model.getField('activated');
    }

    /**
     * open the modal
     */
    public execute() {
        this.modal.openModal('CampaignTaskMailMergeModal', true, this.injector);
    }
}
