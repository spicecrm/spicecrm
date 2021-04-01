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
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';

declare var moment: any;

@Component({
    selector: 'telephony-call-panel-save-button',
    templateUrl: './src/modules/telephony/templates/telephonycallpanelsavebutton.html',
    providers: [model, view]
})
export class TelephonyCallPanelSaveButton {

    /**
     * the call data reference
     */
    @Input() private calldata: any;


    constructor(@SkipSelf() private parent: model, private model: model, private view: view) {

    }

    /**
     * set to disabled if we do not have an end date or the model has an id and the call is saved
     */
    get disabled() {
        return !this.calldata.end || this.model.id;
    }

    /**
     * save the call in the model history
     */
    private saveCall() {
        this.model.module = 'Calls';
        this.model.initialize(this.parent);

        // get the Duration
        let duration = moment.duration(this.calldata.end.diff(this.calldata.start));

        this.model.setFields({
            date_start: this.calldata.start,
            date_end: this.calldata.end,
            direction: this.calldata.direction == 'inbound' ? 'Inbound' : 'Outbound',
            duration_hours: duration.hours(),
            dureation_minutes: duration.minutes(),
            status: 'Held',
            name: this.calldata.note.substring(0, 25) + (this.calldata.note.length > 15 ? '...' : ''),
            description: this.calldata.note
        });

        this.model.save().subscribe(success => {
            this.calldata.call = this.model.id;
        });

    }

}
