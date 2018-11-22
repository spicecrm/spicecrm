import {Component, ElementRef, HostListener, Input, OnDestroy} from '@angular/core';
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";

declare var moment: any;

@Component({
    selector: 'calendar-more-button',
    templateUrl: './src/modules/calendar/templates/calendarmorebutton.html'

})

export class CalendarMoreButton implements OnDestroy{

    @Input("moreevents") private events: any[] = [];
    private popoverCmp = null;
    private showPopoverTimeout: any = {};

    constructor(private elementRef: ElementRef,
                private footer: footer,
                private metadata: metadata) {
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
        this.metadata.addComponent('CalendarMorePopover', this.footer.modalcontainer).subscribe(
            popover => {
                popover.instance.events = this.events;
                popover.instance.parentElementRef = this.elementRef;
                this.popoverCmp = popover.instance;
            }
        );
    }

    public ngOnDestroy() {
        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}