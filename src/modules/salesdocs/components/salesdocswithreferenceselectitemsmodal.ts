/**
 * @module ModuleSalesDocs
 */
import {Component, OnInit, Injector} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {configurationService} from "../../../services/configuration.service";

/**
 * a modal that presentas the users the options for salesdoctypes a slaesdoc can be copied to.
 */
@Component({
    templateUrl: "./src/modules/salesdocs/templates/salesdocswithreferenceselectitemsmodal.html",
})
export class SalesdocsWithReferenceSelectItemsModal {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * the selected type
     */
    private selectedType: string = '';

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

    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }


    /**
     * go and create the new SalesDocument
     */
    private create() {
        this.close();
    }
}
