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
 *
 */
import {Component, EventEmitter, Output} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-action-save-send-button',
    templateUrl: './src/objectcomponents/templates/objectactionsavesendbutton.html'
})
/**
 * this button is meant for activity stream add item with an activity type were there is something to send
 * example text messages
 * Since sending is done within save logic in the backend this button is just a workaround to get a proper toast "data sent"
 */
export class ObjectActionSaveSendButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * if set to true display the button as icon
     */
    public displayasicon: boolean = false;
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model, private view: view) {

    }

    /**
     * disable the button when the model is saving
     */
    get disabled() {
        return this.model.isSaving;
    }

    /*
    * @return boolean
    */
    get hidden() {
        return !this.model.isEditing;
    }

    /**
     * get the label from actionconfig or use default LBL_SAVE
     */
    get label() {
        if(this.actionconfig.label && this.actionconfig.label !== '') return this.actionconfig.label;
        else return 'LBL_SEND';
    }

    /**
     * get the label from actionconfig or use default LBL_DATA_SENT
     */
    get toastLabel() {
        if(this.actionconfig.toastlabel && this.actionconfig.toastlabel !== '') return this.actionconfig.toastlabel;
        else return 'LBL_DATA_SENT';
    }

    /*
    * call model.send() to save & send
    * @set saving
    * @emit 'save' by actionemitter
    * @call model.endEdit
    * @setViewMode
    */
    public execute() {
        if (this.model.isSaving) return;

        if (this.model.validate()) {
            this.model.saveAndSend(true, this.toastLabel).subscribe(saved => {
                this.model.endEdit();
                this.view.setViewMode();
                this.actionemitter.emit('save');
            });
        }
    }
}
