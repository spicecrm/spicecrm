/**
 * @module GlobalComponents
 */
import {ChangeDetectorRef, Component, ElementRef, Renderer2} from '@angular/core';
import {notification} from "../../services/notification.service";
import {userpreferences} from "../../services/userpreferences.service";
import {modal} from "../../services/modal.service";
import {subscription} from "../../services/subscription.service";
import {Router} from "@angular/router";

/**
 * display notifications on the global header
 */
@Component({
    selector: 'global-header-notifications',
    templateUrl: '../templates/globalheadernotifications.html'
})
export class GlobalHeaderNotifications {
    /**
     * if true show the notifications popover
     * @private
     */
    public isOpen: boolean = false;
    /**
     * if true the show settings button clicked
     * @private
     */
    public showSettings: boolean = false;
    /**
     * holds the click listener function to enable remove
     * @private
     */
    public clickListener: () => void;

    /**
     * the distance from the right frame for the popover
     */
    public right: number = 0;

    constructor(public notificationService: notification,
                public elementRef: ElementRef,
                public modal: modal,
                public subscription: subscription,
                public userPreferences: userpreferences,
                public cdRef: ChangeDetectorRef,
                public router: Router,
                public renderer: Renderer2) {
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
        // get the right position
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        this.right = window.innerWidth - rect.right + (rect.left - rect.right) / 2 - 3;

        // toggle open
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
     * returns the right margin
     */
    get popoverStyle(){
        return {
            right: this.right + 'px'
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

    /**
     * navigate to notifications list view component
     */
    public showAllNotifications() {
        this.closePopover();
        this.router.navigate(['notifications']);
    }

    /**
     * a getter to see if the user has subscriptions
     */
    get hasSubscriptions(){
        return this.subscription.subscriptions.length > 0;
    }

    /**
     * opens the modal for the users subscriptions
     */
    public manageSubscriptions(){
        this.closePopover();
        this.modal.openModal('GlobalSubscriptionsManager')
    }
}
