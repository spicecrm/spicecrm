/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ElementRef, Renderer2} from '@angular/core';
import {notification} from "../../services/notification.service";
import {userpreferences} from "../../services/userpreferences.service";
import {reminder} from "../../services/reminder.service";
import {Router} from "@angular/router";

declare var moment: any;

/**
 * display reminders on the global header
 */
@Component({
    selector: 'global-header-reminders',
    templateUrl: '../templates/globalheaderreminders.html'
})
export class GlobalHeaderReminders {
    /**
     * if true show the notifications popover
     * @private
     */
    public isOpen: boolean = false;

    /**
     * holds the click listener function to enable remove
     * @private
     */
    public clickListener: () => void;

    /**
     * the distance fromt eh right frame for the popover
     */
    public right: number = 0;

    constructor(public reminder: reminder,
                public elementRef: ElementRef,
                public userPreferences: userpreferences,
                public cdRef: ChangeDetectorRef,
                public router: Router,
                public renderer: Renderer2) {
    }

    /**
     * get the current reminder sorted by the date
     */
    get currentReminders(){
        return this.reminder.reminders ?  this.reminder.reminders.filter(r => moment(r.reminder_date).isSameOrBefore(new moment(), 'day')).sort((a, b) => moment(a.reminder_date).isBefore(moment(b.reminder_date)) ? -1 : 1) : [];
    }

    /**
     * toggle open popover and handle closing the popover when the click is outside the container
     */
    public toggleOpenPopover() {
        // get the right position
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.right = window.innerWidth - rect.right + (rect.left - rect.right) / 2 + 10;

        // toggle open
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listen('window', 'click', event => {
                if (this.elementRef.nativeElement.contains(event.target)) return;
                this.isOpen = false;
                this.clickListener();
            });
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * deletes a reminder
     *
     * @param reminder
     */
    public deleteReminder(reminder){
        this.reminder.deleteReminder(reminder.module_name, reminder.item_id);
    }

    /**
     * returns the right margin
     */
    get popoverStyle(){
        return {
            right: this.right + 'px'
        }
    }

    /**
     * close the popover and remove the click listener
     */
    public closePopover() {
        this.isOpen = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

}
