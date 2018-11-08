import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {language} from '../../../services/language.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;
declare var _: any;

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @ViewChild('daycontainer', {read: ViewContainerRef}) private dayContainer: ViewContainerRef;
    @ViewChild('boxcontainer', {read: ViewContainerRef}) private boxContainer: ViewContainerRef;
    @Input() private setdate: any = {};
    private currentGrid: Array<any> = [];
    public calendarevents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {}

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get sheetDays(): Array<any> {
        let sheetDays = [];
        // build the days
        let i = 0;
        let dayIndex = this.weekStartDay;
        let days = moment.weekdaysShort();
        while (i < this.weekDaysCount) {
            sheetDays.push({
                index: i,
                text: days[dayIndex]
            });
            i++;
            dayIndex++;
            if (dayIndex > 6) {dayIndex = 0}
        }
        return sheetDays;
    };

    get startHour() {
        return this.calendar.startHour;
    }

    get endHour() {
        return this.calendar.endHour;
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.buildGrid();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).date(1).hour(this.startHour).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M')).hour(this.endHour);
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                events.sort((a, b) => {
                    if (a.start < b.start) {return -1}
                    if (a.start === b.start) {
                        if (a.end > b.end) {return -1} else {return 1}
                    }
                    return 1;});
            }
            // Group events in weeks
            for (let event of events) {
                this.currentGrid.some((week, WIndex) => {
                    return week.some((day, DIndex) => {
                        if (this.startEndThisMonth(event, day) || this.endThisMonth(event, day) || this.startThisMonth(event, day)) {
                            if (!this.calendarevents[WIndex]) { this.calendarevents[WIndex] = []}
                            if (this.calendarevents[WIndex].indexOf(event) == -1){
                                this.calendarevents[WIndex].push(event);
                            }
                        }
                    });
                });
            }
        });
    }

    private gotoDay(sheetday) {
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetday.month).date(sheetday.day);
        this.navigateday.emit(navigateDate);
    }

    private getDayColStyle(weekdayShort) {
        let todayDay = new moment();
        let todayDayShort = todayDay.format('ddd');
        let calendarDate = this.calendar.calendarDate;
        return {
            width: `calc(100% / ${this.weekDaysCount})`,
            color: calendarDate.year() == todayDay.year() && calendarDate.month() == todayDay.month() && todayDayShort == weekdayShort ? this.calendar.todayColor : 'inherit',
            'font-weight': calendarDate.year() == todayDay.year() && calendarDate.month() == todayDay.month() && todayDayShort == weekdayShort ? '600' : 'inherit'
        };
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + (this.calendarsheet.element.nativeElement.offsetTop + 20) + 'px)',
        };
    }

    private getDayDividerStyle(day) {
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / this.weekDaysCount * day) + 'px',
            top: '0px',
            height: '100%'
        };
    }

    private buildGrid() {
        this.currentGrid = [];
        let fdom = new moment(this.setdate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(this.weekStartDay);
        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            if ((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (i < this.weekDaysCount) {
                    week.push({day: fdom.date(), month: fdom.month(), items: []});
                    let weekDaysOffset = 7 - this.weekDaysCount;
                    if (i == (this.weekDaysCount - 1) && this.weekDaysCount < 7) {fdom.add(weekDaysOffset, 'd')}
                    fdom.add(1, 'd');
                    i++;
                }
                this.currentGrid.push(week);
            }
            j++;
        }
    };

    private notLastWeek(week) {
        return week < this.currentGrid.length;
    }

    private notThisMonth(month) {
        return month !== this.setdate.month();
    }

    private getWeekDividerStyle(week) {
        return {
            top: 'calc((100% / ' + this.currentGrid.length + ') * ' + week + ' )'
        };
    }

    private getBoxStyle(i, j, month) {
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / this.weekDaysCount * j) + 'px',
            top: 'calc((100% / ' + this.currentGrid.length + ') * ' + i + ' )',
            color: this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            width: (this.calendarsheet.element.nativeElement.clientWidth / this.weekDaysCount) + 'px',
            height: 'calc(100% / ' + this.currentGrid.length + ')',
        };
    }

    private startEndThisMonth(event, day) {
        return (event.start.month() === day.month && event.end.month() === day.month && event.start.date() <= day.day && event.end.date() >= day.day);
    }

    private endThisMonth(event, day) {
        return (event.start.month() === day.month && event.end.month() !== day.month && event.start.date() <= day.day);
    }

    private startThisMonth(event, day) {
        return (event.end.month() === day.month && event.start.month() !== day.month && event.end.date() >= day.day);
    }

    private getEventStyle(event, weekIndex) {
        let maxEventsPerBox = 4;
        let sheetContainer = this.calendarsheet.element.nativeElement;
        let dayContainerHeight = this.dayContainer.element.nativeElement.clientHeight;
        let boxContainerHeight = this.boxContainer.element.nativeElement.clientHeight - 4;
        let eventHeight = (boxContainerHeight - dayContainerHeight) / maxEventsPerBox;
        let dayStartIndex = null;
        let dayEndIndex = 0;
        let eventIndex = 0;
        this.currentGrid[weekIndex].some((day, DIndex) => {
            if (this.startEndThisMonth(event, day) || this.startThisMonth(event, day) || this.endThisMonth(event, day)) {
                day.items.push(event.id);
                if (dayStartIndex === null) {
                    dayStartIndex = DIndex;
                }
                dayEndIndex = DIndex;
                eventIndex = eventIndex > day.items.indexOf(event.id) ? eventIndex : day.items.indexOf(event.id);
            }
        });

        return {
            left: (sheetContainer.clientWidth / this.weekDaysCount) * dayStartIndex,
            width: (sheetContainer.clientWidth / this.weekDaysCount) + ((sheetContainer.clientWidth / this.weekDaysCount) * (dayEndIndex - dayStartIndex)),
            top: dayContainerHeight + ((sheetContainer.clientHeight / this.currentGrid.length) * weekIndex) + (eventIndex * eventHeight),
            height: eventHeight
        }
    }

    private isTodayStyle(day, month) {
        let year = this.calendar.calendarDate.year();
        let today = new moment();
        return {
            'background-color': year === today.year() && today.month() === month && today.date() == day ? this.calendar.todayColor : 'inherit',
            'border-radius': '50%',
            'line-height': '1rem',
            'text-align': 'center',
            'font-size': '.7rem',
            color: year === today.year() && today.month() === month && today.date() == day ? '#fff' : 'inherit',
            width: '1rem',
            height: '1rem',
            display: 'block',
        }
    }
}
