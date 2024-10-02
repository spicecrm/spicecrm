/**
 * @module ModuleTeleSales
 */

import {ChangeDetectorRef, Component, NgZone, OnDestroy} from "@angular/core";
import {model} from "../../../services/model.service";
import {telecockpitservice} from "../services/telecockpit.service";
import {metadata} from "../../../services/metadata.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */


interface countdownComponents {
    secondsToDday: string;
    minutesToDday: string;
    hoursToDday: string;
    daysToDday: string;
}
declare var moment: any;

@Component({
    selector: 'tele-sales-cockpit-lock-entry-button',
    templateUrl: '../templates/telesalescockpitlockentrybutton.html',
    providers: [model]
})
export class TeleSalesCockpitLockEntryButton implements OnDestroy{

    public locktime = 15;

    public timeLeft: countdownComponents;

    public targetdate: string;

    public timerStarted: boolean;
    /**
     * the timer
     */
    public timer: any;

    /**
     * set to visible if the date is in the future
     */
    public visible: boolean = false;

    private subscription = new Subscription();

    constructor(public model: model,
                public telecockpitservice: telecockpitservice,
                public metadata:metadata,
                public zone: NgZone,
                public cdRef: ChangeDetectorRef) {
        this.model.module = 'CampaignLog';
        if (this.telecockpitservice.selectedListItem) {
            this.setModel();
        }
        this.subscribeToSelectedItem();
    }

    get lockTime(){
        if(this.telecockpitservice.selectedCampaignTask.telesales_lock_time){
            return this.telecockpitservice.selectedCampaignTask.telesales_lock_time;
        }
        return this.locktime;
    }

    private setModel() {
        this.model.resetData();
        this.model.id = this.telecockpitservice.selectedListItem.id;
        this.model.setData(window._.omit({...this.telecockpitservice.selectedListItem}, ['data']));
        this.model.startEdit();
        if (this.telecockpitservice.isLocked()) {
            this.targetdate = moment(this.telecockpitservice.selectedListItem.locked_until);
            this.startTimer();
        }
    }

    private subscribeToSelectedItem() {
        this.subscription.add(
            this.telecockpitservice.selectedListItem$.subscribe(()=> {
                this.reset();
                this.targetdate = undefined;
                this.setModel();
            })
        )
    }

    public execute() {
        let date = new moment().format('YYYY-MM-DD HH:mm:ss');
        this.targetdate = new moment(date).add(this.lockTime,'m');
        this.telecockpitservice.selectedListItem.locked_until = this.targetdate;
        this.telecockpitservice.selectedListItem.locked_by_id = this.metadata.session.authData.user.id;
        this.model.setFields({
            locked_until: this.telecockpitservice.selectedListItem.locked_until,
            locked_by_id: this.telecockpitservice.selectedListItem.locked_by_id
        });

        this.model.save();
        this.startTimer();
    }

    public startTimer() {

        this.reset();

        this.timerStarted = true;

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
        this.timeLeft = this.calcDateDiff();
        if(
        this.timeLeft.secondsToDday== '00' &&
        this.timeLeft.minutesToDday== '00' &&
        this.timeLeft.hoursToDday== '00' &&
        this.timeLeft.daysToDday== '0' ) {
            this.reset();
        }
        this.cdRef.detectChanges();
    }

    private reset() {
        window.clearInterval(this.timer);
        this.timerStarted = false;
        this.timeLeft = undefined;
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

    public ngOnDestroy() {
        this.reset();
        this.subscription.unsubscribe();
    }
}