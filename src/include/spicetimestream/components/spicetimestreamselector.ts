/**
 * @module ModuleSpiceTimeStream
 */
import {
    Component, Input, OnDestroy, OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {modellist} from '../../../services/modellist.service';
import {modelutilities} from '../../../services/modelutilities.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {language} from '../../../services/language.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-timestream-selector',
    templateUrl: '../templates/spicetimestreamselector.html'
})
export class SpiceTimestreamSelector implements OnInit{

    /**
     * the current focus date
     *
     * @private
     */
    public focusDate = new moment();

    /**
     * the timestream object
     *
     * @private
     */
    @Input() public timestream: any;

    /**
     * the week start day .. as per prefercnes either monday or sunday
     * @private
     */
    public weekStartDay = 0;

    constructor(public userpreferences: userpreferences) {

        // get the week start day
        let preferences = this.userpreferences.toUse;
        this.weekStartDay = preferences.week_day_start == "Monday" ? 1 : 0;

    }

    public ngOnInit() {
        // set start and end
        this.period = 'y';
    }

    get period() {
        return this.timestream.period;
    }

    set period(period) {
        switch (period) {
            case 'M':
                let curmonth = moment(this.focusDate).month();

                this.timestream.dateStart = new moment(this.focusDate);
                this.timestream.dateStart.month(curmonth);
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.day(this.weekStartDay);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month(curmonth);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.day(6);
                this.timestream.dateEnd.hour(23);
                this.timestream.dateEnd.minute(59);

                // if we have a week start on monday add one day
                if(this.weekStartDay == 1) {
                    this.timestream.dateEnd.add(1, 'days');
                }
                break;
            case 'Q':
                let month = moment(this.focusDate).month() + 1;

                this.timestream.dateStart = new moment(this.focusDate);

                this.timestream.dateStart.month(3 * Math.floor(month / 3));
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month((3 * Math.floor(month / 3)) + 3);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.hour(23);
                this.timestream.dateEnd.minute(59);
                break;
            case 'y':
                this.timestream.dateStart = new moment(this.focusDate);
                this.timestream.dateStart.month(0);
                this.timestream.dateStart.date(1);
                this.timestream.dateStart.hour(0);
                this.timestream.dateStart.minute(0);

                this.timestream.dateEnd = new moment(this.focusDate);
                this.timestream.dateEnd.month(11);
                this.timestream.dateEnd.date(31);
                this.timestream.dateEnd.hour(23);
                this.timestream.dateEnd.minute(59);
                break;
        }
        this.timestream.period = period;

    }

    /**
     * gets the text for the period element
     */
    get periodText() {
        switch (this.timestream.period) {
            case 'M':
                return moment(this.timestream.dateStart).day(6).format('MMM/Y');
            case 'Q':
                return this.timestream.dateStart.format('Q/Y');
            case 'y':
                return this.timestream.dateStart.format('Y');
        }
    }

    /**
     * switch to previous period
     *
     * @private
     */
    public prev() {
        this.focusDate.subtract(1, this.timestream.period);
        this.period = this.timestream.period;
    }

    /**
     * switch to next period
     *
     * @private
     */
    public next() {
        this.focusDate.add(1, this.timestream.period);
        this.period = this.timestream.period;
    }

}
