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
    templateUrl: './src/modules/priceconditions/templates/priceconditionsbydeterminationlist.html'
})
export class PriceConditionsByDeterminationList implements OnChanges {

    /**
     * the id of the rendered determination
     */
    @Input() private determinationid: string;

    /**
     * the array of conditions to be rendered
     */
    @Input() private conditions: any[] = [];

    /**
     * the type of the condiiton
     */
    private conditiontype: 'A' | 'P' = 'A';

    /**
     * holds the fields for the determination strategy as per the determination_id
     */
    private determinationfields: any[] = [];

    /**
     * holds the unique keys found in teh conditions
     */
    private determinationkeys: string[] = [];

    /**
     * holds conditiontypes allocated to the determination
     */
    private conditiontypes: any[] = [];

    constructor(private language: language, private metadata: metadata, private model: model, private priceconditonsconfiguration: priceconditonsconfiguration, private backend: backend, private userpreferences: userpreferences) {
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

    private getUniqueKeys() {
        this.determinationkeys = _.uniq(this.conditions.map(d => d.pricecondition_key));
        this.determinationkeys.sort();
    }

    /**
     * build teh fields for the determination in the proper sequence
     */
    private getDeterminationIdFields() {
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
    private getValueFromKey(key, element) {
        let val = key.substring(element.element_start, element.element_start + element.element_length);
        if (element.element_domain && this.language.languagedata.applist[element.element_domain]) {
            let textval = this.language.languagedata.applist[element.element_domain][val];
            if (textval) val = textval;
        }
        return val;
    }

    private getConditionsTypeIDs() {
        this.conditiontypes = this.priceconditonsconfiguration.config.conditiondeterminations.filter(c => c.pricedetermination_id == this.determinationid).map(t => this.priceconditonsconfiguration.config.conditiontypes.find(pc => pc.id == t.priceconditiontype_id));
        this.conditiontypes.sort((a, b) => a.sortindex > b.sortindex ? 1 : -1);
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
     * loads the conditionvalue for the combination if a record exists
     *
     * @param key
     * @param conditiontype
     */
    private getConditionValue(key, conditiontype) {
        let conditon = this.conditions.find(c => c.pricecondition_key == key && c.priceconditiontype_id == conditiontype.id);
        return conditon ? this.formatCondition(conditon.amount, conditiontype.valuetype) : '';
    }

    /**
     * formats the value
     *
     * @param amount
     * @param valuetype
     */
    private formatCondition(amount, valuetype) {
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
