import {Component, AfterViewInit, OnInit, OnDestroy, OnChanges, ViewChild, ViewContainerRef, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';
import {reminder} from '../../../services/reminder.service';
import {toast} from '../../../services/toast.service';

declare var moment: any;

@Component({
    selector: 'dashboard-reminders-dashlet',
    templateUrl: './app/modules/dashboard/templates/dashboardremindersdashlet.html'
})
export class DashboardRemindersDashlet implements OnInit{

    reminders: Array<any> = [];
    dashletLabel: string = undefined;

    constructor(private language: language, private metadata: metadata, private reminder: reminder, private router: Router) {

    }

    get recordcount(){
        return this.reminder.reminders.length;
    }

    ngOnInit(){
        this.buildReminders();
    }

    get dashletTitle(){
        return this.language.getLabel(this.dashletLabel);
    }

    buildReminders(){

        this.reminders = [];

        // sort reminders
        for(let reminder of this.reminder.reminders){
            this.reminders.push({
                module_name: reminder.module_name,
                item_id: reminder.item_id,
                item_summary: reminder.item_summary,
                reminder_date: new moment(reminder.reminder_date)
            })
        }

        this.reminders.sort((a, b) => {
            return a.reminder_date > b.reminder_date ? 1 : -1;
        });
    }

    goRecord(module, id){
        this.router.navigate(['/module/' + module + '/' + id]);
    }
    deleteRecord(module, id){
        this.reminder.deleteReminder(module, id).subscribe(val => {
            this.buildReminders();
        });
    }

    getReminderDate(date){
        return date.format('DD.MM.YYYY')
    }

    isOverdue(date){
        return date < new moment() ? true : false;
    }
}