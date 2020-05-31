/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';

declare var _: any;
declare var libphonenumber: any;

@Component({
    selector: 'telephony-call-panel-related',
    templateUrl: './src/modules/telephony/templates/telephonycallpanelrelated.html',
    providers: [view]
})
export class TelephonyCallPanelRelated {

    @Input() private module: string;
    @Input() private id: string;
    @Input() private data: any;

    constructor(private model: model, private view: view) {
        this.view.displayLabels = false;
    }


}
