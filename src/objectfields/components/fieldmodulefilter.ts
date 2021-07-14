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
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import { modal } from '../../services/modal.service';


@Component({
    selector: 'field-modulefilter',
    templateUrl: './src/objectfields/templates/fieldmodulefilter.html',
    providers: [popup],
})
export class fieldModuleFilter extends fieldGeneric implements OnInit {
    private clickListener: any;
    private moduleSelectOpen: boolean = false;
    public modules: any[] = ['Contacts','Accounts','Leads','Users',];

    constructor(
        public model: model,
        public view: view,
        public popup: popup,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get moduleFilterName(){
        let moduleFilter = this.metadata.getModuleFilter(this.moduleFilter);
        return moduleFilter ? moduleFilter['name'] : '';
    }

    get module(){
        return this.model.getField('module') || this.modules[0];
    }

    get value() {
        return this.moduleFilterName;
    }

    get moduleFilters(){
        return this.metadata.getModuleFilters(this.module);
    }

    set moduleFilter(id){
        this.model.setField('module_filter', id);
    }

    get moduleFilter(){
        return this.model.getField('module_filter');
    }

    public ngOnInit() {
        this.setModule(this.module);
    }

    private setModule(module) {
        this.model.setField('module', module);
        this.moduleSelectOpen = false;
    }

    private clearFilter() {
        this.model.setField('module_filter', '');
    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // set the model
                        this.model.data.module_filter = message.messagedata.data.id;
                        this.model.data[this.fieldname] = message.messagedata.data.summary_text;
                    }
                    break;
            }
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private openModules() {
        this.moduleSelectOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private closePopups() {
        if (this.model.data.module_filter) {
        }
        this.moduleSelectOpen = false;
        this.clickListener();
    }
}
