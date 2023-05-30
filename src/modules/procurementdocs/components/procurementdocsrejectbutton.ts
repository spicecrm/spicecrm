/**
 * @module ModuleProcurementDocs
 */
import {Component, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'procurement-docs-reject-button',
    templateUrl: "../templates/procurementdocsrejectbutton.html",
})
export class ProcurementDocsRejectButton {

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, public injector: Injector) {
        this.model.module = 'ProcurementDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        this.modal.openModal('ProcurementDocsRejectModal', true, this.injector);
    }

}
