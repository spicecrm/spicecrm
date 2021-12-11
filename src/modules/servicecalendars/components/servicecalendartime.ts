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
    templateUrl: '../templates/servicecalendartime.html',
    providers: [relatedmodels]
})
export class ServiceCalendarTime implements OnChanges {

    @Input() public calendarid: string;

    public componentconfig: any;
    public listfields: any[];

    constructor(
        public language: language,
        public model: model,
        public metadata: metadata,
        public relatedmodels: relatedmodels
    ) {
        this.relatedmodels.module = 'ServiceCalendars';
        this.relatedmodels.relatedModule = 'ServiceCalendarTimes';
        this.relatedmodels.linkName = 'servicecalendartimes';
        this.relatedmodels.loaditems = 1000;

        this.componentconfig = this.metadata.getComponentConfig('ServiceCalendars', 'ServiceCalendars');
        this.listfields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.relatedmodels.id = this.calendarid;
        this.relatedmodels.resetData();

        // sort the data by first day and then time start
        this.relatedmodels.getData().subscribe(data => {
            this.relatedmodels.items.sort((a, b) => {
                if(a.dayofweek == b.dayofweek){
                    return a.timestart > b.timestart ? 1 : -1;
                } else {
                    return a.dayofweek > b.dayofweek ? 1 : -1;
                }
            })
        });
    }

}
