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
import {ChangeDetectorRef, Component, ElementRef, Renderer2} from '@angular/core';
import {notification} from "../../services/notification.service";
import {userpreferences} from "../../services/userpreferences.service";
import {Router} from "@angular/router";

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
     * if true the show settings button clicked
     * @private
     */
    private showSettings: boolean = false;
    /**
     * holds the click listener function to enable remove
     * @private
     */
    private clickListener: () => void;

    constructor(public notificationService: notification,
                private elementRef: ElementRef,
                public userPreferences: userpreferences,
                private cdRef: ChangeDetectorRef,
                private router: Router,
                private renderer: Renderer2) {
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
     * toggle open popover and handle closing the popover when the click is outside the container
     */
    public toggleOpenPopover() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.showSettings = false;
            this.clickListener = this.renderer.listen('document', 'click', event => {
                if (this.elementRef.nativeElement.contains(event.target)) return;
                this.isOpen = false;
                this.clickListener();
            });
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * close the popover and remove the click listener
     */
    public closePopover() {
        this.isOpen = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * toggle show settings value
     */
    public toggleShowSettings() {
        this.showSettings = !this.showSettings;
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

    /**
     * navigate to notifications list view component
     */
    public showAllNotifications() {
        this.closePopover();
        this.router.navigate(['notifications']);
    }
}
