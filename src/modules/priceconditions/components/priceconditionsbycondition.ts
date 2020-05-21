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
    templateUrl: './src/modules/priceconditions/templates/priceconditionsbycondition.html',
})
export class PriceConditionsByCondition implements OnInit {

    /**
     * all loaded conditions
     */
    @Input() private conditions: any[] = [];

    /**
     * the list of conditiontypes
     */
    private conditiontypes: any[] = [];

    /**
     * the current active condition type
     */
    private activeconditiontype: string;


    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private backend: backend, private configuration: configurationService, private priceconditonsconfiguration: priceconditonsconfiguration) {
    }

    public ngOnInit(): void {
        this.analyzeConditions();
    }

    /**
     * loads the conditions for the accounnt on the backend
     */
    private analyzeConditions() {
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

    private setConditionType(conditiontypeid) {
        this.activeconditiontype = conditiontypeid;
    }

    /**
     * gets the name for the condition
     *
     * @param priceconditiontype_id
     */
    private getConditionTypeName(priceconditiontype_id) {
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
    private getConditionTypeLabel(priceconditiontype_id) {
        if (this.priceconditonsconfiguration.config.conditiontypes) {
            let ct = this.priceconditonsconfiguration.config.conditiontypes.find(t => t.id == priceconditiontype_id);
            if (ct) return ct.label ? ct.label : ct.name;
        }

        return priceconditiontype_id;
    }

    get activedeterminations() {
        return _.uniq(this.conditions.filter(c => c.priceconditiontype_id == this.activeconditiontype).map(d => d.priceconditiontypedetermination_id));
    }

    private conditonsForDeterminationId(determinationid) {
        return this.conditions.filter(c => c.priceconditiontype_id == this.activeconditiontype && c.priceconditiontypedetermination_id == determinationid);
    }
}
