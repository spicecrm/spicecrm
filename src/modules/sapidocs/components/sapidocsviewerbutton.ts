/**
 * @module ModuleSAPIDOCs
 */
import {Component, Injector} from '@angular/core';
import {modal} from "../../../services/modal.service";

@Component({
    templateUrl: './src/modules/sapidocs/templates/sapidocsviewerbutton.html'
})
export class SAPIDOCsViewerButton {


    constructor(private modal: modal, private injector: Injector) {
    }

    private execute() {
        this.modal.openModal('SAPIDOCsViewer', true, this.injector);
    }

}

