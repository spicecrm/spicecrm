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
    templateUrl: './src/modules/calendar/templates/calendarsheetday.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarSheetDay implements OnChanges, OnInit, OnDestroy {
    /**
     * container reference for the main div
     */
    @ViewChild('sheetContainer', {read: ViewContainerRef, static: true}) protected sheetContainer: ViewContainerRef;
    /**
     * children reference of the drop targets
     */
    @ViewChildren(CalendarSheetDropTarget) protected dropTargets: QueryList<CalendarSheetDropTarget>;
    /**
     * day text container class to be set for day text when the calendar is used as dashlet
     */
    private dayTextContainerClass: string = '';
    /**
     * holds the day text class
     */
    private dayTextClass: string = 'slds-text-body--regular';
    /**
     * holds the date text class
     */
    private dateTextClass: string = 'slds-text-heading--large';
    /**
     * holds the sheet hours
     */
    protected sheetHours: any[] = [];
    /**
     * holds the owner multi events
     */
    protected ownerMultiEvents: any[] = [];
    /**
     * holds the google multi events
     */
    protected googleMultiEvents: any[] = [];
    /**
     * the change date comes from the parent
     */
    @Input() private setdate: any = {};
    /**
     * holds a boolean of google events visibility
     */
    @Input() private googleIsVisible: boolean = true;
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
     * holds the resize listener
     */
    private resizeListener: any;
    /**
     * subscription to handle unsubscribe
     */
    private subscription: Subscription = new Subscription();

    constructor(private language: language,
                private cdRef: ChangeDetectorRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.buildHours();
        this.subscribeToChanges();
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
        this.resizeListener = this.renderer.listen('window', 'resize', () =>
            this.setEventsStyle()
        );
    }

    /**
     * @return allEvents: [ownerEvents, userEvents, googleEvents]
     */
    get allEvents() {
        return this.calendar.arrangeEvents(this.ownerEvents.concat(this.userEvents, this.googleEvents));
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
        if (changes.googleIsVisible || changes.setdate) {
            this.getGoogleEvents();
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
    private trackByItemFn(index, item) {
        return item.id;
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
     * correct the start and end hours for the event preview
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

    /**
     * load owner events from service and rearrange the multi events
     */
    private getOwnerEvents() {
        this.ownerEvents = [];
        this.ownerMultiEvents = [];

        if (!this.calendar.ownerCalendarVisible) return this.cdRef.detectChanges();

        this.calendar.loadEvents(this.startDate, this.endDate)
            .subscribe(events => {
                if (events.length > 0) {
                    events = this.correctHours(events);
                    events = this.filterEvents(events);
                    this.ownerEvents = events.filter(event => !event.isMulti);
                    this.ownerMultiEvents = events.filter(event => event.isMulti);
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load google events from service and rearrange the multi events
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
                    this.setEventsStyle();
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
                        }
                    });
                    this.setEventsStyle();
                }
            });
    }

    /**
     * load other users events from service and rearrange the multi events
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
                    this.setEventsStyle();
                }
            });
    }

    /**
     * filter the out of range events or the absence events
     * @param events
     */
    private filterEvents(events): any {
        return events.filter(event => event.end.hour() > this.calendar.startHour || event.start.hour() < this.calendar.endHour || ('absence' == event.type));
    }

    /**
     * display date by input format
     * @param type
     * @return date format
     */
    private displayDate(type) {
        switch (type) {
            case 'day':
                return this.setdate.format('ddd');
            case 'date':
                return this.setdate.format(this.calendar.isDashlet ? 'D, MMMM' : 'D');
        }
    }

    /**
     * build sheet hours
     */
    private buildHours() {
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
    private setEventsStyle() {
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
    private onEventDrop(dragEvent: CdkDragEnd) {
        this.calendar.onEventDrop(dragEvent, this.dropTargets);
    }
}
