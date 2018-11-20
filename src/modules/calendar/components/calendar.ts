import {Component, ElementRef, ViewChild, ViewContainerRef} from '@angular/core';
import {broadcast} from '../../../services/broadcast.service';
import {language} from '../../../services/language.service';
import {navigation} from '../../../services/navigation.service';
import {fts} from '../../../services/fts.service';
import {calendar} from '../services/calendar.service';
import {recent} from '../../../services/recent.service';

declare var moment: any;
declare var _: any;

@Component({
    templateUrl: './src/modules/calendar/templates/calendar.html',
    providers: [calendar],
    styles: [`
        /* Scrollbar */
        /* width */
        ::-webkit-scrollbar {
            width: 5px;
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
export class Calendar {

    public usersCalendars: any[] = [];
    public googleCalendarVisible: boolean = true;
    public searchterm: string = "";
    public searchopen: boolean = false;
    public isLoading: boolean = false;
    public resultsList: any[] = [];
    public timeout: any = undefined;
    public recentUsers: any[] = [];
    @ViewChild('calendarcontent', {read: ViewContainerRef}) private calendarcontent: ViewContainerRef;
    @ViewChild("inputcontainer", {read: ViewContainerRef}) private inputContainer: ViewContainerRef;
    private showTypeSelector: boolean = false;
    private sheetType: string = 'Week';
    private duration: any = {
        Day: 'd',
        Week: 'w',
        Month: 'M',
    };

    constructor(private language: language,
                private broadcast: broadcast,
                private navigation: navigation,
                private fts: fts,
                private recent: recent,
                private elementRef: ElementRef,
                private calendar: calendar) {
        this.navigation.setActiveModule('Calendar');
        this.calendarDate = new moment();
        this.getRecent();
        this.calendar.usersCalendars$.subscribe(res => this.usersCalendars = res);
    }

    get owner() {
        return this.calendar.owner;
    }

    get searchOpen() {
        return this.searchopen;
    }

    get loggedByGoogle() {
        return this.calendar.loggedByGoogle;
    }

    set searchOpen(value) {
        this.searchopen = value;
        if (value) {
            this.getRecent();
        }
    }

    get lookupMenuStyle() {
        return {
            display: this.searchOpen ? "block" : "none",
            width: this.inputContainer.element.nativeElement.getBoundingClientRect().width + "px",
        };
    }

    get weekStartDay() {
        return this.calendar.weekStartDay;
    }

    get weekDaysCount() {
        return this.calendar.weekDaysCount;
    }

    get calendarDate() {
        return this.calendar.calendarDate;
    }

    set calendarDate(value) {
        this.calendar.calendarDate = value;
    }

    get searchTerm() {
        return this.searchterm;
    }

    set searchTerm(value) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.searchterm = value, 500);
        if (value == "") {
            return;
        }
        this.isLoading = true;
        this.fts.searchByModules(this.searchterm, ["Users"], 5, "", {sortfield: "name"})
            .subscribe(res => {
                this.resultsList = res["Users"].hits.map(user => user = user._source)
                    .filter(user => user.id != this.owner && _.findWhere(this.calendar.usersCalendars, {id: user.id}) == undefined);
                this.isLoading = false;
            });
    }

    private getRecent() {
        this.recent.getModuleRecent("Users")
            .subscribe(recent => this.recentUsers = recent
                .filter(user => user.item_id != this.owner && _.findWhere(this.calendar.usersCalendars, {id: user.item_id}) == undefined));
    }

    private addUserCalendar(id, name) {
        this.calendar.addUserCalendar(id, name);
    }

    private removeUserCalendar(id) {
        this.calendar.removeUserCalendar(id);
    }

    private toggleVisibleGoogle() {
        this.googleCalendarVisible = !this.googleCalendarVisible;
    }

    private toggleVisibleUsers(id) {
        this.calendar.usersCalendars.some(calendar => {
            if (calendar.id == id) {
                calendar.visible = !calendar.visible;
                this.calendar.setUserCalendars(this.calendar.usersCalendars.slice());
                return true;
            }
        });
    }

    private getContentStyle() {
        return {
            height: 'calc(100vh - ' + this.calendarcontent.element.nativeElement.offsetTop + 'px)'
        };
    }

    private getCalendarHeader() {
        const focDate = new moment(this.calendarDate);
        switch (this.sheetType) {
            case 'Week':
                return 'Week ' + this.getCalendarWeek() + ': ' + this.getFirstDayOfWeek() + ' - ' + this.getLastDayOfWeek();
            case 'Month':
                return focDate.format('MMMM YYYY');
            case 'Day':
                return focDate.format('MMMM D, YYYY');
        }
    }

    private getCalendarWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(1);
        return focDate.isoWeek();
    }

    private getFirstDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekStartDay);
        return focDate.format('MMMM D, YYYY');
    }

    private getLastDayOfWeek() {
        let focDate = new moment(this.calendarDate);
        focDate.day(this.weekDaysCount);
        return focDate.format('MMMM D, YYYY');
    }

    private setDateChanged(event) {
        this.calendarDate = new moment(event);
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
        this.calendarDate = date;
        this.sheetType = 'Day';
    }

    private goToWeekView() {
        this.sheetType = 'Week';
    }

    private shiftPlus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay + (this.weekDaysCount - 1)) {
            this.calendarDate = new moment(this.calendarDate.add(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.add(moment.duration(1, this.duration[this.sheetType])));
    }

    private shiftMinus() {
        let weekDaysCountOffset = 7 - this.weekDaysCount;
        if (this.sheetType == "Day" && this.calendarDate.day() == this.weekStartDay) {
            this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(weekDaysCountOffset, "d")));
        }
        this.calendarDate = new moment(this.calendarDate.subtract(moment.duration(1, this.duration[this.sheetType])));
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
        this.calendar.currentStart = undefined;
        this.calendar.currentEnd = undefined;
        this.calendarDate = new moment();
    }
}
