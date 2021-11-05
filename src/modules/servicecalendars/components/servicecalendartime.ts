/**
 * @module ServiceCalendarManagerDays
 */
import {Component, OnChanges, Input, SimpleChanges} from '@angular/core';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {metadata} from "../../../services/metadata.service";
import {relatedmodels} from "../../../services/relatedmodels.service";

@Component({
    selector: 'service-calendar-time',
    templateUrl: './src/modules/servicecalendars/templates/servicecalendartime.html',
    providers: [relatedmodels]
})
export class ServiceCalendarTime implements OnChanges {

    @Input() private calendarid: string;

    public componentconfig: any;
    public listfields: any[];

    constructor(
        private language: language,
        private model: model,
        private metadata: metadata,
        private relatedmodels: relatedmodels
    ) {
        this.relatedmodels.module = 'ServiceCalendars';
        this.relatedmodels.relatedModule = 'ServiceCalendarTimes';
        this.relatedmodels.linkName = 'ServicecalendarTimes';
        this.relatedmodels.loaditems = 1000;

        this.componentconfig = this.metadata.getComponentConfig('ServiceCalendars', 'ServiceCalendarTimes');
        this.listfields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.relatedmodels.id = this.calendarid;
        this.relatedmodels.resetData();
        this.relatedmodels.getData();
    }

}
