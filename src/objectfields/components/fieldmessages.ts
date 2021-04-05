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
import {Component, Input, OnChanges, OnInit, Optional} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {fielderrorgrouping} from '../../services/fielderrorgrouping.service';

@Component({
    selector: 'field-messages',
    templateUrl: './src/objectfields/templates/fieldmessages.html'
})
export class FieldMessagesComponent implements OnInit, OnChanges {
    /**
     * the fieldname
     *
     * @private
     */
    @Input() private fieldname: string = '';

    /**
     * the messages collected
     * @private
     */
    @Input('messages') private _messages = [];

    /**
     * the errors
     *
     * @private
     */
    private errors = [];

    /**
     * the warnings
     *
     * @private
     */
    private warnings = [];

    /**
     * notices
     *
     * @private
     */
    private notices = [];

    constructor(private model: model, private view: view, private language: language, @Optional() private fielderrorgroup: fielderrorgrouping) {
    }

    public ngOnInit() {
        this.model.messageChange$.subscribe(() => {
            this.updateMessages();
        });
    }

    public ngOnChanges() {
        this.updateMessages();
    }

    public ngOnDestroy() {
        if (this.fielderrorgroup) this.fielderrorgroup.setError(this.fieldname, false);
    }

    private updateMessages() {
        let messages: any[];
        if (this._messages.length == 0 && this.fieldname) {
            messages = this.model.getFieldMessages(this.fieldname) || [];
        } else {
            messages = this._messages;
        }
        this.errors = this.filterMessages(messages, 'error');
        this.warnings = this.filterMessages(messages, 'warning');
        this.notices = this.filterMessages(messages, 'notice');
        if (this.fielderrorgroup) this.fielderrorgroup.setError(this.fieldname, this.errors.length !== 0);
    }

    private filterMessages(messages: any[], type?: string) {
        return messages.filter((e) => {
            return (!type || e.type == type);
        });
    }
}
