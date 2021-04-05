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
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";
import {relatedmodels} from "../../services/relatedmodels.service";

@Component({
    selector: 'object-action-save-related-button',
    templateUrl: './src/objectcomponents/templates/objectactionsaverelatedbutton.html'
})
export class ObjectActionSaveRelatedButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    public module: string = '';

    private saving: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private view: view, private relatedmodels: relatedmodels) {

    }

    /*
    * @return boolean
    */
    get hidden() {
        return !this.view.isEditMode();
    }

    /*
    * @set saving
    * @emit boolean by actionemitter
    * @setViewMode
    * @call relatedmodels.setItem
    * @call model.endEdit
    * @setEditMode
    */
    public execute() {
        if (this.saving) return;
        if (this.model.validate()) {
            this.saving = true;
            // get changed Data
            let changedData: any = this.model.getDirtyFields();

            // in any case update date modified and set the id for the PUT
            changedData.date_modified = this.model.getField('date_modified');
            changedData.id = this.model.id;

            // save related model
            this.actionemitter.emit(true);

            // set to view mode and save bean
            this.view.setViewMode();
            this.relatedmodels.setItem(changedData).subscribe(success => {
                // end editing
                this.model.endEdit();
                this.saving = false;
            }, error => {
                // return to edit mode
                this.view.setEditMode();
                this.saving = false;
            });
        } else {
            this.saving = false;
            this.model.edit().subscribe(res => {
                if (!res) {
                    this.model.cancelEdit();
                    this.view.setViewMode();
                } else {
                    this.execute();
                }
            });
        }
    }

}
