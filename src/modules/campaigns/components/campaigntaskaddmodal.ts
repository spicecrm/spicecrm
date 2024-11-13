/**
 * @module ModuleCampaigns
 */
import {Component} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {navigationtab} from "../../../services/navigationtab.service";

@Component({
    selector: 'campaigntask-add-modal',
    templateUrl: '../templates/campaigntaskaddmodal.html',
    providers: [model, view]
})
export class CampaignTaskAddModal {

    public self: any;

    constructor(public model: model,
                public view: view,
                private navigationTab: navigationtab) {
        this.model.module = 'CampaignTasks';
        this.model.initialize(parent);

        this.view.isEditable = true;
        this.view.setEditMode('name');


    }

    /**
     * @return boolean disabled flag
     */
    get disabled(): boolean {
        return !this.model.data.campaigntask_type || !this.model.data.name
    }

    public save(goTo?: boolean) {

        if(this.disabled) return;

        this.model.save().subscribe(() => {
            this.self.destroy();
            if (goTo) {
                this.model.goDetail(this.navigationTab.tabid);
            }
        });
    }

    public close() {
        this.self.destroy();
    }

}
