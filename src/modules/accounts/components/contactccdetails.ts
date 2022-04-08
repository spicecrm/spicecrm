/**
 * @module ModuleAccounts
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {backend} from '../../../services/backend.service';
import {model} from '../../../services/model.service';
import {ACManagerService} from '../services/acmanager.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'contact-cc-details',
    templateUrl: '../templates/contactccdetails.html',
    providers: [view]
})
export class ContactCCDetails implements OnInit, OnDestroy {
    public activatedTabs: any[] = [];
    public companyCodes: any[] = [];
    public activeTab: number = 0;
    public contactccdetails: {} = {};
    public isLoading: boolean = false;
    public accountsContactsManagerSubscriber: any;

    constructor(public language: language,
                public model: model,
                public acmService: ACManagerService,
                public backend: backend,
                public view: view) {
        this.loadCompanyCode();
        this.subscribeContactCCDetailsChanges();
    }

    get contactCCDetails() {
        return this.contactccdetails;
    }

    set contactCCDetails(details) {
        this.contactccdetails = details;

    }

    public ngOnInit() {
        this.view.isEditable = true;
    }

    public ngOnDestroy() {
        this.accountsContactsManagerSubscriber.unsubscribe();
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
    public getCCDetailsData(cc) {
        if (!_.isEmpty(this.contactCCDetails)) {
            for (let CCDetail in this.contactCCDetails) {
                if (this.contactCCDetails[CCDetail].companycode_id == cc.id) {
                    return this.contactCCDetails[CCDetail];
                }
            }
        }
    }

    /*
    * Show the Active Tab
    * @param tabindex
    * @return object Style
    * */
    public getContentContainerStyle(tabindex) {
        return {
            display: (tabindex !== this.activeTab) ? 'none' : 'block',
            padding: '.25rem',
        };
    }

    /*
    * Load Company Codes from backend
    * @return void
    * */
    public loadCompanyCode() {
        this.isLoading = true;
        let fields = JSON.stringify(["companycode", "date_modified", "description", "id"]);
        this.backend.getRequest(`module/CompanyCodes`, {fields: fields}).subscribe(CCodes => {
            this.companyCodes = CCodes.list;
            this.isLoading = false;
        });
    }

    /*
    * Subscribe to Contact Company Code Details changes
    * @return void
    * */
    public subscribeContactCCDetailsChanges() {
        this.accountsContactsManagerSubscriber = this.acmService.contactCCDetails$
            .subscribe(details => {
                this.activeTab = 0;
                this.companyCodes = this.companyCodes.slice();
                this.contactCCDetails = details;
            });
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
