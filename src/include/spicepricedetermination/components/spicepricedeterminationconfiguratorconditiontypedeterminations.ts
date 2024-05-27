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
import {
    priceConditionElement, priceConditionTypeDetermination,
    priceDetermination,
    priceDeterminationElement
} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;


@Component({
    selector: 'spice-price-determination-configurator-conditiontype-determinations',
    templateUrl: '../templates/spicepricedeterminationconfiguratorconditiontypedeterminations.html'
})
export class SpicePriceDeterminationConfiguratorConditiontypeDeterminations{

    public self: any;

    public conditiontypeId: string;

    public nowDragging = false;

    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal) {

    }

    get determinations(): priceConditionTypeDetermination[]{
        return this.conditiontypeId ? this.cs.conditionTypeDeterminations.filter(cd => cd.priceconditiontype_id == this.conditiontypeId && cd.deleted !== true).sort((a, b) => a.pricedetermination_index > b.pricedetermination_index ? 1 : -1) : [];
    }


    public close(){
        this.self.destroy();
    }


    public translateElementId(id){
        return this.cs.determinations.find(d => d.id == id).name;
    }

    public dragStarted(e) {
        this.nowDragging = true;
        e.source.element.nativeElement.classList.add('slds-is-selected');
    }

    public dragEnded(e) {
        this.nowDragging = false;
        e.source.element.nativeElement.classList.remove('slds-is-selected');
    }

    public drop(event) {
        let determinations = [...this.determinations]
        let previousItem = determinations.splice(event.previousIndex, 1);
        determinations.splice(event.currentIndex, 0, previousItem[0]);

        let i = 0;
        for (let item of determinations) {
            this.cs.conditionTypeDeterminations.find(e => e.id == item.id).pricedetermination_index = i;
            i++;
        }
    }

    public add(){
        let options = [];
        for(let d of this.cs.determinations){
            if(!this.determinations.find(e => e.pricedetermination_id == d.id)){
                options.push({
                    value: d.id,
                    display: d.name
                })
            }
        }

        this.modal.prompt('input', null, 'LBL_SELEC_ELEMENT', 'shade', null, options, 'radio').subscribe({
            next: (val) => {
                this.cs.conditionTypeDeterminations.push({
                    id: this.mu.generateGuid(),
                    priceconditiontype_id: this.conditiontypeId,
                    pricedetermination_id: val,
                    pricedetermination_index: this.determinations.length
                })
            }
        })
    }

    public delete(cd: priceConditionTypeDetermination){
        cd.deleted = true;
    }

}
