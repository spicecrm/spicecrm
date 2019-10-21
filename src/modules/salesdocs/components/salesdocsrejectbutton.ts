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
    templateUrl: "./src/modules/salesdocs/templates/salesdocsrejectbutton.html",
})
export class SalesdocsRejectButton extends ObjectActionNewButton implements OnInit {

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, private injector: Injector) {
        super(language, metadata, model);

        this.model.module = 'SalesDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        this.modal.openModal('SalesdocsRejectModal', true, this.injector);
    }

}
