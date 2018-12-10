import {Injectable, EventEmitter} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Observable, Subject} from 'rxjs';

declare var moment: any;


@Injectable()
export class reminder {

    public reminders: any[] = [];
    public loaded$: EventEmitter<boolean> = new EventEmitter<boolean>()

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    private handleMessage(message: any) {
        switch (message.messagetype) {
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

    public loadReminders(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)] && sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.reminders = this.session.getSessionData('reminders');
            loadhandler.next('loadReminders');
        } else {
            this.backend.getRequest('spiceui/core/reminders').subscribe(rem => {
                this.session.setSessionData('reminders',rem);
                for(let reminder of rem){
                    reminder.reminder_date = moment.utc(reminder.reminder_date);
                    this.reminders.push(reminder);
                }
                this.loaded$.emit(true);
                delete(this.loaded$);
                loadhandler.next('loadReminders');
            });
        }
    }

    public getReminder(module, id): any {
        let reminderDate = false;
        this.reminders.some(rem => {
            if (rem.module_name === module && rem.item_id === id) {
                reminderDate =  rem.reminder_date;
                return true;
            }
        });
        return reminderDate;
    }

    public getReminders() {
        let retArr = [];
        for (let reminder of this.reminders) {
            if (reminder.module_name === module){
                retArr.push({
                    item_id: reminder.item_id,
                    item_summary: reminder.item_summary
                });
            }
        }

        return retArr;
    }

    public setReminder(model, reminderDate) {
        this.backend.postRequest('spiceui/core/reminders/' + model.module + '/' + model.id + '/' + reminderDate.format('YYYY-MM-DD')).subscribe((fav : any) => {
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
        this.backend.deleteRequest('spiceui/core/reminders/' + module + '/' + id).subscribe(fav => {
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
