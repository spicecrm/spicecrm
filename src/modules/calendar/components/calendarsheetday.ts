/**
 * @module ModuleCalendar
 */
import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {calendar} from '../services/calendar.service';

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'calendar-sheet-day',
    templateUrl: './src/modules/calendar/templates/calendarsheetday.html'
})

export class CalendarSheetDay implements OnChanges, AfterViewInit {

    @Output() public navigateweek: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef, static: true}) private calendarsheet: ViewContainerRef;
    @ViewChild('multieventscontainer', {
        read: ViewContainerRef,
        static: true
    }) private multiEventsContainer: ViewContainerRef;
    @ViewChild('headercontainer', {read: ViewContainerRef, static: true}) private headerContainer: ViewContainerRef;
    @Input() private setdate: any = {};
    @Input('userscalendars') private usersCalendars: any[] = [];
    @Input('othercalendars') private otherCalendars: any[] = [];
    @Input('googleisvisible') private googleIsVisible: boolean = true;
    private sheetTopMargin: number = 0;
    private sheetDay: any = {};
    private sheetHours: any[] = [];
    private ownerEvents: any[] = [];
    private ownerMultiEvents: any[] = [];
    private userEvents: any[] = [];
    private userMultiEvents: any[] = [];
    private otherEvents: any[] = [];
    private googleEvents: any[] = [];
    private googleMultiEvents: any[] = [];

    constructor(private language: language, private calendar: calendar) {
        this.buildHours();
    }

    get sheetStyle() {
        return {
            'height': 'calc(100% - ' + this.headerContainer.element.nativeElement.clientHeight + 'px)',
            'margin-top': '-1px'
        };
    }

    get isDashlet() {
        return this.calendar.isDashlet;
    }

    get offset() {
        return moment.tz(this.calendar.timeZone).format('z Z');
    }

    get sheetTimeWidth() {
        return this.calendar.sheetTimeWidth;
    }

    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
    }

    get allMultiEvents() {
        return this.ownerMultiEvents.concat(this.otherEvents, this.userMultiEvents, this.googleMultiEvents);
    }

    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    get endDate() {
        return new moment(this.startDate).add((this.calendar.endHour - this.calendar.startHour), 'h');
    }

    get dayTextContainerClass() {
        return this.isDashlet ? 'slds-grid slds-grid--vertical-align-center' : '';
    }

    get dayTextDayClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-body--regular';
    }

    get dateTextDateClass() {
        return this.isDashlet ? 'slds-text-heading--medium' : 'slds-text-heading--large';
    }

    public ngAfterViewInit() {
        this.calendarsheet.element.nativeElement.scrollTop = 8 * this.calendar.sheetHourHeight;
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.setdate) {
            this.sheetDay = {date: changes.setdate.currentValue};
            this.getEvents();
        }
        if (changes.usersCalendars || changes.setdate) {
            this.getUsersEvents();
        }
        if (changes.otherCalendars || changes.setdate) {
            this.getOtherEvents();
        }
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
        }
    }

    /*
    * @param index
    * @param item
    * @return index|item
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /*
    * @param index
    * @param item
    * @return index|item
    */
    private trackByFnHours(index, item) {
        return index;
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

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                }
            });
    }

    /*
    * @return void
    */
    private getGoogleEvents() {
        this.googleEvents = [];
        this.googleMultiEvents = [];
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
                }
            });
    }

    /*
    * @return void
    */
    private getUsersEvents() {
        this.userEvents = [];
        this.userMultiEvents = [];
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
                        }
                    });
                }
            });
    }

    /*
    * @return void
    */
    private getOtherEvents() {
        this.otherEvents = [];
        if (this.calendar.isMobileView) {
            return;
        }

        for (let calendar of this.calendar.otherCalendars) {
            if (!calendar.visible) {
                continue;
            }
            this.calendar.loadEvents(this.startDate.hour(0).minute(0).second(0), this.endDate.hour(23).minute(0).second(0), calendar.id, true)
                .subscribe(events => {
                    if (events.length > 0) {
                        events.forEach(event => {
                            event.color = calendar.color;
                            event.visible = calendar.visible;
                            this.otherEvents.push(event);
                        });
                    }
                });
        }
    }

    /*
    * filter the out of range events
    * @return void
    */
    private filterEvents(events) {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    /*
    * @param type
    * @return date format
    */
    private displayDate(type) {
        switch (type) {
            case 'day':
                return this.setdate.format('ddd');
            case 'date':
                return this.setdate.format(this.isDashlet ? 'D, MMMM' : 'D');
        }
    }

    /*
    * @param event
    * @return style
    */
    private getEventStyle(event): any {
        // get the day of the week
        let startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        let endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        let itemWidth = ((this.calendarsheet.element.nativeElement.clientWidth - this.sheetTimeWidth)) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        return {
            'left': (this.sheetTimeWidth + (itemWidth * event.displayIndex)) + 'px',
            'width': itemWidth + 'px',
            'top': (this.calendar.sheetHourHeight / 60 * startminutes) + 'px',
            'height': (this.calendar.sheetHourHeight / 60 * (endminutes - startminutes)) + 'px',
            'z-index': event.resizing ? 20 : 15,
            'border-bottom': event.resizing ? '1px dotted #fff' : 0
        };

    }

    /*
    * @param index
    * @return style
    */
    private getMultiEventStyle(index): any {
        let multiEvents = this.multiEventsContainer.element.nativeElement.getBoundingClientRect();
        return {
            height: this.calendar.multiEventHeight + "px",
            width: multiEvents.width + "px",
            top: (multiEvents.top + (this.calendar.multiEventHeight * index)) + "px",
            left: multiEvents.left + "px",
        };
    }

    /*
    * @return style
    */
    private getMultiEventsContainerStyle() {
        return {height: this.allMultiEvents.length > 0 ? (this.calendar.multiEventHeight * this.allMultiEvents.length) + 'px' : this.calendar.multiEventHeight + 'px'};
    }

    /*
    * @return style
    */
    private getTimeColStyle() {
        return {width: this.sheetTimeWidth + 'px'};
    }

    /*
    * @return style
    */
    private getDayColStyle() {
        return {width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'};
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
    * @return style
    */
    private isTodayStyle() {
        let today = new moment();
        let isToday = today.year() === this.setdate.year() && today.month() === this.setdate.month() && today.date() == this.setdate.date();
        return {
            color: isToday ? this.calendar.todayColor : 'inherit'
        };
    }

    /*
    * @param hour
    * @return style
    */
    private getHourDividerStyle(hour) {
        return {
            top: this.sheetTopMargin + this.calendar.sheetHourHeight * hour + 'px'
        };
    }

    /*
    * @param hour
    * @return style
    */
    private getHalfHourDividerStyle(hour) {
        return {
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour + this.calendar.sheetHourHeight / 2) + 'px',
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)'
        };
    }

    /*
    * @param hour
    * @return style
    */
    private getHourLabelStyle(hour) {
        return {
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour) + 'px',
            width: this.sheetTimeWidth + 'px'
        };
    }

    /*
    * @return style
    */
    private getDayDividerStyle() {
        return {
            left: this.sheetTimeWidth + 'px',
            top: '0px',
            height: (this.calendar.sheetHourHeight * this.sheetHours.length) + 'px'
        };
    }

    private gotoWeek() {
        this.navigateweek.emit();
    }

    /*
    * @param hour
    * @return style
    */
    private getDropTargetStyle(hour) {
        return {
            left: this.sheetTimeWidth + 'px',
            width: 'calc(100% - ' + this.sheetTimeWidth + 'px)',
            top: (this.sheetTopMargin + this.calendar.sheetHourHeight * hour) + 'px',
            height: this.calendar.sheetHourHeight + 'px'
        };
    }

    /*
    * @param hour
    * @return style
    */
    private notLastHour(hour) {
        return hour < this.sheetHours.length;
    }
}
