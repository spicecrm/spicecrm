/**
 * @module ObjectFields
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

@Component({
    selector: 'field-model-footer-popover',
    templateUrl: '../templates/fieldmodelfooterpopover.html',
    providers: [model, view]
})
export class fieldModelFooterPopover implements OnInit {
    public popovermodule: string = '';
    public popoverid: string = '';
    public popoverside: string = 'right';
    public styles = null;
    public mouseover: boolean = false;

    public hidePopoverTimeout: any = {};

    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;

    public parentElementRef: any = null;
    public self: any = null;

    public modelIsLoading: boolean = false;
    public fields: Array<any> = [];

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata,
    ) {

    }

    public goDetail() {
        this.model.goDetail();
    }

    public onMouseOver() {
        this.mouseover = true;

        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    public onMouseOut() {
        this.mouseover = false;
        this.self.destroy();
        // this.self.destroy();
    }

    get popoverStyle() {
        let rect = this.parentElementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();

        if (rect.left < poprect.width) {
            this.popoverside = 'right';
        } else {
            this.popoverside = 'left';
        }

        let styles = {
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: rect.left < poprect.width ? (rect.left + 100) + 'px' : (rect.left - poprect.width - 15) + 'px'
        };

        return styles;
    }

    public ngOnInit() {

        // load the fields
        let componentconfig = this.metadata.getComponentConfig('fieldModelFooterPopover', this.popovermodule);
        if (componentconfig.fieldset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
        } else {
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.popovermodule);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset)
            }
        }

        // load the model
        this.modelIsLoading = true;
        this.model.module = this.popovermodule;
        this.model.id = this.popoverid;
        this.model.getData().subscribe(() => {
            this.modelIsLoading = false;
        });
        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    public getNubbinClass() {
        return this.popoverside == 'left' ? 'slds-nubbin--right' : 'slds-nubbin--left';
    }

    public closePopover(force = false) {
        // this.destroyPopover();
        if (force) {
            this.self.destroy()
        } else {
            this.hidePopoverTimeout = window.setTimeout(() => this.self.destroy(), 500);
        }
    }
}
