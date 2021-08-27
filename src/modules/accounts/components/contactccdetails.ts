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
    templateUrl: './src/modules/accounts/templates/contactccdetails.html',
    providers: [view]
})
export class ContactCCDetails implements OnInit, OnDestroy {
    public activatedTabs: any[] = [];
    private companyCodes: any[] = [];
    private activeTab: number = 0;
    private contactccdetails: {} = {};
    private isLoading: boolean = false;
    private accountsContactsManagerSubscriber: any;

    constructor(private language: language,
                private model: model,
                private acmService: ACManagerService,
                private backend: backend,
                private view: view) {
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
    private setActiveTab(index) {
        this.activatedTabs.push(index);
        this.activeTab = index;
    }

    /*
    * @param cc Company Code
    * @return object Account Company Code Details
    * */
    private getCCDetailsData(cc) {
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
    private getContentContainerStyle(tabindex) {
        return {
            display: (tabindex !== this.activeTab) ? 'none' : 'block',
            padding: '.25rem',
        };
    }

    /*
    * Load Company Codes from backend
    * @return void
    * */
    private loadCompanyCode() {
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
    private subscribeContactCCDetailsChanges() {
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
    private trackByFn(index, item) {
        return index;
    }

}
