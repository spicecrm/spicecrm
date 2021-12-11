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
    templateUrl: '../templates/priceconditionsaccountspanel.html',
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
export class PriceConditionsAccountsPanel implements OnInit {

    /**
     *  a componentconfig passed in
     */
    public componentconfig: any = {};

    /**
     * inidcates that the panel is loading
     */
    public loading: boolean = true;

    /**
     * all loaded conditions
     */
    public conditions: any[] = [];

    /**
     * the list of conditiontypes
     */
    public conditiontypes: any[] = [];

    /**
     * the current active condition type
     */
    public activeconditiontype: string;

    /**
     * for the collapsible panel if the panel is open
     */
    public _isopen: boolean = true;

    public activeView: 'condition' | 'determination' = 'determination';

    constructor(public language: language, public metadata: metadata, public model: model, public router: Router, public backend: backend, public configuration: configurationService, public priceconditonsconfiguration: priceconditonsconfiguration) {
        this.priceconditonsconfiguration.loaded$.subscribe(loaded => {
            if (loaded) {
                this.loadConditions();
            }
        });
    }

    /**
     * an optional actionset rendered to the conmtainer
     */
    get actionset() {
        return this.componentconfig?.actionset;
    }

    public ngOnInit(): void {

    }

    /**
     * toggle Open or Close the panel
     */
    public toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this._isopen = !this._isopen;
    }


    /**
     * loads the conditions for the accounnt on the backend
     */
    public loadConditions() {
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/priceconditions`).subscribe(conditions => {
            this.conditions = conditions.sort((a, b) => a.valid_from > b.valid_from ? -1 : 1);

            // set loading to false
            this.loading = false;
        });
    }

    public setConditionType(conditiontypeid) {
        this.activeconditiontype = conditiontypeid;
    }


    /**
     * a helper to get if we have related models and the state is open
     */
    get isopen() {
        return this._isopen;
    }
}
