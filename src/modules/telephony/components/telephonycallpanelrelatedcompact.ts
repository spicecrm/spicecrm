/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';
import {TelephonyCallPanelRelated} from "./telephonycallpanelrelated";

@Component({
    selector: 'telephony-call-panel-related-compact',
    templateUrl: '../templates/telephonycallpanelrelatedcompact.html',
    providers: [view]
})
export class TelephonyCallPanelRelatedCompact extends TelephonyCallPanelRelated {

    /**
     * set to true to enable clear
     *
     * @private
     */
    @Input() public canClear: boolean = false;

    @Output() public unlink: EventEmitter<boolean> = new EventEmitter<boolean>();

    public clear(){
        this.unlink.emit(true);
    }

}
