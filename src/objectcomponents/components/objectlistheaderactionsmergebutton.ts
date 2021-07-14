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

/**
 * @ignore
 */
declare var moment: any;

import {Component, Injector} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {modal} from '../../services/modal.service';

/**
 * renders an action button as part of a modellist to select and merge records
 */
@Component({
    selector: 'object-list-header-actions-merge-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsmergebutton.html',
})
export class ObjectListHeaderActionsMergeButton {

    /**
     * the actionconfig passed in fromthe actionset
     */
    public actionconfig: any = {};

    /**
     * defautls to true and is set in ngOnInit
     */
    public hidden: boolean = false;

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
        private modellist: modellist,
        private modal: modal,
        private injector: Injector
    ) {
    }

    /**
     * checks the acl rights for the user to export and that we have some items selected
     */
    get disabled() {
        return !this.metadata.checkModuleAcl(this.model.module, 'delete') || this.modellist.getSelectedCount() < 1 || this.modellist.getSelectedCount() > this.maxAllowed;
    }

    /**
     * returns the ax entries allowed to merge. if no value is set this is hardcoded assumed to be 3
     */
    get maxAllowed() {
        return this.actionconfig.maxAllowed ? parseInt(this.actionconfig.maxAllowed, 10) : 3;
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get mergeCount() {
        return this.modellist.getSelectedCount();
    }

    public execute() {
        if (!this.disabled) {
            // check that we can delete at least all entries - 1
            let deletable = this.modellist.getSelectedItems().filter(i => i.acl?.delete).length;
            if (deletable < this.modellist.getSelectedCount() - 1) {
                this.modal.info(this.language.getLabel('MSG_NO_MERGE_DELETE', null, 'long'), this.language.getLabel('MSG_NO_MERGE_DELETE'));
            } else {
                this.modal.openModal('ObjectMergeModal', true, this.injector).subscribe(modalRef => {
                    modalRef.instance.mergemodels = this.modellist.getSelectedItems();
                });
            }
        }
    }

}

