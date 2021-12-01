/**
 * @module ModuleTelephony
 */
import {Component, EventEmitter, Input, OnDestroy} from '@angular/core';


import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from "../../../services/backend.service";
import {configurationService} from "../../../services/configuration.service";
import {modelutilities} from '../../../services/modelutilities.service';
import {Observable, Subject, Subscription} from "rxjs";
import {telephony} from "../../../services/telephony.service";
import {telephonyCallI} from "../../../services/interfaces.service";

declare var _: any;

@Component({
    templateUrl: '../templates/telephonycallsearching.html'
})
export class TelephonyCallSearching {

    @Input() public calldata: telephonyCallI;

    constructor() {

    }

}
