/**
 * @module DirectivesModule
 */
import {
    ApplicationRef,
    ComponentRef,
    createComponent,
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    Renderer2
} from '@angular/core';
import {SystemSpinner} from "../../systemcomponents/components/systemspinner";

/**
 * a directive that displays a loading spinner inside an overlay container over the parent
 */
@Directive({
    selector: '[system-overlay-loading-spinner]',
    host: {
        class: 'slds-is-relative'
    }
})
export class SystemOverlayLoadingSpinnerDirective {
    /**
     * emit the on cancel click event
     */
    @Output() public onCancel = new EventEmitter<void>();
    /**
     * holds the system spinner component reference
     */
    private spinnerRef: ComponentRef<SystemSpinner>;
    /**
     * container for the system spinner
     * @private
     */
    private spinnerContainer = document.createElement('div');
    /**
     * holds the cancellable value until the system spinner is rendered
     * @private
     */
    private cancellable: boolean = false;

    constructor(
        public renderer: Renderer2,
        private appRef: ApplicationRef,
        public elementRef: ElementRef
    ) {
    }

    /**
     * on loading change render/destroy the spinner
     * @param val
     */
    @Input('system-overlay-loading-spinner')
    set isLoadingChange(val) {
        if (val) {
            this.renderSpinner();
        } else {
            this.destroySpinner();
        }
    }

    /**
     * set cancellable on the system spinner
     * @param val
     */
    @Input('cancellable')
    set cancellableChange(val) {

        this.cancellable = val;

        if (!this.spinnerRef) return;

        this.spinnerRef.instance.cancellable = val;
    }

    /**
     * destroy the spinner component
     * @private
     */
    private destroySpinner() {
        if (!this.spinnerRef) return;
        this.spinnerRef.instance.onCancel$.unsubscribe();
        this.spinnerRef.destroy();
        this.spinnerRef = undefined;
        this.renderer.removeChild(this.elementRef.nativeElement, this.spinnerContainer);
    }

    /**
     * use the system spinner as overlay
     * @private
     */
    private renderSpinner() {

        if (this.spinnerRef) return;

        this.renderer.appendChild(this.elementRef.nativeElement, this.spinnerContainer);

        // create spinner component without appending it to the dom
        this.spinnerRef = createComponent(SystemSpinner, {
            environmentInjector: this.appRef.injector,
            hostElement: this.spinnerContainer
        });

        this.spinnerRef.instance.asOverlay = true;
        this.spinnerRef.instance.cancellable = this.cancellable;
        this.spinnerRef.instance.onCancel$.subscribe(() => this.onCancel.emit());

        // attach the spinner component to the application view to enable change detection
        this.appRef.attachView(this.spinnerRef.hostView);
        this.spinnerRef.changeDetectorRef.detectChanges();
    }
}
