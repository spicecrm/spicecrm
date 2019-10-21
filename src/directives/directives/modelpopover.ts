/**
 * @module directives
 */
import {Directive, Input, HostListener, OnDestroy, ElementRef, OnInit, Optional, AfterViewInit} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";


@Directive({
    selector: '[modelPopOver]',
    host:{
        '[class.slds-text-link_faux]' : 'enablelink'
    }
})
export class ModelPopOverDirective implements OnInit, OnDestroy {
    @Input() private module: string;
    @Input() private id: string;
    @Input() private enablelink: boolean = true;
    @Input() private modelPopOver: boolean = true;
    private popoverCmp = null;
    private self: any = null;
    private showPopover: boolean = false;
    private showPopoverTimeout: any = {};
    private hidePopoverTimeout: any = {};

    constructor(
        private metadata: metadata,
        private footer: footer,
        @Optional() private model: model,
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

    @HostListener('click')
    private goRelated() {
        if (this.modelPopOver === false || !this.enablelink) return false;

        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.id]);
    }

    private renderPopover() {
        this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer).subscribe(
            popover => {
                popover.instance.popovermodule = this.module;
                popover.instance.popoverid = this.id;
                popover.instance.parentElementRef = this.elementRef;

                this.popoverCmp = popover.instance;
            }
        );
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
