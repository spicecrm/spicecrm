/**
 * @module ObjectComponents
 */
import {Component, Input, Renderer2, ElementRef, OnDestroy} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {reminder} from '../../services/reminder.service';
import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {Subscription} from "rxjs";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'object-reminder-button',
    templateUrl: '../templates/objectreminderbutton.html'
})
export class ObjectReminderButton implements OnDestroy{

    public showDialog: boolean = false;
    public reminderDate: Date = new moment();
    public hasReminder: boolean = false;

    /**
     * a listner that subscribes to document clicks top close the popover
     */
    public clickListener: any;

    /**
     * subscriptions for this component
     * @private
     */
    private subscriptions: Subscription = new Subscription();

    constructor(public language: language, public metadata: metadata, public model: model, public renderer: Renderer2, public elementRef: ElementRef, public reminder: reminder, public userpreferences: userpreferences) {

        // subscribe to model changes
        this.subscriptions.add(
            this.reminder.changed$.subscribe(loaded => {
                this.loadReminder();
            })
        );

        // oad in any case
        this.loadReminder();

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadReminder() {
        let hasReminder = this.reminder.getReminder(this.model.module, this.model.id);
        if (hasReminder !== false) {
            this.hasReminder = true;
            this.reminderDate = new moment(hasReminder);
        } else {
            this.hasReminder = false;
        }
    }

    public toggleDatePicker() {
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

    public clearReminder() {
        this.reminder.deleteReminder(this.model.module, this.model.id);
        this.hasReminder = false;
    }

    public setReminder(event) {
        this.showDialog = false;
        this.hasReminder = true;
        this.reminderDate = new moment(event);
        this.reminder.setReminder(this.model, this.reminderDate);
    }

    public getReminderDate() {
        // let date = new moment(this.reminderDate);
        return this.reminderDate.format(this.userpreferences.getDateFormat());
    }
}
