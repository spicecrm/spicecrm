/**
 * @module ModuleProcurementDocs
 */
import {Component, OnInit, Injector, SkipSelf} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {ObjectActionNewButton} from "../../../objectcomponents/components/objectactionnewbutton";

declare var _: any;

@Component({
    templateUrl: "../../../objectcomponents/templates/objectactionnewbutton.html",
    providers: [model]
})
export class ProcurementDocsNewButton extends ObjectActionNewButton implements OnInit {

    public actionconfig: any = {};

    constructor(public language: language, public metadata: metadata, public model: model, @SkipSelf() public parentmodel: model, public modal: modal, public injector: Injector) {
        super(language, metadata, model, parentmodel);

        this.model.module = 'ProcurementDocs';
    }

    /**
     * execute when the button is clicked
     */
    public execute() {
        if (_.isEmpty(this.actionconfig)) {
            this.actionconfig = this.metadata.getComponentConfig('ProcurementdocsNewButton', this.model.module);
        }

        this.model.id = "";
        this.model.initialize(this.parentmodel);

        if (this.actionconfig.defaultprocurementdoctype) {
            this.model.setField('procurementdoctype', this.actionconfig.defaultprocurementdoctype);
        }

        this.modal.openModal(this.actionconfig.modalcomponent ? this.actionconfig.modalcomponent : 'ProcurementDocsAddBasics', true, this.injector);
    }

}
