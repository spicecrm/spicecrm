import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {Router}   from '@angular/router';
import {Observable, Subject} from 'rxjs';
//import {isUndefined} from "util";

@Injectable()
export class reminder {

    isFavorite: boolean = false;
    isEnabled: boolean = false;
    reminders: Array<any> = [];

    currentModule: string = '';
    currentId: string = '';

    constructor(private backend: backend, private broadcast: broadcast, private configurationService: configurationService, private session: session) {
        this.broadcast.message$.subscribe(message => this.handleMessage(message))
    }

    handleMessage(message: any) {
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

    enable(module, id) {
        this.isEnabled = true;

        this.currentModule = module;
        this.currentId = id;

        this.reminders.some(fav => {
            if (fav.module_name === module && fav.item_id === id) {
                this.isFavorite = true;
                return true;
            }
        });

    }

    disable() {
        this.isEnabled = false;
        this.isFavorite = false;
    }

    loadReminders(loadhandler: Subject<string>) {
        if (sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)] && sessionStorage[window.btoa('reminders'+this.session.authData.sessionId)].length > 0 && !this.configurationService.data.developerMode) {
            this.reminders = this.session.getSessionData('reminders');
            loadhandler.next('loadReminders');
        }else {
            this.backend.getRequest('spiceui/core/reminders').subscribe(rem => {
                this.session.setSessionData('reminders',rem);
                this.reminders = rem;
                loadhandler.next('loadReminders');
            });
        }
    }

    getReminder(module, id): any{
        let reminderDate = false;
        this.reminders.some(rem => {
            if (rem.module_name === module && rem.item_id === id) {
                reminderDate =  rem.reminder_date;
                return true;
            }
        });

        return reminderDate;
    }

    getReminders() {
        let retArr = [];
        for (let reminder of this.reminders) {
            if (reminder.module_name === module)
                retArr.push({
                    item_id: reminder.item_id,
                    item_summary: reminder.item_summary
                })
        }

        return retArr;
    }

    setReminder(model, reminderDate) {
        this.backend.postRequest('spiceui/core/reminders/' + model.module + '/' + model.id + '/' + reminderDate).subscribe((fav : any) => {
            this.reminders.splice(0, 0, {
                item_id: model.id,
                module_name: model.module,
                item_summary: model.data.summary_text,
                reminder_date: reminderDate
            });
        });
    }

    deleteReminder(module, id): Observable<any> {
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
