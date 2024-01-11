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
    priceConditionElement,
    priceDetermination,
    priceDeterminationElement
} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;


@Component({
    selector: 'spice-price-determination-configurator-determination-elements',
    templateUrl: '../templates/spicepricedeterminationconfiguratordeterminationelements.html'
})
export class SpicePriceDeterminationConfiguratorDeterminationElements{

    public self: any;

    public determinationId: string;

    public nowDragging = false;

    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal) {

    }

    get determinationElements(){
        return this.determinationId ? this.cs.determinationElements.filter(de => de.pricedetermination_id == this.determinationId && de.deleted !== true).sort((a, b) => a.priceconditionelement_index > b.priceconditionelement_index ? 1 : -1) : [];
    }

    public getModule(attributeValue){
        if(!attributeValue) return '';

        let values = attributeValue.split('::');
        return values[0];
    }

    public close(){
        this.self.destroy();
    }


    public translateElementId(id){
        return this.cs.conditionElements.find(ce => ce.id == id).name;
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
        let elements = [...this.determinationElements]
        let previousItem = elements.splice(event.previousIndex, 1);
        elements.splice(event.currentIndex, 0, previousItem[0]);

        let i = 0;
        for (let item of elements) {
            this.cs.determinationElements.find(e => e.id == item.id).priceconditionelement_index = i;
            i++;
        }
    }

    public add(){
        let options = [];
        for(let ce of this.cs.conditionElements){
            if(!this.determinationElements.find(e => e.priceconditionelement_id == ce.id)){
                options.push({
                    value: ce.id,
                    display: ce.name
                })
            }
        }

        this.modal.prompt('input', null, 'LBL_SELEC_ELEMENT', 'shade', null, options, 'radio').subscribe({
            next: (val) => {
                this.cs.determinationElements.push({
                    id: this.mu.generateGuid(),
                    pricedetermination_id: this.determinationId,
                    priceconditionelement_id: val,
                    priceconditionelement_index: this.determinationElements.length
                })
            }
        })
    }

    public delete(de: priceDeterminationElement){
        de.deleted = true;
    }

}
