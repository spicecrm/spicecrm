/**
 * @module AddComponentsModule
 */
import {
    Component,
    Input,
    ElementRef, OnInit
} from '@angular/core';
import {userpreferences} from '../../../services/userpreferences.service';
import {modellist} from '../../../services/modellist.service';
import {metadata} from '../../../services/metadata.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: '[spice-timestream-item]',
    templateUrl: './src/include/spicetimestream/templates/spicetimestreamitem.html'
})
export class SpiceTimestreamItem implements OnInit {

    /**
     * the timestream config
     *
     * @private
     */
    @Input() private timestream: any = {};

    /**
     *
     * @private
     */
    @Input() private element: any = {};

    @Input() private module: string;

    /**
     * holds the componentconfig
     *
     * @private
     */
    private componentconfig: any = {};

    constructor(private metadata: metadata, private userpreferences: userpreferences) {

    }

    public ngOnInit() {
        this.componentconfig = this.metadata.getComponentConfig(this.constructor.name, this.module);
    }

    /**
     * getter for the start fieldname
     */
    get startFieldName() {
        return this.componentconfig.start ? this.componentconfig.start : 'date_start';
    }

    /**
     * getter for the end fieldname
     */
    get endFieldName() {
        return this.componentconfig.end ? this.componentconfig.end : 'date_end';
    }

    /**
     * returns the start date
     */
    get elementstart() {
        return this.element[this.startFieldName];
    }

    /**
     * returns the end date
     */
    get elementend() {
        return this.element[this.endFieldName];
    }

    get displayItem() {
        // if we have start and end all OK
        if( this.elementstart && this.elementend && this.elementstart.isBefore(this.elementend) && this.elementstart.isBefore(this.timestream.dateEnd) && this.elementend.isAfter(this.timestream.dateStart)) return true;

        // display if only start is set
        if( this.elementstart && !this.elementend && this.elementstart.isBefore(this.timestream.dateEnd) && this.elementstart.isAfter(this.timestream.dateStart)) return true;

        // display if only end is set
        if( !this.elementstart && this.elementend && this.elementend.isBefore(this.timestream.dateEnd) && this.elementend.isAfter(this.timestream.dateStart)) return true;

        return false;
    }

    get startdate() {
        return this.elementstart.isBefore(this.timestream.dateStart) ? this.timestream.dateStart : this.elementstart;
    }

    get enddate() {
        return this.elementend.isAfter(this.timestream.dateEnd) ? this.timestream.dateEnd : this.elementend;
    }

    /**
     * gets the start offset from the start
     *
     * @private
     */
    private getStart() {
        let totaldays = this.timestream.dateEnd.diff(this.timestream.dateStart, 'days');
        let startOffset = this.startdate.diff(this.timestream.dateStart, 'days');
        return startOffset / totaldays * 100;
    }

    /**
     * gete the offset from the end date
     * used when only and end date is set to draw a milestone there
     *
     * @private
     */
    private getStartFromEnd() {
        let totaldays = this.timestream.dateEnd.diff(this.timestream.dateStart, 'days');
        let startOffset = this.enddate.diff(this.timestream.dateStart, 'days');
        return startOffset / totaldays * 100;
    }

    private getWidth() {
        let totaldays = this.timestream.dateEnd.diff(this.timestream.dateStart, 'days');
        let length = this.enddate.diff(this.startdate, 'days');
        return length / totaldays * 100;
    }

    private getElementStyle() {
        if (this.elementstart && this.elementend) {
            if (this.timestream.dateEnd.diff(this.timestream.dateStart, 'days') > 0) {
                return {
                    left: this.getStart() + '%',
                    width: this.getWidth() + '%'
                };
            } else {
                return {
                    left: this.getStart() + '%',
                    width: '10px',
                    transform: 'rotate(45deg)'
                };
            }
        } else if (this.elementstart && this.elementstart.isAfter(this.timestream.dateStart) && this.elementstart.isBefore(this.timestream.dateEnd)) {
            return {
                left: this.getStart() + '%',
                width: '10px',
                transform: 'rotate(45deg)'
            };
        } else if (this.elementend && this.elementend.isAfter(this.timestream.dateStart) && this.elementend.isBefore(this.timestream.dateEnd)) {
            return {
                left: this.getStartFromEnd() + '%',
                width: '10px',
                transform: 'rotate(45deg)'
            };
        }
    }
}
