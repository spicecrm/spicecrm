/**
 * @module WorkbenchModule
 */
import { Component, Input } from '@angular/core';
import { language } from '../../services/language.service';

@Component({
    templateUrl: '../templates/crmlogviewerlistmodal.html',
})
export class CRMLogViewerListModal {

    @Input() public filter: any;
    @Input() public crmLogId: string;
    public self;

    constructor( public language: language ) { }

    // Close the modal.
    public closeModal() {
        this.self.destroy();
    }

    // Escape pressed or [x] clicked.
    public onModalEscX() {
        this.closeModal();
    }

}
