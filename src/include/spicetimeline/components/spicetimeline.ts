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
    OnDestroy,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";
import {userpreferences} from "../../../services/userpreferences.service";
import {broadcast} from "../../../services/broadcast.service";
import {Subscription} from "rxjs";
import {DurationPartI, EventI, RecordI} from "../interfaces/spicetimeline.interfaces";

/** @ignore */
declare var moment: any;

/**
 * display the input records in a timeline view
 */
@Component({
    selector: 'spice-timeline',
    templateUrl: '../templates/spicetimeline.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceTimeline implements OnChanges, AfterViewInit, OnDestroy {
    /**
     * holds the focused event color
     */
    public focusColor: string = '#ffc700';
    /**
     * holds the today text color
     */
    public todayColor: string = '#eb7092';
    /**
     * container reference for the main div
     */
    @ViewChild('contentContainer', {read: ViewContainerRef, static: true}) public contentContainer: ViewContainerRef;
    /**
     * holds the period unit width
     */
    public defaultPeriodUnitWidth: number = 50;
    /**
     * holds the period unit width
     */
    public defaultPeriodTimelineWidth: number = 250;
    /**
     * holds the period unit width
     */
    public periodUnitWidth: number = 50;
    /**
     * holds the period unit width
     */
    public periodTimelineWidth: number = 250;
    /**
     * holds the period unit width
     */
    public periodDataWidth: number = 250;
    /**
     * holds the sheet hours
     */
    public periodDuration: DurationPartI[] = [];
    /**
     * holds the input timeline records to be rendered
     */
    @Input() public records: RecordI[] = [];
    /**
     * holds the records main module
     */
    @Input() public recordModule: string;
    /**
     * holds the header fields
     */
    public headerFields: string[] = ['name'];
    /**
     * holds the header fields
     */
    public recordFieldsetFields: any[] = [];
    /**
     * holds the records main module
     */
    @Output() public dateChange = new EventEmitter<any>();
    /**
     * holds the records main module
     */
    @Output() public eventClick = new EventEmitter<{record: RecordI, event?: EventI}>();
    /**
     * holds the period unit to render the timeline cells
     */
    public periodUnit: 'day' | 'week' | 'month' = 'day';
    /**
     * holds the default event color
     */
    public headerDateText: string = '';
    /**
     * holds the default event color
     */
    public eventColor: string = '#039be5';
    /**
     * holds the event height
     */
    public eventHeight: number = 25;
    /**
     * holds the start hour from user preferences
     */
    public startHour: number = 0;
    /**
     * holds the end hour from user preferences
     */
    public endHour: number = 23;
    /**
     * holds day hours count
     */
    public hoursCount: number = 24;
    /**
     * boolean to show/hide date picker
     */
    public pickerIsOpen: boolean = false;
    /**
     * holds the current date
     */
    public currentDate: any = moment();
    /**
     * holds the end date
     */
    public endDate: any = moment();
    /**
     * holds the start date
     */
    public startDate: any = moment();
    /**
     * holds the resize listener
     */
    public resizeListener: any;
    /**
     * holds the build of the record unavailable times {'record.id': {'datePart': true}}
     */
    public recordsUnavailableTimes: any = {};
    /**
     * holds the only working hours enabled boolean to all user to toggle the working hours duration
     */
    public onlyWorkingHoursEnabled: boolean = false;
    /**
     * holds the only working hours boolean to render all or working hours
     */
    public onlyWorkingHours: boolean = false;
    /**
     * holds the today marker style to be rendered over the timeline
     */
    public todayHourMarkerStyle: any;
    /**
     * holds the today marker interval to be removed on destroy
     */
    public todayMarkerHourInterval: any;
    /**
     * subscription to handle unsubscribe
     */
    public subscriptions: Subscription = new Subscription();
    /**
     * holds the focused id
     * @private
     */
    public focusedId: string;

    constructor(public renderer: Renderer2,
                public cdRef: ChangeDetectorRef,
                public language: language,
                public broadcast: broadcast,
                public userpreferences: userpreferences,
                public metadata: metadata) {
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
     * set the only working hours enabled
     * build the period duration
     * set the current date and emit the date to parent to load the events for the selected period
     * reset the default width
     * add resize listener
     * add today hour interval
     * subscribe to broadcast changes
     */
    public ngAfterViewInit() {
        this.setOnlyWorkingHoursEnabled();
        this.setDate();
        this.addResizeListener();
        this.addTodayHourInterval();
        this.subscribeToChanges();
    }

    /**
     * clear today marker interval und unsubscribe from subscriptions
     */
    public ngOnDestroy() {
        if (this.todayMarkerHourInterval) {
            window.clearInterval(this.todayMarkerHourInterval);
        }
        this.subscriptions.unsubscribe();
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     * @return item.id
     */
    public trackByItemFn(index, item) {
        return item.id;
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    public subscribeToChanges() {
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => {
                if (message.messagetype !== 'timezone.changed') return;
                this.setTodayHourMarkerStyle();
                this.setRecordsEventStyle();
                this.cdRef.detectChanges();
            })
        );
    }

    /**
     * add a duration to calendar date
     * @param action
     */
    public shiftDate(action: 'add' | 'subtract') {
        this.startDate = new moment(this.startDate[action](moment.duration(1, this.periodUnit + 's')));
        this.endDate = new moment(this.endDate[action](moment.duration(1, this.periodUnit + 's')));
        this.buildPeriodDuration();
        this.setHeaderDateText();
        this.emitDateChange();
        this.cdRef.detectChanges();
    }

    /**
     * add today hour interval to reposition the marker on minute change
     */
    public addTodayHourInterval() {
        this.todayMarkerHourInterval = window.setInterval(() => {
            this.setTodayHourMarkerStyle();
            this.cdRef.detectChanges();
        }, 60000);
    }

    /**
     * toggle the only working hours
     */
    public toggleOnlyWorkingHours() {
        this.onlyWorkingHours = !this.onlyWorkingHours;
        this.startHour = this.onlyWorkingHours ? +this.userpreferences.toUse.calendar_day_start_hour : 0;
        this.endHour = this.onlyWorkingHours ? (+this.userpreferences.toUse.calendar_day_end_hour - 1) : 23;
        this.hoursCount = this.endHour - this.startHour;
        this.setDate();
        this.buildPeriodDuration();
        this.setTodayHourMarkerStyle();
    }

    /**
     * set the only working hours checkbox enabled if they are set in the user preferences
     */
    public setOnlyWorkingHoursEnabled() {
        const start = this.userpreferences.toUse.calendar_day_start_hour;
        const end = this.userpreferences.toUse.calendar_day_end_hour;
        if (!!start && start != 0 && !!end && end != 23) {
            this.onlyWorkingHoursEnabled = true;
        }
    }

    /**
     * add resize listener to rebuild the period duration
     */
    public addResizeListener() {
        this.resizeListener = this.renderer.listen('window', 'resize', () =>
            this.setDefaultWidth()
        );
    }

    /**
     * set the default width for the period elements
     */
    public setDefaultWidth() {
        const defaultContainerWidth = this.contentContainer.element.nativeElement.getBoundingClientRect().width;
        this.periodDataWidth = defaultContainerWidth * 0.25;
        this.defaultPeriodTimelineWidth = defaultContainerWidth * 0.75;
        this.defaultPeriodUnitWidth = (this.defaultPeriodTimelineWidth - 1) / this.periodDuration.length;
        this.resetPeriodUnitWidth();
        this.cdRef.detectChanges();
    }

    /**
     * emit date change to the parent
     */
    public emitDateChange() {
        this.dateChange.emit({
            start: new moment(this.startDate.format()),
            end: new moment(this.endDate.format())
        });
    }

    /**
     * load event fieldsets
     */
    public loadFieldset() {
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
    public trackByIndexFn(index, item) {
        return index;
    }

    /**
     * build period duration
     * call build hours
     * call set default width
     * call set today marker hour style
     */
    public buildPeriodDuration() {
        this.periodDuration = [];
        let start = new moment(this.startDate).hour(this.startHour);
        let unit, format;

        switch (this.periodUnit) {
            case 'day':
                unit = 'hours';
                format = 'H:00';
                break;
            case 'week':
                start = new moment(this.startDate).day(0);
                unit = 'days';
                format = 'ddd D';
                break;
            case 'month':
                start = new moment(this.startDate).date(1);
                unit = 'days';
                format = 'D';
        }
        const end = new moment(start).endOf(this.periodUnit).hour(this.endHour);

        for (let date = start; date.isBefore(end); date.add(1, unit)) {
            const part: DurationPartI = {
                fullDate: date.format(),
                text: date.format(format),
                color: this.periodUnit != 'day' && new moment().isSame(date, 'day') ? this.todayColor : '#343434'
            };
            if (this.periodUnit == 'week' || this.periodUnit == 'day') {
                part.hours = this.buildDayHours(date);

            }
            this.periodDuration.push(part);
        }

        this.setDefaultWidth();
        this.setTodayHourMarkerStyle();
    }

    /**
     * builds the input day hours
     * @param date
     */
    public buildDayHours(date) {
        const hours = [];
        const start = new moment(date).hour(this.startHour);
        const end = new moment(date).hour(this.endHour);

        for (let date = start; date.isSameOrBefore(end); date.add(1, 'hours')) {
            hours.push(date.format());
        }
        return hours;
    }

    /**
     * set record events style
     */
    public setRecordsEventStyle() {
        this.records.forEach((record: RecordI) => {
            const days = {};
            if (this.periodUnit == 'month') {
                record.events.forEach((event: EventI) => {
                    const eventDay = event.start.date();
                    if (!days[eventDay]) days[eventDay] = [];
                    days[eventDay].push(event.id);
                });
            }
            record.events.forEach((event: EventI) => {

                event.style = {
                    'background-color': event.color || this.eventColor,
                    'display': 'block',
                    'height': '80%',
                    'position': 'absolute',
                    'border-radius': '.2rem',
                    'top': '10%',
                };
                let startMinutes = (event.start.hour() - this.startHour) * 60 + event.start.minute();
                startMinutes = startMinutes < 0 ? 0 : startMinutes;
                let endMinutes = (event.end.hour() - this.startHour) * 60 + event.end.minute();
                endMinutes = endMinutes > (this.hoursCount * 60) ? (this.hoursCount * 60) : endMinutes;

                switch (this.periodUnit) {
                    case 'day':
                        event.style.left = ((this.periodUnitWidth / 60) * startMinutes) + 'px';
                        event.style.width = (((this.periodUnitWidth / 60) * (endMinutes - startMinutes)) -1) + 'px';
                        break;
                    case 'week':
                        event.style.left = ((this.periodUnitWidth * event.start.day()) + ((this.periodUnitWidth / (this.hoursCount * 60)) * startMinutes)) + 'px';
                        event.style.width = (((this.periodUnitWidth / (this.hoursCount * 60)) * (endMinutes - startMinutes)) - 1) + 'px';
                        break;
                    case 'month':
                        const eventDay = event.start.date();
                        event.style.left = ((this.periodUnitWidth * eventDay) + (days[eventDay].indexOf(event.id) * (this.periodUnitWidth / days[eventDay].length))) + 'px';
                        event.style.width = ((this.periodUnitWidth / days[eventDay].length) - 1) + 'px';
                        break;
                }
            });
        });
        this.cdRef.detectChanges();
    }

    /**
     * set the record unavailable array style to grey the unavailable time on the timeline
     */
    public setRecordsUnavailable() {
        this.records.forEach((record: RecordI) => {
            if (!record.unavailable || !record.unavailable.length) return;
            this.recordsUnavailableTimes[record.id] = {};

            record.unavailable.forEach((part) => {
                const start = new moment(part.from);
                const end = new moment(part.to);
                for (let date = start; date.isSameOrBefore(end); date.add(1, 'hours')) {
                    this.recordsUnavailableTimes[record.id][date.format()] = true;
                }
            });
            this.cdRef.detectChanges();
        });
    }

    /**
     * set the period unit
     * reset the date
     * @param value
     */
    public setPeriodUnit(value) {
        this.periodUnit = value;
        this.setDate(this.currentDate);
    }

    /**
     * zoom sheet cells in
     * reset the records event style
     * reset the today marker hour style
     */
    public zoomIn() {
        this.periodUnitWidth += 10;
        this.periodTimelineWidth += (10 * this.periodDuration.length);
        this.setRecordsEventStyle();
        this.setTodayHourMarkerStyle();
        this.cdRef.detectChanges();
    }

    /**
     * zoom sheet cells out
     * reset the records event style
     * reset the today marker hour style
     */
    public zoomOut() {
        this.periodUnitWidth -= 10;
        this.periodTimelineWidth -= (10 * this.periodDuration.length);
        this.setRecordsEventStyle();
        this.setTodayHourMarkerStyle();
        this.cdRef.detectChanges();
    }

    /**
     * reset sheet cells zoom
     * reset the records event style
     * reset the today hour marker style
     */
    public resetZoom() {
        this.resetPeriodUnitWidth();
        this.setRecordsEventStyle();
        this.setTodayHourMarkerStyle();
        this.cdRef.detectChanges();
    }

    /**
     * reset the period unit width to default
     */
    public resetPeriodUnitWidth() {
        this.periodUnitWidth = this.defaultPeriodUnitWidth;
        this.periodTimelineWidth = this.defaultPeriodTimelineWidth;
    }

    /**
     * set the header date text by period unit
     */
    public setHeaderDateText() {
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
     * set the start and end date
     * build the period duration
     * set the header text
     * emit the date changes
     * @param date
     */
    public setDate(date = new moment()) {

        this.currentDate = new moment(date);
        switch (this.periodUnit) {
            case 'day':
                this.startDate = new moment(date).hour(this.startHour).minute(0).second(0);
                break;
            case 'week':
                this.startDate = new moment(date).day(0).hour(this.startHour).minute(0).second(0);
                break;
            case 'month':
                this.startDate = new moment(date).date(1).hour(this.startHour).minute(0).second(0);
                break;
        }

        this.endDate = new moment(this.startDate).endOf(this.periodUnit).hour(this.endHour);
        this.buildPeriodDuration();
        this.setHeaderDateText();
        this.emitDateChange();
        this.pickerIsOpen = false;
    }

    /**
     * toggle open picker
     */
    public toggleOpenPicker() {
        this.pickerIsOpen = !this.pickerIsOpen;
    }

    /**
     * set the today hour marker style
     */
    public setTodayHourMarkerStyle() {
        const today = new moment();
        if (this.periodUnit == 'month' || !today.isSameOrAfter(this.startDate, 'day') || !today.isSameOrBefore(this.endDate, 'day')) {
            return this.todayHourMarkerStyle = {display: 'none'};
        }
        const todayMinutes = (today.hour() - this.startHour) * 60 + today.minute();

        this.todayHourMarkerStyle = {
            'width': '3px',
            'height': '100%',
            'z-index': '10',
            'background': this.todayColor,
            'position': 'absolute'
        };
        switch (this.periodUnit) {
            case 'day':
                this.todayHourMarkerStyle.left = (((this.periodUnitWidth / 60) * todayMinutes) - 1.5) + 'px';
                break;
            case 'week':
                this.todayHourMarkerStyle.left = (((this.periodUnitWidth * today.day()) + ((this.periodUnitWidth / (this.hoursCount * 60)) * todayMinutes)) - 1.5) + 'px';
                break;
        }
    }

    /**
     * emit the clicked event
     * @param record
     * @param event
     * @private
     */
    public emitEvent(record: RecordI, event?: EventI) {
        if (!!event) event.color = this.focusColor;
        this.focusedId = !!event || record.id == this.focusedId ? undefined : record.id;
        this.eventClick.emit({record, event});
    }
}
