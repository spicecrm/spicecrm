/**
 * @module ModulePriceConditions
 */
import {Component, OnInit, OnChanges, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {userpreferences} from '../../../services/userpreferences.service';

import {priceconditonsconfiguration} from '../services/priceconditonsconfiguration.service';

declare var _: any;

@Component({
    selector: 'price-conditions-by-determination-list',
    templateUrl: '../templates/priceconditionsbydeterminationlist.html'
})
export class PriceConditionsByDeterminationList implements OnChanges {

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

    /**
     * holds the unique keys found in teh conditions
     */
    public determinationkeys: string[] = [];

    /**
     * holds conditiontypes allocated to the determination
     */
    public conditiontypes: any[] = [];

    constructor(public language: language, public metadata: metadata, public model: model, public priceconditonsconfiguration: priceconditonsconfiguration, public backend: backend, public userpreferences: userpreferences) {
    }

    public ngOnChanges(): void {

        // loads the key fields
        this.getDeterminationIdFields();

        this.getConditionsTypeIDs();

        this.getUniqueKeys();
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

    public getUniqueKeys() {
        this.determinationkeys = _.uniq(this.conditions.map(d => d.pricecondition_key));
        this.determinationkeys.sort();
    }

    /**
     * build teh fields for the determination in the proper sequence
     */
    public getDeterminationIdFields() {
        this.determinationfields = [];
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
        return this.language.getTranslatedDisplayOption(element.element_domain, val);
    }

    public getConditionsTypeIDs() {
        this.conditiontypes = this.priceconditonsconfiguration.config.conditiondeterminations.filter(c => c.pricedetermination_id == this.determinationid).map(t => this.priceconditonsconfiguration.config.conditiontypes.find(pc => pc.id == t.priceconditiontype_id));
        this.conditiontypes.sort((a, b) => a.sortindex > b.sortindex ? 1 : -1);
    }

    /**
     * gets the name for the condition
     *
     * @param priceconditiontype_id
     */
    public getConditionTypeName(priceconditiontype_id) {
        if (this.priceconditonsconfiguration.config.conditiontypes) {
            let ct = this.priceconditonsconfiguration.config.conditiontypes.find(t => t.id == priceconditiontype_id);
            if (ct) return ct.name;
        }

        return priceconditiontype_id;
    }

    /**
     * loads the conditionvalue for the combination if a record exists
     *
     * @param key
     * @param conditiontype
     */
    public getConditionValue(key, conditiontype) {
        let conditon = this.conditions.find(c => c.pricecondition_key == key && c.priceconditiontype_id == conditiontype.id);
        return conditon ? this.formatCondition(conditon.amount, conditiontype.valuetype) : '';
    }

    /**
     * formats the value
     *
     * @param amount
     * @param valuetype
     */
    public formatCondition(amount, valuetype) {
        let val = parseFloat(amount);
        if (isNaN(val)) return '';
        switch (valuetype) {
            case 'P':
                return this.userpreferences.formatMoney(val) + '%';
            default:
                return this.userpreferences.formatMoney(val);
        }

    }

}
