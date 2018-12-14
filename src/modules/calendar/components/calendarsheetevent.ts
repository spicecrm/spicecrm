import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {model} from '../../../services/model.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';
import {broadcast} from '../../../services/broadcast.service';
import {calendar} from '../services/calendar.service';

declare var moment: any;

@Component({
    selector: 'calendar-sheet-event',
    templateUrl: './src/modules/calendar/templates/calendarsheetevent.html',
    providers: [model, view],
    host: {
        'class': 'slds-is-absolute slds-p-bottom--xxx-small',
        '(dragstart)': 'this.dragStart($event)',
        '(dragend)': 'this.dragEnd($event)',
        '[class.slds-hidden]': 'this.hidden'
    }
})
export class CalendarSheetEvent implements OnInit {
    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    public fields: any[] = [];
    @Input() public event: any = {};
    @Input("ismonthsheet") private isMonthSheet: boolean = false;
    @Input("isschedulesheet") private isScheduleSheet: boolean = false;
    private mouseMoveListener: any = undefined;
    private mouseUpListener: any = undefined;
    private mouseStart: any = undefined;
    private mouseLast: any = undefined;
    private hidden: boolean = false;

    private lastMoveTimeSpan: number = 0;

    constructor(private language: language,
                private metadata: metadata,
                private broadcast: broadcast,
                private calendar: calendar,
                private elementRef: ElementRef,
                private model: model,
                private renderer: Renderer2) {
        this.calendar.color$.subscribe(calendar => {
            if (this.calendar.calendars[calendar.id] && this.calendar.calendars[calendar.id].some(event => this.event.id == event.id)) {
                this.event.color = calendar.color;
            }
        });
    }

    public ngOnInit() {
        this.model.module = this.event.module;
        this.model.id = this.event.id;
        this.model.data = this.event.data;
        if (!this.event.hasOwnProperty('color')) {
            this.event.color = this.calendar.eventColor;
        }
    }

    get canEdit() {
        return this.owner == this.event.data.assigned_user_id && !this.isScheduleSheet && (this.event.type == 'event' || this.event.type == 'absence');
    }

    get owner() {
       return this.calendar.owner;
    }

    private dragStart(event) {
        if (!this.canEdit) {return}
        setTimeout(()=> this.hidden = true, 0);
        this.event.dragging = true;
    }

    private dragEnd(event) {
        this.hidden = false;
        this.event.dragging = false;
    }

    private onMouseDown(e) {

        this.mouseStart = e;
        this.mouseLast = e;
        this.event.resizing = true;

        this.mouseUpListener = this.renderer.listen('document', 'mouseup', (event) => this.onMouseUp());
        this.mouseMoveListener = this.renderer.listen('document', 'mousemove', (event) => this.onMouseMove(event));

        // prevent triggering other events
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
    }

    private onMouseMove(e) {
        if (!this.canEdit) {return}
        this.mouseLast = e;
        let moved = (this.mouseLast.pageY - this.mouseStart.pageY);
        let span = Math.floor(moved / 15);
        if (this.lastMoveTimeSpan !== span) {
            this.lastMoveTimeSpan = span;
            let eventEnd = new moment(this.event.start).add((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15), 'm');
            if (this.event.start.hours() === eventEnd.hours() && this.event.start.minutes() === eventEnd.minutes() || eventEnd.hours() < this.event.start.hours()) {
                this.event.end = new moment(this.event.start).add(15, 'm');
                this.lastMoveTimeSpan = this.lastMoveTimeSpan - (((this.event.data.duration_hours * 60) + this.event.data.duration_minutes + (this.lastMoveTimeSpan * 15)) / 15) + 1;
            } else {
                this.event.end = eventEnd;
            }
        }

    }

    private onMouseUp() {
        if (!this.canEdit) {return}
        this.mouseUpListener();
        this.mouseMoveListener();

        if (this.mouseLast.pageY != this.mouseStart.pageY) {
            let durationMinutes = +this.event.data.duration_hours * 60 + +this.event.data.duration_minutes + this.lastMoveTimeSpan * 15;
            this.event.data.duration_hours = Math.floor(durationMinutes / 60);
            this.event.data.duration_minutes = durationMinutes - this.event.data.duration_hours * 60;
            this.model.data.duration_minutes = this.event.data.duration_minutes;
            this.model.data.duration_hours = this.event.data.duration_hours;

            // save the event
            this.event.saving = true;
            this.model.save().subscribe(data => {
                this.event.saving = false;
            });

            // emit to rearrange on the sheet
            this.rearrange.emit();
        }
        this.mouseStart = undefined;
        this.mouseLast = undefined;
        this.event.resizing = false;
        this.lastMoveTimeSpan = 0;
    }
}
