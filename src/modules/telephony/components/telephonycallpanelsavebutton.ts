/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';

declare var moment: any;

@Component({
    selector: 'telephony-call-panel-save-button',
    templateUrl: '../templates/telephonycallpanelsavebutton.html',
    providers: [model, view]
})
export class TelephonyCallPanelSaveButton {

    /**
     * the call data reference
     */
    @Input() public calldata: any;


    constructor(@SkipSelf() public parent: model, public model: model, public view: view) {

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
    public saveCall() {
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
