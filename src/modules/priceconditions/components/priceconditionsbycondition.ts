/**
 * @module ModulePriceConditions
 */
import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';

import {priceconditonsconfiguration} from '../services/priceconditonsconfiguration.service';

declare var _: any;

@Component({
    selector:'price-conditions-by-condition',
    templateUrl: '../templates/priceconditionsbycondition.html',
})
export class PriceConditionsByCondition implements OnInit {

    /**
     * all loaded conditions
     */
    @Input() public conditions: any[] = [];

    /**
     * the list of conditiontypes
     */
    public conditiontypes: any[] = [];

    /**
     * the current active condition type
     */
    public activeconditiontype: string;


    constructor(public language: language, public metadata: metadata, public model: model, public router: Router, public backend: backend, public configuration: configurationService, public priceconditonsconfiguration: priceconditonsconfiguration) {
    }

    public ngOnInit(): void {
        this.analyzeConditions();
    }

    /**
     * loads the conditions for the accounnt on the backend
     */
    public analyzeConditions() {
        this.conditiontypes = _.uniq(this.conditions.map(d => d.priceconditiontype_id));

        this.conditiontypes = [];
        let conditiontypes = _.uniq(this.conditions.map(d => d.priceconditiontype_id));
        for(let conditiontype of conditiontypes){
            this.conditiontypes.push(this.priceconditonsconfiguration.config.conditiontypes.find(d => d.id == conditiontype));
        }
        this.conditiontypes.sort((a, b) => a.sortindex > b.sortindex ? 1 : -1);


        // set the first one to active
        if (this.conditiontypes.length > 0) {
            this.setConditionType(this.conditiontypes[0].id);
        }

    }

    public setConditionType(conditiontypeid) {
        this.activeconditiontype = conditiontypeid;
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
     * gets the label for the condition
     *
     * @param priceconditiontype_id
     */
    public getConditionTypeLabel(priceconditiontype_id) {
        if (this.priceconditonsconfiguration.config.conditiontypes) {
            let ct = this.priceconditonsconfiguration.config.conditiontypes.find(t => t.id == priceconditiontype_id);
            if (ct) return ct.label ? ct.label : ct.name;
        }

        return priceconditiontype_id;
    }

    get activedeterminations() {
        return _.uniq(this.conditions.filter(c => c.priceconditiontype_id == this.activeconditiontype).map(d => d.priceconditiontypedetermination_id));
    }

    public conditonsForDeterminationId(determinationid) {
        let conditions = this.conditions.filter(c => c.priceconditiontype_id == this.activeconditiontype && c.priceconditiontypedetermination_id == determinationid);
        conditions.sort((a, b) => a.pricecondition_key > b.pricecondition_key ? 1 : -1);
        return conditions;
    }
}
