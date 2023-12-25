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
    priceCalculationSchema,
    priceCalculationSchemaElement,
    priceConditionElement
} from "../interfaces/spicepricedeterminationconfigurator.interfaces";
import {modelutilities} from "../../../services/modelutilities.service";

declare var moment: any;

/**
 * a modalto set prices on a module
 */
@Component({
    selector: 'spice-price-determination-configurator-schemes',
    templateUrl: '../templates/spicepricedeterminationconfiguratorschemes.html'
})
export class SpicePriceDeterminationConfiguratorSchemes {

    public nowDragging: boolean = false;

    constructor(public cs: SpicePriceDeterminationConfiguratorService, public mu: modelutilities, public modal: modal) {

    }

    get calculationSchemes(){
        return this.cs.calculationSchemes.filter(cs => cs.deleted !== true).sort((a, b) => a.name.localeCompare(b.name));
    }

    get schemaElements(): priceCalculationSchemaElement[]{
        return this.cs.selectedSchema ? this.cs.calculationSchemaElements.filter(e => e.syspricecalculationschema_id == this.cs.selectedSchema && e.deleted !== true).sort((a, b) => parseFloat(a.elementindex) > parseFloat(b.elementindex) ? 1 : -1) : [];
    }

    public setConditionType(schemaElemeent: priceCalculationSchemaElement, conditiontypeId){
        schemaElemeent.syspriceconditiontype_id = conditiontypeId;

        if(conditiontypeId) {
            // set come values
            switch (this.cs.conditionTypes.find(ct => ct.id == conditiontypeId).valuetype) {
                case 'T':
                    schemaElemeent.elementbasetype = 'A';
                    schemaElemeent.elementcalculation = '';
                    break
                case 'A':
                case 'F':
                    schemaElemeent.elementbasetype = undefined;
                    schemaElemeent.elementbase = '';
                    break;
                case 'P':
                    schemaElemeent.elementbasetype = undefined;
                    break;
                default:
                    schemaElemeent.elementbasetype = undefined;
                    schemaElemeent.elementbase = '';
                    break;
            }
        } else {
            schemaElemeent.elementbasetype = undefined;
            schemaElemeent.elementbase = '';
        }
    }

    public getValueType(conditionTypeID){
        if(!conditionTypeID) return '';

        return this.cs.conditionTypes.find(ct => ct.id == conditionTypeID).valuetype;
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
        let elements = [...this.schemaElements]
        let previousItem = elements.splice(event.previousIndex, 1);
        elements.splice(event.currentIndex, 0, previousItem[0]);

        this.renumberElements(elements)
    }

    public renumberElements(elements = null){

        if(!elements) elements = this.schemaElements;

        let i = 1;
        let mapped: any[] = [];
        for (let item of elements) {
            this.cs.calculationSchemaElements.find(e => e.id == item.id).elementindex = (i * 10).toString();
            i++;
        }
    }

    /**
     * adds a new element
     */
    public addSchema(copy = false){
        this.modal.prompt('input', null, 'LBL_ADD_CALCULATIONSCHEMA').subscribe({
            next: (name) => {
                if(name) {
                    let id = this.mu.generateGuid();
                    this.cs.calculationSchemes.push({
                        id: id,
                        name: name,
                        deleted: false
                    });

                    // if we should copy create the entries
                    if (copy) {
                        this.cs.calculationSchemaElements.filter(cse => cse.syspricecalculationschema_id == this.cs.selectedSchema).forEach(cse => {
                            let newCSE = {...cse};
                            newCSE.id = this.mu.generateGuid();
                            newCSE.syspricecalculationschema_id = id;
                            this.cs.calculationSchemaElements.push(newCSE);
                        });

                    }

                    this.cs.selectedSchema = id;
                }
            }
        });
    }


    /**
     * adds a new element
     */
    public add(){
        this.modal.prompt('input', null, 'LBL_ADD_SCHEMAELEMENT', 'shade', 'C', [{value: 'M', display: 'LBL_FORMULA'},{value: 'C', display: 'LBL_CONDITIONTYPE'}]).subscribe({
            next: (determinationtype) => {
                if(determinationtype) {
                    this.cs.calculationSchemaElements.push({
                        id: this.mu.generateGuid(),
                        syspricecalculationschema_id: this.cs.selectedSchema,
                        elementdeterminationtype: determinationtype,
                        elementindex: ((this.schemaElements.length + 1) * 10).toString(),
                        editable: '0',
                        hidden: '0',
                        print: '0'
                    })
                }
            }
        })

    }

    /**
     * deletes a new element
     * @param id
     */
    public deleteSchema(){
        let cs = this.cs.calculationSchemes.find(c => c.id == this.cs.selectedSchema).deleted = true;
        this.cs.calculationSchemaElements.filter(cse => cse.syspricecalculationschema_id == this.cs.selectedSchema).forEach(cse => cse.deleted = true);
        this.cs.selectedSchema = '';
    }

    /**
     * makes an elemnent as deleted
     * @param pcse
     */
    public deleteElement(pcse: priceCalculationSchemaElement){
        pcse.deleted = true;
        this.renumberElements();
    }

}
