/**
 * @module ModuleCampaigns
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {toast} from "../../../services/toast.service";
import {DomSanitizer} from "@angular/platform-browser";
import {configurationService} from "../../../services/configuration.service";
import {view} from "../../../services/view.service";

declare var moment: any;

@Component({
    selector: 'campaignlog-tracking-actions-modal',
    templateUrl: '../templates/campaignlogtrackingactionsmodal.html',
    providers: [view],
    standalone: false
})
export class CampaignLogTrackingActionsModal implements OnInit{

    /**
     * reference to the modal itself
     * @private
     */
    public self: any;

    /**
     * the action entries
     */
    public actionEntries: any[] = [];

    /**
     * indicate if we are loaded
     */
    public loaded = false;

    constructor(
        public language: language,
        public model: model,
        public backend: backend,
        public modal: modal,
        public sanitizer: DomSanitizer,
        public configuration: configurationService,
        public toast: toast,
        public view: view
    ) {
        this.view.displayLabels = false;
        this.view.isEditable = false;
    }

    public ngOnInit() {
        let loadingModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/emailtrackingactions`, {
            module: 'EmailTrackingActions',
            offset: 0,
            limit: -99
        }).subscribe({
            next: (res) => {

                this.actionEntries = res;

                // sort according to date entered
                this.actionEntries.sort((a, b) => moment(a.date_entered).isBefore (moment(b.date_entered)) ? 1 : -1);

                loadingModal.emit(true);
                this.loaded = true;
                if(this.actionEntries.length == 0){
                    this.toast.sendToast('LBL_NO_RECORDS_FOUND', 'info');
                    this.close();
                }
            },
            error: (e) => {
                this.toast.sendToast('LBL_ERROR_LOADING_RECORDS', 'error');
                this.close();
            }
        });
    }

    public getMailgunLog(){
        let log = '';
        this.backend.getRequest(`/channels/mailgun/analytics/logs/${this.model.data.external_id}`).subscribe({
            next: (res) => {
                log = res;
            }
        })

    }

    /**
     * closes the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }

}
