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
import {NotificationI, SocketEventI} from "./interfaces.service";

/** @ignore */
declare var moment: any;

/**
 * this service handles loading and managing the user notifications
 */
@Injectable()
export class notification {
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
    public unreadNotifications: NotificationI[] = [];
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
     * check if the notification api is supported by the browser and request permission if the user did not take action yet.
     */
    protected initializeDesktopNotification() {

        if (!('Notification' in window)) {

            window.console.error('This browser does not support desktop notification');
            return Promise.resolve(null);

        } else if (Notification.permission === 'default') {

            return Notification.requestPermission().then((p: NotificationPermission) => {
                this.preferences.setPreference('displayDesktopNotifications', (p == 'granted'), true);
            });
        } else {
            return Promise.resolve(null);
        }
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

        this.unreadNotifications = this.unreadNotifications.filter(n => n.id !== id);
        this.unreadCount--;
        this.backend.postRequest(`common/SpiceNotifications/${id}/markasread`);
    }

    /**
     * mark all notifications as read
     */
    public markAllAsRead() {

        this.notifications.forEach(n => {
            n.notification_read = 1;
        });
        this.unreadNotifications = [];
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
     * reload the notifications from backend
     */
    public reloadNotifications() {

        this.notifications = [];
        this.unreadNotifications = [];
        this.desktopNotifications = [];

        this.loadNotificationsFromBackend();
    }

    /**
     * load more notifications from the backend
     */
    public loadMoreNotifications() {

        if (this.isLoading || this.notifications.length >= this.totalCount) {
            return;
        }

        this.loadNotificationsFromBackend();
    }

    /**
     * load the notifications from the backend
     * @private
     */
    private loadNotificationsFromBackend() {

        this.isLoading = true;

        this.backend.getRequest('common/SpiceNotifications', {offset: this.notifications.length})
            .subscribe((res: { count: number, records: NotificationI[] }) => {

                    this.isLoading = false;

                    this.notifications = this.notifications.concat(
                        res.records.map(n => this.parseNotification(n))
                    );
                    this.unreadNotifications = this.notifications.filter(n => n.notification_read != 1);

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
        this.unreadNotifications.unshift(notification);

        this.pushDesktopNotification(notification);

        if (!!this.preferences.toUse.showRealtimeNotifications) {
            this.displayRealtimeNotification(notification);
        }

        this.unreadCount++;
    }

    /**
     * display a realtime notification only without saving it to the notification list
     * @param n
     * @param autoClose
     */
    public displayRealtimeNotification(n: NotificationI, autoClose: boolean = true) {

        this.newNotifications.push(n);

        this.pushDesktopNotification(n);

        if (!autoClose) return;

        window.setTimeout(() =>
                this.clearTempNotification(n),
            10000
        );
    }

    /**
     * remove the temporary notification from the new notification array
     * @param n
     */
    public clearTempNotification(n: NotificationI) {
        this.newNotifications = this.newNotifications.filter(newN => newN != n);
    }

    /**
     * creates desktop notifications from the notifications array
     * @param n
     */
    public pushDesktopNotification(n?: NotificationI) {

        if (!this.preferences.toUse.displayDesktopNotifications) return;

        const body = !n ? this.language.getLabel('MSG_NEW_NOTIFICATIONS') : this.generateDesktopNotificationTitle(n);

        this.desktopNotifications.unshift(
            new Notification(this.configuration.systemName, {
                body: body,
                icon: 'config/headerimage'
            })
        );
    }

    /**
     * set the unread count
     * @private
     */
    private setUnreadCount() {
        this.unreadCount = this.unreadNotifications.length;
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
        this.unreadNotifications = this.notifications.filter(n => n.notification_read != 1);
        this.setUnreadCount();
        if (this.unreadCount > 0) {
            this.pushDesktopNotification();
        }
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
     * generate a notification text
     * @param n
     * @private
     */
    private generateDesktopNotificationTitle(n: NotificationI): string {
        switch (n.notification_type) {
            case 'reminder':
                return `${this.language.getLabel('LBL_REMINDER')} ${n.bean_name}\n${n.notification_date}`;
            case 'assign':
                return `${this.language.getLabel('LBL_ASSIGNED')} ${n.bean_name} ${this.language.getLabel('LBL_BY')} ${n.created_by_name}`;
            case 'change':
                return `${this.language.getLabel('LBL_CHANGED')} ${n.bean_name} ${this.language.getLabel('LBL_BY')} ${n.created_by_name}`;
            case 'delete':
                return `${this.language.getLabel('LBL_DELETED')} ${n.bean_name} ${this.language.getLabel('LBL_BY')} ${n.created_by_name}`;
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
                // push only if we also have event data
                if (event.data) {
                    this.pushNotification(event.data);
                }
                break;
        }
    }

    /**
     * format notification date and parse additional infos
     * @private
     * @param n
     */
    private parseNotification(n: NotificationI) {
        const timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
        const dateFormat = `${this.preferences.getDateFormat()} ${this.preferences.getTimeFormat()}`;
        let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(n.notification_date).tz(timeZone) : moment(n.notification_date);
        n.notification_date = pDateTime.isValid() ? pDateTime.format(dateFormat) : null;

        if (!!n.additional_infos && typeof n.additional_infos == 'string') {
            n.additional_infos = JSON.parse(n.additional_infos);
        }
        return n;
    }
}
