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
    templateUrl: "./src/objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class SalesdocsNewButton extends ObjectActionNewButton implements OnInit {

    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, private injector: Injector) {
        super(language, metadata, model);

        this.model.module = 'SalesDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        let componentConfig = this.metadata.getComponentConfig('SalesdocsNewButton', this.model.module);

        this.model.id = "";
        this.model.initialize();
        this.modal.openModal(componentConfig.modalcomponent ? componentConfig.modalcomponent : 'SalesDocsAddBasics', true, this.injector);
    }

}
