/**
 * @module ModuleSpicePriceDetermination
 */
import {
    Component, OnInit
} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {modal} from "../../../services/modal.service";

declare var moment: any;

/**
 * a modalto set prices on a module
 */
@Component({
    selector: 'spice-price-manager-modal',
    templateUrl: '../templates/spicepricemanagermodal.html',
})
export class SpicePriceManagerModal implements OnInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    public conditionTypes: any[] = [];
    public _conditionType: string = '';

    public determinationTypes: any[] = [];

    public _determinationType: string = '';

    public loadedconditions: any[] = [];
    public conditions: any[] = [];

    constructor(public backend: backend,  public model: model, public modal: modal) {

    }

    public ngOnInit() {
        this.loadConditionTypes();
    }

    public loadConditionTypes(){
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/pricedetermination/conditiontypes`).subscribe({
            next: (res) => {
                this.conditionTypes = res.conditiontypes;
                this.determinationTypes = res.determinations;
            }
        })
    }

    get conditionType(){
        return this._conditionType;
    }

    set conditionType(ct){
        this._conditionType = ct;
        this.determinationType = '';
    }


    get determinationType(){
        return this._determinationType;
    }

    set determinationType(dt){
        this._determinationType = dt;
        // if we have a value
        if(dt) {
            this.loadConditions();
        } else {
            this.conditions = [];
        }
    }

    /**
     * return the type elements
     */
    get conditionTypeElements(){
        return this._determinationType ? this.determinationTypes.find(d => d.id == this._determinationType).elements : [];
    }

    /**
     * returns true if the type is TAX
     */
    get isTypeTax(){
        return this.conditionType ? this.conditionTypes.find(t => t.id == this.conditionType).valuetype == 'T' : false;
    }

    /**
     * loads the condition records
     */
    public loadConditions(){
        this.conditions = [];
        let awaitModal = this.modal.await('LBL_LOADING');
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/pricedetermination/conditions/${this.conditionType}/${this.determinationType}`).subscribe({
            next: (res) => {
                this.loadedconditions= res;
                for(let c of this.loadedconditions){
                    if(c.valid_from) c.valid_from = new moment(c.valid_from);
                    if(c.valid_to) c.valid_to = new moment(c.valid_to);
                    c.condition_value = parseFloat(c.condition_value);
                    c.quantity_base = parseFloat(c.quantity_base);
                }
                awaitModal.emit(true);
            },
            error: () => {
                awaitModal.emit(true);
            }
        })
    }

    public addCondition(){
        let condition = {
            id: this.model.utils.generateGuid(),
            valid_from: moment(),
            quantity_base: 1,
            elementvalues: []
        }

        for(let ce of this.conditionTypeElements){
            let newValue: any = {
                id: this.model.utils.generateGuid(),
                syspricedeterminationelement_id: ce.id,
                elementvalue: this.model.module == ce.element_module ? this.model.getField(ce.element_module_field) : undefined
            }

            // if the field is the id .. push the name
            if(this.model.module == ce.element_module && ce.element_module_field && ce.element_module_field == 'id'){
                newValue.elementname = this.model.getField('name');
            }

            condition.elementvalues.push(newValue)
        }

        this.conditions.push(condition);
    }

    public getElementValue(conditionid, elementid, loaded = false){
        if(loaded){
            let rec = this.loadedconditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid);
            return rec.elementname ?? rec.elementvalue;
        } else {
            let rec = this.conditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid);
            return rec.elementname ?? rec.elementvalue;
        }
    }

    public setElementValue(conditionid, elementid, value){
        this.conditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid).elementvalue = value;
    }


    public getRelatedElementValue(conditionid, elementid, loaded = false){
        let rec = undefined
        if(loaded){
            rec = this.loadedconditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid);
        } else {
            rec = this.conditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid);
        }

        return rec?.elementvalue ? rec.elementvalue + '::' + rec.elementname : undefined;
    }


    public setRelatedIdValue(conditionid, elementid, value){
        let valArray = value.split('::');
        this.conditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid).elementvalue = valArray[0];
        this.conditions.find(c => c.id == conditionid).elementvalues.find(ev => ev.syspricedeterminationelement_id == elementid).elementname = valArray[1];
    }

    public saveConditions(){
        // format dates
        for(let c of this.conditions){
            c.valid_from = c.valid_from.utc().format('YYYY-MM-DD HH:mm:ss');
            if(c.valid_to){
                c.valid_to = c.valid_to.utc().format('YYYY-MM-DD HH:mm:ss');
            }
        }

        // post to the backend
        this.backend.postRequest(`module/${this.model.module}/${this.model.id}/pricedetermination/conditions/${this.conditionType}/${this.determinationType}`, {}, this.conditions).subscribe({
            next: (res) => {
                this.conditions= res;
                this.close();
            }
        })
    }

    get conditionDeterminations(){
        let determinations = [];

        if(!this.conditionType) return determinations;

        // push the determinations
        for(let cdt of this.conditionTypes.find(t => t.id == this.conditionType).determinations){
            let dt =this.determinationTypes.find(d => d.id == cdt.pricedetermination_id);
            if(dt) determinations.push(dt);
        }

        return determinations;
    }

    public close(){
        this.self.destroy();
    }

}
