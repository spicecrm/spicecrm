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
    providers: [view]
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
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/emailtrackingactions`, {
            module: 'EmailTrackingActions',
            offset: 0,
            limit: -99
        }).subscribe({
            next: (res) => {
                for(let id in res){
                    this.actionEntries.push(res[id]);
                }

                // sort according to date entered
                this.actionEntries.sort((a, b) => moment(a.date_entered).isBefore (moment(b.date_entered)) ? 1 : -1);
            }
        });
    }

    /**
     * closes the modal
     * @private
     */
    public close() {
        this.self.destroy();
    }

}
