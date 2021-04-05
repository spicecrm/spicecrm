/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleAccounts
 */
import {Component, Renderer2} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/modules/accounts/templates/accountskpisoverview.html'
})
export class AccountsKPIsOverview {

    years: number[] = [];
    limit: number = 0;
    yearto: number = 0;
    companyCodes: any[] = [];
    accountKpis: any = {};
    isLoading: boolean = false;

    constructor(private backend: backend,
                private model: model,
                private metadata: metadata,
                private language: language,
                private renderer: Renderer2) {

        this.getYears();
        this.isLoading = true;
        this.backend.getRequest(`module/AccountKPIs/${this.model.id}/getsummary`, {yearfrom: (this.yearto - this.limit)+1, yearto: this.yearto})
            .subscribe(kpis => {
                this.accountKpis = kpis.accountkpis;
                this.companyCodes = kpis.companycodes;
                this.isLoading = false;
            });
    }

    get tableContainerStyle() {

        return {
            'border': '1px solid #dddbda',
            'border-radius': '.25rem',
            'height': '417px'
        };
    }

    getYears(){
        let componentConfig = this.metadata.getComponentConfig('AccountsKPIsOverview', 'AccountKPIs');
        this.yearto = (componentConfig && componentConfig.yearto) ? +componentConfig.yearto : new moment().get('year');
        this.limit = (componentConfig && componentConfig.limit) ? +componentConfig.limit : 4;
        for (let year = (this.yearto - this.limit)+1; year <= this.yearto; year++)
            this.years.push(year);
    }

    getKPI(cc, year) {
        try {
            return (this.accountKpis[cc][year]) ? this.accountKpis[cc][year] : 0;
        } catch (e) {
            return 0;
        }
    }
}
