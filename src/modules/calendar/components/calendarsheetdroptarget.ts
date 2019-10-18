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
        let date = this.day ? new moment(this.day.date) : new moment();
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
        this.calendar.eventDrop$.emit({
            day: this.day,
            hour: this.hour,
            minutes: this.minutes
        });
        e.preventDefault();
        e.stopPropagation();
    }
}
