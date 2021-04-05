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
