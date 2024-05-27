/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, Injector, OnInit
} from '@angular/core';
import {modal} from "../../../services/modal.service";
import {SpicePriceDeterminationConfiguratorService} from "../services/spicepricedeterminationconfigurator.service";
import {
    priceConditionType,
} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";


@Component({
    selector: 'spice-price-determination-configurator-conditiontypes',
    templateUrl: '../templates/spicepricedeterminationconfiguratorconditiontypes.html'
})
export class SpicePriceDeterminationConfiguratorConditiontypes {

    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal, public injector: Injector) {

    }

    get conditionTypes(){
        return this.cs.getValues('conditionTypes');
    }

    /**
     * returns if the elemtn is used to limit delete and changes
     * @param id
     */
    public isUsed(id){
        return this.cs.calculationSchemaElements.filter(cse => cse.syspriceconditiontype_id == id).length > 0;
    }

    public add(){
        this.modal.prompt('input', null, 'LBL_ADD_DETERMINATION').subscribe({
            next: (name) => {
                if(name) {
                    this.cs.conditionTypes.push({
                        id: this.mu.generateGuid(),
                        name: name,
                        determinationtype: "F",
                        valuetype: 'A',
                        deleted: false
                    });
                }
            }
        });
    }

    public delete(cs: priceConditionType){
        cs.deleted = true;
    }

    public elements(id){
        this.modal.openModal('SpicePriceDeterminationConfiguratorConditiontypeDeterminations', true, this.injector).subscribe({
            next: (modalRef) => {
                 modalRef.instance.conditiontypeId = id;
            }
        })
    }

}
