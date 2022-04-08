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
    templateUrl: '../templates/accountterritorydetails.html'
})
export class AccountTerritoryDetails implements OnInit {
    public companyCodes: any[] = [];
    public activatedTabs: any[] = [];
    public activeTab: number = 0;
    public isLoading: boolean = false;

    constructor(public language: language,
                public model: model,
                public backend: backend,
                public view: view) {

    }

    public ngOnInit() {
        this.view.isEditable = true;
    }

    /*
    * set the Active Tab
    * @param index Tab Index
    * @return void
    * */
    public setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    public getCCDetails(): any {
        return this.model.data?.accountccdetails?.beans ? _.toArray(this.model.data.accountccdetails.beans) : [];
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    public getCCDetailsData(cc): any {
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
    public trackByFn(index, item) {
        return index;
    }
}
