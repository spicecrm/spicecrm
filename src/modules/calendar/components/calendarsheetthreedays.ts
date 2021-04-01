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
import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CalendarSheetWeek} from "./calendarsheetweek";

/**
 * @ignore
 */
declare var moment: any;

/**
 * Display calendar events in three days view
 */
@Component({
    selector: 'calendar-sheet-three-days',
    templateUrl: './src/modules/calendar/templates/calendarsheetthreedays.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarSheetThreeDays extends CalendarSheetWeek implements OnInit {
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
     * @return startDate: moment
     */
    get startDate() {
        return new moment(this.setdate).hour(this.calendar.startHour).minute(0).second(0);
    }

    /**
     * @return endDate: moment
     */
    get endDate() {
        return new moment(this.startDate).add(moment.duration(2, 'd')).hour(this.calendar.endHour);
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
     * build sheet days
     */
    public buildSheetDays() {
        this.sheetDays = [];
        let d = 0;
        while (d < 3) {
            let focDate = new moment(this.setdate);
            focDate = focDate.add(d, 'days');
            this.sheetDays.push({
                index: d,
                date: moment(focDate),
                day: moment(focDate).day(),
                color: this.isToday(moment(focDate)) ? this.calendar.todayColor : '#000000',
                dateTextDayShort: moment(focDate).format('ddd'),
                dateTextDayNumber: moment(focDate).format('D'),
                items: []
            });
            d++;
        }
    }

    /**
     * set the event style
     * @param event
     */
    public setEventStyle(event) {
        const day = this.sheetDays.find(day => day.day == event.start.day()) || 0;
        const startminutes = (event.start.hour() - this.calendar.startHour) * 60 + event.start.minute();
        const endminutes = (event.end.hour() - this.calendar.startHour) * 60 + event.end.minute();
        const scrollOffset = this.scrollContainer.element.nativeElement.getBoundingClientRect().width;
        const sheetWidth = this.sheetContainer.element.nativeElement.clientWidth - scrollOffset;
        const itemWidth = ((sheetWidth - this.sheetTimeWidth) / 3) / (event.maxOverlay > 0 ? event.maxOverlay : 1);
        const left = this.sheetTimeWidth + ((sheetWidth - this.sheetTimeWidth) / 3 * day.index) + (itemWidth * event.displayIndex);
        const top = this.calendar.sheetHourHeight / 60 * startminutes;
        const height = this.calendar.sheetHourHeight / 60 * (endminutes - startminutes);

        event.style = {
            'left': left + 'px',
            'width': itemWidth + 'px',
            'top': top + 'px',
            'height': height + 'px',
            'min-height': this.calendar.multiEventHeight + 'px'
        };
    }

    /**
     * set the multi event style
     * @param event
     */
    public setMultiEventStyle(event) {
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
        event.style = {
            width: width + "px",
            left: left + "px",
            height: this.calendar.multiEventHeight + "px",
            top: (this.calendar.multiEventHeight * eventI) + "px",
        };
    }

    /**
     * display date by input format
     * @param type
     * @param date
     * @return date formatted
     */
    public displayDate(type, date) {
        switch (type) {
            case 'day':
                return date.format('ddd');
            case 'date':
                return date.format(this.calendar.isDashlet ? 'D, MMM' : 'D');
        }
    }
}
