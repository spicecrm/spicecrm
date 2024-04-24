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
import {asapScheduler, Subscription} from "rxjs";
import {navigation} from "../../../services/navigation.service";
import {navigationtab} from "../../../services/navigationtab.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in week view
 */
@Component({
    selector: 'calendar-sheet-week',
    templateUrl: '../templates/calendarsheetweek.html',
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
    public sheetHours: any[] = [];
    /**
     * children reference of the drop targets
     */
    @ViewChildren(CalendarSheetDropTarget) public dropTargets: QueryList<CalendarSheetDropTarget>;
    /**
     * container reference for the main div
     */
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) public sheetContainer: ViewContainerRef;
    /**
     * element reference for the scrollbar
     */
    @ViewChild('scrollContainer', {read: ViewContainerRef, static: true}) public scrollContainer: ViewContainerRef;
    /**
     * the change date comes from the parent
     */
    @Input() public setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() public groupwareVisible: boolean = true;
    /**
     * holds the owner multi events
     */
    public ownerMultiEvents: any[] = [];
    /**
     * holds the google multi events
     */
    public groupwareMultiEvents: any[] = [];
    /**
     * holds the owner events
     */
    public ownerEvents: any[] = [];
    /**
     * holds the users events
     */
    public userEvents: any[] = [];
    /**
     * holds the users multi events
     */
    public userMultiEvents: any[] = [];
    /**
     * holds the google events
     */
    public groupwareEvents: any[] = [];
    /**
     * holds the second day date for the single events that end on the next day
     */
    public nextDaySingleEvents = {ownerEvents: {}, userEvents: {}, groupwareEvents: {}};
    /**
     * subscription to handle unsubscribe
     */
    public subscription: Subscription = new Subscription();
    /**
     * holds the resize listener
     */
    public resizeListener: any;

    constructor(public language: language,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2,
                private navigation: navigation,
                private navigationTab: navigationtab,
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
     * @return allEvents: [ownerMultiEvents, userMultiEvents, groupwareMultiEvents]
     */
    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.userMultiEvents, this.groupwareMultiEvents);
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
        if (changes.groupwareVisible || changes.setdate) {
            this.getGroupwareEvents();
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
    public setSingleEventsStyle() {
        this.calendar.arrangeEvents(this.ownerEvents.concat(
            this.userEvents,
            this.groupwareEvents,
            Object.values(this.nextDaySingleEvents.ownerEvents),
            Object.values(this.nextDaySingleEvents.userEvents),
            Object.values(this.nextDaySingleEvents.groupwareEvents),
        )).forEach(event =>
            this.setSingleEventStyle(event)
        );
        this.cdRef.detectChanges();
    }

    /**
     * @param event: object
     * @return style: object
     */
    public setSingleEventStyle(event) {
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
        let eventI = event.sequence -1;
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const multiEventsContainerWidth = (sheetWidth - this.sheetTimeWidth) / this.calendar.weekDaysCount;
        const weekStartDate = moment(moment(this.setdate).day(this.calendar.weekStartDay).hour(0).format('YYYY-MM-DD HH:00:00'));
        const weekEndDate = moment(moment(weekStartDate).add(moment.duration(this.calendar.weekDaysCount, 'd')).hour(this.calendar.endHour));
        const eventStart = event.start.isBefore(weekStartDate) ? weekStartDate : event.start;
        const eventEnd = event.end.isAfter(weekEndDate) ? weekEndDate : event.end;
        const startDateDifference = ((+event.start.diff(weekStartDate, 'days') > 0) ? +event.start.diff(weekStartDate, 'days') : 0);
        const left = startDateDifference * multiEventsContainerWidth;
        const max = this.calendar.weekDaysCount - startDateDifference;
        const eventLength = Math.abs(eventEnd.diff(eventStart, 'days')) + (eventEnd.hour() > eventStart.hour() || eventEnd.minute() > eventStart.minute() ? 1 : 0);
        const width = (eventLength > max ? max : eventLength) * multiEventsContainerWidth;

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
    public isToday(date: any) {
        let today = new moment();
        return today.year() === date.year() && today.month() === date.month() && today.date() == date.date();
    }

    /**
     * subscribe to user calendar changes
     * subscribe to resize event to reset the events style
     */
    public subscribeToChanges() {
        this.subscription.add(
            this.calendar.layoutChange$.subscribe(() => {
                this.buildSheetDays();
                this.arrangeMultiEvents();
                this.setSingleEventsStyle();
                this.setMultiEventsStyle();
            })
        );

        this.subscription.add(
            this.navigation.activeTab$.subscribe(tabId => {

                if (this.navigationTab.objecttab.id != tabId) return;

                // wait until the tab is visible and the reset the events styles
                asapScheduler.schedule(() => {
                    this.arrangeMultiEvents();
                    this.setSingleEventsStyle();
                    this.setMultiEventsStyle();
                }, 100);
            })
        );

        this.subscription.add(this.calendar.userCalendarChange$.subscribe(calendar => {
                if (calendar.id == 'owner') {
                    this.getOwnerEvents();
                } else {
                    this.getUserEvents(calendar);
                }
            })
        );
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.setSingleEventsStyle();
            this.setMultiEventsStyle();
        });
    }


    /**
     * get event days difference
     * @private
     * @param start
     * @param end
     * @param isAllDay
     */
    private getDaysDiff(start, end, isAllDay: boolean): number {

        let eventDaysDiff = Math.ceil(end.diff(start, 'day', true).toFixed(1));

        if (!isAllDay && eventDaysDiff > 0 && end.hour() == 0 && end.minute() == 0) {
            eventDaysDiff--;
        }

        return eventDaysDiff;
    }

    /**
     * sort allMultiEvents
     */
    public arrangeMultiEvents() {


        const daysIndices = {};
        this.sheetDays.forEach(d => daysIndices[d.date.date()] = d.index);

        const multiEvents = this.allMultiEvents.sort((a, b) => a.start.isBefore(b.start) ? -1 : 1)
            .sort((a, b) => a.end.diff(a.start, 'day') > b.end.diff(b.start, 'day') && a.start.isSameOrBefore(b.start, 'day') ? -1 : 1);

        this.sheetDays.forEach(day => day.events = []);

        multiEvents.forEach(event => {

            delete event.sequence;

            const daysDiff = this.getDaysDiff(event.start, event.end, event.isAllDay);
            Array.from({length: daysDiff +1}, (_, i) => moment(event.start).add(i, 'days'))
                .forEach(eventDay => {
                    const day = this.sheetDays[daysIndices[eventDay.date()]];

                    if (!day) return;

                    if (isNaN(event.sequence)) {
                        event.sequence = day.events.sort((a, b) => a.sequence > b.sequence ? 1 : -1).reduce((acc, e) => acc +1 == e.sequence ? acc + 1 : acc, 0) + 1;
                    }

                    day.events.push(event);
                });
            for (let day of this.sheetDays) {
                for (let eventDay = moment(event.start); eventDay.diff(event.end, 'days') <= -1; eventDay.add(1, 'days')) {
                    if (eventDay.date() == day.date.date() && !day.events.some(itemsEvent => itemsEvent.id == event.id)) {
                        day.events.push(event);
                    }
                }
            }
        });

        this.cdRef.detectChanges();
    }

    /**
     * generate the next day single events to for display style
     * @param key
     * @private
     */
    private generateNextDaySingleEvents(key: string) {
        this[key].forEach(event => {

            if (event.isMulti || event.start.date() == event.end.date()) return;

            // set the next day end before correction
            const nextDayEnd = moment(event.end);

            // if the event starts before the first displayed day correct the date
            if (event.start.isBefore(this.sheetDays[0].date, 'day')) {
                event.start.date(this.sheetDays[0].date.date()).hour(this.calendar.startHour).minute(0);
            } else {
                // update the event end hour to the end of the day only if the event starts after the beginning of the first day
                event.end.date(event.start.date()).hour(this.calendar.endHour + 1).minute(0);

            }

            this.nextDaySingleEvents[key][event.id + '_next'] = {
                id: event.id + '_next',
                start: moment(event.start).add(1, 'day').hour(this.calendar.startHour).minute(0),
                end: nextDayEnd,
            };

        });
    }

    /**
     * load owner events from service and rearrange the multi events
     */
    public getOwnerEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];
        this.nextDaySingleEvents.ownerEvents = [];
        this.arrangeMultiEvents();

        if (!this.calendar.ownerCalendarVisible) return this.setSingleEventsStyle();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                    this.generateNextDaySingleEvents('ownerEvents');
                    this.arrangeMultiEvents();
                    this.setSingleEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    public getGroupwareEvents() {
        this.groupwareEvents = [];
        this.nextDaySingleEvents.groupwareEvents = [];
        this.groupwareMultiEvents = [];
        this.arrangeMultiEvents();
        if (!this.groupwareVisible || this.calendar.isMobileView) {
            return this.setSingleEventsStyle();
        }

        this.calendar.loadGroupwareEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    this.groupwareEvents = events.filter(event => !event.isMulti);
                    this.groupwareMultiEvents = events.filter(event => event.isMulti);
                    this.generateNextDaySingleEvents('groupwareEvents');
                    this.arrangeMultiEvents();
                    this.setSingleEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    public getUserEvents(calendar) {

        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.nextDaySingleEvents.userEvents = {};
        this.generateNextDaySingleEvents('userEvents');

        this.userMultiEvents = this.userMultiEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.arrangeMultiEvents();

        if (this.calendar.isMobileView || !calendar.visible) {
            return this.setSingleEventsStyle();
        }

        this.calendar.loadUserEvents(this.startDate, this.endDate, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                        }
                    });
                    this.generateNextDaySingleEvents('userEvents');
                    this.arrangeMultiEvents();
                    this.setSingleEventsStyle();
                    this.setMultiEventsStyle();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
     */
    public getUsersEvents() {
        this.userEvents = [];
        this.nextDaySingleEvents.userEvents = {};
        this.userMultiEvents = [];
        this.arrangeMultiEvents();
        if (this.calendar.isMobileView) {
            return this.setSingleEventsStyle();
        }

        this.calendar.loadUsersEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events.forEach(event => {
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                        }
                    });
                    this.generateNextDaySingleEvents('userEvents');
                    this.arrangeMultiEvents();
                    this.setSingleEventsStyle();
                    this.setMultiEventsStyle();
                }
            });

    }

    /**
     * @param dragEvent: CdkDragEnd
     * call calendar.onEventDrop and pass the dropTargets reference for this sheet
     */
    public onEventDrop(dragEvent: CdkDragEnd) {
        this.calendar.onEventDrop(dragEvent, this.dropTargets);
    }
}
