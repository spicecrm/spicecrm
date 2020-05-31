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

    /**
     * the note passed in
     */
    @Input() private note: string;

    constructor(@SkipSelf() private parent: model, private model: model, private view: view) {

    }

    /**
     * set to disabled if we do not have an end date
     */
    get disabled() {
        return !this.calldata.end;
    }

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
            name: this.note.substring(0, 25) + '...',
            description: this.note
        });

        this.model.save();

    }

}
