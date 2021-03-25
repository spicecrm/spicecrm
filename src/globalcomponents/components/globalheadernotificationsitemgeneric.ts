/**
 * @module GlobalComponents
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NavigationI} from "../interfaces/globalcomponents.interfaces";

/**
 * display a notification item for generic types
 */
@Component({
    selector: 'global-header-notifications-item-generic',
    templateUrl: './src/globalcomponents/templates/globalheadernotificationsitemgeneric.html'
})
export class GlobalHeaderNotificationsItemGeneric {
    /**
     * holds the notification data
     */
    @Input() public notification: NavigationI;
}
