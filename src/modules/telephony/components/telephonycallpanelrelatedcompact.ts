/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';

import {model} from "../../../services/model.service";
import {view} from '../../../services/view.service';
import {TelephonyCallPanelRelated} from "./telephonycallpanelrelated";

@Component({
    selector: 'telephony-call-panel-related-compact',
    templateUrl: './src/modules/telephony/templates/telephonycallpanelrelatedcompact.html',
    providers: [view]
})
export class TelephonyCallPanelRelatedCompact extends TelephonyCallPanelRelated {


}
