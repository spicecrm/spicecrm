/**
 * @module ModuleSpiceTimeline
 */
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from "../../../services/metadata.service";

/** @ignore */
declare var moment: any;

@Component({
    selector: 'spice-timeline',
    templateUrl: './src/include/spicetimeline/templates/spicetimeline.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceTimeline implements OnChanges, AfterViewInit {
    /**
     * holds the week days count
     */
    public weekDaysCount: number = 7;
    /**
     * container reference for the main div
     */
    @ViewChild('contentContainer', {read: ViewContainerRef, static: true}) protected contentContainer: ViewContainerRef;
    /**
     * holds the period unit width
     */
    protected defaultPeriodUnitWidth: number = 50;
    /**
     * holds the period unit width
     */
    protected defaultPeriodContainerWidth: number = 250;
    /**
     * holds the period unit width
     */
    protected periodUnitWidth: number = 50;
    /**
     * holds the period unit width
     */
    protected periodContainerWidth: number = 250;
    /**
     * holds the sheet hours
     */
    protected periodDuration: string[] = [];
    /**
     * holds the input timeline records to be rendered
     */
    @Input() protected records: any[] = [];
    /**
     * holds the records main module
     */
    @Input() protected recordModule: string;
    /**
     * holds the records main module
     */
    @Output() private dateChange = new EventEmitter<any>();
    /**
     * holds the period unit to render the timeline cells
     */
    private periodUnit: 'day' | 'week' | 'month' = 'day';
    /**
     * holds the default event color
     */
    private headerDateText: string = '';
    /**
     * holds the default event color
     */
    private eventColor: string = '#039be5';
    /**
     * holds the event height
     */
    private eventHeight: number = 25;
    /**
     * holds the start hour from user preferences
     */
    private startHour: number = 0;
    /**
     * holds the end hour from user preferences
     */
    private endHour: number = 23;
    /**
     * boolean to show/hide date picker
     */
    private pickerIsOpen: boolean = false;
    /**
     * a fieldset id for loading a fieldset in the record row
     */
    private recordFieldset: string;
    /**
     * holds the current date
     */
    private currentDate: any = moment();
    /**
     * holds the end date
     */
    private endDate: any = moment();
    /**
     * holds the start date
     */
    private startDate: any = moment();
    /**
     * holds the resize listener
     */
    private resizeListener: any;

    constructor(private renderer: Renderer2,
                private cdRef: ChangeDetectorRef,
                private metadata: metadata) {
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
        this.buildPeriodDuration();
        this.setDefaultWidth();
        this.resetZoom();
        this.setDate(new moment());
        this.addResizeListener();
    }

    /**
     * add resize listener to rebuild the period duration
     */
    private addResizeListener() {
        this.resizeListener = this.renderer.listen('window', 'resize', () =>
            this.setDefaultWidth()
        );
    }

    /**
     * set the default width for the period elements
     */
    private setDefaultWidth() {
        this.defaultPeriodContainerWidth = this.contentContainer.element.nativeElement.getBoundingClientRect().width;
        this.defaultPeriodUnitWidth = parseFloat((((this.defaultPeriodContainerWidth * 0.75)  - 1) / this.periodDuration.length).toFixed(3));
    }

    /**
     * add a duration to calendar date
     */
    public shiftPlus() {
        this.startDate = new moment(this.startDate.add(moment.duration(1, this.periodUnit + 's')));
        this.endDate = new moment(this.endDate.add(moment.duration(1, this.periodUnit + 's')));
        this.setHeaderDateText();
        this.emitDateChange();
    }

    /**
     * subtract a duration from calendar date
     */
    public shiftMinus() {
        this.startDate = new moment(this.startDate.subtract(moment.duration(1, this.periodUnit + 's')));
        this.endDate = new moment(this.endDate.subtract(moment.duration(1, this.periodUnit + 's')));
        this.setHeaderDateText();
        this.emitDateChange();
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

    private emitDateChange() {
        this.dateChange.emit({
            start: this.startDate,
            end: this.endDate
        });
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
    private buildPeriodDuration() {
        this.periodDuration = [];
        let start = 0;
        let end;

        switch (this.periodUnit) {
            case 'day':
                end = 23;
                break;
            case 'week':
                end = 6;
                break;
            case 'month':
                end = 31;
        }
        while (start <= end) {
            this.periodDuration.push(start.toString());
            start++;
        }
    }

    /**
     * set record events style
     */
    private setRecordEventsStyle() {
        this.records.forEach(record =>
            record.events.forEach(event => {
                const startMinutes = (event.start.hour() - this.startHour) * 60 + event.start.minute();
                const endMinutes = (event.end.hour() - this.startHour) * 60 + event.end.minute();
                event.style = {
                    'left': (this.periodUnitWidth / 60) * startMinutes + 'px',
                    'width': ((this.periodUnitWidth / 60) * (endMinutes - startMinutes)) + 'px',
                    'background-color': this.eventColor,
                    'display': 'block',
                    'height': '80%',
                    'position': 'absolute',
                    'border-radius': '.25rem',
                    'top': '10%',
                };

            })
        );
        this.cdRef.detectChanges();
    }

    /**
     * set the period unit
     * @param value
     */
    private setPeriodUnit(value) {
        this.periodUnit = value;
        this.resetZoom();
        this.buildPeriodDuration();
        this.setDate(this.startDate);
        this.setHeaderDateText();
    }

    /**
     * zoom sheet cells in
     */
    private zoomIn() {
        this.periodUnitWidth += 10;
        this.periodContainerWidth += (10 * this.periodDuration.length);
        this.setRecordEventsStyle();
        this.cdRef.detectChanges();
    }

    /**
     * zoom sheet cells out
     */
    private zoomOut() {
        this.periodUnitWidth -= 10;
        this.periodContainerWidth -= (10 * this.periodDuration.length);
        this.setRecordEventsStyle();
        this.cdRef.detectChanges();
    }

    /**
     * reset sheet cells zoom
     */
    private resetZoom() {
        this.periodUnitWidth = this.defaultPeriodUnitWidth;
        this.periodContainerWidth = this.defaultPeriodContainerWidth;
        this.setRecordEventsStyle();
        this.cdRef.detectChanges();
    }

    /**
     * set the header date text
     */
    private setHeaderDateText() {
        switch (this.periodUnit) {
            case 'week':
                this.headerDateText = `${this.startDate.format('MMMM D')} - ${this.endDate.format('MMMM D')}`;
                break;
            case 'month':
                this.headerDateText = this.startDate.format('MMMM YYYY');
                break;
            case 'day':
                this.headerDateText = this.startDate.format('MMMM D');
        }
    }

    /**
     * set current date
     * @param date
     */
    private setDate(date) {
        this.currentDate = new moment(date);
        this.startDate = new moment(date);
        this.endDate = new moment(date).add(moment.duration(1, this.periodUnit + 's'));
        this.setHeaderDateText();
        this.emitDateChange();
        this.pickerIsOpen = false;
    }

    private toggleOpenPicker() {
        this.pickerIsOpen = !this.pickerIsOpen;
    }
}
