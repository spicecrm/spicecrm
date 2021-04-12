/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {userpreferences} from "./userpreferences.service";
import {NotificationI} from "../globalcomponents/interfaces/globalcomponents.interfaces";
import {language} from "./language.service";
import {DomSanitizer} from "@angular/platform-browser";

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
     * holds the total count of the notifications
     */
    public totalCount: number = 0;
    /**
     * holds the notifications
     */
    public notifications: NotificationI[] = [];
    /**
     * holds the notifications
     */
    public desktopNotifications: Notification[] = [];
    /**
     * true if more notifications are loading from backend
     */
    public isLoading: boolean = false;

    constructor(private backend: backend,
                private broadcast: broadcast,
                private configuration: configurationService,
                private preferences: userpreferences,
                private language: language,
                private sanitizer: DomSanitizer,
                private session: session) {
        this.initializeDesktopNotification().then(() =>
            this.loadNotifications()
        );
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

            const data = this.configuration.getData('spicenotifications');

            if (msg.messagetype !== 'loader.completed' || msg.messagedata !== 'loadUserData' || !data || !Array.isArray(data.records)) {
                return;
            }
            this.totalCount = data.count;
            this.notifications = this.parseNotifications(data.records);
            this.createDesktopNotifications(this.notifications);

            this.unreadCount = this.notifications.filter(n => n.notification_read != 1).length;
        });
    }

    /**
     * load more notifications from the backend
     */
    public loadMoreNotifications() {

        if (this.isLoading || this.notifications.length >= this.totalCount) {
            return;
        }

        this.isLoading = true;

        this.backend.getRequest('common/SpiceNotifications', {offset: this.notifications.length})
            .subscribe((res: {count: number, records: NotificationI[]}) => {
                    this.isLoading = false;
                    const parsedNotifications = this.parseNotifications(res.records);
                    this.notifications = this.notifications.concat(parsedNotifications);
                    this.createDesktopNotifications(parsedNotifications);
                }, () =>
                    this.isLoading = false
            );
    }

    /**
     * push the notification to the notifications array
     * @param notification
     * todo check if we need to save to the database
     */
    public pushNotification(notification) {
        this.notifications.push(notification);
    }

    /**
     * creates desktop notifications from the notifications array
     * @param notifications
     */
    public createDesktopNotifications(notifications: NotificationI[]) {
        this.desktopNotifications.concat(
            notifications
                .filter(n => n.notification_read !== 1)
                .map(n => {
                    let title = '';
                    switch (n.notification_type) {
                        case 'assign':
                            title = `${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_ASSIGNED')} ${n.created_by_name}`;
                            break;
                        case 'change':
                            title = `${this.language.getLabel('LBL_FIELDS')} (${n.additional_infos.fieldsNames}) ${this.language.getLabel('LBL_IN')} ${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_CHANGED')} ${n.created_by_name}`;
                            break;
                        case 'delete':
                            title = `${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_DELETED')} ${n.created_by_name}`;
                            break;
                    }
                    return new Notification(this.configuration.systemName, {
                        body: title,
                        icon: this.configuration.getCapabilityConfig('theme').header_image
                    });
                })
        );
    }

    /**
     * check if the notification api is supported by the browser and request permission if the user did not take action yet.
     */
    protected initializeDesktopNotification() {
        if (!('Notification' in window)) {
            console.error('This browser does not support desktop notification');
            return Promise.resolve(null);
        } else if (Notification.permission === 'default') {
            return Notification.requestPermission();
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * format the notifications
     * @param notifications
     * @private
     */
    private parseNotifications(notifications: NotificationI[]) {
        const timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
        const dateFormat = `${this.preferences.getDateFormat()} ${this.preferences.getTimeFormat()}`;
        return notifications.map(n => {
            let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(n.notification_date).tz(timeZone) : moment(n.notification_date);
            n.notification_date = pDateTime.isValid() ? pDateTime.format(dateFormat) : null;
            if (!!n.additional_infos && typeof n.additional_infos == 'string') {
                n.additional_infos = JSON.parse(n.additional_infos);
                if (n.additional_infos?.fieldsNames) {
                    n.additional_infos.fieldsNames = n.additional_infos.fieldsNames
                        .map(f => this.language.getFieldDisplayName(n.bean_module, f))
                        .join(',');
                }
            }
            return n;
        });
    }
}
