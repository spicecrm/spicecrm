/**
 * @module ModuleSAPIDOCs
 */
import {Component, Injector} from '@angular/core';
import {modal} from "../../../services/modal.service";

@Component({
    templateUrl: '../templates/sapidocsviewerbutton.html'
})
export class SAPIDOCsViewerButton {


    constructor(public modal: modal, public injector: Injector) {
    }

    public execute() {
        this.modal.openModal('SAPIDOCsViewer', true, this.injector);
    }

}

