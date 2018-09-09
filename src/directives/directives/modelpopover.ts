import {Directive, Input, HostListener, OnDestroy, ElementRef, OnInit} from '@angular/core';
import {Router}   from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";



@Directive({
    selector: '[modelPopOver]',
})
export class ModelPopOverDirective implements OnInit, OnDestroy
{
    @Input() module:string;
    @Input() id:string;
    popoverCmp = null;
    self: any = null;
    showPopover:boolean = false;
    showPopoverTimeout:any = {};

    constructor(
        private metadata:metadata,
        private footer:footer,
        private model:model,
        private elementRef:ElementRef,
        private router: Router
    ) {

    }

    @HostListener('mouseenter')
    onMouseOver() {
        this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 500);
    }

    @HostListener('mouseleave')
    onMouseOut() {
        if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
        this.destroyPopover()
    }

    @HostListener('click')
    goRelated() {
        if (this.showPopoverTimeout) window.clearTimeout(this.showPopoverTimeout);
        // go to the record
        this.router.navigate(['/module/' + this.module + '/' + this.id]);
    }

    renderPopover(){
        this.metadata.addComponent('fieldModelFooterPopover', this.footer.footercontainer).subscribe(
            popover => {
                popover.instance['popovermodule'] = this.module;
                popover.instance['popoverid'] = this.id;
                popover.instance['parentElementRef'] = this.elementRef;
                // popover.instance['self'] = popover;

                this.popoverCmp = popover.instance.self;
            }
        );
    }

    destroyPopover(){
        if(this.popoverCmp)
            this.popoverCmp.destroy();
    }

    ngOnInit()
    {
        if(!this.module)
        {
            this.module = this.model.module;
        }
        if(!this.id)
        {
            this.id = this.model.id;
        }
    }

    ngOnDestroy()
    {
        this.destroyPopover();
    }
}