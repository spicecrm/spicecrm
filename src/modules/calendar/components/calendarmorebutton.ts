/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, HostListener, Injector, Input, OnDestroy} from '@angular/core';
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

@Component({
    selector: 'calendar-more-button',
    templateUrl: './src/modules/calendar/templates/calendarmorebutton.html'

})

export class CalendarMoreButton implements OnDestroy {
    /*
    * @input moreevents: any[]
    */
    @Input("moreevents") public events: any[] = [];
    /*
    * @input ismobileview: boolean = false
    */
    @Input("ismobileview") private isMobileView: boolean = false;
    /*
    * @input sheetday: any
    */
    @Input("sheetday") private sheetDay: any = {};

    private popoverComponentRef = null;
    private showPopoverTimeout: any = {};

    constructor(private elementRef: ElementRef,
                private language: language,
                private footer: footer,
                private injector: Injector,
                private metadata: metadata) {
    }

    /*
    * @closePopover
    */
    public ngOnDestroy() {
        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover(true);
        }
    }

    /*
    * @listen mouseenter
    * @setTimeout showPopoverTimeout = 500ms
    * @renderPopover
    */
    @HostListener('mouseenter')
    private onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    /*
    * @listen mouseleave
    * @clearTimeout showPopoverTimeout
    * @closePopover
    */
    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }
        if (this.popoverComponentRef) {
            this.popoverComponentRef.closePopover();
        }
    }

    /*
    * @addComponent CalendarMorePopover to the footer
    * @pass events
    * @sort events by start date
    * @pass isMobileView
    * @pass sheetDay
    * @pass parentElementRef
    * @set popoverComponentRef
    */
    private renderPopover() {
        this.metadata.addComponent('CalendarMorePopover', this.footer.modalcontainer, this.injector)
            .subscribe(
                popoverRef => {
                    popoverRef.instance.events = this.events.slice().sort((a, b) => a.start.isAfter(b.start) ? 1 : -1);
                    popoverRef.instance.isMobileView = this.isMobileView;
                    popoverRef.instance.sheetDay = this.sheetDay;
                    popoverRef.instance.parentElementRef = this.elementRef;
                    this.popoverComponentRef = popoverRef.instance;
                }
            );
    }
}
