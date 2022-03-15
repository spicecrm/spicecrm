/**
 * @module SystemComponents
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges, OnDestroy,
    SimpleChanges
} from '@angular/core';

import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {session} from '../../services/session.service';
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * displays a date and/or time in the format of the user
 */
@Component({
    selector: 'system-display-datetime',
    templateUrl: '../templates/systemdisplaydatetime.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayDatetime implements AfterViewInit, OnChanges, OnDestroy {

    /**
     * the number to be displayed
     */
    @Input() public date: any;

    /**
     * set to true to not display the date
     *
     * @private
     */
    @Input() public displayDate: boolean = true;

    /**
     * set to false to not return the time value
     *
     * @private
     */
    @Input() public displayTime: boolean = true;

    /**
     * holds the components subscriptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public language: language, public cdRef: ChangeDetectorRef, public session: session, public userpreferences: userpreferences) {

    }

    /**
     * on changes also trigger the change detection
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        this.detectChanges();
    }

    /**
     * cancel any active subscriptiuon we might have
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * after view init subscribe to changes and we can also run detect changes if changes happen
     */
    public ngAfterViewInit() {
        this.subscribeToPrefs();
    }

    /*
    * subscribe to pref changes
     */
    public subscribeToPrefs() {
        this.subscriptions.add(
            this.userpreferences.preferences$.subscribe(prefs => {
                this.prefChanges(prefs);
            })
        );
    }

    /**
     * handle pref changes and detect changes
     *
     * @param prefs
     * @private
     */
    public prefChanges(prefs) {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    public detectChanges() {
        this.cdRef.detectChanges();
    }

    /**
     * returns the value to be displayed
     */
    get displayValue() {
        // if we do not have a date or neither date nor time should be displayed return empty
        if (!this.date || (!this.displayDate && !this.displayTime)) return '';

        let formatArray = [];
        if (this.displayDate) formatArray.push(this.userpreferences.getDateFormat());
        if (this.displayTime) formatArray.push(this.userpreferences.getTimeFormat());

        if(moment.isMoment(this.date)) {
            return this.date.format(formatArray.join(' '));
        } else {
            let timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
            // set the Time Zone for the Field Value only if the Time Zone is set
            return moment.utc(this.date).tz(timeZone).format(formatArray.join(' '));
        }
    }

}
