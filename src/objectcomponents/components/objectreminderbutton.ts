/**
 * @module ObjectComponents
 */
import {Component, Input, Renderer2, ElementRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {reminder} from '../../services/reminder.service';
import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'object-reminder-button',
    templateUrl: './src/objectcomponents/templates/objectreminderbutton.html'
})
export class ObjectReminderButton {

    private showDialog: boolean = false;
    private reminderDate: Date = new moment();
    private hasReminder: boolean = false;
    private clickListener: any;

    constructor(private language: language, private metadata: metadata, private model: model, private renderer: Renderer2, private elementRef: ElementRef, private reminder: reminder, private userpreferences: userpreferences) {

        if (!this.reminder.loaded) {
            this.reminder.loaded$.subscribe(loaded => {
                this.loadReminder();
            });
        } else {
            this.loadReminder();
        }
    }

    private loadReminder() {
        let hasReminder = this.reminder.getReminder(this.model.module, this.model.id);
        if (hasReminder !== false) {
            this.hasReminder = true;
            this.reminderDate = new moment(hasReminder);
        }
    }

    private toggleDatePicker() {
        this.showDialog = !this.showDialog;

        // toggle the listener
        if (this.showDialog) {
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }

    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.showDialog = false;
        }
    }

    get isEditing() {
        return this.model.isEditing;
    }

    private clearReminder() {
        this.reminder.deleteReminder(this.model.module, this.model.id);
        this.hasReminder = false;
    }

    private setReminder(event) {
        this.showDialog = false;
        this.hasReminder = true;
        this.reminderDate = new moment(event);
        this.reminder.setReminder(this.model, this.reminderDate);
    }

    private getReminderDate() {
        // let date = new moment(this.reminderDate);
        return this.reminderDate.format(this.userpreferences.getDateFormat());
    }
}
