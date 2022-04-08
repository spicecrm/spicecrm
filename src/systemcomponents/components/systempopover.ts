/**
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    templateUrl: '../templates/systempopover.html'
})
export class SystemPopover implements OnInit {
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public styles = null;

    public hidePopoverTimeout: any = {};

    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;
    @ViewChild('popoverbody', {read: ViewContainerRef, static: true}) public popoverbody: ViewContainerRef;

    public parentElementRef: any = null;
    public self: any = null;

    public componentset: string;
    public component: string;

    public heightcorrection = 30;
    public widthcorrection = 30;

    constructor(
        public metadata: metadata,
    ) {

    }

    public onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    public onMouseOut() {
        this.closePopover(true);
    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (window.innerWidth - rect.left > poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        // console.error('dimensions ', rect.top, poprect.height);

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + this.heightcorrection > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + this.heightcorrection) + 'px',
                left: this.popoverside == 'right' ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - this.heightcorrection) + 'px',
                left: this.popoverside == 'right' ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        }
    }

    get popoverBodyStyle() {
        return {'max-height': `calc(100vh - ${(this.popoverbody.element.nativeElement.getBoundingClientRect().top + 5)}px)`};
    }

    public ngOnInit() {
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    public getNubbinClass() {
        return (this.popoverside == 'left' ? 'slds-nubbin--right-' : 'slds-nubbin--left-') + this.popoverpos;
    }

    public closePopover(force = false) {
        if (force) {
            this.self.destroy();
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }
}
