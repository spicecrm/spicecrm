/**
 * @module ModulePriceConditions
 */
import {Component, OnInit, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';

import {priceconditonsconfiguration} from '../services/priceconditonsconfiguration.service';

@Component({
    selector: 'price-conditions-conditions-list',
    templateUrl: '../templates/priceconditionsconditionslist.html'
})
export class PriceConditionsConditionsList implements OnInit {

    /**
     * the id of the rendered condition type
     */
    @Input() public conditiontypeid: string;

    /**
     * the id of the rendered determination
     */
    @Input() public determinationid: string;

    /**
     * the array of conditions to be rendered
     */
    @Input() public conditions: any[] = [];

    /**
     * the type of the condiiton
     */
    public conditiontype: 'A' | 'P' = 'A';

    /**
     * holds the fields for the determination strategy as per the determination_id
     */
    public determinationfields: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, public priceconditonsconfiguration: priceconditonsconfiguration, public backend: backend) {
    }

    public ngOnInit(): void {
        // loads the condition type
        this.determineConditionType();

        // loads the key fields
        this.getDeterminationIdFields();
    }

    /**
     * loads the conditon type (Amount or Percent)
     */
    public determineConditionType() {
        this.conditiontype = this.priceconditonsconfiguration.config.conditiontypes.find(t => t.id == this.conditiontypeid).valuetype;
    }

    /**
     * returns the label or name of the determination
     */
    get determinationname() {
        if (this.priceconditonsconfiguration.config.determinations) {
            let determination = this.priceconditonsconfiguration.config.determinations.find(d => d.id == this.determinationid);
            if (determination) return determination.label ? determination.label : determination.name;
        }
        return this.determinationid;
    }

    /**
     * build teh fields for the determination in the proper sequence
     */
    public getDeterminationIdFields() {
        let determinationelements = this.priceconditonsconfiguration.config.determinationelements.filter(d => d.pricedetermination_id == this.determinationid).sort((a, b) => a.priceconditionelement_index > b.priceconditionelement_index ? 1 : -1);
        let start = 0;
        for (let determinationelement of determinationelements) {
            let detElement = this.priceconditonsconfiguration.config.conditionelements.find(e => e.id == determinationelement.priceconditionelement_id);
            if (detElement) {
                // only push oif we are not for the module
                if (detElement.element_module != this.model.module) {
                    detElement.element_length = parseInt(detElement.element_length, 10);
                    detElement.element_start = start;
                    this.determinationfields.push(detElement);
                }
                start += parseInt(detElement.element_length, 10);
            }
        }
    }

    /**
     * returns the value from the key
     *
     * @param element
     * @param key
     */
    public getValueFromKey(key, element) {
        let val = key.substring(element.element_start, element.element_start + element.element_length);
        if (element.element_domain && this.language.languagedata.applist[element.element_domain]) {
            let textval = this.language.languagedata.applist[element.element_domain][val];
            if (textval) val = textval;
        }
        return val;
    }
}
