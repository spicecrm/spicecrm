/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {SpicePriceDeterminationConfiguratorService} from "../services/spicepricedeterminationconfigurator.service";
import {priceConditionElement} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;

/**
 * a modalto set prices on a module
 */
@Component({
    selector: 'spice-price-determination-configurator-elements',
    templateUrl: '../templates/spicepricedeterminationconfiguratorelements.html'
})
export class SpicePriceDeterminationConfiguratorElements {


    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal) {

    }

    get conditionElements(){
        return this.cs.getValues('conditionElements');
        // return this.cs.conditionElements.filter(ce => ce.deleted !== true).sort((a, b) => a.name.localeCompare(b.name));
    }

    public resetField(record: priceConditionElement){
        if(!record.element_module) record.element_module_field = undefined;
    }

    /**
     * returns if the elemtn is used to limit delete and changes
     * @param id
     */
    public isUsed(id){
        return this.cs.determinationElements.filter(de => de.priceconditionelement_id == id).length > 0;
    }

    /**
     * adds a new element
     */
    public add(){
        this.modal.prompt('input', null, 'LBL_ADD_DETERMINATIONELEMENT').subscribe({
            next: (name) => {
                if(name) {
                    this.cs.conditionElements.push({
                        id: this.mu.generateGuid(),
                        name: name,
                        deleted: false
                    });
                }
            }
        });
    }

    /**
     * deletes a new element
     * @param id
     */
    public delete(ce: priceConditionElement){
        if(!this.isUsed(ce.id)) {
           ce.deleted = true;
        }
    }

}
