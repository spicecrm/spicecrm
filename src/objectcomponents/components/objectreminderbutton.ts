import {Component, Input, Renderer, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {popup} from '../../services/popup.service';
import {reminder} from '../../services/reminder.service';
import {language} from '../../services/language.service';

declare var moment: any;

@Component({
    selector: 'object-reminder-button',
    templateUrl: './src/objectcomponents/templates/objectreminderbutton.html',
    providers: [popup]
})
export class ObjectReminderButton {

    showDialog: boolean = false;
    reminderDate: Date = new moment();
    hasReminder: boolean = false;
    clickListener: any;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private renderer: Renderer, private elementRef: ElementRef, private reminder: reminder) {
        let hasReminder = this.reminder.getReminder(this.model.module, this.model.id);
        if(hasReminder !== false){
            this.hasReminder = true;
            this.reminderDate = new moment(hasReminder);
        }
    }

    toggleDatePicker() {
        this.showDialog = !this.showDialog;

        // toggle the listener
        if (this.showDialog) {
            this.clickListener = this.renderer.listenGlobal('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener)
            this.clickListener();

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDialog = false;
        }
    }

    get isEditing(){
        return this.model.isEditing;
    }

    clearReminder() {
        this.reminder.deleteReminder(this.model.module, this.model.id);
        this.hasReminder = false;
    }

    setReminder(event) {
        this.showDialog = false;
        this.hasReminder = true;
        let reminderDate = new moment(event);
        this.reminder.setReminder(this.model, reminderDate.format('YYYY-MM-DD'));
    }

    getReminderDate() {
        // let date = new moment(this.reminderDate);
        return this.reminderDate.format('DD.MM.YYYY');
    }

}