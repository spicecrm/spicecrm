/**
 * @module ModuleDashboard
 */
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {reminder} from '../../../services/reminder.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'dashboard-reminders-dashlet',
    templateUrl: '../templates/dashboardremindersdashlet.html'
})
export class DashboardRemindersDashlet {

    public dashletLabel: string = undefined;

    constructor(public language: language, public metadata: metadata, public reminder: reminder, public router: Router) {

    }

    get recordcount() {
        return this.reminder.reminders.length;
    }

    get dashletTitle() {
        return this.language.getLabel(this.dashletLabel);
    }

    get reminders() {
        return this.reminder.reminders
            .map(reminder => {
                reminder.reminder_date = new moment(reminder.reminder_date);
                return reminder;
            })
            .sort((a, b) => a.reminder_date - b.reminder_date);
    }

    public trackByFn(index, item) {
        return item.item_id;
    }

    public goRecord(module, id) {
        this.router.navigate(['/module/' + module + '/' + id]);
    }

    public deleteRecord(module, id) {
        this.reminder.deleteReminder(module, id);
    }

    public getReminderDate(date) {
        return date.format('DD.MM.YYYY');
    }

    public isOverdue(date) {
        return date < new moment();
    }
}
