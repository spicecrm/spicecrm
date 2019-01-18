import {
    AfterViewInit, ChangeDetectorRef,
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
    providers: [calendar]
})

export class Calendar implements AfterViewInit, OnDestroy {
    @ViewChild('calendarcontainer', {read: ViewContainerRef}) private calendarContainer: ViewContainerRef;
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;

    private clickListener: any;
    private touchStartListener: any;
    private touchMoveListener: any;
    private resizeListener: any;
    private xDown: number = null;
    private yDown: number = null;
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
                private cdr: ChangeDetectorRef,
                private renderer: Renderer2,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        this.language.currentlanguage$.subscribe(lang => this.calendarDate = this.calendar.calendarDate);
        this.scheduleUntilDate = new moment().minute(0).second(0).add(1, "M");
        this.calendar.usersCalendars$.subscribe(res => this.usersCalendars = res);
        this.calendar.otherCalendars$.subscribe(res => this.otherCalendars = res);
        this.resizeListener = this.renderer.listen('window', 'resize', () => {
            this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
        });
        this.touchStartListener = this.renderer.listen('document', 'touchstart', e => this.handleTouchStart(e));
    }

    public ngAfterViewInit() {
        this.calendar.isMobileView = this.calendarContainer.element.nativeElement.getBoundingClientRect().width < 768;
    }

    public ngAfterViewChecked() {
        this.cdr.detectChanges();
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
        this.calendar.calendarDate = new moment(value).locale(this.language.currentlanguage.substring(0,2));
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

    private getCompactCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        return focDate.format('MMM, YYYY');
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
        this.toggleClosed();
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

    private handleTouchStart(evt) {
        const touches = evt.touches || evt.originalEvent.touches;
        this.xDown = touches[0].clientX;
        this.yDown = touches[0].clientY;
        this.touchMoveListener = this.renderer.listen('document', 'touchmove', e => this.handleTouchMove(e));
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
        this.touchMoveListener();
    };

    private toggleOpen(picker, button) {
        this.openPicker = !this.openPicker;
        if (this.openPicker) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event, picker, button));
        }
    }

    private toggleClosed() {
        this.openPicker = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    private onDocumentClick(event: MouseEvent, picker, button) {
        if (this.openPicker && !picker.contains(event.target) && !button.contains(event.target)) {
            this.openPicker = false;
            this.clickListener();
        }
    }

    public ngOnDestroy() {
        if (this.resizeListener) {
            this.resizeListener();
        }
        if (this.touchStartListener) {
            this.touchStartListener();
        }
        if (this.touchMoveListener) {
            this.touchMoveListener();
        }
        if (this.clickListener) {
            this.clickListener();
        }
        this.cdr.detach();
    }
}