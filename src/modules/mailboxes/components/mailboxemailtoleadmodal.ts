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
 * @module ModuleMailboxes
 */
import {AfterViewInit, Component, HostBinding, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {view} from "../../../services/view.service";

@Component({
    providers: [model, view],
    templateUrl: "./src/modules/mailboxes/templates/mailboxemailtoleadmodal.html",
})
export class MailboxEmailToLeadModal implements OnInit, AfterViewInit {

    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    private email: any = null;
    private self: any = null;

    private componentRefs: Array<any> = [];

    private leadFields: Array<string> = [
        "first_name",
        "last_name",
        "department",
        "account_name",
        "phone_mobile",
        "phone_work",
        "email1",
        "primary_address_street",
        "primary_address_city",
        "primary_address_postalcode",
        "primary_address_country",
        "description",
    ];

    constructor(
        private language: language,
        private metadata: metadata,
        private view: view,
        private model: model
    ) {
        this.model.module = "Leads";

    }

    public ngOnInit() {
        this.model.initializeModel(this.email);

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngAfterViewInit(){
        this.buildContainer();
    }

    public closeModal(){
        this.self.destroy();
    }

    public buildContainer() {
        // reset any rendered component
        for (let component of this.componentRefs) {
            component.destroy();
        }
        this.componentRefs = [];

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).
            subscribe(componentRef => {
                componentRef.instance["componentconfig"] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    public setField(fieldData){
        this.model.data[fieldData.field] = fieldData.value;
    }

    public saveLead(){
        this.model.save().subscribe(lead => {
            this.closeModal();
        });
    }

}