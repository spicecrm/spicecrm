/**
 * @module GlobalComponents
 */
import {Component, Input} from '@angular/core';
import {NotificationI} from "../interfaces/globalcomponents.interfaces";

/**
 * display a notification item for change type
 */
@Component({
    selector: 'global-header-notifications-item-change',
    templateUrl: './src/globalcomponents/templates/globalheadernotificationsitemchange.html'
})
export class GlobalHeaderNotificationsItemChange {
    /**
     * holds the notification data
     */
    @Input() public notification: NotificationI;
}
