/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output} from '@angular/core';
import {model} from '../../../services/model.service';
import {calendar} from '../services/calendar.service';
import {take} from "rxjs/operators";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-sheet-drop-target',
    template: '',
    providers: [model]
})
export class CalendarSheetDropTarget {

    @Output() public rearrange: EventEmitter<any> = new EventEmitter<any>();
    @Input() private hour: any = '';
    @Input() private set hourPart(value: number) {
        this.minutes = value ? 15* value : 0;
    }
    @Input() private day: any = undefined;

    private minutes: number = 0;

    constructor(private calendar: calendar, private model: model, private elementRef: ElementRef) {
    }

    get content() {
        return this.hour + ' ' + this.day;
    }

    @HostListener('click')
    private addEvent() {
        let date = this.day ? new moment(this.day) : new moment();
        date.hour(this.hour).minute(this.minutes).second(0);
        if (this.calendar.asPicker) {
            this.calendar.pickerDate$.emit(date);
        } else {
            this.calendar.addingEvent$.emit(date);
        }
    }

    @HostListener('dragover', ['$event'])
    private dragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener('dragenter')
    @HostListener('mouseenter')
    private activateHoverStyle() {
        this.elementRef.nativeElement.style.cursor = 'pointer';
        this.elementRef.nativeElement.innerText = `${this.hour}:${(this.minutes == 0 ? '00' : this.minutes)}`;
        this.elementRef.nativeElement.classList.add('slds-text-align--center');
        this.elementRef.nativeElement.classList.add('slds-theme--shade');
    }

    @HostListener('mouseleave')
    @HostListener('dragleave')
    private deactivateHoverStyle() {
        this.elementRef.nativeElement.style.cursor = 'initial';
        this.elementRef.nativeElement.innerText = '';
        this.elementRef.nativeElement.classList.remove('slds-text-align--center');
        this.elementRef.nativeElement.classList.remove('slds-theme--shade');
    }

    @HostListener('drop', ['$event'])
    private drop(e) {
        this.deactivateHoverStyle();
        let dragEvent: any = this.calendar.getEvents().find(calendarEvent => calendarEvent.dragging);

        if (dragEvent) {
            dragEvent.dragging = false;

            if (this.day) {
                dragEvent.start.date(this.day.date.date());
                dragEvent.start.month(this.day.date.month());
                dragEvent.start.year(this.day.date.year());
            }
            dragEvent.start.hour(this.hour);
            dragEvent.start.minutes(this.minutes);

            // calculate the end date
            dragEvent.end = new moment(dragEvent.start).add(dragEvent.data.duration_minutes + 60 * dragEvent.data.duration_hours, 'm');
            let module = this.calendar.modules.find(module => module == dragEvent.module);
            let dateStartName = module.dateStartName || 'date_start';
            let dateEndName = module.dateEndName ||'date_end';
            dragEvent.data[dateStartName].date(dragEvent.start.date());
            dragEvent.data[dateStartName].month(dragEvent.start.month());
            dragEvent.data[dateStartName].year(dragEvent.start.year());
            dragEvent.data[dateStartName].hour(this.hour);
            dragEvent.data[dateStartName].minutes(this.minutes);
            dragEvent.data[dateEndName] = new moment(dragEvent.end);

            // save the event
            this.saveEvent(dragEvent);

            // emit to rearrange
            this.rearrange.emit();
            e.preventDefault();
            e.stopPropagation();
        }
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
