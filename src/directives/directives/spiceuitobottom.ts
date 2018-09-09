import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[spiceuitobottom]'
})
export class SpiceUIToBottomDirective {
    constructor(el: ElementRef) {
        el.nativeElement.style.backgroundColor = 'yellow';
        //let rect = el.nativeElement.getBoundingClientRect();
        //el.nativeElement.style.height = 'calc(100vh - ' + rect.top + 'px)';
    }
}