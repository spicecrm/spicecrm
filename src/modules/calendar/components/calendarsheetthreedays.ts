/**
 * @module ModuleCalendar
 */
import {
    Component,
    EventEmitter,
    Input,
    OnChanges, OnDestroy,
    Output, QueryList,
    SimpleChanges,
    ViewChild, ViewChildren,
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

@Component({
    selector: 'calendar-sheet-three-days',
    templateUrl: './src/modules/calendar/templates/calendarsheetthreedays.html'
})
export class CalendarSheetThreeDays implements OnChanges, OnDestroy {

    public sheetDays: any[] = [];
    protected sheetHours: any[] = [];
    @ViewChildren(CalendarSheetDropTarget) private dropTargets: QueryList<CalendarSheetDropTarget>;
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) private sheetContainer: ViewContainerRef;
    @ViewChild('scrollcontainer', {read: ViewContainerRef, static: true}) private scrollContainer: ViewContainerRef;
    /**
     * @Input setdate: moment
     */
    @Input() private setdate: any = {};
    /**
     * @Input usersCalendars: {id: string, name: string, visible: boolean, color: string}
     */
    @Input('userscalendars') private usersCalendars: any[] = [];
    /**
     * @Input googleIsVisible: boolean
     */
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    /**
     * @output navigateday: EventEmitter<moment>
     */
    @Output() private navigateday: EventEmitter<any> = new EventEmitter<any>();

    private ownerEvents: any[] = [];
    private ownerMultiEvents: any[] = [];
    private userEvents: any[] = [];
    private userMultiEvents: any[] = [];
    private googleEvents: any[] = [];
    private googleMultiEvents: any[] = [];
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private calendar: calendar) {
        this.buildHours();
        this.sheetDays = this.buildSheetDays();

        this.subscription.add(this.calendar.userCalendarVisibility$.subscribe(calendar => {
                this.getUserEvents(calendar);
            })
        );
        this.subscription.add(this.calendar.usersCalendarsLoad$.subscribe(() => {
                this.getUsersEvents();
            })
        );
    }

    get offset() {
        return moment.tz(this.calendar.timeZone).format('z Z');
    }

    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    get isDashlet() {
        return this.calendar.isDashlet;
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
    }

    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.userMultiEvents, this.googleMultiEvents);
    }

    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    get endDate() {
        return new moment(this.startDate).add(moment.duration(2, 'd')).hour(this.calendar.endHour);
    }

    get dayTextContainerClass() {
        return this.isDashlet ? 'slds-grid slds-grid--vertical-align-center' : '';
    }

    get dayTextClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-body--regular';
    }

    get dateTextClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-heading--large';
    }

    get timeColStyle() {
        return {
            width: this.sheetTimeWidth + 'px'
        };
    }

    get hourHeightStyle() {
        return {height: this.calendar.sheetHourHeight + 'px'};
    }

    get dayWidthStyle() {
        return {width: `calc(100% / ${this.calendar.weekDaysCount})`};
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.sheetDays = this.buildSheetDays();
        if (changes.setdate) {
            this.getEvents();
            if (this.calendar.usersCalendarsLoaded) {
                this.getUsersEvents();
            }
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /*
    * @param index
    * @param item
    * @return item.id
    */
    private trackByItemFn(index, item) {
        return item.id;
    }

    /*
    * @param index
    * @param item
    * @return index
    */
    private trackByIndexFn(index, item) {
        return index;
    }

    /*
    * @return void
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

    /*
    * @param events
    * @return events
    */
    private correctHours(events) {
        events.forEach(event => {
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

    /*
    * @return void
    */
    private getEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];
        this.arrangeMultiEvents();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                    this.arrangeMultiEvents();
                }
            });
    }

    /*
    * @return void
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
                }
            });
    }

    /*
    * @return void
    */
    private getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id);
        this.userMultiEvents = this.userMultiEvents.filter(event => event.data.assigned_user_id != calendar.id);
        this.arrangeMultiEvents();

        if (this.calendar.isMobileView || !calendar.visible) {
            return;
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
                }
            });
    }

    /*
    * @return void
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
                }
            });
    }

    /*
    * filter the out of range events
    * @return void
    */
    private filterEvents(events, type?) {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    /*
    * @return sheetDays
    */
    private buildSheetDays() {
        let sheetDays = [];
        let d = 0;
        while (d < 3) {
            let focDate = new moment(this.setdate);
            focDate = focDate.add(d, 'days');
            sheetDays.push({index: d, date: moment(focDate), day: moment(focDate).day(), items: []});
            d++;
        }
        return sheetDays;
    }

    /*
    * @param date
    * @return style
    */
    private isTodayStyle(date) {
        let today = new moment();
        let isToday = today.year() === date.year() && today.month() === date.month() && today.date() == date.date();
        return {
            color: isToday ? this.calendar.todayColor : 'inherit'
        };
    }

    /*
    * @param event
    * @return style
    */
    private getEventStyle(event) {
        const day = this.buildSheetDays().find(day => day.day == event.start.day()) || 0;
        const startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        const endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const itemWidth = ((sheetWidth - this.sheetTimeWidth) / 3) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        const left = this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / 3 * day.index) + (itemWidth * event.displayIndex);
        const top = this.calendar.sheetHourHeight / 60 * startminutes;
        const height = this.calendar.sheetHourHeight / 60 * (endminutes - startminutes);

        return {
            left: left + 'px',
            width: itemWidth + 'px',
            top: top + 'px',
            height: height + 'px'
        };
    }

    /*
    * @param event
    * @return style
    */
    private getMultiEventStyle(event): any {
        let eventI = null;
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const multiEventsContainerWidth = (sheetWidth - this.sheetTimeWidth) / 3;
        const startDate = new moment(this.setdate).hour(0).minute(0).second(0);
        const endDate = new moment(startDate).add(moment.duration(3, 'd'));
        const startDateDifference = ((+event.start.diff(startDate, 'days') > 0) ? +event.start.diff(startDate, 'days') : 0);
        const endDateDifference = (+event.end.diff(endDate, 'days') > 0) ? 0 : Math.abs(+event.end.diff(endDate, 'days'));
        const left = startDateDifference * multiEventsContainerWidth;
        const width = (3 - (startDateDifference + endDateDifference)) * multiEventsContainerWidth;

        this.sheetDays.some(day => {
            if (day.events.indexOf(event) > -1) {
                eventI = day.events.indexOf(event);
                return true;
            }
        });
        return {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: (this.calendar.multiEventHeight * eventI) + "px",
        };
    }

    /*
    * @param event
    * @return style
    */
    private getMultiEventsContainerStyle() {
        let eventsHeight = 1;
        for (let day of this.sheetDays) {
            eventsHeight = day.events.length > eventsHeight ? day.events.length : eventsHeight;
        }
        return {height: (this.calendar.multiEventHeight * eventsHeight) + 'px'};
    }

    /*
    * @param format
    * @param date
    * @return date format
    */
    private displayDate(type, date) {
        switch (type) {
            case 'day':
                return date.format('ddd');
            case 'date':
                return date.format(this.isDashlet ? 'D, MMM' : 'D');
        }
    }

    /*
    * @return style
    */
    private getDaysContainerStyle() {
        let scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        return {
            width: (sheetWidth - this.sheetTimeWidth) + 'px'
        };
    }

    /*
    * @return void
    */
    private buildHours() {
        this.sheetHours = [];
        let i = this.calendar.startHour;
        while (i <= this.calendar.endHour) {
            this.sheetHours.push(i);
            i++;
        }
    }

    /*
    * @param dow day
    * @return void
    */
    private gotoDay(dow) {
        if (this.calendar.asPicker) {
            return;
        }
        let navigateDate = moment(dow);
        this.navigateday.emit(navigateDate);
    }

    /**
     * @param dragEvent: CdkDragEnd
     * @call calendar.onEventDrop and pass the dropTargets reference for this sheet
     */
    private onEventDrop(dragEvent: CdkDragEnd) {
        this.calendar.onEventDrop(dragEvent, this.dropTargets);
    }
}
