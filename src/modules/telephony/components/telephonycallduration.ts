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
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy} from '@angular/core';
import {telephonyCallI} from "../../../services/interfaces.service";

declare var moment: any;

@Component({
    selector: 'telephony-call-duration',
    templateUrl: './src/modules/telephony/templates/telephonycallduration.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelephonyCallDuration implements OnDestroy {

    @Input() public calldata: telephonyCallI;

    private interval: any;

    private duration: string = '';

    constructor(private cdref: ChangeDetectorRef) {
        this.interval = window.setInterval(() => {
            this.calculateDuration();
        }, 100);
    }

    /**
     * kill the interval
     */
    public ngOnDestroy(): void {
        this.clearInterval();
    }

    /**
     * trigger determination of duration and trigger change detection
     */
    private calculateDuration() {
        this.duration = this._duration;
        this.cdref.detectChanges();
    }

    /**
     * clear the interval
     */
    private clearInterval() {
        if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = undefined;
        }
    }

    /**
     * get the call duration
     */
    get _duration() {
        if (!this.calldata.start) {
            return '';
        }

        // see if we have an end set
        let end = moment();
        if (this.calldata.end) {
            end = this.calldata.end;
            this.clearInterval();
        }

        // get the ruation
        let duration = moment.duration(end.diff(this.calldata.start));

        // format as time
        return duration.hours() > 0 ? moment.utc(duration.asMilliseconds()).format("HH:mm:ss") : moment.utc(duration.asMilliseconds()).format("mm:ss");
    }

}
