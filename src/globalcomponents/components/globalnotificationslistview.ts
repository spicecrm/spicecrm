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
    templateUrl: './src/globalcomponents/templates/globalnotificationslistview.html'
})
export class GlobalNotificationsListView {

    constructor(public notificationService: notification,
                private navigationTab: navigationtab,
                private language: language,
                private cdRef: ChangeDetectorRef,
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
    private setTabInfo() {
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
    private setDisplayDesktopNotification(value: boolean) {

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
