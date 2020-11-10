/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {configurationService} from "../../services/configuration.service";
import {backend} from "../../services/backend.service";
import {session} from "../../services/session.service";

/** @ignore */
declare var moment;

/**
 * display notifications on the global header
 */
@Component({
    selector: 'global-header-notifications',
    templateUrl: './src/globalcomponents/templates/globalheadernotifications.html'
})
export class GlobalHeaderNotifications {
    /**
     * if true show the notifications popover
     * @private
     */
    private isOpen: boolean = false;
    /**
     * holds the unread notifications count
     * @private
     */
    private unreadCount: number = 0;
    /**
     * holds the notifications
     * @private
     */
    private notifications = [];

    constructor(private configuration: configurationService,
                private session: session,
                private backend: backend) {
        this.loadNotifications();
        this.setUnreadCount();
    }

    /**
     * load the notifications from the configuration service
     * @private
     */

    private loadNotifications() {
        this.notifications = this.configuration.getData('spicenotifications') || [];
        this.notifications.map(n => {
            const timeZone = this.session.getSessionData('timezone') || moment.tz.guess(true);
            let pDateTime = typeof timeZone == 'string' && timeZone.length > 0 ? moment.utc(n.notification_date).tz(timeZone) : moment(n.notification_date);
            n.notification_date = pDateTime.isValid() ? pDateTime : null;
            n.notification_read = n.notification_read == '1';
            return n;
        });
    }

    /**
     * set the notifications unread count
     * @private
     */
    private setUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.notification_read).length;
    }

    /**
     * toggle open popover
     * @private
     */
    private toggleOpenPopover() {
        this.isOpen = !this.isOpen;
    }

    /**
     * mark notification as read
     * @param notification
     * @private
     */
    private markAsRead(notification) {
        this.backend.postRequest('SpiceNotifications/markAsRead/' + notification.id).subscribe(res => {
            if (!res) return;
            notification.notification_read = 1;
            this.setUnreadCount();
        });
    }
}
