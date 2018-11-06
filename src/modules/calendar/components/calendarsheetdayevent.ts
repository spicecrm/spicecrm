import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {broadcast} from '../../../services/broadcast.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-day-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetdayevent.html',
    providers: [model, view],
    host: {
        'class': 'slds-is-absolute',
        '(dragstart)': 'this.dragStart($event)',
        '(dragend)': 'this.dragEnd($event)'
    }
})
export class CalendarSheetDayEvent implements OnInit {
    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    @Input() private event: any = {};
    private componentconfig: any = {};
    public fields: Array<any> = [];
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseStart: any = undefined;
    private mouseLast: any = undefined;

    private lastMoveTimeSpan: number = 0;

    constructor(private language: language, private metadata: metadata, private broadcast: broadcast, private calendar: calendar, private elementRef: ElementRef, private model: model, private renderer: Renderer2) {
        // this.calendar.sheetHourHeight = this.calendar.sheetHourHeight;
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;

        // load the config and the fieldset
        // this.componentconfig = this.metadata.getComponentConfig('CalendarSheetDayEvent', this.event.module);
        // if (this.componentconfig.fieldset)
        this.fields = this.metadata.getFieldSetFields({fieldset: " 7d5edd2a-c103-4e97-96c0-f18fef955eb3"});
    }

    private getEventStyle() {
        try {
            return {
                'background-color': this.componentconfig.colors.default ? this.componentconfig.colors.default : 'rgb(3, 155, 229)'
            };
        } catch (e) {
            return {
                'background-color': 'rgb(3, 155, 229)'
            };
        }
    }

    private dragStart(event) {
        this.event.dragging = true;
    }

    private dragEnd(event) {
        this.event.dragging = false;
    }

    private onMouseDown(e) {

        this.mouseStart = e;
        this.mouseLast = e;

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', (event) => this.onMouseUp());
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));
    }

    private onMouseMove(e) {
        this.mouseLast = e;

        let moved = (this.mouseLast.pageY - this.mouseStart.pageY);

        let span = Math.floor(moved / 15);
        if (this.lastMoveTimeSpan !== span) {
            this.lastMoveTimeSpan = span;
            this.event.end = new moment(this.event.start).add(this.event.data.duration_hours * 60 + this.event.data.duration_minutes + this.lastMoveTimeSpan * 15, 'm');
        }

    }

    private onMouseUp() {
        this.mouseUpListener();
        this.mouseMoveListener();

        this.mouseStart = undefined;
        this.mouseLast = undefined;
        let durationMinutes = +this.event.data.duration_hours * 60 + +this.event.data.duration_minutes + this.lastMoveTimeSpan * 15;
        this.event.data.duration_hours = Math.floor(durationMinutes / 60);
        this.event.data.duration_minutes = durationMinutes - this.event.data.duration_hours * 60;

        // save the event
        this.event.saving = true;
        this.model.save().subscribe(data => {
            this.event.saving = false;
        });

        // emit to rearrange on the sheet
        this.rearrange.emit();

        this.lastMoveTimeSpan = 0;

    }
}
