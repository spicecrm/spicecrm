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
    OnInit,
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
 * Display a sheet day view
 */
@Component({
    selector: 'calendar-sheet-day',
    templateUrl: '../templates/calendarsheetday.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarSheetDay implements OnChanges, OnInit, OnDestroy {
    /**
     * container reference for the main div
     */
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) public sheetContainer: ViewContainerRef;
    /**
     * children reference of the drop targets
     */
    @ViewChildren(CalendarSheetDropTarget) public dropTargets: QueryList<CalendarSheetDropTarget>;
    /**
     * day text container class to be set for day text when the calendar is used as dashlet
     */
    public dayTextContainerClass: string = '';
    /**
     * holds the day text class
     */
    public dayTextClass: string = 'slds-text-body--regular';
    /**
     * holds the date text class
     */
    public dateTextClass: string = 'slds-text-heading--large';
    /**
     * holds the sheet hours
     */
    public sheetHours: any[] = [];
    /**
     * holds the owner multi events
     */
    public ownerMultiEvents: any[] = [];
    /**
     * holds the google multi events
     */
    public groupwareMultiEvents: any[] = [];
    /**
     * the change date comes from the parent
     */
    @Input() public setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() public groupwareVisible: boolean = true;
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
     * holds the resize listener
     */
    public resizeListener: any;
    /**
     * subscription to handle unsubscribe
     */
    public subscription: Subscription = new Subscription();
    /**
     * active calendars
     */
    @Input() public availableCalendars: {id: string, visible: boolean}[] = [];

    constructor(public language: language,
                public cdRef: ChangeDetectorRef,
                public renderer: Renderer2,
                public calendar: calendar) {
        this.buildHours();
        this.subscribeToChanges();
    }

    /**
     * subscribe to user calendar changes
     * subscribe to resize event to reset the events style
     */
    public subscribeToChanges() {
        this.subscription.add(
            this.calendar.layoutChange$.subscribe(() => {
                this.setEventsStyle();
            })
        );
        this.subscription.add(this.calendar.userCalendarChange$.subscribe({
            next: calendar => {
                if (calendar.type == 'other') {
                    this.getOwnerEvents(calendar);
                } else {
                    this.getUserEvents(calendar);
                }
            }
        }));
        this.resizeListener = this.renderer.listen('window', 'resize', () =>
            this.setEventsStyle()
        );
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, groupwareEvents]
     */
    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.groupwareEvents));
    }

    /**
     * @return hour height style
     */
    get offset() {
        return moment.tz(this.calendar.timeZone).format('z Z');
    }

    /**
     * @return hour height style
     */
    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    /**
     * @return startDate: moment
     */
    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    /**
     * @return endDate: moment
     */
    get endDate() {
        return new moment(this.startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
    }

    /**
     * @return today style
     */
    get isTodayStyle() {
        let today = new moment();
        let isToday = today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date();
        return {
            color: isToday ? this.calendar.todayColor : 'inherit'
        };
    }

    /**
     * handle input changes to load events
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.getOwnerEvents();
            this.getUsersEvents();
        }
        if (changes.groupwareVisible || changes.setdate) {
            this.getGroupwareEvents();
        }
    }

    /**
     * set classes if the calendar is used as dashlet
     */
    public ngOnInit() {
        if (this.calendar.isDashlet) {
            this.dayTextContainerClass = 'slds-grid slds-grid--vertical-align-center';
            this.dayTextClass = 'slds-text-heading--medium';
            this.dateTextClass = 'slds-text-heading--medium';
        }
    }

    /**
     * unsubscribe from subscriptions
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
        if (this.resizeListener) {
            this.resizeListener();
        }
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
     * correct the start and end hours for the event preview
     * @param event
     * @return events
     */
    public adjustEvent(event) {
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
    }

    public adjustOtherUserEvent(event, userId: string) {
        this.adjustEvent(event);
        event.id = userId + event.id;
    }

    /**
     * load owner events from service and rearrange the multi events
     */
    public getOwnerEvents(calendar?) {

        if (!calendar) {
            this.ownerEvents = [];
            this.ownerMultiEvents = [];
        } else {
            this.ownerEvents = this.ownerEvents.filter(e => e.calendarId != calendar.id);
            this.ownerMultiEvents = this.ownerMultiEvents.filter(e => e.calendarId != calendar.id);
        }

        this.setEventsStyle();

        (calendar ? [calendar] : this.availableCalendars).forEach(calendar => {

            if (!calendar.visible) return;

            this.calendar.loadEvents(this.startDate, this.endDate, this.calendar.owner, calendar.id).subscribe(events => {
                if (events.length > 0) {
                    events = this.filterEvents(events);
                    events.forEach(event => this.adjustEvent(event));
                    this.ownerEvents = this.ownerEvents.concat(events.filter(event => !event.isMulti));
                    this.ownerMultiEvents = this.ownerMultiEvents.concat(events.filter(event => event.isMulti));
                    this.setEventsStyle();
                }
            });
        });
    }

    /**
     * load google events from service and rearrange the multi events
     */
    public getGroupwareEvents() {
        this.groupwareEvents = [];
        this.groupwareMultiEvents = [];
        if (!this.groupwareVisible || this.calendar.isMobileView) {
            return this.setEventsStyle();
        }

        this.calendar.loadGroupwareEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.filterEvents(events);
                    events.forEach(event => this.adjustEvent(event));
                    this.groupwareEvents = events.filter(event => !event.isMulti);
                    this.groupwareMultiEvents = events.filter(event => event.isMulti);
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load other user events from service and rearrange the multi events
     */
    public getUserEvents(calendar) {
        this.userEvents = this.userEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        this.userMultiEvents = this.userMultiEvents.filter(event => event.data.assigned_user_id != calendar.id &&
            (!event.data.meeting_user_status_accept || !event.data.meeting_user_status_accept.beans[calendar.id]));

        if (this.calendar.isMobileView || !calendar.visible) {
            return this.setEventsStyle();
        }

        this.calendar.loadEvents(this.startDate, this.endDate, calendar.id, calendar.id)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.filterEvents(events);
                    events.forEach(event => {
                        this.adjustOtherUserEvent(event, calendar.id);
                    });
                    events.forEach(event => {
                        if (!event.isMulti) {
                            this.userEvents.push(event);
                        } else {
                            this.userMultiEvents.push(event);
                        }
                    });
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
     */
    public getUsersEvents() {
        this.userEvents = [];
        this.userMultiEvents = [];
        this.setEventsStyle();

        if (this.calendar.isMobileView) return;

        const visibleUserCalendars = this.calendar.usersCalendars.filter(c => !!c.visible);

        if (visibleUserCalendars.length == 0) return;

        visibleUserCalendars.forEach(userCalendar =>
            this.getUserEvents(userCalendar)
        );
    }

    /**
     * filter the out of range events
     * @param events
     */
    public filterEvents(events): any {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour);
    }

    /**
     * display date by input format
     * @param type
     * @return date format
     */
    public displayDate(type) {
        switch (type) {
            case 'weekday':
                return (typeof this.setdate.format('d') === 'string' ? parseInt(this.setdate.format('d'), 10) : this.setdate.format('d'));
            case 'day':
                return this.setdate.format('ddd');
            case 'date':
                return this.setdate.format(this.calendar.isDashlet ? 'D, MMMM' : 'D');
        }
    }

    /**
     * build sheet hours
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
     * set all events style
     */
    public setEventsStyle() {
        this.allEvents.forEach(event => {
                const startMinutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
                const endMinutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
                const itemWidth = ((this.sheetContainer.element.nativeElement.clientWidth - this.sheetTimeWidth)) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
                event.style = {
                    'left': (this.sheetTimeWidth + (itemWidth * event.displayIndex)) + 'px',
                    'width': itemWidth + 'px',
                    'top': (((this.calendar.sheetHourHeight / 60 * startMinutes)) - 1) + 'px',
                    'height': (this.calendar.sheetHourHeight / 60 * (endMinutes - startMinutes)) + 'px',
                    'min-height': this.calendar.multiEventHeight + 'px'
                };
            }
        );
        this.cdRef.detectChanges();
    }

    /**
     * @param dragEvent: CdkDragEnd
     * call calendar.onEventDrop and pass the dropTargets reference for this sheet
     */
    public onEventDrop(dragEvent: CdkDragEnd) {
        this.calendar.onEventDrop(dragEvent, this.dropTargets);
    }
}
