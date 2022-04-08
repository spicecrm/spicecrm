/**
 * @module DirectivesModule
 */
import {
    Directive,
    Input,
    HostBinding,
    ElementRef,
    Renderer2,
    DoCheck, AfterViewInit, HostListener, Output, EventEmitter
} from '@angular/core';

import {footer} from "../../services/footer.service";

/**
 * a directive that sets the height of an element to the bottom ov the vioewable viewport, renders the element as scrollable and also emits
 * an event when the content is close to the bottom so an infinite list can reload automatically
 */
@Directive({
    selector: '[system-to-bottom]',
})
export class SystemToBottomDirective implements DoCheck {

    /**
     * an emitter that fires if the scrollable item is approaching the end of the list
     * this should trigger loading more
     */
    @Output('system-to-bottom') public more: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * a margin in pixels fromt he bottom
     * @private
     */
    @Input() public marginBottom = 0;

    constructor(public element: ElementRef, public renderer: Renderer2, public footer: footer) {
    }

    /**
     * set the scrollable class
     */
    @HostBinding('class.slds-scrollable--y') public elementClass = true;

    /**
     * triggering when the element is resized
     */
    public ngDoCheck() {
        let rect = this.element.nativeElement.getBoundingClientRect();
        let height = Math.floor(window.innerHeight - rect.top - this.marginBottom - parseInt( getComputedStyle(this.element.nativeElement).marginBottom, 10 ) - parseInt( getComputedStyle(this.element.nativeElement).paddingBottom, 10 ) - this.footer.visibleFooterHeight);
        this.renderer.setStyle(this.element.nativeElement, 'height',  height + 'px');
    }

    /**
     * bind to the scroll event and if we reach the end trigger the more emitter
     *
     * @param event
     */
    @HostListener('scroll', ['$event'])
    public onScroll(event) {
        let element = this.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.more.emit(true);
        }
    }
}
