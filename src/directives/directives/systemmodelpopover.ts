/**
 * @module DirectivesModule
 */
import {
    Directive,
    Input,
    HostListener,
    OnDestroy,
    ElementRef,
    OnChanges,
    Optional,
    Injector,
    SkipSelf, Output, EventEmitter
} from '@angular/core';
import {Router} from '@angular/router';

import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {model} from "../../services/model.service";
import {modal} from "../../services/modal.service";
import {view} from "../../services/view.service";
import {navigationtab} from "../../services/navigationtab.service";


/**
 * displays a popover over an item
 */
@Directive({
    selector: '[system-model-popover]',
    host: {
        '[class.slds-text-link_faux]': '!disableLink'
    },
    providers: [model]
})
export class SystemModelPopOverDirective implements OnChanges, OnDestroy {
    /**
     * the module for the popover
     */
    @Input() public module: string;

    /**
     * the if od the model for the popover
     */
    @Input() public id: string;

    /**
     * if set to true the item is presented as a link
     */
    @Input() public enablelink: boolean = true;

    /**
     * if the modelpopover shoudl be enabled or not
     * this allows to add the directive but disable it by a parameter on the component if e.g. the popover shoudl be displayed conditional
     */
    @Input('system-model-popover') public modelPopOver: boolean = true;

    /**
     * an emitter when the link is clicked
     * nice to handle if you have links imn popoers and they shoudl close
     */
    @Output() public clicked: EventEmitter<boolean> = new EventEmitter<boolean>()

    /**
     * the popover that is rendered
     */
    public popoverCmp = null;

    /**
     * a timeout that renders the component only when the user hovers ovet eh component and does not leave short time after
     * this prevents a somehwta too nervous loading of popovers
     */
    public showPopoverTimeout: any = {};


    public popoverModelInitialized: boolean = false;

    constructor(
        public metadata: metadata,
        public footer: footer,
        public modal: modal,
        @Optional() @SkipSelf() public model: model,
        @Optional() public navigationtab: navigationtab,
        public popovermodel: model,
        public elementRef: ElementRef,
        @Optional() public view: view,
        public router: Router,
        public injector: Injector
    ) {

    }

    @HostListener('mouseenter')
    public onMouseOver() {
        if (this.modelPopOver !== false) {
            this.showPopoverTimeout = window.setTimeout(() => this.renderPopover(), 1000);
        }
    }

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
     * react to the click and if the link is there navigate to the record
     */
    @HostListener('click')
    public goRelated() {
        if (this.modelPopOver === false || this.disableLink) return false;

        // if we have apopover close it
        if (this.popoverCmp) {
            this.popoverCmp.closePopover();
        }

        // if a timeout is running .. stop it
        if (this.showPopoverTimeout) {
            window.clearTimeout(this.showPopoverTimeout);
        }

        // check if the link is the model that is in the focus
        // go to the record
        if (this.model && (!this.id || (this.id && this.module && this.model.id == this.id && this.model.module == this.module))) {
            this.model.goDetail(this.navigationtab?.tabid);
        } else if (this.popoverModelInitialized) {
            this.popovermodel.goDetail(this.navigationtab?.tabid);
        } else if(!this.popovermodel.isLoading) {
            let loadingmodal = this.modal.await('LBL_LOADING');
            this.popovermodel.getData(true).subscribe({
                next: (loaded) => {
                    this.popovermodel.goDetail(this.navigationtab?.tabid);
                    loadingmodal.emit(true);
                },
                error: () => {
                    loadingmodal.emit(true);
                }
            });
        }

        // emit that we clicked
        this.clicked.emit(true);
    }

    /**
     * checks if the view disables the links and then onlyrneders a popover
     */
    get disableLink() {
        return (this.view && this.view.displayLinks === false) || this.enablelink === false;
    }

    /**
     * renders the popover if a footer container if in the footer service
     */
    public renderPopover() {
        if (this.footer.footercontainer) {

            // if we are no initialized load the data
            if(!this.popoverModelInitialized) {
                if (!!this.model && (!this.model || !this.id || (this.model.module == this.module && this.model.id == this.id))) {
                    this.popovermodel.module = this.model.module;
                    this.popovermodel.id = this.model.id;
                    this.popovermodel.initialize();
                    this.popovermodel.setData(this.model.data, false);
                    this.popoverModelInitialized = true;
                } else {
                    this.popovermodel.getData().subscribe(() => {
                        this.popoverModelInitialized = true;
                    });
                }
            }

            // render the popover
            this.metadata.addComponent('ObjectModelPopover', this.footer.footercontainer, this.injector).subscribe(
                popover => {
                    popover.instance.parentElementRef = this.elementRef;
                    this.popoverCmp = popover.instance;
                }
            );
        }
    }

    public ngOnChanges() {
        // set the data for the popover model and if we had it initialized reset it to false
        if(this.id && this.module && this.id != this.popovermodel.id && this.module != this.popovermodel.module) {
            this.popoverModelInitialized = false;
            this.popovermodel.initialize();
            this.popovermodel.id = this.id;
            this.popovermodel.module = this.module;
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
