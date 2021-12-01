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
    templateUrl: '../templates/campaigntaskaddmodal.html',
    providers: [model, view]
})
export class CampaignTaskAddModal {

    public self: any;

    constructor(@SkipSelf() public parent: model, public model: model, public view: view, public modal: modal) {
        this.model.module = 'CampaignTasks';
        this.model.initialize(parent);

        this.view.isEditable = true;
        this.view.setEditMode('name');


    }

    public save() {
        if(this.model.validate()) {
            this.model.save().subscribe(() => {
                this.self.destroy();
            });
        }
    }

    public close() {
        this.self.destroy();
    }

}
