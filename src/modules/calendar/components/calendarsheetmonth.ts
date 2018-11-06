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

@Component({
    selector: 'calendar-sheet-month',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonth.html',
})
export class CalendarSheetMonth implements OnChanges {

    @Output() public navigateday: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('calendarsheet', {read: ViewContainerRef}) private calendarsheet: ViewContainerRef;
    @Input() private setdate: any = {};
    private currentGrid: Array<any> = [];
    private calendarevents: Array<any> = [];

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private elementRef: ElementRef,
                private calendar: calendar) {
    }

    get sheetDays(): Array<any> {
        let sheetDays = [];

        // build the days
        let i = 0;
        let days = moment.weekdaysShort();
        while (i < 7) {
            sheetDays.push({
                index: i,
                text: days[i]
            });
            i++;
        }

        return sheetDays;
    };

    public ngOnChanges(changes: SimpleChanges) {
        this.buildGrid();

        this.calendarevents = [];
        let startDate = new moment(this.setdate).date(1).hour(0).minute(0).second(0);
        let endDate = new moment(startDate).add(moment.duration(1, 'M'));
        this.calendar.loadEvents(startDate, endDate).subscribe(events => {
            if (events.length > 0) {
                events.sort((a, b) => {
                    if (a.start < b.start) {
                        return -1;
                    }
                    if (a.start === b.start) {
                        if (a.end > b.end) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }
                    return 1;
                });
            }

            this.calendarevents = events;
        });
    }

    private gotoDay(sheetday) {
        let navigateDate = moment(this.setdate);
        navigateDate.month(sheetday.month).date(sheetday.day);
        this.navigateday.emit(navigateDate);
    }

    private getDayColStyle() {
        return {
            width: 'calc(100% / 7)'
        };
    }

    private getSheetStyle() {
        return {
            height: 'calc(100vh - ' + (this.calendarsheet.element.nativeElement.offsetTop + 20) + 'px)',
        };
    }

    private getDayDividerStyle(day) {
        return {
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * day) + 'px',
            top: '0px',
            height: '100%'
        };
    }

    private buildGrid() {
        this.currentGrid = [];
        // let fdom = new moment(this.curDate.year() + '-' + (this.curDate.month() + 1) + '-' + '01');
        let fdom = new moment(this.setdate);
        // move to first day of month
        fdom.date(1);
        // move to Sunday
        fdom.day(0);

        // build 6 weeks
        let j = 0;
        while (j < 6) {
            let i = 0;
            let week = [];
            if ((fdom.year() < this.setdate.year()) || (fdom.month() <= this.setdate.month())) {
                while (i < 7) {
                    week.push({day: fdom.date(), month: fdom.month()});

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
            left: (this.calendarsheet.element.nativeElement.clientWidth / 7 * j) + 'px',
            top: 'calc((100% / ' + this.currentGrid.length + ') * ' + i + ' )',
            color: this.notThisMonth(month) ? '#9faab5' : 'inherit',
            'background-color': this.notThisMonth(month) ? '#f4f6f9' : 'transparent',
            width: (this.calendarsheet.element.nativeElement.clientWidth / 7) + 'px',
            height: 'calc(100% / ' + this.currentGrid.length + ')',
        };
    }

    private getCellEvents(i, j) {
        let cellEvents: Array<any> = [];
        let cellDate = this.currentGrid[i][j];
        for (let event of this.calendarevents) {
            if (event.start.month() === cellDate.month && event.end.month() === cellDate.month && event.start.date() <= cellDate.day && event.end.date() >= cellDate.day) {
                cellEvents.push(event);
            } else if (event.start.month() === cellDate.month && event.end.month() !== cellDate.month && event.start.date() <= cellDate.day) {
                cellEvents.push(event);
            } else if (event.end.month() === cellDate.month && event.start.month() !== cellDate.month && event.end.date() >= cellDate.day) {
                cellEvents.push(event);
            }
        }
        return cellEvents;
    }
}
