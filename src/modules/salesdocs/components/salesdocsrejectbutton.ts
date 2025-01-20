/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {ObjectActionNewButton} from "../../../objectcomponents/components/objectactionnewbutton";

@Component({
    templateUrl: "../templates/salesdocsrejectbutton.html",
})
export class SalesdocsRejectButton {

    constructor(
        public model: model,
        public modal: modal,
        public injector: Injector
    ) {
        this.model.module = 'SalesDocs';
    }

    get disabled(){
        return this.model.isEditing;
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        this.modal.openModal('SalesdocsRejectModal', true, this.injector);
    }

}
