/**
 * @module ModuleSalesDocs
 */
import {Component, Injector} from "@angular/core";
import {modal} from "../../../services/modal.service";

/**
 * renders a button to pop up the sales docs document flow modal
 */
@Component({
    selector: 'salesdocs-flow-button',
    templateUrl: "../templates/salesdocsflowbutton.html"
})
export class SalesDocsFlowButton {

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

        this.modal.openModal('SalesDocsFlowModal', true, this.injector);
    }

}
