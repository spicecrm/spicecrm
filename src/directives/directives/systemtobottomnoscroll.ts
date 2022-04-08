/**
 * @module DirectivesModule
 */
import {
    Directive,
    HostBinding,
    ElementRef,
    Renderer2,
    DoCheck, AfterViewInit, Input
} from '@angular/core';

import {footer} from "../../services/footer.service";

@Directive({
    selector: '[system-to-bottom-noscroll]', // tobottomnoscroll
})
export class SystemToBottomNoScrollDirective implements DoCheck {

    @Input('system-to-bottom-noscroll') public toBottomNoScroll: boolean = true;

    /**
     * a margin in pixels fromt he bottom
     * @private
     */
    @Input() public marginBottom = 0;

    constructor(public element: ElementRef, public renderer: Renderer2, public footer: footer) {
    }

    public ngDoCheck() {
        if (this.toBottomNoScroll === false) return;
        let rect = this.element.nativeElement.getBoundingClientRect();
        let height = Math.floor(window.innerHeight - rect.top - this.marginBottom - parseInt( getComputedStyle(this.element.nativeElement).marginBottom, 10 ) - parseInt( getComputedStyle(this.element.nativeElement).paddingBottom, 10 ) - this.footer.visibleFooterHeight);
        this.renderer.setStyle(this.element.nativeElement, 'height', height + 'px');
    }
}
