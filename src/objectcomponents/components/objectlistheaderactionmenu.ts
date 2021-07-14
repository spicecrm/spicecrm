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
 * @module ObjectComponents
 */
import {Component, Input, NgZone, Injector, ChangeDetectorRef} from '@angular/core';
import {language} from '../../services/language.service';
import {modal} from '../../services/modal.service';
import {modellist} from '../../services/modellist.service';
import {ObjectActionContainer} from "./objectactioncontainer";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";

/**
 * renders the action menu on the top left corner of the regular list view
 */
@Component({
    selector: 'object-list-header-actionmenu',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionmenu.html'
})
export class ObjectListHeaderActionMenu extends ObjectActionContainer {

    /**
     * an array with the action items.
     */
    public actionitems: any[] = [];

    constructor(private modellist: modellist, public language: language, public metadata: metadata, public model: model, public ngZone: NgZone, public cdRef: ChangeDetectorRef, private modal: modal, private injector: Injector) {
        super(language, metadata, model, ngZone, cdRef);
    }

    /**
     * initialize on Change
     */
    public ngOnChanges() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        this.actionitems = [];
        let initial = true;

        for (let actionitem of actionitems) {
            this.actionitems.push({
                disabled: true,
                id: actionitem.id,
                sequence: actionitem.sequence,
                action: actionitem.action,
                component: actionitem.component,
                actionconfig: actionitem.actionconfig
            });
        }
    }

    /**
     * selects all items
     */
    get selectAll() {
        return this.modellist.listSelected.type === 'all';
    }

    /**
     * returns if any items are selected
     */
    get hasSelection() {
        return this.modellist.getSelectedCount() > 0;
    }

    /**
     * opens the modal allowing theuser to choose and select the display fields
     */
    private chooseFields() {
        if (!this.canChooseFields) {
            return false;
        }
        this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
    }

    /**
     * returns if we do not have a standrad list and thus can edit
     */
    get canChooseFields() {
        return this.modellist.currentList.id != 'all' && this.modellist.currentList.id != 'owner' && this.modellist.checkAccess('edit');
    }
}
