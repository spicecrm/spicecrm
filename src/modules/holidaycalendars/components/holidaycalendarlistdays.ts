/**
 * @module ModuleHolidayCalendars
 */
import {Component, OnChanges, Input, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

declare var moment: any;

@Component({
    selector: 'holiday-calendar-list-days',
    templateUrl: '../templates/holidaycalendarlistdays.html',
    providers: [relatedmodels]
})
export class HolidayCalendarListDays implements OnChanges {

    @Input() public calendarid: string;

    public componentconfig: any;
    public listfields: any[];

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public relatedmodels: relatedmodels
    ) {
        this.relatedmodels.module = 'SystemHolidayCalendars';
        this.relatedmodels.relatedModule = 'SystemHolidayCalendarDays';
        this.relatedmodels.linkName = 'systemholidaycalendardays';
        this.relatedmodels.loaditems = 1000;

        this.componentconfig = this.metadata.getComponentConfig('HolidayCalendarListDays', 'SystemHolidayCalendarDays');
        this.listfields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.relatedmodels.id = this.calendarid;
        this.relatedmodels.resetData();
        this.relatedmodels.getData().subscribe(data => {
            this.relatedmodels.items.sort((a, b) => {
                return moment(a.holiday_date).isBefore(moment(b.holiday_date)) ? 1 : -1;
            })
        });
    }

}
