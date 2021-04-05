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
import {
    Component,
    ViewChild,
    Input,
    OnChanges,
    AfterViewInit,
    ViewContainerRef
} from '@angular/core';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {ACManagerService} from '../services/acmanager.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'accounts-contacts-manager-details',
    templateUrl: './src/modules/accounts/templates/accountscontactsmanagerdetails.html',
    providers: [model, view]
})
export class AccountsContactsManagerDetails implements AfterViewInit, OnChanges {

    @ViewChild('detailscontainer', {read: ViewContainerRef, static: true}) detailscontainer: ViewContainerRef;
    @Input('activecontactid') activeContactId: string = undefined;
    renderedComponents: Array<any> = [];

    constructor(private language: language,
                private metadata: metadata,
                private view: view,
                private acmService: ACManagerService,
                private relatedmodels: relatedmodels,
                private model: model) {
        this.model.module = 'Contacts';
    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    ngOnChanges() {
        if (this.activeContactId) {
            this.resetView();
            this.buildContainer();
            this.view.setViewMode();
            this.model.id = this.activeContactId;
            this.model.getData(true, '', true)
                .subscribe(data => {
                    if (!_.isEmpty(data.contactccdetails.beans)) {
                        this.acmService.contactCCDetails = data.contactccdetails.beans;
                    } else {
                        this.acmService.contactCCDetails = {};
                    }
                });
        }
    }

    resetView(){
        for(let renderedComponent of this.renderedComponents){
            renderedComponent.destroy();
        }
        this.renderedComponents = [];
    }

    buildContainer() {
        let componentconfig = this.metadata.getComponentConfig('AccountsContactsManager', 'Accounts');
        let componentSet = componentconfig.detailscomponentset;

        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.detailscontainer).subscribe(componentref => {
                    this.renderedComponents.push(componentref);
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
