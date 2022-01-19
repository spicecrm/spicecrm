/**
 * @module ModulePriceConditions
 */
import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {backend} from '../../../services/backend.service';
import {language} from '../../../services/language.service';
import {configurationService} from '../../../services/configuration.service';

import {priceconditonsconfiguration} from '../services/priceconditonsconfiguration.service';

declare var _: any;

@Component({
    selector: 'price-conditions-by-determination',
    templateUrl: '../templates/priceconditionsbydetermination.html',
})
export class PriceConditionsByDetermination implements OnInit {

    /**
     * all loaded conditions
     */
    @Input() public conditions: any[] = [];

    /**
     * the list of determinationtypes
     */
    public determinationtypes: any[] = [];

    /**
     * the current active condition type
     */
    public activedeterminationtype: string;


    constructor(public language: language, public metadata: metadata, public model: model, public router: Router, public backend: backend, public configuration: configurationService, public priceconditonsconfiguration: priceconditonsconfiguration) {
    }

    public ngOnInit(): void {
        this.analyzeConditions();
    }


    /**
     * loads the conditions for the accounnt on the backend
     */
    public analyzeConditions() {
        this.determinationtypes = [];
        let determinationtypes = _.uniq(this.conditions.map(d => d.priceconditiontypedetermination_id));
        for (let determinationtype of determinationtypes) {
            this.determinationtypes.push(this.priceconditonsconfiguration.config.determinations.find(d => d.id == determinationtype));
        }
        this.determinationtypes.sort((a, b) => a.sortindex > b.sortindex ? 1 : -1);


        // set the first one to active
        if (this.determinationtypes.length > 0) {
            this.setDeterminationType(this.determinationtypes[0].id);
        }
    }

    /**
     * sets the active determination type
     *
     * @param determinationtypeid
     */
    public setDeterminationType(determinationtypeid) {
        this.activedeterminationtype = determinationtypeid;
    }

    get activedeterminations() {
        return _.uniq(this.conditions.filter(c => c.priceconditiontype_id == this.activedeterminationtype).map(d => d.priceconditiontypedetermination_id));
    }

    public conditonsForDeterminationId(determinationid) {
        return this.conditions.filter(c => c.priceconditiontypedetermination_id == determinationid);
    }
}
