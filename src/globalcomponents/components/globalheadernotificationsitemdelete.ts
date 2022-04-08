/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';
import {NotificationI} from "../../services/interfaces.service";
import {notification} from "../../services/notification.service";

/**
 * display a notification item for assignment type
 */
@Component({
    selector: 'global-header-notifications-item-delete',
    templateUrl: '../templates/globalheadernotificationsitemdelete.html'
})
export class GlobalHeaderNotificationsItemDelete {
    /**
     * holds the notification data
     */
    @Input() public notification: NotificationI;
    /**
     * if true render the box template for new pushed notifications
     */
    @Input() public asBox: boolean = false;

    constructor(public notificationService: notification) {
    }
}
