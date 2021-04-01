/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/include/spicetimeline/templates/spicetimeline.html',
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
    protected periodDuration: DurationPartI[] = [];
    /**
     * holds the input timeline records to be rendered
     */
    @Input() protected records: RecordI[] = [];
    /**
     * holds the records main module
     */
    @Input() protected recordModule: string;
    /**
     * holds the header fields
     */
    protected headerFields: string[] = ['name'];
    /**
     * holds the header fields
     */
    protected recordFieldsetFields: any[] = [];
    /**
     * holds the records main module
     */
    @Output() private dateChange = new EventEmitter<any>();
    /**
     * holds the records main module
     */
    @Output() private eventClick = new EventEmitter<{record: RecordI, event?: EventI}>();
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
     * holds day hours count
     */
    private hoursCount: number = 24;
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
     * holds the build of the record unavailable times {'record.id': {'datePart': true}}
     */
    private recordsUnavailableTimes: any = {};
    /**
     * holds the only working hours enabled boolean to all user to toggle the working hours duration
     */
    private onlyWorkingHoursEnabled: boolean = false;
    /**
     * holds the only working hours boolean to render all or working hours
     */
    private onlyWorkingHours: boolean = false;
    /**
     * holds the today marker style to be rendered over the timeline
     */
    private todayHourMarkerStyle: any;
    /**
     * holds the today marker interval to be removed on destroy
     */
    private todayMarkerHourInterval: any;
    /**
     * subscription to handle unsubscribe
     */
    private subscriptions: Subscription = new Subscription();
    /**
     * holds the focused id
     * @private
     */
    private focusedId: string;

    constructor(private renderer: Renderer2,
                private cdRef: ChangeDetectorRef,
                private language: language,
                private broadcast: broadcast,
                private userpreferences: userpreferences,
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
    protected trackByItemFn(index, item) {
        return item.id;
    }

    /**
     * subscribe to model and timezone changes and apply the changes in the calendar
     */
    private subscribeToChanges() {
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
    private shiftDate(action: 'add' | 'subtract') {
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
    private addTodayHourInterval() {
        this.todayMarkerHourInterval = window.setInterval(() => {
            this.setTodayHourMarkerStyle();
            this.cdRef.detectChanges();
        }, 60000);
    }

    /**
     * toggle the only working hours
     */
    private toggleOnlyWorkingHours() {
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
    private setOnlyWorkingHoursEnabled() {
        const start = this.userpreferences.toUse.calendar_day_start_hour;
        const end = this.userpreferences.toUse.calendar_day_end_hour;
        if (!!start && start != 0 && !!end && end != 23) {
            this.onlyWorkingHoursEnabled = true;
        }
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
        this.resetPeriodUnitWidth();
        this.cdRef.detectChanges();
    }

    /**
     * emit date change to the parent
     */
    private emitDateChange() {
        this.dateChange.emit({
            start: new moment(this.startDate.format()),
            end: new moment(this.endDate.format())
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
     * build period duration
     * call build hours
     * call set default width
     * call set today marker hour style
     */
    private buildPeriodDuration() {
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
    private buildDayHours(date) {
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
    private setRecordsEventStyle() {
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
    private setRecordsUnavailable() {
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
    private setPeriodUnit(value) {
        this.periodUnit = value;
        this.setDate(this.currentDate);
    }

    /**
     * zoom sheet cells in
     * reset the records event style
     * reset the today marker hour style
     */
    private zoomIn() {
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
    private zoomOut() {
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
    private resetZoom() {
        this.resetPeriodUnitWidth();
        this.setRecordsEventStyle();
        this.setTodayHourMarkerStyle();
        this.cdRef.detectChanges();
    }

    /**
     * reset the period unit width to default
     */
    private resetPeriodUnitWidth() {
        this.periodUnitWidth = this.defaultPeriodUnitWidth;
        this.periodTimelineWidth = this.defaultPeriodTimelineWidth;
    }

    /**
     * set the header date text by period unit
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
     * set the start and end date
     * build the period duration
     * set the header text
     * emit the date changes
     * @param date
     */
    private setDate(date = new moment()) {

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
    private toggleOpenPicker() {
        this.pickerIsOpen = !this.pickerIsOpen;
    }

    /**
     * set the today hour marker style
     */
    private setTodayHourMarkerStyle() {
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
    private emitEvent(record: RecordI, event?: EventI) {
        if (!!event) event.color = this.focusColor;
        this.focusedId = !!event || record.id == this.focusedId ? undefined : record.id;
        this.eventClick.emit({record, event});
    }
}
