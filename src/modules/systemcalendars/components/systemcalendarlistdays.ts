/**
 * @module ModuleHolidayCalendars
 */
import {Component, OnChanges, Input, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'system-calendar-list-days',
    templateUrl: './src/modules/holidaycalendars/templates/systemcalendarlistdays.html',
    providers: [relatedmodels, model]
})
export class SystemCalendarListDays implements OnChanges {

    @Input() private calendarid: string;

    private componentconfig: any;
    private listfields: any[];

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private relatedmodels: relatedmodels
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
        this.relatedmodels.getData();
    }

}
