/**
 * @module ObjectComponents
 */
import {Component} from '@angular/core';
import {backend} from "../../services/backend.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";

/**
 * standard item to download an ics file from calls
 */
@Component({
    selector: 'object-action-download-ics-button',
    template: '<span><system-label label="LBL_DOWNLOAD"></system-label></span>',
})
export class ObjectActionDownloadIcsButton {

    constructor(public model: model, public backend: backend, public modal: modal) {}

    get hidden() {
        return this.model.module !== 'Calls' && this.model.module !== 'Meetings';
    }

    /**
     * downloads the call/meeting as .ics file
     */
    public execute() {
        let fileName = this.model.module + '_' + this.model.getField('summary_text') + '.ics';
        let awaitModal = this.modal.await('LBL_LOADING');

        this.backend.downloadFile({route: `module/${this.model.module}/${this.model.id}/ics`}, fileName, 'text/bin')
            .subscribe({
                next: () => {
                    awaitModal.emit(true);
                    awaitModal.complete();
                },
                error: () => {
                    awaitModal.emit(true);
                    awaitModal.complete();
                }
            })
    }
}