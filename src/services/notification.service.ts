/**
 * @module services
 */
import {Injectable} from '@angular/core';

import {configurationService} from './configuration.service';
import {session} from './session.service';
import {backend} from './backend.service';
import {broadcast} from './broadcast.service';
import {userpreferences} from "./userpreferences.service";
import {language} from "./language.service";
import {DomSanitizer} from "@angular/platform-browser";
import {socket} from "./socket.service";
import {SocketEventI, NotificationI} from "./interfaces.service";

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
    /**
     * holds the new notifications temporary to be rendered as toast for 5 seconds
     */
    public newNotifications: NotificationI[] = [];

    constructor(private backend: backend,
                private broadcast: broadcast,
                private configuration: configurationService,
                private preferences: userpreferences,
                private language: language,
                private sanitizer: DomSanitizer,
                private socket: socket,
                private session: session) {
        this.initializeDesktopNotification().then(() =>
            this.loadNotifications()
        );
        this.initializeSocket();
        this.subscribeToBroadcast();
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
     * mark all notifications as read
     */
    public markAllAsRead() {
        this.notifications.forEach(n => {
            n.notification_read = 1;
        });

        this.unreadCount = 0;

        this.backend.postRequest(`common/SpiceNotifications/all/read`);
    }

    /**
     * load the notifications from the configuration service
     */
    public loadNotifications() {

        this.setInitialValues(
            this.configuration.getData('spicenotifications')
        );

        this.broadcast.message$.subscribe(msg => {

            if (msg.messagetype !== 'loader.completed' || msg.messagedata !== 'loadUserData') {
                return;
            }
            this.setInitialValues(
                this.configuration.getData('spicenotifications')
            );
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
            .subscribe((res: { count: number, records: NotificationI[] }) => {

                    this.isLoading = false;

                    this.notifications = this.notifications.concat(
                        res.records.map(n => this.parseNotification(n))
                    );
                    this.setUnreadCount();

                }, () =>
                    this.isLoading = false
            );
    }

    /**
     * push the notification to the notifications array
     * @param notification
     */
    public pushNotification(notification) {

        notification = this.parseNotification(notification);

        this.notifications.unshift(notification);
        this.pushDesktopNotification(notification);
        this.newNotifications.push(notification);

        window.setTimeout(() =>
                this.clearTempNotification(notification),
            10000
        );

        this.unreadCount++;
    }

    /**
     * remove the temporary notification from the new notification array
     * @param n
     */
    public clearTempNotification(n: NotificationI) {
        this.newNotifications = this.newNotifications.filter(newN => newN != n);
    }

    /**
     * check if the notification api is supported by the browser and request permission if the user did not take action yet.
     */
    protected initializeDesktopNotification() {
        if (!('Notification' in window)) {
            window.console.error('This browser does not support desktop notification');
            return Promise.resolve(null);
        } else if (Notification.permission === 'default') {
            return Notification.requestPermission();
        } else {
            return Promise.resolve(null);
        }
    }

    /**
     * set the unread count
     * @private
     */
    private setUnreadCount() {
        this.unreadCount = this.notifications.filter(n => n.notification_read != 1).length;
    }

    /**
     * set the intial values for notifications
     * @param data
     * @private
     */
    private setInitialValues(data: { records: [], count: number }) {

        if (!data || !Array.isArray(data.records)) return;

        this.totalCount = data.count;
        this.notifications = data.records.map(n => this.parseNotification(n));
        this.setUnreadCount();
        this.pushDesktopNotification();
    }

    /**
     * initialize a socket connection and join the user private room
     * @private
     */
    private initializeSocket() {
        this.socket.initializeNamespace('notifications').subscribe(e => this.handleSocketEvents(e));
        this.socket.joinRoom('notifications', this.session.authData.userId);
    }

    /**
     * creates desktop notifications from the notifications array
     * @param n
     */
    private pushDesktopNotification(n?: NotificationI) {

        const body = !n ? this.language.getLabel('MSG_NEW_NOTIFICATIONS') : this.generateDesktopNotificationTitle(n);

        this.desktopNotifications.unshift(
            new Notification(this.configuration.systemName, {
                body: body,
                icon: this.configuration.getCapabilityConfig('theme').header_image
            })
        );
    }

    /**
     * generate a notification text
     * @param n
     * @private
     */
    private generateDesktopNotificationTitle(n: NotificationI): string {
        switch (n.notification_type) {
            case 'assign':
                return `${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_ASSIGNED')} ${n.created_by_name}`;
            case 'change':
                return `${this.language.getLabel('LBL_FIELDS')} (${n.additional_infos.fieldsNames}) ${this.language.getLabel('LBL_IN')} ${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_CHANGED')} ${n.created_by_name}`;
            case 'delete':
                return `${n.bean_name} ${this.language.getLabel('MSG_NOTIFICATION_DELETED')} ${n.created_by_name}`;
        }
    }

    /**
     * subscribe to broadcast message to initialize/disconnect a socket client
     * @private
     */
    private subscribeToBroadcast() {
        this.broadcast.message$.subscribe(data => {
            if (data.messagetype === 'login') {
                this.initializeSocket();
            }
            if (data.messagetype === 'logout') {
                this.socket.disconnect('notifications');
            }
        });
    }

    /**
     * handle socket event
     * @param event
     * @private
     */
    private handleSocketEvents(event: SocketEventI) {
        switch (event.type) {
            case 'new':
                this.pushNotification(event.data);
                break;
        }
    }

    /**
     * format notification date and parse additional infos
     * @private
     * @param n
     */
    private parseNotification(n: NotificationI) {
        {
            const timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
            const dateFormat = `${this.preferences.getDateFormat()} ${this.preferences.getTimeFormat()}`;
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
        }
    }
}
