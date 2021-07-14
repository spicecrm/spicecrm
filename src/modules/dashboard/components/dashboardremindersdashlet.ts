/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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

    private trackByFn(index, item) {
        return item.item_id;
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
