/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component} from '@angular/core';
import {notification} from "../../services/notification.service";
import {userpreferences} from "../../services/userpreferences.service";
import {navigationtab} from "../../services/navigationtab.service";
import {language} from "../../services/language.service";

/**
 * display notifications list view
 */
@Component({
    selector: 'global-notifications-list-view',
    templateUrl: '../templates/globalnotificationslistview.html'
})
export class GlobalNotificationsListView {

    constructor(public notificationService: notification,
               public navigationTab: navigationtab,
               public language: language,
               public cdRef: ChangeDetectorRef,
                public userPreferences: userpreferences) {
        this.setTabInfo();
    }

    /**
     * @return boolean true if desktop notification not supported in browser or permission denied
     */
    get desktopNotificationsDisabled() {
        return !('Notification' in window);
    }

    /**
     * @return string desktop notification permission
     */
    get desktopNotificationsStatus(): 'default' | 'denied' | 'granted' {
        return Notification.permission;
    }

    /**
     * set the navigation tab info
     * @private
     */
   public setTabInfo() {
        this.navigationTab.setTabInfo({
            displayname: this.language.getLabel('LBL_NOTIFICATIONS'),
            displayicon: 'notification'
        });
    }

    /**
     * reload the notifications
     */
    public reload() {
        this.notificationService.reloadNotifications();
    }

    /**
     * mark notification as read
     * @param id
     */
    public markAsRead(id: string) {
        this.notificationService.markAsRead(id);
    }

    /**
     * mark notification as read
     */
    public markAllAsRead() {
        this.notificationService.markAllAsRead();
    }

    /**
     * load more items if the scroll reached to bottom
     * @param element
     */
    public onScroll(element: HTMLElement) {
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.notificationService.loadMoreNotifications();
        }
    }

    /**
     * set setting to user preferences
     * @param name
     * @param value
     */
    public setSetting(name: string, value: boolean) {
        this.userPreferences.setPreference(name, value);
    }

    /**
     * set display desktop notifications value in the user preferences
     * @param value
     * @private
     */
   public setDisplayDesktopNotification(value: boolean) {

        if (this.desktopNotificationsStatus === 'default') {

            Notification.requestPermission().then((p: NotificationPermission) => {
                if (p == 'granted') {
                    this.setSetting('displayDesktopNotifications', value);
                }
                this.cdRef.detectChanges();
            });
        } else {
            this.setSetting('displayDesktopNotifications', value);
        }
    }
}
