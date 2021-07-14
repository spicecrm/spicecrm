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
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';

/**
 * the panel to convert the lead to an opportunity
 */
@Component({
    selector: 'lead-convert-opportunity',
    templateUrl: './src/modules/leads/templates/leadconvertopportunity.html',
    providers: [view, model]
})
export class LeadConvertOpportunity implements AfterViewInit {

    /**
     * the container ref to render the detailed view in
     */
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    /**
     * EventEmitter to emit the created opportunity
     */
    @Output() public opportunity: EventEmitter<model> = new EventEmitter<model>();

    /**
     * the component config
     */
    private componentconfig: any = {};

    /**
     * reference to the various compoentnes rendered as part of the detailed componentset
     */
    private componentRefs: any = [];

    /**
     * internal boolean flag to allow the user to select if an opportunity shoudl be created
     */
    private createOpportunity: boolean = false;

    /**
     * returns if the flag is set
     */
    get create() {
        return this.createOpportunity;
    }

    /**
     * set the flag and if set emit the model or null to the main cobversion component
     *
     * @param value
     */
    set create(value) {
        this.createOpportunity = value;

        if (value == false) {
            this.opportunity.emit(null);
            this.lead.setFields({
                opportunity_id: undefined
            });
        } else {
            this.opportunity.emit(this.model);
        }
    }

    constructor(private view: view, private metadata: metadata, @SkipSelf() private lead: model, private model: model, private language: language) {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.initializeFromLead();
    }

    public ngAfterViewInit() {
        this.buildContainer();
    }

    /**
     * initialize the Opportunity from the Lead
     * also subscribes to the lead in case the account id changes to get the updated account id to link the opportunity to
     */
    private initializeFromLead() {
        this.model.module = 'Opportunities';
        this.model.initialize(this.lead);
        this.lead.data$.subscribe(data => {
            if (data.account_id != this.model.getField('account_id') || data.account_linked_name != this.model.getField('account_linked_name')) {
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
            if(this.lead.getField('opportunity_id') != data.id) {
                this.lead.setFields({
                    opportunity_id: data.id
                });
            }
        });

        // emit the model
        if(this.createOpportunity) {
            this.opportunity.emit(this.model);
        }
    }

    /**
     * builds the container
     */
    private buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
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
}
