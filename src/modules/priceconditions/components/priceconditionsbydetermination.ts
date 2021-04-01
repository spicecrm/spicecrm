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
    templateUrl: './src/modules/priceconditions/templates/priceconditionsbydetermination.html',
})
export class PriceConditionsByDetermination implements OnInit {

    /**
     * all loaded conditions
     */
    @Input() private conditions: any[] = [];

    /**
     * the list of determinationtypes
     */
    private determinationtypes: any[] = [];

    /**
     * the current active condition type
     */
    private activedeterminationtype: string;


    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private backend: backend, private configuration: configurationService, private priceconditonsconfiguration: priceconditonsconfiguration) {
    }

    public ngOnInit(): void {
        this.analyzeConditions();
    }


    /**
     * loads the conditions for the accounnt on the backend
     */
    private analyzeConditions() {
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
    private setDeterminationType(determinationtypeid) {
        this.activedeterminationtype = determinationtypeid;
    }

    get activedeterminations() {
        return _.uniq(this.conditions.filter(c => c.priceconditiontype_id == this.activedeterminationtype).map(d => d.priceconditiontypedetermination_id));
    }

    private conditonsForDeterminationId(determinationid) {
        return this.conditions.filter(c => c.priceconditiontypedetermination_id == determinationid);
    }
}
