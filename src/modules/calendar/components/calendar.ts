import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output, Renderer2,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar',
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar],
    styles: [`
        /* Scrollbar */
        /* width */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        /* Track */
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }

        /* Handle */
        ::-webkit-scrollbar-thumb {
            background: #aaa;
        }

        /* Handle on hover */
        ::-webkit-scrollbar-thumb:hover {
            background: #888;
        }
    `]
})

export class Calendar implements AfterViewInit, OnDestroy {
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;
    touchStartListener: any = {};
    touchMoveListener: any = {};
    xDown: number = null;
    yDown: number = null;
    private resizeListener: any;
    public usersCalendars: any[] = [];
    public otherCalendars: any[] = [];
    public openPicker: boolean = false;
    public googleIsVisible: boolean = true;
    public scheduleUntilDate: any = {};
    private showTypeSelector: boolean = false;
    private sheetType: string = 'Week';
    private self: any = {};
    private duration: any = {
        Day: 'd',
        Three_Days: 'd',
        Week: 'w',
        Month: 'M',
        Schedule: 'M',
    };

    constructor(private language: language,
                private navigation: navigation,
                private elementRef: ElementRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        this.calendarDate = new moment();
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
        this.calendar.usersCalendars$.subscribe(res => this.usersCalendars = res);
        this.calendar.otherCalendars$.subscribe(res => this.otherCalendars = res);
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.calendar.isMobileView = this.elementRef.nativeElement.getBoundingClientRect().width < 1024;
        });
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
    }

    public ngAfterViewInit() {
        this.calendar.isMobileView = this.elementRef.nativeElement.getBoundingClientRect().width < 1024;
    }

    get isMobileView() {
        return this.calendar.isMobileView;
    }

    get owner() {
        return this.calendar.owner;
    }

    get sidebarWidth() {
        return this.calendar.sidebarWidth;
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    set calendarDate(value) {
        this.calendar.calendarDate = value;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    set asPicker(value) {
        if (value) {
            this.sheetType = 'Three_Days';
            this.calendar.asPicker = value;
        } else {
            this.closeModal();
        }
    }

    get asPicker() {
        return this.calendar.asPicker;
    }

    get sidebarStyle() {
        return {
            'width': this.calendar.sidebarwidth + 'px',
            'z-index': 1,
        };
    }

    private addOtherCalendar() {
        this.calendar.addOtherCalendar();
    }

    private getSheetStyle() {
        return {
            width: `calc(100% - ${this.sidebarWidth}px)`,
            height: '100%',
        };
    }

    private getCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        switch (this.sheetType) {
            case 'Week':
                return this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D');
            case 'Schedule':
                return focDate.format("MMM D, YYYY") + ' - ' + this.scheduleUntilDate.format("MMM D, YYYY");
            case 'Three_Days':
                return focDate.format("MMM D") + ' - ' + moment(focDate.add(2, 'd')).format("MMM D");
        }
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekStartDay);
        return focDate.format('MMM D');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekDaysCount);
        return focDate.format('MMM D');
    }

    private setDateChanged(event) {
        this.openPicker = false;
        this.calendarDate = new moment(event);
        this.refresh();
    }

    private toggleTypeSelector() {
        this.showTypeSelector = !this.showTypeSelector;
    }

    private setType(sheetType) {
        this.sheetType = sheetType;
        this.refresh();
        this.showTypeSelector = false;
    }

    private goToday() {
        this.calendarDate = new moment();
    }

    private gotToDayView(date) {
        this.calendarDate = new moment(date);
        this.refresh();
        this.sheetType = 'Day';
    }

    private shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(this.sheetType == 'Three_Days'? 3 : 1, this.duration[this.sheetType])));
    }

    private shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(this.sheetType == 'Three_Days'? 3 : 1, this.duration[this.sheetType])));
    }

    private zoomin() {
        this.calendar.sheetHourHeight += 10;
    }

    private zoomout() {
        this.calendar.sheetHourHeight -= 10;
    }

    private resetzoom() {
        this.calendar.sheetHourHeight = 80;
    }

    private refresh() {
        this.calendar.currentStart = {};
        this.calendar.currentEnd = {};
        this.calendarDate = new moment(this.calendar.calendarDate);
    }

    private closeModal() {
        this.self.destroy();
    }

    public ngOnDestroy() {
        this.resizeListener();
        this.touchStartListener();
        this.touchMoveListener();
    }

    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
    };

    private handleTouchMove(evt) {
        if (!this.xDown || !this.yDown) {return}
        let xDiff = this.xDown - evt.touches[0].clientX;

        if ( Math.abs( xDiff ) > Math.abs( this.yDown - evt.touches[0].clientY ) ) {
            if ( xDiff < 0 ) {
                this.shiftMinus();

            } else {
                this.shiftPlus();
            }
        }

        this.xDown = null;
        this.yDown = null;
    };
}