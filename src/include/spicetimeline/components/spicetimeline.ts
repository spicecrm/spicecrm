/**
 * @module ModuleSpiceTimeline
 */
import {AfterViewInit, Component, Input, OnChanges, Renderer2, SimpleChanges, ViewChild, ViewContainerRef} from '@angular/core';
import {calendar} from "../../../modules/calendar/services/calendar.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'spice-timeline',
    templateUrl: './src/include/spicetimeline/templates/spicetimeline.html'
})
export class SpiceTimeline implements OnChanges, AfterViewInit {
    /**
     * container reference for the main div
     */
    @ViewChild('periodsContainer', {read: ViewContainerRef, static: true}) protected periodsContainer: ViewContainerRef;
    /**
     * holds the period unit width
     */
    protected periodUnitWidth;
    /**
     * holds the sheet hours
     */
    protected periodDuration: any[] = [];
    /**
     * holds the input timeline records to be rendered
     */
    @Input() protected records: any[] = [];
    /**
     * holds the records main module
     */
    @Input() protected recordModule: string;
    /**
     * a fieldset id for loading a fieldset in the record row
     */
    private recordFieldset: string;
    /**
     * holds the resize listener
     */
    private resizeListener: any;

    constructor(private calendar: calendar,
                private renderer: Renderer2,
                private metadata: metadata) {
        this.buildHours();
        this.loadFieldset();
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (!changes.records) return;
        this.setRecordEventsStyle();
    }

    /**
     * set the period unit width
     */
    public ngAfterViewInit() {
        const periodDuration = this.calendar.endHour - this.calendar.startHour + 1;
        this.periodUnitWidth = this.periodsContainer.element.nativeElement.clientWidth / periodDuration;
        this.resizeListener = this.renderer.listen('window', 'resize', () =>
            this.buildHours()
        );
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    protected trackByItemFn(index, item) {
        return item.id;
    }

    /**
     * load event fieldsets
     */
    private loadFieldset() {
        let config = this.metadata.getComponentConfig('SpiceTimeline', this.recordModule);
        if (config && config.recordFieldset) {
            this.recordFieldset = config.recordFieldset;
        }
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return index
     */
    private trackByIndexFn(index, item) {
        return index;
    }

    /**
     * build sheet hours
     */
    private buildHours() {
        this.periodDuration = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.periodDuration.push(i);
            i++;
        }
    }

    /**
     * set record events style
     */
    private setRecordEventsStyle() {
        this.records.forEach(record =>
            record.events.forEach(event => {
                const startMinutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
                const endMinutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
                event.style = {
                    'left': (this.periodUnitWidth / 60) * startMinutes + 'px',
                    'width': ((this.periodUnitWidth / 60) * (endMinutes - startMinutes)) + 'px',
                    'background-color': this.calendar.eventColor,
                    'display': 'block',
                    'height': '80%',
                    'position': 'absolute',
                    'border-radius': '.25rem',
                    'top': '10%',
                };

            })
        );
    }
}
