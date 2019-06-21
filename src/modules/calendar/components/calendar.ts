/**
 * @module ModuleCalendar
 */
import {AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';
import {Subscription} from "rxjs";
import {CalendarHeader} from "./calendarheader";

/**
* @ignore
*/
declare var moment: any;
/**
* @ignore
*/
declare var _: any;

@Component({
    selector: 'calendar',
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar]
})

export class Calendar implements AfterViewInit, OnDestroy {
    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public googleIsVisible: boolean = true;
    @ViewChild('calendarcontainer', {read: ViewContainerRef, static: false}) private calendarContainer: ViewContainerRef;
    @ViewChild('calendarcontent', {read: ViewContainerRef, static: false}) private calendarcontent: ViewContainerRef;
    @ViewChild(CalendarHeader, {static: false}) private calendarHeader: CalendarHeader;
    private subscriptions: Subscription = new Subscription();
    private touchStartListener: any;
    private touchMoveListener: any;
    private resizeListener: any;
    private xDown: number = null;
    private yDown: number = null;
    private self: any = {};

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        let usersSubscriber = this.calendar.usersCalendars$.subscribe(res => this.usersCalendars = res);
        this.subscriptions.add(usersSubscriber);
        let otherSubscriber = this.calendar.otherCalendars$.subscribe(res => this.otherCalendars = res);
        this.subscriptions.add(otherSubscriber);

        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
        });
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
    }

    get isMobileView() {
        return this.calendar.isMobileView;
    }

    get sheetType() {
        return this.calendar.sheetType;
    }

    get sidebarWidth() {
        return this.calendar.sidebarWidth;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    set asPicker(value) {
        if (value) {
            this.calendar.sheetType = 'Three_Days';
            this.calendar.asPicker = value;
        } else {
            this.closeModal();
        }
    }

    get sidebarStyle() {
        return {
            'width': this.calendar.sidebarwidth + 'px',
            'z-index': 1,
        };
    }

    get mainContainerClass() {
        return !this.asPicker ? 'slds-theme--default' : 'slds-modal slds-fade-in-open slds-modal_large';
    }

    get sheetStyle() {
        return {
            width: `calc(100% - ${this.sidebarWidth}px)`,
            height: '100%',
        };
    }

    public ngAfterViewInit() {
        setTimeout(() => this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768, 10);
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();

        if (this.resizeListener) {
            this.resizeListener();
        }
        if (this.touchStartListener) {
            this.touchStartListener();
        }
    }

    private handleUntiDate(event) {
        this.calendarHeader.scheduleUntilDate = event;
    }

    private setDateChanged(event) {
        this.calendarHeader.toggleClosed();
        this.calendar.calendarDate = new moment(event);
        this.calendar.refresh();
    }

    private handleGoogleIsVisible(value) {
        this.googleIsVisible = value;
    }

    private gotToDayView(date) {
        this.calendar.calendarDate = new moment(date);
        this.calendar.refresh();
        this.calendar.sheetType = 'Day';
    }

    private closeModal() {
        this.self.destroy();
    }

    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    private handleTouchMove(evt) {
        this.touchMoveListener();

        if (!this.xDown || !this.yDown) {
            return;
        }
        let xDiff = this.xDown - evt.touches[0].clientX;

        if (Math.abs(xDiff) > Math.abs(this.yDown - evt.touches[0].clientY)) {
            if (xDiff < 0) {
                this.calendar.shiftMinus();
            } else {
                this.calendar.shiftPlus();
            }
        }
        this.xDown = null;
        this.yDown = null;
    }
}