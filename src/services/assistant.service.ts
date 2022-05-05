/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {Observable, Subject} from 'rxjs';

import {session} from './session.service';
import {modelutilities} from './modelutilities.service';
import {backend} from './backend.service';
import {notification} from './notification.service';
import {broadcast} from "./broadcast.service";
import {NotificationI} from "./interfaces.service";

declare var moment: any;

@Injectable()
export class assistant {

    /**
     * the list of modules
     */
    public assistantModules: string[] = [];

    /**
     * the items in the assistant
     */
    public assitantItems: any[] = [];

    /**
     * filters for the assistant applied
     */
    public assistantFilters: any = {
        objectfilters: [],
        timefilter: 'all'
    };


    /**
     * indicates that we are initialized
     *
     * @private
     */
    public initialized: boolean = false;

    /**
     * inidicates that the service is loading
     */
    public loading: boolean = true;

    /**
     * the reminder interval
     *
     * @private
     */
    public reminder: any = null;

    constructor(public modelutilities: modelutilities, public backend: backend, public broadcast: broadcast, public session: session, public notification: notification) {
        // subscribe to the broadcast service
        this.broadcast.message$.subscribe(message => {
            this.handleMessage(message);
        });

        if (this.session.authData.sessionId) {
            this.initialize();
        }
    }

    public handleMessage(message: any) {
        let itemIndex = 0;
        switch (message.messagetype) {
            case 'logout':
                // clear the items
                this.assitantItems = [];

                // reset the initialized status so we will load again on the next login
                this.initialized = false;

                // cancel the reminder interval if we have any
                if (this.reminder) {
                    clearInterval(this.reminder);
                }
                break;
            case 'login':
                // load the records
                this.initialize();

                break;
            case 'model.delete':
            case 'model.save':
                // ToDo: smarter chck if the module shoudl be listed here
                if (this.assistantModules.indexOf(message.messagedata.module) >= 0) {
                    this.loadItems(true);
                }
                break;
        }
    }

    /**
     * initialize the service
     */
    public initialize() {
        if(!this.initialized) {
            this.initialized = true;
            this.loadItems();

            // set the interval function
            this.reminder = setInterval(() => {
                this.remind();
            }, 60000);
        }
    }


    public remind() {
        // get a now timestamp
        let now = moment.utc();
        for (let i of this.assitantItems) {
            if(i.data.reminder_time && i.data.reminder_time != '-1') {
                let reminder = new moment.utc(i.date_activity).subtract(parseInt(i.data.reminder_time, 10), 'seconds');
                if (now.format('YYYYMMDDHHmm') ==  reminder.format('YYYYMMDDHHmm')) {
                    let n: NotificationI = {
                        id: this.modelutilities.generateGuid(),
                        bean_module: i.module,
                        bean_id: i.data.id,
                        created_by: i.data.created_by,
                        created_by_name: i.data.created_by,
                        user_id: i.data.created_by,
                        notification_date: i.date_activity,
                        notification_type: 'reminder',
                        notification_read:  0,
                        additional_infos: {},
                        bean_name: i.data.summary_text
                    };
                    this.notification.displayRealtimeNotification(n, false);
                }
            }
        }
    }

    /**
     * load the items
     *
     * @param silent
     */
    public loadItems(silent: boolean = true): Observable<any> {

        // set to loading if we are not silent
        if (!silent) {
            this.loading = true;
            this.assitantItems = [];
        }

        let retSubject = new Subject<any>();

        this.backend.getRequest('module/Activities/assistant/list').subscribe({
            next:(retData) => {
                let newItems = [];
                for (let retItem of retData.items) {
                    newItems.push({
                        id: retItem.id,
                        module: retItem.module,
                        date_activity: retItem.date_activity,
                        data: this.modelutilities.backendModel2spice(retItem.module, retItem.data)
                    });
                }
                this.assitantItems = newItems;

                // set the modules
                this.assistantModules = retData.modules ? retData.modules : [];

                retSubject.next(this.assitantItems);
                retSubject.complete();

                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
        return retSubject.asObservable();
    }

    /**
     * returns the filtered items
     */
    get filteredItems() {
        if (this.assistantFilters.timefilter != 'all' || this.assistantFilters.objectfilters.length > 0) {
            return this.assitantItems.filter(i => {
                if (this.assistantFilters.objectfilters.length > 0 && this.assistantFilters.objectfilters.indexOf(i.module) == -1) return false;

                if (this.assistantFilters.timefilter != 'all') {
                    let date = new moment.utc(i.date_activity);
                    if (this.assistantFilters.timefilter == 'today' && !date.isSame(moment.utc(), 'day')) return false;
                    if (this.assistantFilters.timefilter == 'overdue' && !date.isBefore(moment.utc(), 'day')) return false;
                }

                return true;
            });
        } else {
            return this.assitantItems;
        }
    }

    /**
     * returns the items available
     */
    get activityTypes() {
        let types = [];

        for (let item of this.assitantItems) {
            if (types.indexOf(item.module) == -1) {
                types.push(item.module);
            }
        }

        return types;
    }
}
