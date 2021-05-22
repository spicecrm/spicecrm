/**
 * @module WorkbenchModule
 */
import { Component, Input } from '@angular/core';
import { language } from '../../services/language.service';

@Component({
    templateUrl: './src/workbench/templates/crmlogviewerlistmodal.html',
})
export class CRMLogViewerListModal {

    @Input() private filter: any;
    @Input() private crmLogId: string;
    private self;

    constructor( private language: language ) { }

    // Close the modal.
    private closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

}
