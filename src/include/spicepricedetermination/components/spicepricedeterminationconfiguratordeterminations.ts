/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, Injector, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";
import {SpicePriceDeterminationConfiguratorService} from "../services/spicepricedeterminationconfigurator.service";
import {priceConditionElement, priceDetermination} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;


@Component({
    selector: 'spice-price-determination-configurator-determinations',
    templateUrl: '../templates/spicepricedeterminationconfiguratordeterminations.html'
})
export class SpicePriceDeterminationConfiguratorDeterminations {


    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal, public injector: Injector) {

    }

    get determinations(){
        return this.cs.getValues('determinations');
    }

    /**
     * returns if the elemtn is used to limit delete and changes
     * @param id
     */
    public isUsed(id){
        return this.cs.conditionTypeDeterminations.filter(ctd => ctd.pricedetermination_id == id).length > 0;
    }

    public getModule(attributeValue){
        if(!attributeValue) return '';

        let values = attributeValue.split('::');
        return values[0];
    }

    public getField(attributeValue){
        if(!attributeValue) return '';

        let values = attributeValue.split('::');
        return values[1];
    }

    public setModule(determination : priceDetermination, module){
        determination.determinationattribute = module ? module + '::' : undefined
    }

    public setField(determination : priceDetermination, field){
        let values = determination.determinationattribute.split('::');
        determination.determinationattribute = values[0] + '::' + (field ? field : '');
    }

    public add(){
        this.modal.prompt('input', null, 'LBL_ADD_DETERMINATION').subscribe({
            next: (name) => {
                if(name) {
                    this.cs.determinations.push({
                        id: this.mu.generateGuid(),
                        name: name,
                        deleted: false
                    });
                }
            }
        });
    }

    public delete(d: priceDetermination){
        d.deleted = true;
    }

    public elements(id){
        this.modal.openModal('SpicePriceDeterminationConfiguratorDeterminationElements', true, this.injector).subscribe({
            next: (modalRef) => {
                 modalRef.instance.determinationId = id;
            }
        })
    }

}
