/**
 * @module GlobalComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, Input, OnInit} from '@angular/core';

interface countdownComponents {
    secondsToDday: string;
    minutesToDday: string;
    hoursToDday: string;
    daysToDday: string;
}

declare var moment: any;

@Component({
    selector: 'global-countdown',
    templateUrl: '../templates/globalcountdown.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalCountdown implements OnInit{

    /**
     * the timer
     */
    public timer: any;

    /**
     * the component
     */
    public timeleft: countdownComponents;

    /**
     * the event name
     */
    @Input() public event: string;

    /**
     * set to visible if the date is in the future
     */
    public visible: boolean = false;

    /**
     * a target date in international format
     */
    @Input() public targetdate: string;

    constructor(private zone: NgZone, private cdref: ChangeDetectorRef) {

    }

    public ngOnInit() {
        let date = new moment(this.targetdate);

        this.visible = moment().isBefore(date);
        if(this.visible) {
            this.zone.runOutsideAngular(() => {
                this.timer = setInterval(() => {
                    this.update();
                }, 1000);
            });
        }
    }

    /**
     * updates the time and pushes change detection
     * @private
     */
    private update(){
        this.timeleft = this.calcDateDiff();
        this.cdref.detectChanges();
    }

    /**
     * calculates the values
     *
     * @param endDay
     * @private
     */
    private calcDateDiff(): countdownComponents {

        let date = new moment(this.targetdate);
        let diff = moment.duration(date.diff(new moment()));
        const secondsToDday = diff.get('seconds').toString().padStart(2, '0');
        const minutesToDday = diff.get('minutes').toString().padStart(2, '0');
        const hoursToDday = diff.get('hours').toString().padStart(2, '0');
        const daysToDday = Math.floor(diff.as('days')).toString();

        return { secondsToDday, minutesToDday, hoursToDday, daysToDday };
    }

}
