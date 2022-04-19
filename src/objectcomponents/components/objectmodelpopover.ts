/**
 * @module ObjectComponents
 */
import {Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {metadata} from '../../services/metadata.service';

/**
 * renders a popover for a model. The element that calls this needs to provide the model
 */
@Component({
    selector: 'object-model-popover',
    templateUrl: '../templates/objectmodelpopover.html',
    providers: [view]
})
export class ObjectModelPopover implements OnInit {

    /**
     * the side for the popover
     */
    public popoverside: 'right'|'left' = 'right';

    /**
     * the position of the popover
     */
    public popoverpos: 'top'|'bottom' = 'top';

    /**
     * additonal styles
     */
    public styles = null;

    /**
     *
     * @private
     */
    public hidePopoverTimeout: any = {};

    /**
     * reference to the popover for calculaiton of the size and position
     *
     * @private
     */
    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;

    /**
     * the related container if there are related elements rendered
     *
     * @private
     */
    @ViewChild('relatedcontainer', {read: ViewContainerRef, static: true}) public relatedContainer: ViewContainerRef;

    /**
     * the elementref to the parent element. Passd in when the modal is rendered to get the position for the overlay
     */
    public parentElementRef: any = null;

    /**
     * reference to the popover itsefl for destruction
     */
    public self: any = null;

    /**
     * the fields if they are rendered
     */
    public fields: any[] = [];

    /**
     * the fieldset if one is defined
     */
    public fieldset: string = '';

    /**
     * the componentset to be displayes
     */
    public componentset: string = '';

    /**
     * a header componentset if one is defined
     */
    public headercomponentset: string = '';

    /**
     * needed to position properly
     *
     * @private
     */
    public heightcorrection = 30;

    /**
     * needed to position the poopover properly
     *
     * @private
     */
    public widthcorrection = 30;

    constructor(
        public model: model,
        public view: view,
        public metadata: metadata,
    ) {
        this.view.displayLinks = false;
    }

    /**
     * get the style for the relate container limniting the height
     */
    get relatedStyle() {
        return {'max-height': `calc(100vh - ${(this.relatedContainer.element.nativeElement.getBoundingClientRect().top  + 5)}px)`};
    }

    /**
     * catch the mouse entry
     *
     * @private
     */
    public onMouseOver() {
        if (this.hidePopoverTimeout) {
            window.clearTimeout(this.hidePopoverTimeout);
        }
    }

    /**
     * catch the mouse leave and close the modal
     *
     * @private
     */
    public onMouseOut() {
        this.closePopover();
    }

    /**
     * determine the style for the popover depending on the size and the parent element position
     */
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

    /**
     * initialize the component
     */
    public ngOnInit() {
        // load the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectModelPopover', this.model.module);
        if (componentconfig.fieldset || componentconfig.componentset) {
            this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);

            this.fieldset = componentconfig.fieldset;
            this.componentset = componentconfig.componentset;
            this.headercomponentset = componentconfig.headercomponentset;
        } else {
            // if we did not find a fieldset and have no component set try to take the header one instead
            componentconfig = this.metadata.getComponentConfig('ObjectPageHeaderDetails', this.model.module);
            if (componentconfig.fieldset) {
                this.fields = this.metadata.getFieldSetFields(componentconfig.fieldset);
                this.fieldset = componentconfig.fieldset;
            }
        }

        // if we have a reload flag load the model
        // this allows to get potential details when the model is not fully loaded in the list
        if(componentconfig.forcereload){
            this.model.getData(false);
        }

        // don't know why... but this call fixes ExpressionChangedAfterItHasBeenCheckedError ... maybe because it sets the nubbin class earlier so it won't change after changedetection anymore?
        this.styles = this.popoverStyle;
    }

    /**
     * determine the nubbin side
     *
     * @private
     */
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
