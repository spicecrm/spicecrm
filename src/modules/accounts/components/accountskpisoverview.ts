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
    templateUrl: '../templates/accountskpisoverview.html'
})
export class AccountsKPIsOverview {

    years: number[] = [];
    limit: number = 0;
    yearto: number = 0;
    companyCodes: any[] = [];
    accountKpis: any = {};
    isLoading: boolean = false;

    constructor(public backend: backend,
                public model: model,
                public metadata: metadata,
                public language: language,
                public renderer: Renderer2) {

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
