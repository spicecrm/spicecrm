import {AfterViewInit, DestroyRef, Directive, ElementRef, inject, NgZone, output} from '@angular/core';
import {SizeChangeI} from "../../systemcomponents/interfaces/systemcomponents.interfaces";

@Directive({
    selector: '[system-size-listener]',
    standalone: false
})
export class SystemSizeListenerDirective implements AfterViewInit {
    /**
     * reference to the element ref
     */
    public elementRef = inject(ElementRef);
    /**
     * emits the HTML element when the directive is loaded
     */
    public onSizeChange$ = output<SizeChangeI>({alias: 'system-size-listener'});
    /**
     * HTML content change observer reference
     * @private
     */
    private observer: ResizeObserver;
    /**
     * reference to the destroy ref
     * @private
     */
    private destroyRef = inject(DestroyRef);
    /**
     * reference to zone
     * @private
     */
    private zone = inject(NgZone);

    public ngAfterViewInit(): void {

        this.onSizeChange$.emit({
            rect: this.elementRef.nativeElement.getBoundingClientRect(), element: this.elementRef.nativeElement
        });

        this.observeChanges();
    }

    /**
     * observe the host element size change and emit the element ref when the content changes
     * @private
     */
    private observeChanges() {

        this.zone.runOutsideAngular(() => {
            this.observer = new ResizeObserver((entries) => {

                const entry = entries[0];

                if (!entry) return;

                this.zone.run(() => {
                    this.onSizeChange$.emit({
                        rect: entry.contentRect, element: this.elementRef.nativeElement
                    });
                });
            });

            this.observer.observe(this.elementRef.nativeElement);
        });

        this.destroyRef.onDestroy(() => {
            this.observer?.disconnect();
        });
    }
}