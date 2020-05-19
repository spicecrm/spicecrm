/**
 * @module ModulePriceConditions
 */
import {Component, OnInit} from '@angular/core';
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
    templateUrl: './src/modules/priceconditions/templates/priceconditionsbydetermination.html',
    providers: [priceconditonsconfiguration],
    animations: [
        trigger('conditionscard', [
            transition(':enter', [
                style({opacity: 0, height: '0px', overflow: 'hidden'}),
                animate('.5s', style({height: '*', opacity: 1})),
                style({overflow: 'unset'})
            ]),
            transition(':leave', [
                style({overflow: 'hidden'}),
                animate('.5s', style({height: '0px', opacity: 0}))
            ])
        ]),
        trigger('animateicon', [
            state('open', style({transform: 'scale(1, 1)'})),
            state('closed', style({transform: 'scale(1, -1)'})),
            transition('open => closed', [
                animate('.5s'),
            ]),
            transition('closed => open', [
                animate('.5s'),
            ])
        ])
    ]
})
export class PriceConditionsByDetermination {

    /**
     * inidcates that the panel is loading
     */
    private loading: boolean = true;

    /**
     * all loaded conditions
     */
    private conditions: any[] = [];

    /**
     * the list of determinationtypes
     */
    private determinationtypes: any[] = [];

    /**
     * the current active condition type
     */
    private activedeterminationtype: string;

    /**
     * for the collapsible panel if the panel is open
     */
    private _isopen: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private backend: backend, private configuration: configurationService, private priceconditonsconfiguration: priceconditonsconfiguration) {
        this.priceconditonsconfiguration.loaded$.subscribe(loaded => {
            if (loaded) {
                this.loadConditions();
            }
        });
    }


    /**
     * toggle Open or Close the panel
     */
    private toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this._isopen = !this._isopen;
    }


    /**
     * loads the conditions for the accounnt on the backend
     */
    private loadConditions() {
        this.backend.getRequest(`module/PriceConditions/list/${this.model.module}/${this.model.id}`).subscribe(conditions => {
            this.conditions = conditions;

            // determine the conditiontypes we have
            /**
             for (let condition of conditions) {
                if (this.conditiontypes.indexOf(condition.priceconditiontype_id) < 0) {
                    this.conditiontypes.push(condition.priceconditiontype_id);
                }
            }*/


            this.determinationtypes = [];
            let determinationtypes = _.uniq(this.conditions.map(d => d.priceconditiontypedetermination_id));
            for(let determinationtype of determinationtypes){
                this.determinationtypes.push(this.priceconditonsconfiguration.config.determinations.find(d => d.id == determinationtype));
            }
            this.determinationtypes.sort((a, b) => a > b ? 1 : -1);


            // set the first one to active
            if (this.determinationtypes.length > 0) {
                this.setDeterminationType(this.determinationtypes[0].id);
            }

            // set loading to false
            this.loading = false;
        });
    }

    /**
     * sets the active determination type
     *
     * @param determinationtypeid
     */
    private setDeterminationType(determinationtypeid) {
        this.activedeterminationtype = determinationtypeid;
    }

    /**
     * a helper to get if we have related models and the state is open
     */
    get isopen() {
        return this._isopen;
    }

    get activedeterminations() {
        return _.uniq(this.conditions.filter(c => c.priceconditiontype_id == this.activedeterminationtype).map(d => d.priceconditiontypedetermination_id));
    }

    private conditonsForDeterminationId(determinationid) {
        return this.conditions.filter(c => c.priceconditiontypedetermination_id == determinationid);
    }
}
