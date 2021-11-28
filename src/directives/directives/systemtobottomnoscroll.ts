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

    @Input('system-to-bottom-noscroll') private toBottomNoScroll: boolean = true;

    /**
     * a margin in pixels fromt he bottom
     * @private
     */
    @Input() private marginBottom = 0;

    constructor(private element: ElementRef, private renderer: Renderer2, private footer: footer) {
    }

    public ngDoCheck() {
        if (this.toBottomNoScroll === false) return;
        let rect = this.element.nativeElement.getBoundingClientRect();
        let height = Math.floor(window.innerHeight - rect.top - this.marginBottom - parseInt( getComputedStyle(this.element.nativeElement).marginBottom, 10 ) - parseInt( getComputedStyle(this.element.nativeElement).paddingBottom, 10 ) - this.footer.visibleFooterHeight);
        this.renderer.setStyle(this.element.nativeElement, 'height', height + 'px');
    }
}
