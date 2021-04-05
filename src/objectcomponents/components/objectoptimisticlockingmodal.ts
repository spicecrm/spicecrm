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
 * @module ObjectComponents
 */
import {
    Component, OnInit
} from '@angular/core';


import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    templateUrl: './src/objectcomponents/templates/objectoptimisticlockingmodal.html',
    providers: [view],
    styles: [
        'table { border-bottom: none; }',
        'table tr:last-child td { border-bottom: none; }'
    ]
})
export class ObjectOptimisticLockingModal implements OnInit {

    private self: any = {};
    public conflicts: any = {};
    private _conflicts = [];
    private originaldata: any = {};
    private fieldsToCopy = {};

    constructor(
        private language: language,
        private model: model,
        private view: view,
        private metadata: metadata,
        private modal: modal
    ) {
        // this.view.isEditable = true;
        // this.view.setEditMode();
    }

    public ngOnInit() {
        for (let fieldname in this.conflicts) {
            this._conflicts.push({
                field: fieldname,
                value: this.conflicts[fieldname].value,
                changes: this.conflicts[fieldname].changes
            });

            // create an object for the field for the original values
            this.originaldata[fieldname] = this.conflicts[fieldname].value;
        }
    }

    private cancel() {
        // cancel the edit process and roll back
        this.model.cancelEdit();

        // retrieve the model
        this.model.getData();

        // destroy the component
        this.self.destroy();
    }

    private edit() {
        // got back to editing
        this.model.edit();

        // destroy the component
        this.self.destroy();
    }

    private save(goDetail: boolean = false) {
        this.copyFields();
        this.modal.openModal('SystemLoadingModal').subscribe(modalRef => {
            modalRef.instance.messagelabel = 'LBL_SAVING_DATA';

            // set the date modified to now
            this.model.setField('date_modified', new moment());

            this.model.save().subscribe(status => {
                if (status) {

                    /// if go Detail go to record)
                    if (goDetail) {
                        this.model.goDetail();
                    }

                    // destroy the component
                    this.self.destroy();
                }
                modalRef.instance.self.destroy();
            });
        });
    }

    private copyFields() {
        for ( let fieldname in this.conflicts ) {
            if ( !this.fieldsToCopy[fieldname] ) this.model.setField( fieldname, this.conflicts[fieldname].value );
        }
    }

    private toggleChangeDetails(fieldname) {
        this.conflicts[fieldname].open = !this.conflicts[fieldname].open;
    }

    private select(fieldname) {
        this.fieldsToCopy[fieldname] = true;
    }

    private unselect(fieldname) {
        delete this.fieldsToCopy[fieldname];
    }

    private changeDetailsIcon(fieldname) {
        return this.conflicts[fieldname].open ? 'chevronup' : 'chevrondown';
    }

    private channgeOpen(fieldname) {
        return this.conflicts[fieldname].open ? true : false;
    }

}
