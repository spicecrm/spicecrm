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
import {Component, OnInit,  ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    selector: 'lead-openleads-dashlet',
    templateUrl: './src/modules/leads/templates/leadopenleadsdashlet.html',
    providers: [model]
})
export class LeadOpenLeadsDashlet implements OnInit {
    myLeads: Array<any> = [];
    myLeadsCount: number = 0;

    @ViewChild('tableheader', {read: ViewContainerRef, static: true}) tableheader: ViewContainerRef;
    @ViewChild('dashletcontainer', {read: ViewContainerRef, static: true}) dashletcontainer: ViewContainerRef;

    constructor(private language: language, private metadata: metadata, private backend: backend, private model: model, private elementRef: ElementRef) {

    }

    ngOnInit() {

        let params = {
            searchmyitems: true,
            fields: JSON.stringify(['id', 'first_name', 'last_name', 'account_name', 'status', 'phone_mobile'])
        }

        this.backend.getRequest('module/Leads', params).subscribe((leads : any) => {
            this.myLeads = leads.list;
            this.myLeadsCount = leads.totalcount
        })
    }

    get containerstyle() {
        if(this.dashletcontainer) {
            let rectc = this.dashletcontainer.element.nativeElement.getBoundingClientRect();
            let rectt = this.tableheader.element.nativeElement.getBoundingClientRect();
            return {
                height: rectc.bottom - rectt.bottom + 'px',
                'margin-top': '-1px'
            }
        }
    }

}
