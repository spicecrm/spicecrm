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
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fts} from "../../../services/fts.service";
import {view} from "../../../services/view.service";
import {language} from '../../../services/language.service';

/**
 * manages the lead to account conversion giving the user the option to link to an account
 * also includes the duplicate check to find potential already created accounts
 */
@Component({
    selector: "lead-convert-account",
    templateUrl: "./src/modules/leads/templates/leadconvertaccount.html",
    providers: [view, model]
})
export class LeadConvertAccount implements AfterViewInit, OnInit {
    /**
     * the content conatiner the componentset for the account edit is rendered in
     */
    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    /**
     * emits the model that has been created
     */
    @Output() private account: EventEmitter<model> = new EventEmitter<model>();


    /**
     * the component config
     */
    private componentconfig: any = {};

    /**
     * references to the components rendered in the view
     */
    private componentRefs: any = [];

    /**
     * the account selected if there is one
     * picked from the matched duplicates
     */
    public selectedAccount: any = undefined;

    /**
     * internal value for the checkbox allowing the user to select if he wants to link the lead to an account or not
     */
    private _linktoaccount: boolean = true;


    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model, private modelutilities: modelutilities, private fts: fts, private language: language) {

    }

    public ngOnInit() {
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initializes the account from the lead using th ecopy rules
     * Also subscribes to the model data$ and updates the leads account_id and anccunt_linked_name if the model data changes
     */
    public initializeFromLead() {
        // initialize the model
        this.model.module = "Accounts";

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

        if (this.lead.getField('account_name')) {
            this.model.id = null;
            this.model.initialize(this.lead);
            this._linktoaccount = true;
        }

        if (this._linktoaccount) {
            this.account.emit(this.model);
        }

        // subscribe to the model data to get the account id and name
        this.model.data$.subscribe(data => {
            if(this._linktoaccount && (this.lead.getField('account_id') != data.id || this.lead.getField('account_linked_name') != data.name) ) {
                this.lead.setFields({
                    account_id: this.model.id,
                    account_linked_name: this.model.getField('name')
                });
            }
        });

    }

    /**
     * getter for the link checkbox
     */
    get linktoaccount() {
        return this._linktoaccount;
        this.account.emit(this.model);
    }

    /**
     * setter for the link checkbox
     *
     * @param value
     */
    set linktoaccount(value) {
        this._linktoaccount = value;

        if (value == false) {
            this.account.emit(null);
            this.lead.setFields({
                account_id: undefined
            });
        } else {
            this.account.emit(this.model);
        }
    }

    /**
     * builds the container and renders the data
     */
    private buildContainer() {
        // Close any already open dialogs
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    /**
     * when a duplicate is found and selected
     *
     * @param accountdata
     */
    private selectAccount(accountdata) {
        this.selectedAccount = accountdata;

        this.model.id = accountdata.id;
        this.model.isNew = false;
        this.model.data = this.model.utils.backendModel2spice('Accounts', accountdata);
        this.lead.setFields({
            account_id: this.model.id,
            account_linked_name: this.model.getField('name')
        });
        this.view.isEditable = false;

    }

    /**
     * then the user unlinks the account
     */
    private unlinkAccount() {
        this.selectedAccount = undefined;

        this.buildContainer();

        this.initializeFromLead();
    }
}
