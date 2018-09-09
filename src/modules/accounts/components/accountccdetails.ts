import {Component, OnInit, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';

@Component({
    templateUrl: './src/modules/accounts/templates/accountccdetails.html',
    providers: [view]
})
export class AccountCCDetails implements OnInit {
    @ViewChild('detailscontainer', {read: ViewContainerRef}) detailscontainer: ViewContainerRef;
    tabs: any[] = [];
    companyCodes: any[] = [];
    activatedTabs: any[] = [];
    activeTab: number = 0;
    isLoading: boolean = false;

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private backend: backend,
                private view: view) {
        this.isLoading = true;
        let fields = JSON.stringify(["companycode", "date_modified", "description", "id"]);
        this.backend.getRequest(`/module/CompanyCodes`, {fields: fields}).subscribe(CCodes => {
            this.companyCodes = CCodes.list;
        });
        this.isLoading = false;
    }


    get containerStyle() {
        return {
            'border-radius': '.25rem',
            'border': '1px solid #dddbda',
        }
    }

    ngOnInit() {
        this.view.isEditable = true;
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    getCCDetailsData(cc) {
        let beans = this.model.data.accountccdetails.beans;
        for (let bean in beans) {
            if (beans[bean].companycode_id == cc.id)
                return beans[bean];
        }
    }

    getContentContainerStyle(tabindex) {
        return {
            display: (tabindex !== this.activeTab) ? 'none' : 'block',
            padding: '.25rem',
        };
    }

}