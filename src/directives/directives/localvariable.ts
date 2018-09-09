import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";

/**
 * a directive to store variables locally for use in templates... most used inside ngFor loops...
 * author: sebastian franz
 * source: https://stackoverflow.com/questions/38582293/how-to-declare-a-variable-in-a-template-in-angular2/43172992#43172992
 */
@Directive({
    selector: '[ngVar]',
})
export class LocalVariableDirective {
    @Input()
    set ngVar(context: any) {
        this.context.$implicit = this.context.ngVar = context;
        this.updateView();
    }

    context: any = {};

    constructor(private vcRef: ViewContainerRef, private templateRef: TemplateRef<any>) {}

    updateView() {
        this.vcRef.clear();
        this.vcRef.createEmbeddedView(this.templateRef, this.context);
    }
}