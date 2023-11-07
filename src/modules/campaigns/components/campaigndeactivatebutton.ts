import {Component, OnDestroy} from '@angular/core';
import {ActionSetItemI} from "../../../objectcomponents/interfaces/objectcomponents.interfaces";
import {model} from "../../../services/model.service";
import {Subscription} from "rxjs";

@Component({
    selector: 'campaign-deactivate-button',
    templateUrl: '../templates/campaigndeactivatebutton.html'
})

export class CampaignDeactivateButton implements ActionSetItemI, OnDestroy {
    /**
     * true while deactivating
     */
    public isDeactivating: boolean = false;
    /**
     * the action button config
     */
    public actionconfig: any;
    /**
     * disabled flag to be propagated
     */
    public disabled: boolean;
    /**
     * holds the rxjs subscriptions
     * @private
     */
    private subscriptions = new Subscription();

    constructor(public model: model) {

        this.subscriptions.add(
            this.model.mode$.subscribe(mode =>
                this.setDisabled()
            )
        );

        this.subscriptions.add(
            this.model.data$.subscribe(data =>
                this.setDisabled()
            )
        );
    }

    /**
     * deactivate the campaign task
     */
    public execute(): void {

        if (this.isDeactivating) return;

        this.model.modal.confirm('MSG_DEACTIVATE_CAMPAIGN_TASK', 'MSG_DEACTIVATE_CAMPAIGN_TASK')
            .subscribe(answer => {
                if (!answer) return;

                this.isDeactivating = true;

                this.model.backend.postRequest(`module/CampaignTasks/${this.model.id}/deactivate`).subscribe({
                    next: res => {
                        this.isDeactivating = false;
                        this.model.getData();
                        this.model.broadcast.broadcastMessage('relatedmodels.reload', {module: 'CampaignLog'});
                        this.model.toast.sendToast('MSG_SUCCESSFULLY_EXECUTED', 'success');
                    },
                    error: () => {
                        this.isDeactivating = false;
                        this.model.toast.sendToast('ERR_FAILED_TO_EXECUTE', 'error');
                    },
                });
            });
    }

    /**
     * unsubscribe the rxjs subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * set disabled flag from model data
     * @private
     */
    private setDisabled() {

        this.disabled = this.model.isEditing || !this.model.getField('activated') ||
            !this.model.metadata.checkModuleAcl(this.model.module, 'deactivate');
    }
}