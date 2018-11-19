import {
    Directive,
    HostBinding,
    ElementRef,
    Renderer2,
    DoCheck
} from '@angular/core';
@Directive({
    selector: '[tobottom]',
})
export class ToBottomDirective implements DoCheck {

    constructor(private element: ElementRef, private renderer: Renderer2) {
    }

    @HostBinding('class') private elementClass = 'slds-scrollable--y';

    public ngDoCheck() {
        let rect = this.element.nativeElement.getBoundingClientRect();
        this.renderer.setStyle(this.element.nativeElement, 'height', window.innerHeight - rect.top + 'px');
    }
}
