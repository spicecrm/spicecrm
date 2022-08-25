/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

/**
 * Display a popover to list the google event details
 */
@Component({
    selector: 'calendar-microsoft-event-popover',
    templateUrl: '../templates/calendarmicrosofteventpopover.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarMicrosoftEventPopover implements AfterViewInit {
    /**
     * holds the microsoft event data
     */
    public event: any = {};
    /**
     * holds the nubbin class
     */
    public nubbinClass: string = '';
    /**
     * holds the popover style
     */
    public popoverStyle: any = {};
    /**
     * mobile view boolean to fix the display position on active
     */
    public isMobileView: boolean = false;
    /**
     * reference of the parent element to handle the positioning
     */
    public parentElementRef;
    /**
     * reference of self for destroy purpose
     */
    public self: any;
    /**
     * holds the popover hide timeout
     */
    public hidePopoverTimeout: any = {};
    /**
     * element reference of the popover container to handle its style
     */
    @ViewChild('popoverContainer', {read: ViewContainerRef, static: true}) public popoverContainer: ViewContainerRef;

    constructor(public metadata: metadata,
                public calendar: calendar,
                public language: language,
                public renderer: Renderer2,
                public cdr: ChangeDetectorRef) {
    }

    /**
     * detectChanges to prevent angular change detection error
     * set popover position
     */
    public ngAfterViewInit() {
        this.setPopoverPosition();
        this.cdr.detectChanges();
    }

    /**
     * handle closing the popover
     */
    public closePopover(force = false, event?) {
        if (force) {
            if (event && event.relatedTarget.classList.contains('slds-dropdown')) {
                let dropdownListener = this.renderer.listen(event.relatedTarget, 'click', () => {
                    dropdownListener();
                    this.self.destroy();
                });
            } else {
                this.self.destroy();
            }
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }

    /**
     * set popover style and the popover sides and position
     */
    public setPopoverPosition() {

        if (this.isMobileView) {
            return {left: 0, bottom: 0, width: '100%'};
        }

        let popoverSide: string;
        let popoverPosition: string;

        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popoverContainer.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            popoverSide = 'right';
        } else {
            popoverSide = 'left';
        }

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + 30 > 0) {
            popoverPosition = 'bottom';
            this.popoverStyle = {
                top: (rect.top - poprect.height + 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        } else {
            popoverPosition = 'top';
            this.popoverStyle = {
                top: (rect.top - 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        }

        this.nubbinClass = (popoverSide == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + popoverPosition;
    }

    /**
     * clear hide timeout
     */
    public onMouseEnter() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
     * call to force closing the popover
     */
    public onMouseLeave(event) {
        this.closePopover(true, event);
    }
}
