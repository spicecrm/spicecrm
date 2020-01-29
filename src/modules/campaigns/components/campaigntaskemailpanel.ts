/**
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";

@Component({
    selector: 'campaign-task-email-panel',
    templateUrl: './src/modules/campaigns/templates/campaigntaskemailpanel.html'
})
export class CampaignTaskEmailPanel {

    private componentconfig: any = {};

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal) {

    }

    /**
     * @return matchedModelState: boolean
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * @openModal ObjectModalModuleLookup
     * @pass module
     * @pass multiselect
     * @setField email_subject
     * @setField email_body
     * @setField email_stylesheet_id
     */
    private copyFromTemplate() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'EmailTemplates';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.model.setField('email_subject', items[0].subject);
                        this.model.setField('email_body', items[0].body_html);
                        this.model.setField('email_stylesheet_id', items[0].style);
                    }
                });
            });
    }
}
