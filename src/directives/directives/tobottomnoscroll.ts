/**
 * @module directives
 */
import {
    Directive,
    HostBinding,
    ElementRef,
    Renderer2,
    DoCheck, AfterViewInit
} from '@angular/core';
@Directive({
    selector: '[tobottomnoscroll]',
})
export class ToBottomNoScrollDirective implements DoCheck {

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    public ngDoCheck() {
        let rect = this.element.nativeElement.getBoundingClientRect();
        this.renderer.setStyle(this.element.nativeElement, 'height', window.innerHeight - rect.top - parseInt( getComputedStyle(this.element.nativeElement).marginBottom, 10 ) - parseInt( getComputedStyle(this.element.nativeElement).paddingBottom, 10 ) + 'px');
    }
}
