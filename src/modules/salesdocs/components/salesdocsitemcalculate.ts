/**
 * @module ModuleSalesDocs
 */
import {
    AfterViewInit,
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    EventEmitter,
    Output, Optional, OnInit
} from '@angular/core';


import {model} from '../../../services/model.service';
import {configurationService} from '../../../services/configuration.service';
import {salesdocrecord} from "../services/salesdocrecord";
import {view} from "../../../services/view.service";

@Component({
    selector: 'salesdocs-items-calculate',
    templateUrl: '../templates/salesdocsitemcalculate.html',
})
export class SalesDocsItemCalculate implements OnInit{

    /**
     * reference to the modal itself
     */
    public self: any;

    public conditionelements: any[] = [];

    public schemaname: string = '';

    public schemaelements: any[] = [];

    private pricecalculationschema_id: string = '';

    constructor(public model: model, public view: view, public configuration: configurationService, public salesdocrecord: salesdocrecord) {

    }

    public ngOnInit() {
        // get the itemdetails
        this.pricecalculationschema_id = this.model.getField('salesdocitempricecalculationschema_id');

        // get the schema details
        let schemas = this.configuration.getData('pricingschemes');
        let schema = schemas.find(s => s.id == this.pricecalculationschema_id);
        this.schemaname = schema.name;

        // get the schema elements
        let schemaelements = this.configuration.getData('pricingschemaelements');
        this.schemaelements = schemaelements.filter(e => e.syspricecalculationschema_id == this.pricecalculationschema_id);
        this.schemaelements.sort((a, b) => a.elementindex > b.elementindex ? 1 : -1);

        // get the condition elements
        this.conditionelements = [...this.model.getField('salesdocitempricedetermination')];
    }

    get isEditing(){
        return this.view.isEditMode();
    }

    public getElementValue(elementid, override = false){
        // get the condiiton element
        let conditionelement = this.conditionelements.find(c => c.id == elementid);

        // return nothing if we have not found a record
        if(!conditionelement) return undefined;

        return override ? conditionelement.elementoverridevalue : conditionelement.elementvalue;
    }

    public getElementTaxCategory(elementid){
        // get the condiiton element
        let conditionelement = this.conditionelements.find(c => c.id == elementid);

        // return nothing if we have not found a record
        if(!conditionelement) return '';

        return conditionelement.tax_category;
    }

    public getElementLabel(element){
        if(element.label) return element.label;
        if(element.elementname) return element.elementname;
        if(element.conditionname) return element.conditionname;
        if(element.elementtype) return element.elementtype;
        return '';
    }

    public setElementOverrideValue(elementid, value){
        this.conditionelements.find(c => c.id == elementid).elementoverridevalue = value || value == 0 ? parseFloat(value) : undefined;

        // recalculate
        this.salesdocrecord.recalculate(this.schemaelements, this.conditionelements, this.model.getField('quantity'));
    }

    public getElementAmount(elementid, total = false){
        let element = this.conditionelements.find(c => c.id == elementid);
        return element ? (total ? element.elementtotalamount : element.elementamount) : null;
    }

    public save(){
        if(this.isEditing) {
            let updatefields: any = {};
            this.salesdocrecord.getItemFieldsByElements(this.model.getField('salesdocitempricecalculationschema_id'), this.model.getField('quantity'), this.conditionelements, updatefields);
            updatefields.salesdocitempricedetermination = this.conditionelements;
            this.model.setFields(updatefields);
        }
        this.close();
    }
    public close(){
        this.self.destroy();
    }

}
