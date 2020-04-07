/**
 * @module directives
 */
import {
    Directive,
    Input,
    HostListener,
    OnDestroy,
    ElementRef,
    OnInit,
    Optional,
    AfterViewInit,
    SkipSelf
} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";
import {navigationtab} from "../../services/navigationtab.service";


/**
 * displays a popover over an item
 */
@Directive({
    selector: '[modelPopOver]',
    host:{
        '[class.slds-text-link_faux]' : 'enablelink'
    },
    providers: [model]
})
export class ModelPopOverDirective implements OnInit, OnDestroy {
    /**
     * the module for the popover
     */
    @Input() private module: string;

    /**
     * the if od the model for the popover
     */
    @Input() private id: string;

    /**
     * if set to true the item is presented as a link
     */
    @Input() private enablelink: boolean = true;

    /**
     * if the modelpopover shoudl be enabled or not
     * this allows to add the directive but disable it by a parameter on the component if e.g. the popover shoudl be displayed conditional
     */
    @Input() private modelPopOver: boolean = true;

    /**
     * the popover that is rendered
     */
    private popoverCmp = null;

    /**
     * a timeout that renders the component only when the user hovers ovet eh component and does not leave short time after
     * this prevents a somehwta too nervous loading of popovers
     */
    private showPopoverTimeout: any = {};

    constructor(
        private metadata: metadata,
        private footer: footer,
        @Optional() @SkipSelf() private model: model,
        @Optional() private navigationtab: navigationtab,
        private popovermodel: model,
        private elementRef: ElementRef,
        private router: Router
    ) {

    }

    @HostListener('mouseenter')
    private onMouseOver() {
        if (this.modelPopOver !== false) {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
        }
    }

    @HostListener('mouseleave')
    private onMouseOut() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }
    }

    /**
     * react to the click and if the link is there navigate to the record
     */
    @HostListener('click')
    private goRelated() {
        if (this.modelPopOver === false || !this.enablelink) return false;

        // if we have apopover close it
        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }

        // if a timeout is running .. stop it
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        // go to the record
        this.popovermodel.id = this.id;
        this.popovermodel.module = this.module;
        this.popovermodel.getData(true).subscribe(loaded => {
            this.popovermodel.goDetail(this.navigationtab?.tabid);
        });
    }

    /**
     * renders the popover if a footer container if in the footer service
     */
    private renderPopover() {
        if(this.footer.footercontainer){
            this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer).subscribe(
                popover => {
                    popover.instance.popovermodule = this.module;
                    popover.instance.popoverid = this.id;
                    popover.instance.parentElementRef = this.elementRef;

                    this.popoverCmp = popover.instance;
                }
            );
        }
    }

    public ngOnInit() {
        if (!this.module && this.model) {
            this.module = this.model.module;
        }
        if (!this.id && this.model) {
            this.id = this.model.id;
        }
    }

    public ngOnDestroy() {
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        if (this.popoverCmp) {
            this.popoverCmp.closePopover(true);
        }
    }
}
