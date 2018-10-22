import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {broadcast} from '../../../services/broadcast.service';
import {navigation} from '../../../services/navigation.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-month-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetmonthevent.html',
    providers: [model, view]
})
export class CalendarSheetMonthEvent implements OnInit {
    @Input() private event: any = {};

    private componentconfig: any = {};
    private fields: Array<any> = [];

    constructor(private language: language, private metadata: metadata, private broadcast: broadcast, private navigation: navigation, private elementRef: ElementRef, private model: model) {

    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;

        // load the config and the fieldset
        this.componentconfig = this.metadata.getComponentConfig('CalendarSheetDayEvent', this.event.module);
        if (this.componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
        }
    }

    private getEventStyle() {
        try {
            return {
                'background-color': this.componentconfig.colors.default ? this.componentconfig.colors.default : '#d5e4f0'
            };
        } catch (e) {
            return {
                'background-color': '#d5e4f0'
            };
        }
    }

    private getEventStartTime(event) {
        return event.start.format('HH:mm');
    }

}
