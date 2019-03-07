/**
 * @module ModuleAccounts
 */
import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {ACManagerService} from '../services/acmanager.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'contact-cc-details',
    templateUrl: './src/modules/accounts/templates/contactccdetails.html',
    providers: [view]
})
export class ContactCCDetails implements OnInit {
    @ViewChild('detailscontainer', {read: ViewContainerRef}) detailscontainer: ViewContainerRef;
    tabs: any[] = [];
    companyCodes: any[] = [];
    activatedTabs: any[] = [];
    activeTab: number = 0;
    contactccdetails: {} = {};
    isLoading: boolean = false;

    constructor(private language: language,
                private metadata: metadata,
                private model: model,
                private acmService: ACManagerService,
                private backend: backend,
                private view: view) {
        this.isLoading = true;
        let fields = JSON.stringify(["companycode", "date_modified", "description", "id"]);
        this.backend.getRequest(`/module/CompanyCodes`, {fields: fields}).subscribe(CCodes => {
            this.companyCodes = CCodes.list;
            this.isLoading = false;
        });

        this.acmService.contactCCDetails$.subscribe(details => {
            this.activeTab = 0;
            this.companyCodes = this.companyCodes;
            this.contactCCDetails = details;
        });
    }

    get containerStyle() {
        return {
            'border-radius': '.25rem',
            'border': '1px solid #dddbda',
        }
    }

    get contactCCDetails(){
        return this.contactccdetails;
    }

    set contactCCDetails(details){
        this.contactccdetails = details;

    }
    ngOnInit() {
        this.view.isEditable = true;
    }

    setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    getCCDetailsData(cc) {
        if (!_.isEmpty(this.contactCCDetails)) {
            for (let CCDetail in this.contactCCDetails) {
                if (this.contactCCDetails[CCDetail].companycode_id == cc.id)
                    return this.contactCCDetails[CCDetail];
            }
        }
    }

    getContentContainerStyle(tabindex) {
        return {
            display: (tabindex !== this.activeTab) ? 'none' : 'block',
            padding: '.25rem',
        };
    }

}