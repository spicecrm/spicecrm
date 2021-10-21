/**
 * @module ModuleCampaigns
 */
import {Component, SkipSelf} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';

declare var moment: any;

@Component({
    selector: 'campaigntask-add-modal',
    templateUrl: './src/modules/campaigns/templates/campaigntaskaddmodal.html',
    providers: [model, view]
})
export class CampaignTaskAddModal {

    private self: any;

    constructor(@SkipSelf() private parent: model, private model: model, private view: view, private modal: modal) {
        this.model.module = 'CampaignTasks';
        this.model.initialize(parent);

        this.view.isEditable = true;
        this.view.setEditMode('name');


    }

    private save() {
        if(this.model.validate()) {
            this.model.save().subscribe(() => {
                this.self.destroy();
            });
        }
    }

    private close() {
        this.self.destroy();
    }

}
