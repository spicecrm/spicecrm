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
 * @module ModuleCalendar
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';
import {CdkDragEnd} from "@angular/cdk/drag-drop";
import {CalendarSheetDropTarget} from "./calendarsheetdroptarget";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in week view
 */
@Component({
    selector: 'calendar-sheet-week',
    templateUrl: './src/modules/calendar/templates/calendarsheetweek.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetWeek implements OnChanges, OnDestroy {
    /**
     * holds the sheet days moment object
     */
    public sheetDays: any[] = [];
    /**
     * holds sheet hours
     */
    protected sheetHours: any[] = [];
    /**
     * children reference of the drop targets
     */
    @ViewChildren(CalendarSheetDropTarget) protected dropTargets: QueryList<CalendarSheetDropTarget>;
    /**
     * container reference for the main div
     */
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) protected sheetContainer: ViewContainerRef;
    /**
     * element reference for the scrollbar
     */
    @ViewChild('scrollContainer', {read: ViewContainerRef, static: true}) protected scrollContainer: ViewContainerRef;
    /**
     * the change date comes from the parent
     */
    @Input() protected setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() protected googleIsVisible: boolean = true;
    /**
     * holds the owner multi events
     */
    protected ownerMultiEvents: any[] = [];
    /**
     * holds the google multi events
     */
    protected googleMultiEvents: any[] = [];
    /**
     * holds the owner events
     */
    private ownerEvents: any[] = [];
    /**
     * holds the users events
     */
    private userEvents: any[] = [];
    /**
     * holds the users multi events
     */
    private userMultiEvents: any[] = [];
    /**
     * holds the google events
     */
    private googleEvents: any[] = [];
    /**
     * subscription to handle unsubscribe
     */
    private subscription: Subscription = new Subscription();
    /**
     * holds the resize listener
     */
    private resizeListener: any;

    constructor(public language: language,
                public cdRef: ChangeDetectorRef,
                private renderer: Renderer2,
                public calendar: calendar) {
        this.buildHours();
        this.buildSheetDays();
        this.subscribeToChanges();
    }

    /**
     * @return moment.timeZone
     */
    get offset() {
        return moment.tz(this.calendar.timeZone).format('z Z');
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, googleEvents]
     */
    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
    }

    /**
     * @return allEvents: [ownerMultiEvents, userMultiEvents, googleMultiEvents]
     */
    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.userMultiEvents, this.googleMultiEvents);
    }

    /**
     * @return sheetTimeWidth: number
     */
    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    /**
     * @return startDate: moment
     */
    get startDate() {
        return new moment(this.setdate).day(this.calendar.weekStartDay).hour(this.calendar.startHour).minute(0).second(0);
    }

    /**
     * @return endDate: moment
     */
    get endDate() {
        return new moment(this.startDate).add(moment.duration((this.calendar.weekDaysCount - 1), 'd')).hour(this.calendar.endHour);
    }

    /**
     * @return width: string
     */
    get dayWidthStyle() {
        return {width: `calc(100% / ${this.calendar.weekDaysCount})`};
    }

    /**
     * handle input changes to load events
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        this.buildSheetDays();
        if (changes.setdate) {
            this.getOwnerEvents();
            this.getUsersEvents();
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
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
     * build sheet days
     */
    public buildSheetDays() {
        this.sheetDays = [];
        let d = 0;
        let dayIndex = this.calendar.weekStartDay;

        while (d < this.calendar.weekDaysCount) {
            let focDate = new moment(this.setdate);
            focDate.day(dayIndex);
            this.sheetDays.push({
                index: d,
                date: moment(focDate),
                day: dayIndex,
                color: this.isToday(moment(focDate)) ? this.calendar.todayColor : '#000000',
                dateTextDayShort: moment(focDate).format('ddd'),
                dateTextDayNumber: moment(focDate).format('D'),
                items: []
            });
            d++;
            dayIndex++;
        }
    }

    /**
     * set all events style
     */
    public setEventsStyle() {
        this.allEvents.forEach(event =>
            this.setEventStyle(event)
        );
        this.cdRef.detectChanges();
    }

    /**
     * @param event: object
     * @return style: object
     */
    public setEventStyle(event) {
        const startday = this.calendar.weekStartDay == 1 && event.start.day() == 0 ? 6 : event.start.day() - this.calendar.weekStartDay;
        const startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        const endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const itemWidth = ((sheetWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        const left = this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount * startday) + (itemWidth * event.displayIndex);
        const top = this.calendar.sheetHourHeight / 60 * startminutes;
        const height = this.calendar.sheetHourHeight / 60 * (endminutes - startminutes);

        event.style = {
            'left': left + 'px',
            'width': itemWidth + 'px',
            'top': top + 'px',
            'height': height + 'px',
            'min-height': this.calendar.multiEventHeight + 'px'
        };
    }

    /**
     * set all multi events style
     */
    public setMultiEventsStyle() {
        this.allMultiEvents.forEach(event =>
            this.setMultiEventStyle(event)
        );
        this.cdRef.detectChanges();
    }

    /**
     * set multi event style
     * @param event: object
     * @return style: object
     */
    public setMultiEventStyle(event): any {
        let eventI = null;
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const multiEventsContainerWidth = (sheetWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount;
        const startDate = new moment(this.setdate).day(this.calendar.weekStartDay).hour(0).minute(0).second(0);
        const endDate = new moment(startDate).add(moment.duration(this.calendar.weekDaysCount, 'd'));
        const startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days') : 0);
        const endDateDifference = (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        const left = startDateDifference * multiEventsContainerWidth;
        const width = (this.calendar.weekDaysCount - (startDateDifference + endDateDifference)) * multiEventsContainerWidth;

        this.sheetDays.some(day => {
            if (day.events.indexOf(event) > -1) {
                eventI = day.events.indexOf(event);
                return true;
            }
        });
        event.style = {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: (this.calendar.multiEventHeight * eventI) + "px",
        };
    }

    /**
     * display date by input format
     * @param format
     * @param date
     * @return date formatted
     */
    public displayDate(format, date) {
        return date.format(format);
    }

    /**
     * @reset sheetHours
     * @build sheetHours
     * @set sheetHours
     */
    public buildHours() {
        this.sheetHours = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    /**
     * navigate to selected date
     * @param dayOfWeek: number
     */
    public gotoDay(dayOfWeek) {
        if (this.calendar.asPicker) return;
        this.calendar.gotToDayView(moment(dayOfWeek.format()));
    }

    /**
     * @param date: moment
     * @return color: string
     */
    protected isToday(date: any) {
        let today = new moment();
        return today.year() === date.year() && today.month() === date.month() && today.date() == date.date();
    }

    /**
     * subscribe to user calendar changes
     * subscribe to resize event to reset the events style
     */
    private subscribeToChanges() {
        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                if (calendar.id == 'owner') {
                    this.getOwnerEvents();
                } else {
                    this.getUserEvents(calendar);
                }
            })
        );
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.setEventsStyle();
            this.setMultiEventsStyle();
        });
    }

    /**
     * sort allMultiEvents
     */
    private arrangeMultiEvents() {

        this.sheetDays.forEach(day => day.events = []);

        for (let event of this.allMultiEvents) {
            for (let day of this.sheetDays) {
                for (let eventDay = moment(event.start); eventDay.diff(event.end) <= 0; eventDay.add(1, 'days')) {
                    if (eventDay.date() == day.date.date() && !day.events.some(itemsEvent => itemsEvent.id == event.id)) {
                        day.events.push(event);
                    }
                }
            }
        }
        this.sheetDays.forEach(day => {
            day.events = day.events.filter(event => (event.hasOwnProperty("visible") && event.visible) || !event.hasOwnProperty("visible"));
            day.events.sort((a, b) => {
                if (a.start.isBefore(b.start)) {
                    return -1;
                } else if (a.start.diff(a.end, 'days') < b.start.diff(b.end, 'days')) {
                    return -1;
                }
                return 0;
            });
        });
        this.allMultiEvents.forEach(event => {
            let itemIdx = null;
            this.sheetDays.forEach(day => {
                day.events.forEach((item, idx) => {
                    if (item.id == event.id) {
                        if (itemIdx != null && event.end.diff(event.start, 'days') > 0) {
                            day.events.splice(idx, 1);
                            day.events.splice(itemIdx, 0, event);
                        } else {
                            itemIdx = idx;
                        }
                    }
                });
            });
        });
    }

    /**
     * correct the start and end hours for the event preview
     * @return events
     */
    private correctHours(events) {
        events.map(event => {
            if (!event.isMulti) {
                let endInRange = event.end.hour() > this.calendar.startHour && event.start.hour() < this.calendar.startHour;
                let startInRange = event.start.hour() < this.calendar.endHour && event.end.hour() > this.calendar.endHour;
                if (endInRange) {
                    event.start = event.start.hour(this.calendar.startHour).minute(0);
                }
                if (startInRange) {
                    event.end = event.end.hour(this.calendar.endHour).minute(59);
                }
            }
        });
        return events;
    }

    /**
     * load owner events from service and rearrange the multi events
     */
    private getOwnerEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];
        this.arrangeMultiEvents();

        if (!this.calendar.ownerCalendarVisible) return this.cdRef.detectChanges();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                    this.arrangeMultiEvents();
                    this.setEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    private getGoogleEvents() {
        this.googleEvents = [];
        this.googleMultiEvents = [];
        this.arrangeMultiEvents();
        if (!this.googleIsVisible || this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadGoogleEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.googleEvents = events.filter(event => !event.isMulti);
                    this.googleMultiEvents = events.filter(event => event.isMulti);
                    this.arrangeMultiEvents();
                    this.setEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.userMultiEvents = this.userMultiEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));
        this.arrangeMultiEvents();

        if (this.calendar.isMobileView || !calendar.visible) {
            return this.cdRef.detectChanges();
        }

        this.calendar.loadUserEvents(this.startDate, this.endDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    events.forEach(event => {
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                            this.arrangeMultiEvents();
                        }
                    });
                    this.setEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
     */
    private getUsersEvents() {
        this.userEvents = [];
        this.userMultiEvents = [];
        this.arrangeMultiEvents();
        if (this.calendar.isMobileView) {
            return;
        }

        this.calendar.loadUsersEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    events.forEach(event => {
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                            this.arrangeMultiEvents();
                        }
                    });
                    this.setEventsStyle();
                    this.setMultiEventsStyle();
                }
            });

    }

    /**
     * filter the out of range events or the absence events
     * @return events
     */
    private filterEvents(events) {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    /**
     * @param dragEvent: CdkDragEnd
     * call calendar.onEventDrop and pass the dropTargets reference for this sheet
     */
    private onEventDrop(dragEvent: CdkDragEnd) {
        this.calendar.onEventDrop(dragEvent, this.dropTargets);
    }
}
