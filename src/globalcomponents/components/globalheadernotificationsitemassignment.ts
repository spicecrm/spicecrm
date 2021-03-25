/**
 * @module GlobalComponents
 */
import {Component} from '@angular/core';
import {GlobalHeaderNotificationsItemGeneric} from "./globalheadernotificationsitemgeneric";

/**
 * display a notification item for assignment type
 */
@Component({
    selector: 'global-header-notifications-item-assignment',
    templateUrl: './src/globalcomponents/templates/globalheadernotificationsitemassignment.html'
})
export class GlobalHeaderNotificationsItemAssignment extends GlobalHeaderNotificationsItemGeneric {

}
