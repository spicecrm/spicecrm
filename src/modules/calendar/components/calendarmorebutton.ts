/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'calendar-more-button',
    templateUrl: './src/modules/calendar/templates/calendarmorebutton.html'

})

export class CalendarMoreButton implements OnDestroy {

    @Input("moreevents") private events: any[] = [];
    @Input("ismobileview") private isMobileView: boolean = false;
    @Input("sheetday") private sheetDay: any = {};
    private popoverCmp = null;
    private showPopoverTimeout: any = {};

    constructor(private elementRef: ElementRef,
                private language: language,
                private footer: footer,
                private metadata: metadata) {
    }

    public ngOnDestroy() {
        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }

    @HostListener('mouseenter')
    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }
        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }
    }

    private renderPopover() {
        this.metadata.addComponent('CalendarMorePopover', this.footer.modalcontainer)
            .subscribe(
                popover => {
                    popover.instance.events = this.events;
                    popover.instance.isMobileView = this.isMobileView;
                    popover.instance.sheetDay = this.sheetDay;
                    popover.instance.parentElementRef = this.elementRef;
                    this.popoverCmp = popover.instance;
                }
            );
    }
}