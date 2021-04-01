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
        let conditions = this.conditions.filter(c => c.priceconditiontype_id == this.activeconditiontype && c.priceconditiontypedetermination_id == determinationid);
        conditions.sort((a, b) => a.pricecondition_key > b.pricecondition_key ? 1 : -1);
        return conditions;
    }
}
