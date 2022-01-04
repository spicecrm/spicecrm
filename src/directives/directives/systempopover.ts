/**
 * @module DirectivesModule
 */
import {Directive, Input, HostListener, OnDestroy, ElementRef, OnInit, Optional} from '@angular/core';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";

/**
 * a generic popover directive that can be tied to an element and pass in an injector and a componentset to be rendered in the popover
 */
@Directive({
    selector: '[system-pop-over]',
})
export class SystemPopOverDirective implements OnDestroy {
    /**
     * reference to the component that is rendered as popover
     */
    public popoverCmp = null;

    /**
     * a timeout that is initalized when the user hovers over the component
     */
    public showPopoverTimeout: any = {};

    public _popoverSettings: any = {
        injector: {},
        componentset: {},
        component: ''
    }

    /**
     * as part of the attribute the model paramaters can be passed in
     *
     * @Input('modelProvider') provided_model:{
     *   module:string,
     *   id:string,
     *   data:any,
     *   };
     *
     * @param provided_model
     */
    @Input('system-pop-over')
    set popoverSettings(popoverSettings: { injector: any, component: string, componentset: any }) {
        this._popoverSettings.injector = popoverSettings.injector;
        this._popoverSettings.componentset = popoverSettings.componentset;
        this._popoverSettings.component = popoverSettings.component;
    }

    constructor(
        public metadata: metadata,
        public footer: footer,
        public elementRef: ElementRef
    ) {

    }

    /**
     * listens to the mouseenter event on the host and if the mouse enters starts the timeout to render the popover
     */
    @HostListener('mouseenter')
    public onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    /**
     * catches when the user leaves the host element and either stops the timeout or closes the popover
     */
    @HostListener('mouseleave')
    public onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }
    }

    /**
     * renders the popover
     */
    public renderPopover() {
        this.metadata.addComponent('SystemPopover', this.footer.footercontainer, this._popoverSettings.injector).subscribe(
            popover => {
                popover.instance.parentElementRef = this.elementRef;
                popover.instance.componentset = this._popoverSettings.componentset;

                this.popoverCmp = popover.instance;
            }
        );
    }

    /**
     * catches if the host component is destroyed and also destoys the popover
     */
    public ngOnDestroy() {
        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}
