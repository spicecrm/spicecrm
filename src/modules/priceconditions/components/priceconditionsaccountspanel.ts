/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
        this.backend.getRequest(`module/PriceConditions/list/${this.model.module}/${this.model.id}`).subscribe(conditions => {
            this.conditions = conditions;

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
