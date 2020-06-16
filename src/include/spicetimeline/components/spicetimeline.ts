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
import {language} from "../../../services/language.service";

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
    protected defaultPeriodTimelineWidth: number = 250;
    /**
     * holds the period unit width
     */
    protected periodUnitWidth: number = 50;
    /**
     * holds the period unit width
     */
    protected periodTimelineWidth: number = 250;
    /**
     * holds the period unit width
     */
    protected periodDataWidth: number = 250;
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
     * holds the header fields
     */
    protected headerFields: any[] = ['name'];
    /**
     * holds the header fields
     */
    protected recordFieldsetFields: any[] = [];
    /**
     * holds the period unit to render the timeline cells
     */
    protected hoursArray: string[] = [];
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
    /**
     * holds the build of the record unavailable times
     */
    private recordsUnavailableTimes: any = {};

    constructor(private renderer: Renderer2,
                private cdRef: ChangeDetectorRef,
                private language: language,
                private metadata: metadata) {
        this.loadFieldset();
    }

    /**
     * call to load fieldset for records module
     * call to set record events style
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (!!changes.recordModule) {
            this.loadFieldset();
        }
        if (!changes.records) return;
        this.setRecordsEventStyle();
        this.setRecordsUnavailable();
    }

    /**
     * set the period unit width
     */
    public ngAfterViewInit() {
        this.buildPeriodDuration();
        this.setDefaultWidth();
        this.resetZoom();
        this.setDate();
        this.addResizeListener();
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
        const defaultContainerWidth = this.contentContainer.element.nativeElement.getBoundingClientRect().width;
        this.periodDataWidth = defaultContainerWidth * 0.25;
        this.defaultPeriodTimelineWidth = defaultContainerWidth * 0.75;
        this.defaultPeriodUnitWidth = (this.defaultPeriodTimelineWidth - 1) / this.periodDuration.length;
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
        if (!config || !config.recordFieldset) return;
        const headerFields = this.metadata.getFieldSetFields(config.recordFieldset);
        if (!!headerFields) {
            this.recordFieldsetFields = headerFields;
            this.headerFields = headerFields.map(item => this.language.getFieldDisplayName(this.recordModule, item.field));
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
        let start = new moment(this.currentDate).hour(0);
        let unit, format;

        switch (this.periodUnit) {
            case 'day':
                unit = 'hours';
                format = 'H:00';
                break;
            case 'week':
                start = new moment(this.currentDate).day(0);
                unit = 'days';
                format = 'ddd D';
                break;
            case 'month':
                start = new moment(this.currentDate).date(1);
                unit = 'days';
                format = 'D';
        }
        const end = new moment(start).endOf(this.periodUnit);

        for (let date = start; date.isBefore(end); date.add(1, unit)) {
            this.periodDuration.push(date.format(format));
        }

        this.buildHoursArray();
    }

    private buildHoursArray() {
        this.hoursArray = [];
        const start = new moment().hour(0);
        const end = new moment(start).endOf('day');

        for (let date = start; date.isBefore(end); date.add(1, 'hours')) {
            this.hoursArray.push(date.format('H:00'));
        }
    }

    /**
     * set record events style
     */
    private setRecordsEventStyle() {
        this.records.forEach(record => {
            const days = {};
            if (this.periodUnit == 'month') {
                record.events.forEach(event => {
                    const eventDay = event.start.date();
                    if (!days[eventDay]) {
                        days[eventDay] = [];
                    }
                    days[eventDay].push(event.id);
                });
            }
            record.events.forEach(event => {

                event.style = {
                    'background-color': this.eventColor,
                    'display': 'block',
                    'height': '80%',
                    'position': 'absolute',
                    'border-radius': '.2rem',
                    'top': '10%',
                };
                const startMinutes = (event.start.hour() - this.startHour) * 60 + event.start.minute();
                const endMinutes = (event.end.hour() - this.startHour) * 60 + event.end.minute();

                switch (this.periodUnit) {
                    case 'day':
                        event.style.left = ((this.periodUnitWidth / 60) * startMinutes) + 'px';
                        event.style.width = ((this.periodUnitWidth / 60) * (endMinutes - startMinutes)) + 'px';
                        break;
                    case 'week':
                        event.style.left = ((this.periodUnitWidth * event.start.day()) + ((this.periodUnitWidth / 1440) * startMinutes)) + 'px';
                        event.style.width = ((this.periodUnitWidth / 1440) * (endMinutes - startMinutes)) + 'px';
                        break;
                    case 'month':
                        const eventDay = event.start.date();
                        event.style.left = ((this.periodUnitWidth * eventDay) + (days[eventDay].indexOf(event.id) * (this.periodUnitWidth / days[eventDay].length))) + 'px';
                        event.style.width = ((this.periodUnitWidth / days[eventDay].length) -1) + 'px';
                        break;
                }
            });
        });
        this.cdRef.detectChanges();
    }

    /**
     * set the record unavailable array style to grey the unavailable time on the timeline
     */
    private setRecordsUnavailable() {
        this.records.forEach(record => {
            if (!record.unavailable || !record.unavailable.length) return;
            this.recordsUnavailableTimes[record.id] = {};

            record.unavailable.forEach(part => {
                const start = new moment().hour(part.from);
                const end = new moment().hour(part.to);
                for (let date = start; date.isSameOrBefore(end); date.add(1, 'hours')) {
                    this.recordsUnavailableTimes[record.id][date.format('H:00')] = true;
                }
            });
        });
    }

    /**
     * set the period unit
     * @param value
     */
    private setPeriodUnit(value) {
        this.periodUnit = value;
        this.buildPeriodDuration();
        this.setDefaultWidth();
        this.resetZoom();
        this.setDate();
        this.setHeaderDateText();
    }

    /**
     * zoom sheet cells in
     */
    private zoomIn() {
        this.periodUnitWidth += 10;
        this.periodTimelineWidth += (10 * this.periodDuration.length);
        this.setRecordsEventStyle();
        this.cdRef.detectChanges();
    }

    /**
     * zoom sheet cells out
     */
    private zoomOut() {
        this.periodUnitWidth -= 10;
        this.periodTimelineWidth -= (10 * this.periodDuration.length);
        this.setRecordsEventStyle();
        this.cdRef.detectChanges();
    }

    /**
     * reset sheet cells zoom
     */
    private resetZoom() {
        this.periodUnitWidth = this.defaultPeriodUnitWidth;
        this.periodTimelineWidth = this.defaultPeriodTimelineWidth;
        this.setRecordsEventStyle();
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
    private setDate(date = new moment()) {

        this.currentDate = new moment(date);
        switch (this.periodUnit) {
            case 'day':
                this.startDate = new moment(date).hour(0).minute(0).second(0);
                break;
            case 'week':
                this.startDate = new moment(date).day(0).hour(0).minute(0).second(0);
                break;
            case 'month':
                this.startDate = new moment(date).date(1).hour(0).minute(0).second(0);
                break;
        }

        this.endDate = new moment(this.startDate).endOf(this.periodUnit);
        this.setHeaderDateText();
        this.emitDateChange();
        this.pickerIsOpen = false;
    }

    /**
     * toggle open picker
     */
    private toggleOpenPicker() {
        this.pickerIsOpen = !this.pickerIsOpen;
    }

    /**
     * set today marker on the timeline
     */
    private setTodayMarker() {

    }
}
