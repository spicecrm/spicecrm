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
    Component,
    Output,
    EventEmitter,
    OnInit,
    ViewContainerRef,
    ViewChild,
    AfterViewInit, SkipSelf
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {SystemLoadingModal} from "../../../systemcomponents/components/systemloadingmodal";

@Component({
    selector: 'lead-convert-opportunity-modal',
    templateUrl: './src/modules/leads/templates/leadconvertopportunitymodal.html',
    providers: [model, view]
})
export class LeadConvertOpportunityModal implements OnInit, AfterViewInit {

    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true})  private detailcontainer: ViewContainerRef;

    private self: any = {};
    @Output() private converted: EventEmitter<any> = new EventEmitter<any>();

    /**
     * the componentset to be rendered
     */
    private componentSet: string;

    constructor(private language: language, @SkipSelf() private lead: model, private model: model, private metadata: metadata, private view: view, private modal: modal) {
        this.model.module = 'Opportunities';
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    public ngOnInit() {
        this.model.initialize(this.lead);
    }

    public ngAfterViewInit() {
        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        this.componentSet = componentconfig.componentset;
    }

    private close() {
        this.self.destroy();
    }

    /**
     * converts the lead to an opportunity
     */
    private convert() {
        if ( !this.model.validate() ) return;
        this.modal.openModal('SystemLoadingModal').subscribe(loadingModalRef => {
            loadingModalRef.instance.messagelabel = 'creating Opportunity';
            this.model.save().subscribe(done => {
                loadingModalRef.instance.messagelabel = 'updating Lead';
                this.lead.setField('status', 'Converted');
                this.lead.setField('opportunity_id', this.model.id);
                this.lead.setField('opportunity_name', this.model.getFieldValue('name'));
                this.lead.save().subscribe(leadsaved => {
                    loadingModalRef.instance.self.destroy();
                    this.close();
                });
            });
        });
    }

}
