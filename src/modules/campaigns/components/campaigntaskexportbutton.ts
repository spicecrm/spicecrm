/**
 * @module ModuleCampaigns
 */
import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

declare var moment: any;

@Component({
    templateUrl: './src/modules/campaigns/templates/campaigntaskexportbutton.html'
})
export class CampaignTaskExportButton {

    /**
     * inidctaes if the export is running
     */
    private exporting: boolean = false;

    /**
     * grabbed by the container if the button shoudl be disabled
     */
    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private toast: toast, private backend: backend, private domsanitizer: DomSanitizer) {
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }


    /**
     * only show for campaign tasks of type email
     */
    get hidden() {
        return this.model.data.campaigntask_type == 'Email';
    }


    /**
     * handles the disbaled check
     */
    private handleDisabled() {

        // not if activated
        if (this.model.getFieldValue('activated')) {
            this.disabled = true;
            return;
        }

        // disabled if editing
        this.disabled = this.model.isEditing ? true : false;
    }

    public execute() {
        // if we are activating .. do nothing
        if (this.exporting) return;

        // set activating indicator
        this.exporting = true;

        this.backend.getDownloadPostRequestFile(`/module/CampaignTasks/${this.model.id}/export`, {}).subscribe(url => {

            // create a link on the document and click for the download
            let downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.setAttribute('download', this.model.getField('name').replace(' ', '_') + '_' + moment().format('YYYY_MM_DD_HH_mm_ss')+'.csv');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // set exporting to false
            this.exporting = false;
        });
    }
}
