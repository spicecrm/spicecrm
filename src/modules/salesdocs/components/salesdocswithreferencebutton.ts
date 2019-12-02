/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";

@Component({
    templateUrl: "./src/modules/salesdocs/templates/salesdocswithreferencebutton.html",

})
export class SalesdocsWithReferenceButton {

    private salesdoctype: string;

    /**
     * holds the targettypes
     */
    private targetTypes: any[] = [];

    /**
     * subscribe to the model data$
     * @param language
     * @param metadata
     * @param model
     * @param modal
     * @param injector
     * @param configuration
     */
    constructor(public language: language, public metadata: metadata, public model: model, public modal: modal, private injector: Injector, private configuration: configurationService) {
        this.model.data$.subscribe(data => {
            this.getFlowTypes();
        });
    }

    /**
     * determine the targettypes
     */
    private getFlowTypes(): void {
        if(this.model.getField('salesdoctype') != this.salesdoctype) {
            this.salesdoctype = this.model.getField('salesdoctype');
            this.targetTypes = [];
            let typesFlows = this.configuration.getData('salesdoctypesflow');
            this.targetTypes = typesFlows.filter(typesFlow => typesFlow.from == this.salesdoctype);
        }
    }

    /**
     * disable if there are no possible flows
     */
    get disabled() {
        return this.targetTypes.length == 0;
    }

    /**
     * execute when the button is clicked .. open the proper modal
     */
    public execute() {
        this.modal.openModal ('SalesdocsWithReferenceTypeModal', true, this.injector);
    }

}
