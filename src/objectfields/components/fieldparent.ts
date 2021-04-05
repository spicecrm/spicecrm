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
 * @module ObjectFields
 */
import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';
import {modal} from '../../services/modal.service';


@Component({
    selector: 'field-parent',
    templateUrl: './src/objectfields/templates/fieldparent.html'
})
export class fieldParent extends fieldGeneric implements OnInit {
    private clickListener: any;

    private parentTypeSelectOpen: boolean = false;
    private parentSearchOpen: boolean = false;
    private parentSearchTerm: string = '';

    private recentItems: any[] = [];

    private parentTypes: string[] = [];

    constructor(
        public model: model,
        public view: view,
        public broadcast: broadcast,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private modal: modal
    ) {
        super(model, view, language, metadata, router);

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    get parentIdField() {
        return this.fieldconfig.parentIdField ? this.fieldconfig.parentIdField : 'parent_id';
    }

    get parentTypeField() {
        return this.fieldconfig.parentTypeField ? this.fieldconfig.parentTypeField : 'parent_type';
    }

    get parentName() {
        return this.model.getField(this.fieldname);
    }

    get parentType() {
        return this.model.getField(this.parentTypeField);
    }

    get parentId() {
        return this.model.getField(this.parentIdField);
    }

    get displayModuleIcon() {
        return this.fieldconfig.hidemoduleicon ? false : true;
    }

    public ngOnInit() {
        // determine the valid types
        this.determineParentTypes();

        // initialize the parenttype
        if (!this.model.data[this.parentTypeField] || this.model.data[this.parentTypeField] == '') {
            this.model.data[this.parentTypeField] = this.parentTypes[0];
        }
    }

    /**
     * get the valid parent types from the metadata or the field config
     */
    private determineParentTypes() {
        let parenttypes = [];

        if(this.field_defs.parent_modules){
            parenttypes = this.field_defs.parent_modules;
        } else if (this.fieldconfig.parenttypes) {
            parenttypes = this.fieldconfig.parenttypes.replace(/\s/g, '').split(',');
        }

        parenttypes.sort((a, b) => this.language.getModuleName(a).toLowerCase() > this.language.getModuleName(b).toLowerCase() ? 1 : -1);

        this.parentTypes = parenttypes;
    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.parentSearchTerm = '';

                        // set the model
                        this.model.data[this.parentIdField] = message.messagedata.data.id;
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

    /**
     * simple getter to determine if the field has a link, the view allows for links and if the user has ACL rights to navigate to thte the of the record
     */
    get link() {
        try {
            return this.view.displayLinks;
        } catch (e) {
            return false;
        }
    }

    private closePopups() {
        if (this.model.data[this.parentIdField]) {
            this.parentSearchTerm = '';
        }

        this.parentSearchOpen = false;
        this.parentTypeSelectOpen = false;

        this.clickListener();
    }

    private setParent(parent) {
        this.model.setField(this.fieldname, parent.text);
        this.model.setField(this.parentIdField, parent.id);
    }

    private toggleParentTypeSelect() {
        this.parentTypeSelectOpen = !this.parentTypeSelectOpen;
        this.parentSearchOpen = false;
    }

    private setParentType(parentType) {
        this.parentSearchTerm = '';

        this.model.setField(this.parentTypeField, parentType);
        this.parentTypeSelectOpen = false;
    }

    private clearParent() {
        if (this.fieldconfig.promptondelete) {
            this.modal.confirm(
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)], 'long'),
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)])
            ).subscribe(response => {
                if (response) {
                    this.removeRelated();
                }
            });
        } else {
            this.removeRelated();
        }
    }

    private removeRelated() {
        this.model.setField(this.fieldname, '');
        this.model.setField(this.parentIdField, '');
    }

    private openParentTypes() {
        this.parentTypeSelectOpen = true;
        this.parentSearchOpen = false;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private onFocusParent() {
        this.parentTypeSelectOpen = false;
        this.parentSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private searchWithModal() {
        this.parentSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.parentType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if (items.length) {
                    this.setParent({
                        id: items[0].id,
                        text: items[0].summary_text,
                        data: items[0]
                    });
                }
            });
            selectModal.instance.searchTerm = this.parentSearchTerm;
        });
    }

}
