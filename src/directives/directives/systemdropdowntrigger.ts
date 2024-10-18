/**
 * @module DirectivesModule
 */
import {
    ChangeDetectorRef, ComponentRef,
    Directive,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    OnDestroy, OnInit,
    Renderer2
} from '@angular/core';
import {footer} from "../../services/footer.service";
import {layout} from "../../services/layout.service";
import {modal} from "../../services/modal.service";
import {SystemDropdownMobileModal} from "../../systemcomponents/components/systemdropdownmobilemodal";
import {DomPortal} from "@angular/cdk/portal";
import {fromEvent} from "rxjs";
import {take} from "rxjs/operators";

/**
 * This directive can be added to an element to handle show/hide the dropdown element
 * it also moves the dropdown element to the footer and re position it to prevent any overflow.
 *
 * <div system-dropdown-trigger>
 *      <button>dropdown button</button>
 *      <div class="slds-dropdown">
 *          dropdown content
 *      </div>
 * </div>
 */
@Directive({
    selector: '[system-dropdown-trigger]'
})
export class SystemDropdownTriggerDirective implements OnInit, OnDestroy {

    @HostBinding('class.slds-is-open') public dropDownOpen: boolean = false;
    public hasTriggerButton = false;
    public triggerElementButton: ElementRef;
    public clickListener: any;
    public triggerClickListener: any;
    public previousTriggerRect: any;
    public dropdownElement: HTMLElement;
    /**
     * if true apply the sticky bottom class for the dropdown container
     * @private
     */
    @Input() private stickyOnMobile: boolean = false;
       /**
     * if true always close the dropdown on click
     * @private
     */
    @Input() private autoClose: boolean = false;
    /*
    * @input dropdowntrigger: boolean = false
    */
    @Input('system-dropdown-trigger') public dropdowntriggerdisabled: boolean = false;
    /**
     * holds a reference of the mobile modal
     * @private
     */
    private mobileModalRef: ComponentRef<SystemDropdownMobileModal>;

    constructor(
        public renderer: Renderer2,
        public elementRef: ElementRef,
        public footer: footer,
        public layout: layout,
        public cdRef: ChangeDetectorRef,
        private modal: modal
    ) {

    }

    /**
     * @return trigger element reference either the button element directive if used or this element ref
     */
    get triggerElement() {
        return this.hasTriggerButton ? this.triggerElementButton.nativeElement : this.elementRef.nativeElement;
    }

    /**
     * set dropdown element
     */
    public ngOnInit() {
        this.setDropdownElement();
    }

    public ngOnDestroy() {
        this.removeScrollListener();
        this.restoreDropdownFromFooter();
        if (this.clickListener) this.clickListener();
        if (this.triggerClickListener) this.triggerClickListener();
    }

    /**
     * remove scroll listener
     * @private
     */
    private removeScrollListener() {
        window.removeEventListener("scroll", this.scrollHandlerFn, {capture: true});
    }

    /**
     * move the dropdown element to the footer
     * reset dropdown right and transform
     * set dropdown position
     * toggle open dropdown
     * listen to global click event
     * remove dropdown from footer if it is closed
     * remove global click listener
     */
    public toggleDropdown() {

        if (!this.dropdownElement) {
            this.setDropdownElement();
        }

        if (this.dropdowntriggerdisabled || !this.dropdownElement) return false;

        if (!this.dropDownOpen) {
            this.open();
        } else {
            this.close();
        }
    }

    /**
     * open dropdown
     */
    public open() {

        this.dropDownOpen = true;

        this.moveDropdownToFooter();
        this.setDropdownElementPosition();

        this.scrollHandlerFn = () => requestAnimationFrame(
            () => this.setDropdownElementPosition()
        );

        this.clickListener = this.renderer.listen("document", "click", (e) => this.onClick(e));
        // use window scroll listener with capture to catch any scroll event in the app
        window.addEventListener("scroll", this.scrollHandlerFn, {capture: true});
    }

    /**
     * holds the scroll handler
     * @private
     */
    private scrollHandlerFn: () => void;

    /**
     * open the dropdown on the host click if the trigger button was not defined
     * @private
     */
    @HostListener('click')
    public hostClick() {
        if (this.hasTriggerButton) return;
        this.toggleDropdown();
    }

    /*
    * @remove the dropdown element from origin
    * @append the dropdown element to the footer
    */
    public moveDropdownToFooter() {

        if (this.stickyOnMobile && this.layout.screenwidth == 'small') {

            this.modal.openStaticModal(SystemDropdownMobileModal).subscribe((modalRef: ComponentRef<SystemDropdownMobileModal>) => {
                this.mobileModalRef = modalRef;
                modalRef.instance.portalContent = new DomPortal<HTMLElement>(this.dropdownElement);
                modalRef.instance.destroy$.subscribe({
                    complete: () => {
                        if (this.dropDownOpen) this.close();
                    }
                })
            });
        } else {
            this.renderer.removeChild(this.elementRef.nativeElement, this.dropdownElement);
            this.renderer.appendChild(this.footer.footercontainer.element.nativeElement, this.dropdownElement);
        }
    }

    /*
    * @remove the dropdown element from origin
    * @append the dropdown element to the footer
    */
    public restoreDropdownFromFooter() {

        if (this.stickyOnMobile && this.layout.screenwidth == 'small') {
            if (this.mobileModalRef) {
                this.mobileModalRef.instance.self.destroy();
                this.mobileModalRef = undefined;
                this.cdRef.detectChanges();
            }

        } else if (this.dropdownElement && this.footer.footercontainer.element.nativeElement.contains(this.dropdownElement)) {
            this.renderer.removeChild(this.footer.footercontainer.element.nativeElement, this.dropdownElement);
            this.renderer.appendChild(this.elementRef.nativeElement, this.dropdownElement);
        }
    }

    /*
    * @set dropdownElement from origin children
    */
    public setDropdownElement() {
        if (this.dropdownElement) return;
        for (let child of this.elementRef.nativeElement.children) {
            if (child.classList.contains('slds-dropdown')) {
                this.dropdownElement = child;
                break;
            }
        }
    }

    /*
    * set the dropdown element position
    */
    public setDropdownElementPosition() {

        if (this.stickyOnMobile && this.layout.screenwidth == 'small') {
            return;
        }

        let triggerRect = this.triggerElement.getBoundingClientRect();

        if (this.previousTriggerRect && JSON.stringify(this.previousTriggerRect) == JSON.stringify(triggerRect)) return;

        this.previousTriggerRect = triggerRect;

        this.renderer.setStyle(this.dropdownElement, 'transform', 'translateX(0)');
        this.renderer.setStyle(this.dropdownElement, 'z-index', '999999');
        this.renderer.addClass(this.dropdownElement, 'slds-scrollable');

        // from bottom to top direction
        if (triggerRect.bottom > window.innerHeight * 0.70 && triggerRect.bottom + this.dropdownElement.clientHeight > window.innerHeight) {
            this.renderer.setStyle(this.dropdownElement, 'bottom', (window.innerHeight - triggerRect.top) + 'px');
            this.renderer.setStyle(this.dropdownElement, 'top', 'auto');

            // on overflow adjust the height
            this.renderer.setStyle(this.dropdownElement, 'max-height', (triggerRect.top - 10) + 'px');

            // from top to bottom direction
        } else {
            this.renderer.setStyle(this.dropdownElement, 'top', triggerRect.bottom + 'px');
            this.renderer.setStyle(this.dropdownElement, 'bottom', 'auto');

            // on overflow adjust the height
            if (triggerRect.bottom < window.innerHeight * 0.70) {
                this.renderer.setStyle(this.dropdownElement, 'max-height', (window.innerHeight - triggerRect.bottom - 10) + 'px');
            }
        }

        // from right to left direction
        if (triggerRect.right - this.dropdownElement.clientWidth > 10 || triggerRect.right > window.innerWidth * 0.30) {
            this.renderer.setStyle(this.dropdownElement, 'right', (window.innerWidth - triggerRect.right) + 'px');
            this.renderer.setStyle(this.dropdownElement, 'left', 'auto');

            // ToDo: check why this was added ... sets regular dropdowns to being too small
            if(this.triggerElement.nodeName == 'INPUT') {
                this.renderer.setStyle(this.dropdownElement, 'max-width', triggerRect.width + 'px');
            }

            // from left to right direction
        } else {
            this.renderer.setStyle(this.dropdownElement, 'left', triggerRect.left + 'px');
            this.renderer.setStyle(this.dropdownElement, 'right', 'auto');

            // on overflow adjust the width
            if (triggerRect.right < window.innerWidth * 0.70) {
                this.renderer.setStyle(this.dropdownElement, 'max-width', triggerRect.width + 'px');
            }
        }

        // make sure we detect changes in case we are on a push strategy
        this.cdRef.markForCheck();
    }

    /*
    * @set dropDownOpen
    * @remove dropdown from footer
    * @append dropdown to origin
    * @remove global click listener
    */
    public onClick(event): void {
        if (this.autoClose || !this.elementRef.nativeElement.contains(event.target)) {
            this.close();
        }
    }

    /**
     * close dropdown
     */
    public close() {
        this.dropDownOpen = false;
        this.removeScrollListener();
        this.restoreDropdownFromFooter();
        this.clickListener();
        // make sure we detect changes in case we are on a push strategy
        this.cdRef.markForCheck();
    }
}
