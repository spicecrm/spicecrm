/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, Output,  SkipSelf} from '@angular/core';

import {model} from "../../../services/model.service";

/**
 * renders a button in the telphony docked composer to save a call attmept and log this inthe activitiy stream
 */
@Component({
    selector: 'telephony-call-panel-log-attempt-button',
    templateUrl: './src/modules/telephony/templates/telephonycalllogattemptbutton.html',
    providers: [model]
})
export class TelephonyCallLogAttemptButton {

    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(@SkipSelf() private parent: model, private model: model) {

    }

    get disabled() {
        return !this.parent.getField('name');
    }

    /**
     * save the call in the model history
     */
    private execute() {
        this.model.module = 'CallAttempts';
        this.model.initialize(this.parent);

        // save the model
        this.model.save();

        // proactively emit that we saved ... we optimitically assuem this will work
        this.actionemitter.emit(true);
    }

}
