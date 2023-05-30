/**
 * @module ModuleProcurementDocs
 */
import {Component} from "@angular/core";
import {backend} from "../../../services/backend.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {view} from "../../../services/view.service";
import {language} from "../../../services/language.service";

/**
 * renders a modal to set the rejection reason on the items
 */
@Component({
    selector: 'procurement-docs-reject-modal',
    templateUrl: "../templates/procurementdocsrejectmodal.html",
    providers: [view]
})
export class ProcurementDocsRejectModal {

    /**
     * reference to self passed in from header
     */
    public self: any;

    constructor(public language: language, public backend: backend, public model: model, public modal: modal, public view: view) {
        this.view.isEditable = false;
    }


    /**
     * closes the moal without further action
     */
    public close() {
        this.self.destroy();
    }

    /**
     * closes the moal without further action
     */
    public save() {
        this.backend.postRequest('module/ProcurementDocs/'+this.model.id+'/reject',{}, {items: this.model.data.procurementdocitems.beans}).subscribe(res => {
            this.close();
        })
        this.close();
    }

}
