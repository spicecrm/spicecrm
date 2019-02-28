import {Component, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {calendar} from '../services/calendar.service';
import {take} from "rxjs/operators";

declare var moment: any;

@Component({
    selector: 'calendar-sheet-drop-target',
    template: `
        <div *ngIf="showPlus" style="cursor: pointer" (click)="addEvent()"
             class="slds-align--absolute-center spice-h-full slds-theme_shade slds-text-heading_medium slds-text-color--inverse-weak">
            +
        </div>`,
    providers: [model]
})
export class CalendarSheetDropTarget {

    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    @Input() private hour: any = '';
    @Input() private day: any = undefined;
    private isDropTarget: boolean = false;
    private showPlus: boolean = false;

    constructor(private calendar: calendar, private model: model) {
    }

    get content() {
        return this.hour + ' ' + this.day;
    }

    @HostBinding('class')
    get targetClass() {
        return this.isDropTarget ? 'slds-is-absolute slds-theme--shade' : 'slds-is-absolute';
    }

    private addEvent() {
        if (this.day) {
            this.calendar.addingEvent$.emit(moment(this.day.date).hour(this.hour).minute(0).second(0));
        }
    }

    @HostListener('mouseenter')
    private mouseEnter() {
        if (this.calendar.asPicker) {
            this.showPlus = true;
        }
    }

    @HostListener('mouseleave')
    private mouseLeave() {
        this.showPlus = false;
    }

    @HostListener('dragover', ['$event'])
    private dragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragenter')
    private dragEnter() {
        this.isDropTarget = true;
    }

    @HostListener('dragleave')
    private dragLeave() {
        this.isDropTarget = false;
    }

    @HostListener('drop', ['$event'])
    private drop(event) {
        event.preventDefault();
        event.stopPropagation();

        let dragEvent: any;
        this.calendar.getEvents().some(calendarEvent => {
            if (calendarEvent.dragging) {
                dragEvent = calendarEvent;
                return true;
            }
        });
        if (dragEvent) {
            dragEvent.dragging = false;

            if (this.day) {
                dragEvent.data.date_start.date(this.day.date.date());
                dragEvent.data.date_start.month(this.day.date.month());
                dragEvent.data.date_start.year(this.day.date.year());
            }
            dragEvent.data.date_start.hour(this.hour);
            dragEvent.data.date_start.minutes(0);

            // calculate the end date
            dragEvent.data.date_end = new moment(dragEvent.data.date_start).add(dragEvent.data.duration_minutes + 60 * dragEvent.data.duration_hours, 'm');

            if (this.day) {
                dragEvent.start.date(this.day.date.date());
                dragEvent.start.month(this.day.date.month());
                dragEvent.start.year(this.day.date.year());
            }
            dragEvent.start.hour(this.hour);
            dragEvent.start.minutes(0);

            // calculate the end date
            dragEvent.end = new moment(dragEvent.start).add(dragEvent.data.duration_minutes + 60 * dragEvent.data.duration_hours, 'm');

            // save the event
            this.saveEvent(dragEvent);

            // emit to rearrange
            this.rearrange.emit();
        }

        this.isDropTarget = false;
        event.preventDefault();
    }


    private saveEvent(event) {
        this.model.module = event.module;
        this.model.id = event.id;
        this.model.data = event.data;
        event.saving = true;
        this.model.save()
            .pipe(take(1))
            .subscribe(data => {
                event.saving = false;
            });
    }
}
