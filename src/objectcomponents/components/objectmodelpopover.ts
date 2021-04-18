/**
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'object-model-popover',
    templateUrl: './src/objectcomponents/templates/objectmodelpopover.html',
    providers: [model, view]
})
export class ObjectModelPopover implements OnInit {
    public popovermodule: string = '';
    public popoverid: string = '';
    public popoverside: string = 'right';
    public popoverpos: string = 'top';
    public styles = null;

    private hidePopoverTimeout: any = {};

    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;
    @ViewChild('relatedcontainer', {read: ViewContainerRef, static: true}) private relatedContainer: ViewContainerRef;

    public parentElementRef: any = null;
    public self: any = null;

    public fields: any[] = [];
    public fieldset: string = '';
    public componentset: string = '';
    public headercomponentset: string = '';

    private heightcorrection = 30;
    private widthcorrection = 30;

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata,
    ) {
        this.view.displayLinks = false;
    }

    get relatedStyle() {
        return {'max-height': `calc(100vh - ${(this.relatedContainer.element.nativeElement.getBoundingClientRect().top  + 5)}px)`};
    }

    private goDetail() {
        this.model.goDetail();
    }

    private onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    private onMouseOut() {
        this.closePopover(true);
    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        // console.error('dimensions ', rect.top, poprect.height);

        if (rect.top - 30 + poprect.height > window.innerHeight && rect.top - poprect.height + this.heightcorrection > 0) {
            this.popoverpos = 'bottom';
            return {
                top: (rect.top - poprect.height + this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        } else {
            this.popoverpos = 'top';
            return {
                top: (rect.top - this.heightcorrection) + 'px',
                left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - this.widthcorrection) + 'px'
            };
        }
    }

    public ngOnInit() {
        // load the model
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData();

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectModelPopover', this.popovermodule);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        }

        // if we did not find a fieldset and have no component set try to take the header one instead
        if (!this.fieldset && !this.componentset) {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    private getNubbinClass() {
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
