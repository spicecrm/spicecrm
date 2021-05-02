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
import {currency} from '../../services/currency.service';
import {Subscription} from "rxjs";

declare var moment: any;

/**
 * displays a date and/or time in the format of the user
 */
@Component({
    selector: 'system-display-datetime',
    templateUrl: './src/systemcomponents/templates/systemdisplaydatetime.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemDisplayDatetime implements AfterViewInit, OnChanges, OnDestroy {

    /**
     * the number to be displayed
     */
    @Input() private date: any;

    /**
     * set to true to not display the date
     *
     * @private
     */
    @Input() private displayDate: boolean = true;

    /**
     * set to false to not return the time value
     *
     * @private
     */
    @Input() private displayTime: boolean = true;

    private subscriptions: Subscription = new Subscription();

    constructor(private language: language, private cdRef: ChangeDetectorRef, private currency: currency, private userpreferences: userpreferences) {

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
    private subscribeToPrefs() {
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
    private prefChanges(prefs) {
        this.detectChanges();
    }

    /**
     * triggers the change detection when the language is changed
     */
    private detectChanges() {
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
            return moment(this.date).format(formatArray.join(' '));
        }
    }

}
