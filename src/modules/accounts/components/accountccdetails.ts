/**
 * @module ModuleAccounts
 */
import {Component, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/accounts/templates/accountccdetails.html'
})
export class AccountCCDetails implements OnInit {
    public companyCodes: any[] = [];
    public activatedTabs: any[] = [];
    private activeTab: number = 0;
    private isLoading: boolean = false;

    constructor(private language: language,
                private model: model,
                private backend: backend,
                private view: view) {
        this.loadCompanyCodes();
    }

    public ngOnInit() {
        this.view.isEditable = true;
    }

    /*
    * Load Company Codes from backend
    * @return void
    * */
    private loadCompanyCodes() {
        this.isLoading = true;
        let fields = JSON.stringify(["companycode", "date_modified", "description", "id"]);
        this.backend.getRequest(`module/CompanyCodes`, {fields: fields}).subscribe(CCodes => {
            this.companyCodes = CCodes.list;
        });
        this.isLoading = false;
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
    private getCCDetailsData(cc): any {
        let beans = this.model.data.accountccdetails.beans;
        for (let bean in beans) {
            if (beans.hasOwnProperty(bean) && beans[bean].companycode_id == cc.id) {
                return beans[bean];
            }
        }
    }

    /*
    * Show the Active Tab
    * @param tabindex
    * @return object Style
    * */
    private getContentContainerStyle(tabindex) {
        return {
            display: (tabindex !== this.activeTab) ? 'none' : 'block',
            padding: '.25rem',
        };
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
