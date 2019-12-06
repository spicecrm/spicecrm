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
    templateUrl: "./src/modules/salesdocs/templates/salesdocswithreferencetypemodal.html",
})
export class SalesdocsWithReferenceTypeModal implements OnInit {

    /**
     * reference to the modal itself
     */
    private self: any;

    /**
     * holds the targettypes
     */
    private targetTypes: any[] = [];

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
     * determine the targettypes
     */
    public ngOnInit(): void {
        this.targetTypes = [];
        let typesFlows = this.configuration.getData('salesdoctypesflow');
        this.targetTypes = typesFlows.filter(typesFlow => typesFlow.from == this.model.getField('salesdoctype'));

        // select the first by default
        this.selectedType = this.targetTypes[0].to;
    }

    /**
     * closes the modal
     */
    private close() {
        this.self.destroy();
    }

    /**
     * check if we find the type and a vname is defined .. otherwise return the doc type direct
     *
     * @param salesdoctype
     */
    private salesdoctypeDisplayname(salesdoctype) {
        let type = this.configuration.getData('salesdoctypes').find(thistype => thistype.name == salesdoctype);
        if (type && type.vname) {
            return this.language.getLabel(type.vname);
        } else {
            return salesdoctype;
        }
    }

    /**
     * go and create the new SalesDocument
     */
    private create() {
        this.modal.openModal('SalesdocsWithReferenceSelectItemsModal', true, this.injector).subscribe(itemsmodal => {
            itemsmodal.instance.selectedType = this.selectedType;
            this.close();
        });
    }
}
