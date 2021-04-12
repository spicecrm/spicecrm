/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';
import {NotificationI} from "../interfaces/globalcomponents.interfaces";

/**
 * display a notification item for assignment type
 */
@Component({
    selector: 'global-header-notifications-item-assign',
    templateUrl: './src/globalcomponents/templates/globalheadernotificationsitemassign.html'
})
export class GlobalHeaderNotificationsItemAssign {
    /**
     * holds the notification data
     */
    @Input() public notification: NotificationI;
}
