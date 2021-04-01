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
 * @module ModuleTeleSales
 */
import {Component, Input, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {telecockpitservice} from '../services/telecockpit.service';

declare var moment;

@Component({
    selector: 'tele-sales-cockpit-list-item',
    templateUrl: './src/modules/telesales/templates/telesalescockpitlistitem.html',
    providers: [model, view]
})
export class TeleSalesCockpitListItem implements OnInit {

    @Input() public item: any = {};
    public componentFields: any[] = [];
    public isSelected: boolean = false;

    constructor(private language: language,
                private model: model,
                private view: view,
                private metadata: metadata,
                private telecockpitservice: telecockpitservice,
                private userpreferences: userpreferences
    ) {

        this.view.displayLabels = false;
    }

    get activityDate() {
        return this.userpreferences.formatDateTime(moment(this.item.planned_activity_date))
    }

    get hitsStyle() {
        return {
            'border-radius': '50%',
            'padding': this.item.hits.length > 1 ? '5px 5px 5px 3px' : '5px',
            'line-height': this.item.hits.length > 1 ? '80%' : '60%',
            'display': 'inline-block',
            'border': 'none'
        };
    }

    get selectedClass() {
        return this.isSelected ? 'slds-theme--shade' : '';
    }

    public ngOnInit() {
        this.initializeModel();
        this.loadComponentFields();
    }

    private initializeModel() {
        this.model.module = this.item.target_type;
        this.model.id = this.item.id;
        this.model.data = this.item.data;
    }

    private loadComponentFields() {
        let componentConf = this.metadata.getComponentConfig('TeleSalesCockpitListItem', this.model.module);
        this.componentFields = componentConf && componentConf.fieldset ? this.metadata.getFieldSetFields(componentConf.fieldset) : [];
    }

    private setSelectedListItem() {
        this.telecockpitservice.selectedListItem$ = this.item;
    }

    private trackByFn(index, item) {
        return item.item_id;
    }
}
