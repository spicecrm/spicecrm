/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';
import {NotificationI} from "../interfaces/globalcomponents.interfaces";

/**
 * display a notification item for assignment type
 */
@Component({
    selector: 'global-header-notifications-item-delete',
    templateUrl: './src/globalcomponents/templates/globalheadernotificationsitemdelete.html'
})
export class GlobalHeaderNotificationsItemDelete {
    /**
     * holds the notification data
     */
    @Input() public notification: NotificationI;
}
