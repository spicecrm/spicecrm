import { Directive, ElementRef, Input } from '@angular/core';
@Directive({
    selector: '[spoiceui-autofocus]'
})
export class SpiceUIAutofocusDirective {
    @Input() appAutofocus: boolean;
    private el: any;
    constructor(
        private elementRef:ElementRef,
    ) {
        this.el = this.elementRef.nativeElement;

    }
    ngOnInit(){
        this.el.focus();
    }

}