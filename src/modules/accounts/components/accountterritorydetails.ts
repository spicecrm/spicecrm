/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';

declare var _: any;

@Component({
    templateUrl: './src/modules/accounts/templates/accountterritorydetails.html'
})
export class AccountTerritoryDetails implements OnInit {
    public companyCodes: any[] = [];
    public activatedTabs: any[] = [];
    private activeTab: number = 0;
    private isLoading: boolean = false;

    constructor(private language: language,
                private model: model,
                private backend: backend,
                private view: view) {

    }

    public ngOnInit() {
        this.view.isEditable = true;
    }

    /*
    * set the Active Tab
    * @param index Tab Index
    * @return void
    * */
    private setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    private getCCDetails(): any {
        return _.toArray(this.model.data.accountccdetails.beans);
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    private getCCDetailsData(cc): any {
        let beans = this.model.data.accountccdetails.beans;
        for (let bean in beans) {
            if (beans.hasOwnProperty(bean) && beans[bean].companycode_id == cc.id) {
                return beans[bean];
            }
        }
    }


    /*
    * @param index
    * @param item
    * @return index|item
    * */
    private trackByFn(index, item) {
        return index;
    }
}
