/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {userpreferences} from "./userpreferences.service";
import {NavigationI} from "../globalcomponents/interfaces/globalcomponents.interfaces";

/** @ignore */
declare var moment: any;

/**
 * this service handles loading and managing the user notifications
 */
@Injectable()
export class NotificationService {
    /**
     * holds the unread notifications count
     */
    public unreadCount: number = 0;
    /**
     * holds the notifications
     */
    public notifications: NavigationI[] = [];

    constructor(private backend: backend,
                private broadcast: broadcast,
                private configuration: configurationService,
                private preferences: userpreferences,
                private session: session) {
        this.loadNotifications();
    }

    /**
     * mark notification as read
     * @param id
     */
    public markAsRead(id: string) {
        this.notifications.some(n => {
            if (n.id == id) {
                n.notification_read = 1;
                this.unreadCount--;
                return true;
            }
        });

        this.backend.postRequest(`common/SpiceNotifications/${id}/markasread`);
    }

    /**
     * load the notifications from the configuration service
     */
    public loadNotifications() {

        this.broadcast.message$.subscribe(msg => {
            if (msg.messagetype !== 'loader.completed' || msg.messagedata !== 'loadUserData') return;

            this.notifications = this.configuration.getData('spicenotifications');
            this.formatNotificationsDate();

            this.unreadCount = this.notifications.filter(n => n.notification_read != 1).length;
        });
    }

    private formatNotificationsDate() {
        const timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
        const dateFormat = `${this.preferences.getDateFormat()} ${this.preferences.getTimeFormat()}`;
        this.notifications = this.notifications.map(n => {
            let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(n.notification_date).tz(timeZone) : moment(n.notification_date);
            n.notification_date = pDateTime.isValid() ? pDateTime.format(dateFormat) : null;
            return n;
        });
    }

    /**
     * push the notification to the notifications array
     * @param notification
     * todo check if we need to save to the database
     */
    public pushNotification(notification) {
        this.notifications.push(notification);
    }
}
