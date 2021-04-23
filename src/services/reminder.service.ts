/**
 * @module services
 */
import {Injectable, EventEmitter} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Observable, Subject} from 'rxjs';

/**
 * @ignore
 */
declare var moment: any;


@Injectable()
export class reminder {

    public reminders: any[] = [];
    public loaded: boolean = false;
    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>()


    constructor(private backend: backend, private broadcast: broadcast, private configuration: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    private handleMessage(message: any) {
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
                    this.loaded$.emit(true);
                }
                break;
            case 'model.save':
                this.reminders.some((item, index) => {
                    if (item.module_name === message.messagedata.module && item.item_id == message.messagedata.id) {
                        this.reminders[index].item_summary = message.messagedata.data.summary_text;
                        return true;
                    }
                });
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

    public getReminders() {
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

    public setReminder(model, reminderDate) {
        this.backend.postRequest('common/spicereminders/' + model.module + '/' + model.id + '/' + reminderDate.format('YYYY-MM-DD')).subscribe((fav: any) => {
            this.reminders.splice(0, 0, {
                item_id: model.id,
                module_name: model.module,
                item_summary: model.data.summary_text,
                reminder_date: reminderDate
            });
        });
    }

    public deleteReminder(module, id): Observable<any> {
        let retSubject = new Subject<any>();
        this.backend.deleteRequest('common/spicereminders/' + module + '/' + id).subscribe(fav => {
            this.reminders.some((rem, remindex) => {
                if (rem.module_name === module && rem.item_id === id) {
                    this.reminders.splice(remindex, 1);
                    return true;
                }
            });
            retSubject.next(true);
            retSubject.complete();
        });
        return retSubject.asObservable();
    }

}
