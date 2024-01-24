/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Observable, Subject} from 'rxjs';
import {modelutilities} from "./modelutilities.service";
import {model} from "./model.service";

/**
 * @ignore
 */
declare var moment: any;


@Injectable({
    providedIn: 'root'
})
export class reminder {

    /**
     * an array with the dat on teh current reminders
     */
    public reminders: any[] = [];

    /**
     * indicates that he model is laoded
     */
    public loaded: boolean = false;

    /**
     * emit when the data is changed
     */
    public changed$: EventEmitter<boolean> = new EventEmitter<boolean>();


    constructor(
        public backend: backend,
        public broadcast: broadcast,
        public configuration: configurationService,
        public session: session,
        public modelutilities: modelutilities
    ){
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    public handleMessage(message: any) {
        switch (message.messagetype) {
            case "loader.completed":
                if (message.messagedata == 'loadUserDataStep2') {
                    // reset the reminders we have
                    this.reminders = [];
                    // load from the configuration data service
                    for (let reminder of this.configuration.getData('reminders')) {
                        reminder.reminder_date = moment.utc(reminder.reminder_date);
                        this.reminders.push(reminder);
                    }
                    this.loaded = true;

                    // emit that we have changes
                    this.changed$.emit(true);
                }
                break;
            case 'model.save':
                    let reminderIndex = this.reminders.findIndex(r => r.module_name == message.messagedata.module && r.item_id == message.messagedata.id);
                    if (reminderIndex >= 0) {
                        this.reminders[reminderIndex].item_summary = message.messagedata.data.summary_text;
                        this.reminders[reminderIndex].data = message.messagedata.data;
                        return true;
                    }
                break;
        }
    }

    public getReminder(module, id): any {
        let reminderDate = false;
        this.reminders.some(rem => {
            if (rem.module_name === module && rem.item_id === id) {
                reminderDate = rem.reminder_date;
                return true;
            }
        });
        return reminderDate;
    }

    public getReminders(module) {
        let retArr = [];
        for (let reminder of this.reminders) {
            if (reminder.module_name === module) {
                retArr.push({
                    item_id: reminder.item_id,
                    item_summary: reminder.item_summary
                });
            }
        }

        return retArr;
    }

    /**
     * sets a reminder. If one is set updates it accordingly
     *
     * @param model
     * @param reminderDate
     */
    public setReminder(model: model, reminderDate) {
        let retSubject = new Subject();
        this.backend.postRequest('common/spicereminders/' + model.module + '/' + model.id + '/' + reminderDate.format('YYYY-MM-DD')).subscribe({
            next:(fav: any) => {
                let i = this.reminders.findIndex(r => r.item_id == model.id && r.module_name == model.module);
                if (i >= 0) {
                    this.reminders[i].reminder_date = reminderDate;
                    this.reminders[i].data = model.backendData;
                } else {
                    this.reminders.splice(0, 0, {
                        item_id: model.id,
                        module_name: model.module,
                        item_summary: model.data.summary_text,
                        reminder_date: reminderDate,
                        data: model.backendData
                    });
                }

                // resolve the subject
                retSubject.next(true);
                retSubject.complete();

                // emit that we have changes
                this.changed$.emit(true);
            },
            error: (e) => {
                retSubject.error(e);
            }
        });
        return retSubject.asObservable();
    }

    /**
     * deletes a reminder
     *
     * @param module
     * @param id
     */
    public deleteReminder(module, id): Observable<any> {
        let retSubject = new Subject<any>();
        this.backend.deleteRequest('common/spicereminders/' + module + '/' + id).subscribe({
            next: (fav) => {
                this.reminders.some((rem, remindex) => {
                    if (rem.module_name === module && rem.item_id === id) {
                        this.reminders.splice(remindex, 1);
                        return true;
                    }
                });
                retSubject.next(true);
                retSubject.complete();

                // emit that we have changes
                this.changed$.emit(true);
            },
            error: (e) => {
                retSubject.error(e);
            }
        });
        return retSubject.asObservable();
    }

}
