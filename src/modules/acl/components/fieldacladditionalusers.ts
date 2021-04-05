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
 * @module ModuleACLTerritories
 */
import {Component, Renderer2, ElementRef} from '@angular/core';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';
import {modal} from '../../../services/modal.service';
import {Router} from '@angular/router';
import {fieldGeneric} from "../../../objectfields/components/fieldgeneric";

/**
 * renders a field to add secondary territories
 */
@Component({
    templateUrl: './src/modules/acl/templates/fieldacladditionalusers.html',
    styles: ['input, input:focus { border: none; outline: none;}']
})
export class fieldACLAdditionalUsers extends fieldGeneric {

    private clickListener: any;

    private lookupSearchOpen: boolean = false;
    private lookupSearchTerm: string = '';

    constructor(public model: model,
                public view: view,
                public language: language,
                public metadata: metadata,
                public router: Router,
                public elementRef: ElementRef,
                public renderer: Renderer2,
                public modal: modal) {
        super(model, view, language, metadata, router);
    }

    get displayAssignedUser() {
        return this.fieldconfig.displayassigneduser;
    }

    get users() {
        try {
            return JSON.parse(this.model.getField('spiceacl_additional_users'));
        } catch (e) {
            return [];
        }

    }

    set users(value) {
        this.model.setField('spiceacl_additional_users', JSON.stringify(value));
    }

    private addItem(item) {
        let users = this.users;
        let index = users.findIndex(user => user.id == item.id);
        if (index == -1) {
            users.push({
                id: item.id,
                summary_text: item.text
            });
        }

        // close the popups
        this.closePopups();

        // set to the model
        this.users = users;
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        this.lookupSearchOpen = false;
        this.lookupSearchTerm = '';

        this.clickListener();
    }

    private removeItem(userid) {
        let users = this.users;
        let index = users.findIndex(user => user.id == userid);
        if (index >= 0) {
            users.splice(index, 1);
        }

        // set to the model
        this.users = users;
    }

    private onFocus() {
        this.openSearchDropDown();
    }

    private onFieldClick() {
        this.openSearchDropDown();
    }

    private openSearchDropDown() {
        // this.getRecent();
        this.lookupSearchOpen = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private parentSearchStyle() {
        if (this.lookupSearchOpen) {
            return {
                display: 'block'
            };
        }
    }

    private searchWithModal() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe((selectModal) => {
            selectModal.instance.module = 'Users';
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe((items) => {
                this.addItem({id: items[0].id, text: items[0].summary_text, data: items[0]});
            });
            selectModal.instance.usedSearchTerm.subscribe(term => {
                this.lookupSearchTerm = term;
            });
            selectModal.instance.searchTerm = this.lookupSearchTerm;
        });
    }

}
