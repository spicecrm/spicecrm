/**
 * @module ModuleCampaigns
 */
import {Component, OnDestroy} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {Subscription} from "rxjs";

@Component({
    templateUrl: '../templates/campaigntaskactivatebutton.html',
    selector: "campaign-activate-button",
    standalone: false
})
export class CampaignTaskActivateButton implements OnDestroy {

    public activating: boolean = false;
    public disabled: boolean = true;
    /**
     * holds the rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();

    constructor(public language: language, public metadata: metadata, public model: model, public toast: toast, public backend: backend) {
        this.subscriptions.add(
            this.model.mode$.subscribe(mode => {
                this.handleDisabled();
            })
        );

        this.subscriptions.add(
            this.model.data$.subscribe(data => {
                this.handleDisabled();
            })
        );
    }

    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.getField('campaigntask_type') == 'Email' || this.model.getField('campaigntask_type') == 'SMS' || this.model.getField('campaigntask_type') == 'Feedback';
    }


    public handleDisabled() {

        // not for email
        if (this.model.getFieldValue('campaigntask_type') == 'Email' || this.model.getField('campaigntask_type') == 'SMS' || this.model.getField('campaigntask_type') == 'Feedback'){
            this.disabled = true;
            return;
        }

        // not if activated
        if (this.model.getFieldValue('activated')){
            this.disabled = true;
            return;
        }

        this.disabled = this.model.isEditing || this.model.getField('activated') === true;
    }

    public execute() {
        // if we are activating .. do nothing
        if (this.activating) return;

        // set activating indicator
        this.activating = true;

        // execute on backend
        this.backend.postRequest(`module/CampaignTasks/${this.model.id}/activate`).subscribe({
            next: () => {
                this.activating = false;

            // send toast and set active
                this.model.getData();
                this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'CampaignLog'});
                this.toast.sendToast(this.language.getLabel("LBL_CAMPAIGNTASK_ACTIVATED"));

            }, error: err => {
                this.activating = false;
                this.toast.sendToast(err.error.error?.lbl, 'error');
            }
        });
    }

    /**
     * unsubscribe from rxjs subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}
