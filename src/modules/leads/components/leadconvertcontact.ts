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
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

/**
 * renders a tab to convert the lead to the contact
 */
@Component({
    selector: 'lead-convert-contact',
    templateUrl: './src/modules/leads/templates/leadconvertcontact.html',
    providers: [view, model]
})
export class LeadConvertContact implements AfterViewInit, OnInit {
    /**
     * reference to the container where the detail view is to be rendered
     */
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) public detailcontainer: ViewContainerRef;

    /**
     * the emitter for the contact created or selected
     */
    @Output() public contact: EventEmitter<model> = new EventEmitter<model>();

    /**
     * a selected conmtact if picked from the duplicates that have been matched based on the data
     */
    public selectedContact: any = undefined;

    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * the list of compoennts rendered
     */
    public componentRefs: any = [];

    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        // console.log(this.model.data);
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initializes the öoad from the lead using the copy rules
     *
     * also links to the lead in case the account is changed to link to the account
     */
    private initializeFromLead() {
        this.model.module = 'Contacts';
        this.model.id = null;
        this.model.isNew = true;
        this.model.initialize(this.lead);
        this.model.initializeField(
            'emailaddresses',
            [{
                id: this.model.generateGuid(),
                bean_id: this.model.id,
                bean_module: this.model.module,
                email_address: this.lead.getField('email1'),
                email_address_id: '',
                primary_address: '1'
            }]
        );

        /**
         * subscribe to lead changes to update the account link if set
         */
        this.lead.data$.subscribe(data => {
            if (!this.selectedContact && data.account_id != this.model.getField('account_id') || data.account_linked_name != this.model.getField('account_linked_name')) {
                this.model.setFields({
                    account_id: data.account_id,
                    account_name: data.account_linked_name
                });
            }
        });

        /**
         * make sure we update the lead with the link
         */
        this.model.data$.subscribe(data => {
            if(this.lead.getField('contact_id') != data.id) {
                this.lead.setFields({
                    contact_id: data.id
                });
            }
        });

        // emit the model
        this.contact.emit(this.model);
    }

    /**
     * builds the details container
     */
    public buildContainer() {
        // Close any already open dialogs
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
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
    private selectContact(contactdata) {
        this.selectedContact = contactdata;

        this.model.id = contactdata.id;
        this.model.isNew = false;
        this.model.data = this.model.utils.backendModel2spice('Contacts', contactdata);
        this.view.isEditable = false;

        this.contact.emit(this.model);
    }

    /**
     * then the user unlinks the account
     */
    private unlinkContact() {
        this.selectedContact = undefined;
        this.view.isEditable = true;

        // rebuild the container
        this.buildContainer();

        this.initializeFromLead();
    }

}
