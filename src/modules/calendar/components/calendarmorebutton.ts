/**
 * @module ModuleCalendar
 */
import {Component, ElementRef, HostListener, Injector, Input, OnDestroy} from '@angular/core';
import {footer} from "../../../services/footer.service";
import {metadata} from "../../../services/metadata.service";
import {language} from "../../../services/language.service";

/**
 * Displays a button in a month day cell to handle displaying the overflowed events in a modal
 */
@Component({
    selector: 'calendar-more-button',
    templateUrl: '../templates/calendarmorebutton.html'

})

export class CalendarMoreButton implements OnDestroy {
    /*
    * @input moreevents: any[]
    */
    @Input("moreevents") public events: any[] = [];
    /*
    * @input ismobileview: boolean = false
    */
    @Input("ismobileview") public isMobileView: boolean = false;
    /*
    * @input sheetday: any
    */
    @Input("sheetday") public sheetDay: any = {};

    public popoverComponentRef = null;
    public showPopoverTimeout: any = {};

    constructor(public elementRef: ElementRef,
                public language: language,
                public footer: footer,
                public injector: Injector,
                public metadata: metadata) {
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
    public onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    /*
    * @listen mouseleave
    * @clearTimeout showPopoverTimeout
    * @closePopover
    */
    @HostListener('mouseleave')
    public onMouseOut() {
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
    public renderPopover() {
        this.metadata.addComponent('CalendarMorePopover', this.footer.modalcontainer, this.injector)
            .subscribe(
                popoverRef => {
                    popoverRef.instance.events = this.events;
                    popoverRef.instance.isMobileView = this.isMobileView;
                    popoverRef.instance.sheetDay = this.sheetDay;
                    popoverRef.instance.parentElementRef = this.elementRef;
                    this.popoverComponentRef = popoverRef.instance;
                }
            );
    }
}
