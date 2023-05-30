/**
 * @module ModuleProcurementDocs
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";

/**
 * renders a button to pop up the procurement docs document flow modal
 */
@Component({
    selector: 'procurement-docs-flow-button',
    templateUrl: "../templates/procurementdocsflowbutton.html"
})
export class ProcurementDocsFlowButton {

    /**
     * component subscriptions
     *
     * @private
     */
    constructor(public modal: modal, public injector: Injector) {

    }

    /**
     * execute when the button is clicked
     */
    public execute() {

        this.modal.openModal('ProcurementDocsFlowModal', true, this.injector);
    }

}
