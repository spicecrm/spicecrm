/**
 * @module DirectivesModule
 */
import {Directive, ElementRef, Input, OnDestroy, SimpleChanges} from '@angular/core';
import {Subscription} from "rxjs";
import {language} from "../../services/language.service";

/**
 * translate the input label by the language service and set the placeholder attribute for the element ref
 */
@Directive({
    selector: '[system-placeholder]'
})
export class SystemPlaceholderDirective implements OnDestroy {

    /**
     * the system label to be translated and set on the element title
     */
    @Input('system-placeholder') private label: string;
    /**
     * rxjs subscription to unsubscribe the observables
     */
    private subscription = new Subscription();

    constructor(private language: language, private elementRef: ElementRef) {
        this.subscribeToCurrentLanguageChange();
    }

    /**
     * unsubscribe from the language service when the component is destroyed
     */
    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /**
     * check if the input label has changed and set the element title attribute
     *
     * @param changes
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.label.previousValue === changes.label.currentValue || !(!!changes.label.currentValue)) return;
        this.setElementTitleAttribute();
    }

    /**
     * subscribe to current language change and reset the element title
     */
    protected subscribeToCurrentLanguageChange() {
        this.subscription = this.language.currentlanguage$.subscribe(() => this.setElementTitleAttribute());
    }

    /**
     * set the element reference title attribute
     */
    private setElementTitleAttribute() {
        this.elementRef.nativeElement.setAttribute('placeholder', this.language.getLabel(this.label));
    }
}
