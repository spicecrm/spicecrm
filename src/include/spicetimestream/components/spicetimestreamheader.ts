/**
 * @module AddComponentsModule
 */
import {
    Component,
    Input,
    ElementRef
} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: '[spice-timestream-header]',
    templateUrl: '../templates/spicetimestreamheader.html'
})
export class SpiceTimestreamHeader {

    @Input() public timestream: any = {};

    public dateElements: any[] = [];

    constructor(public elementRef: ElementRef, public userpreferences: userpreferences) {

    }

    get startDate() {
        return this.timestream.datestart.format(this.userpreferences.getDateFormat());
    }

    get endDate() {
        return this.timestream.dateend.format(this.userpreferences.getDateFormat());
    }

    get width() {
        return this.elementRef.nativeElement.parentElement.getBoundingClientRect().width;
    }

    get periods() {
        let periods = [];
        let i = 0;
        switch (this.timestream.period) {
            case 'M':
                let weekdate = moment(this.timestream.dateStart);
                while (weekdate.isSameOrBefore(this.timestream.dateEnd)) {

                    periods.push({
                        name: weekdate.format('DD'),
                        displayclass: weekdate.day() == 0 || weekdate.day() == 6 ? 'slds-theme_shade' : ''
                    });
                    weekdate.add(1, 'd');
                }
                break;
            case 'Q':
                while (i < 3) {
                    let date = new moment().month(this.timestream.dateStart.month() + i);
                    periods.push({
                        name: date.format('MMM')
                    });
                    i++;
                }
                break;
            case 'y':
                while (i < 12) {
                    let date = new moment().month(i);
                    periods.push({
                        name: date.format('MMM')
                    });
                    i++;
                }
                break;
        }

        return periods;
    }

    public getPeriodStyle() {
        return {
            width: 100 / this.periods.length + '%'
        };
    }

}
