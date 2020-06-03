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
