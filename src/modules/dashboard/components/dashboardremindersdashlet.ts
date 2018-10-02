import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {reminder} from '../../../services/reminder.service';

declare var moment: any;

@Component({
    selector: 'dashboard-reminders-dashlet',
    templateUrl: './src/modules/dashboard/templates/dashboardremindersdashlet.html'
})
export class DashboardRemindersDashlet {

    private dashletLabel: string = undefined;

    constructor(private language: language, private metadata: metadata, private reminder: reminder, private router: Router) {

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

    private goRecord(module, id) {
        this.router.navigate(['/module/' + module + '/' + id]);
    }

    private deleteRecord(module, id) {
        this.reminder.deleteReminder(module, id);
    }

    private getReminderDate(date) {
        return date.format('DD.MM.YYYY');
    }

    private isOverdue(date) {
        return date < new moment();
    }
}
