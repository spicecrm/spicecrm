import {Directive, effect, ElementRef, input, OnDestroy, output, Renderer2, signal,} from '@angular/core';
import {animate, AnimationBuilder, AnimationPlayer, style} from '@angular/animations';
import {BreakpointObserver} from '@angular/cdk/layout';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Directive({
    selector: '[system-responsive-sidebar]',
    standalone: false,
    exportAs: 'systemResponsiveSidebar'
})
export class SystemResponsiveSidebarDirective implements OnDestroy {
    /**
     * input side of the sidebar
     */
    readonly side = input<'left' | 'right'>('left');
    /**
     * emitter for is open flag
     */
    public isOpen$ = output<boolean>();
    // Convert Media Query to a Signal
    public readonly isMobile = toSignal(
        this.breakpointObserver.observe('(max-width: 767px)').pipe(map(res => res.matches)),
        {initialValue: false}
    );
    /**
     * is open flag
     */
    private _isOpen = signal(undefined);
    /**
     * is open flag
     */
    readonly isOpen = this._isOpen.asReadonly();
    /**
     * animation player reference
     * @private
     */
    private player?: AnimationPlayer;
    /**
     * holds the click listener to remove it on close
     * @private
     */
    private clickListener: () => void;

    constructor(private el: ElementRef,
                private renderer: Renderer2,
                private builder: AnimationBuilder,
                private breakpointObserver: BreakpointObserver) {

        // Effect runs whenever isMobile or isOpen signals change
        effect(() => {
            const mobile = this.isMobile();
            const open = this._isOpen();

            if (mobile) {
                this.applyMobileClass();
                if (open !== undefined) {
                    this.playAnimation(open);
                }
            } else {
                this.resetDesktopStyles();
            }
        });
    }

    public ngOnDestroy() {
        this.removeClickListener();
    }

    /**
     * toggle the sidebar open/close
     */
    public toggle() {
        this.setIsOpen(!this._isOpen());
    }

    /**
     * emit click outside the container to handle isOpen from the parent
     * @param e
     */
    private onDocumentClick(e: MouseEvent) {
        if (this.isMobile() && this._isOpen() && !this.el.nativeElement.contains(e.target)) {
            this.setIsOpen(false);
        }
    }

    /**
     * set is open flag
     * @param value
     */
    private setIsOpen(value: boolean) {
        this._isOpen.set(value);

        this.removeClickListener();

        if (value) {
            this.clickListener = this.renderer.listen('document', 'click', e => this.onDocumentClick(e));
        }

        this.isOpen$.emit(this._isOpen());
    }

    /**
     * remove click listener if it exists
     * @private
     */
    private removeClickListener() {
        if (!this.clickListener) return;
        this.clickListener();
        this.clickListener = undefined;
    }

    /**
     * play animation
     * @param open
     * @private
     */
    private playAnimation(open: boolean) {

        if (this.player) this.player.destroy();

        const metadata = open
            ? [
                style({transform: this.side() === 'left' ? 'translateX(-100%)' : 'translateX(100vw)'}),
                style({[this.side()]: '0'}),
                style({width: '90%'}),
                animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', style({transform: 'translateX(0)'}))
            ]
            : [
                style({transform: 'translateX(0)'}),
                animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({transform: this.side() === 'left' ? 'translateX(-100%)' : 'translateX(100vw)'}))
            ];

        const factory = this.builder.build(metadata);
        this.player = factory.create(this.el.nativeElement);
        this.player.play();
    }

    /**
     * apply mobile class
     * @private
     */
    private applyMobileClass() {
        const native = this.el.nativeElement;
        this.renderer.addClass(native, 'system-responsive-sidebar-small');
    }

    /**
     * reset desktop styles to default
     * @private
     */
    private resetDesktopStyles() {

        if (this.player) {
            this.player.pause();
            this.player.destroy();
            this.player = undefined;
        }

        const native = this.el.nativeElement;
        this.renderer.removeStyle(native, 'transform');
        this.renderer.removeClass(native, 'system-responsive-sidebar-small');
    }
}