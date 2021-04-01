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
import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {ACManagerService} from "../services/acmanager.service";

@Component({
    selector: 'accounts-contacts-manager',
    templateUrl: './src/modules/accounts/templates/accountscontactsmanager.html',
    providers: [relatedmodels, ACManagerService]
})
export class AccountsContactsManager implements AfterViewInit, OnDestroy {

    editcomponentset: string = '';
    module: string = '';
    displayitems: number = 5;
    activeContactId: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private relatedmodels: relatedmodels,
                private acmService: ACManagerService,
                private model: model) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
    }

    setActiveContactId(id){
        this.activeContactId = id;
    }


    get childrenHeight() {
        return {'height': '340px'};
    }

    get mainStyle() {
        return {
            'height': '350px' + 'px',
            'border-radius': '.25rem',
            'border': '1px solid #dddbda'
        }
    }

    ngAfterViewInit() {
        this.loadRelated();
    }

    loadRelated() {
        this.relatedmodels.relatedModule = 'Contacts';
        this.relatedmodels.getData();
    }

    ngOnDestroy() {
        // need to stop all subscrptions on my service
        this.relatedmodels.stopSubscriptions();
    }

    aclAccess() {
        return this.metadata.checkModuleAcl(this.module, 'list');
    }
}