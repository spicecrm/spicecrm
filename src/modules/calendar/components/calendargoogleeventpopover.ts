/**
 * @module ModuleCalendar
 */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Renderer2, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {calendar} from "../services/calendar.service";
import {language} from "../../../services/language.service";

@Component({
    templateUrl: './src/modules/calendar/templates/calendargoogleeventpopover.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGoogleEventPopover implements AfterViewInit {
    /**
     * holds the google event data
     */
    public event: any = {};
    /**
     * holds the popover side
     */
    public popoverSide: 'right' | 'left' = 'right';
    /**
     * holds the popover position
     */
    public popoverPosition: 'top' | 'bottom' = 'top';
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
    private hidePopoverTimeout: any = {};
    /**
     * element reference of the popover container to handle its style
     */
    @ViewChild('popoverContainer', {read: ViewContainerRef, static: true}) private popoverContainer: ViewContainerRef;

    constructor(private metadata: metadata,
                private calendar: calendar,
                private language: language,
                private renderer: Renderer2,
                private cdr: ChangeDetectorRef) {
    }

    /**
    * @return popover style and set the popover sides and position
    */
    get popoverStyle() {

        if (this.isMobileView) {
            return {left: 0, bottom: 0, width: '100%'};
        }

        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popoverContainer.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverSide = 'right';
        } else {
            this.popoverSide = 'left';
        }

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + 30 > 0) {
            this.popoverPosition = 'bottom';
            return {
                top: (rect.top - poprect.height + 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        } else {
            this.popoverPosition = 'top';
            return {
                top: (rect.top - 30) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 30) + 'px'
            };
        }
    }

    /**
    * @return nubbin class
    */
    get nubbinClass() {
        return (this.popoverSide == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverPosition;
    }

    /**
    * detectChanges to prevent angular change detection error
    */
    public ngAfterViewInit() {
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
    * clear hide timeout
    */
    private onMouseEnter() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
    * call to force closing the popover
    */
    private onMouseOut(event) {
        this.closePopover(true, event);
    }
}
