/*
SpiceUI 2018.10.001

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
        return this.model.data?.accountccdetails?.beans ? _.toArray(this.model.data.accountccdetails.beans) : [];
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
