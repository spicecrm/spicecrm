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
    templateUrl: './src/modules/priceconditions/templates/priceconditionsaccountspanel.html',
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
    private componentconfig: any = {};

    /**
     * inidcates that the panel is loading
     */
    private loading: boolean = true;

    /**
     * all loaded conditions
     */
    private conditions: any[] = [];

    /**
     * the list of conditiontypes
     */
    private conditiontypes: any[] = [];

    /**
     * the current active condition type
     */
    private activeconditiontype: string;

    /**
     * for the collapsible panel if the panel is open
     */
    private _isopen: boolean = true;

    private activeView: 'condition' | 'determination' = 'determination';

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private backend: backend, private configuration: configurationService, private priceconditonsconfiguration: priceconditonsconfiguration) {
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
    private toggleOpen(e: MouseEvent) {
        e.stopPropagation();
        this._isopen = !this._isopen;
    }


    /**
     * loads the conditions for the accounnt on the backend
     */
    private loadConditions() {
        this.backend.getRequest(`module/${this.model.module}/${this.model.id}/related/priceconditions`).subscribe(conditions => {
            this.conditions = conditions.sort((a, b) => a.valid_from > b.valid_from ? -1 : 1);

            // set loading to false
            this.loading = false;
        });
    }

    private setConditionType(conditiontypeid) {
        this.activeconditiontype = conditiontypeid;
    }


    /**
     * a helper to get if we have related models and the state is open
     */
    get isopen() {
        return this._isopen;
    }
}
