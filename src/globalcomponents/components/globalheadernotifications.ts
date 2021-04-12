/**
 * @module GlobalComponents
 */
import {Component, ElementRef, Renderer2} from '@angular/core';
import {NotificationService} from "../../services/notification.service";

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
    private clickListener: () => void;

    constructor(private notificationService: NotificationService,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
    }

    /**
     * mark notification as read
     * @param id
     */
    public markAsRead(id: string) {
        this.notificationService.markAsRead(id);
    }

    /**
     * toggle open popover and handle closing the popover when the click is outside the container
     */
    public toggleOpenPopover() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
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
     * load more items if the scroll reached to bottom
     * @param element
     */
    public onScroll(element: HTMLElement) {
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.notificationService.loadMoreNotifications();
        }
    }
}
