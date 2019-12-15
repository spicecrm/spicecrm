/**
 * @module ModuleSalesDocs
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
    templateUrl: "./src/modules/salesdocs/templates/salesdocsrejectmodal.html",
    providers: [view]
})
export class SalesdocsRejectModal {

    /**
     * reference to self passed in from header
     */
    private self: any;

    constructor(public language: language, public backend: backend, public model: model, public modal: modal, private view: view) {
        this.view.isEditable = false;
    }


    /**
     * closes the moal without further action
     */
    private close() {
        this.self.destroy();
    }

    /**
     * closes the moal without further action
     */
    private save() {
        this.backend.postRequest('module/SalesDocs/'+this.model.id+'/reject',{}, {items: this.model.data.salesdocitems.beans}).subscribe(res => {
            this.close();
        })
        this.close();
    }

}
