/**
 * @module ObjectFields
 */
import {Component, Input, OnInit, Optional, ElementRef, Renderer2, OnDestroy} from '@angular/core';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';

/**
 * renders a popover with some field specific data when rightclicked on a label
 */
@Component({
    templateUrl: '../templates/fieldlabelpopover.html'
})
export class fieldLabelPopover implements OnInit, OnDestroy {

    /**
     * reference to the component to be able to close itself
     */
    public self: any;

    /**
     * the event passed in from the intiating component
     */
    public event: any;

    /**
     * the click listener
     */
    public clickListener: any;
    public contextmenulistener: any;

    public fieldlabel: string = '';
    public fieldname: string = '';
    public fieldconfig: any = {};

    /**
     * the offset from the top
     */
    public top = '0px';

    /**
     * the offset from left
     */
    public left = '0px';

    constructor(
        public language: language,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        @Optional() public model: model
    ) {
    }

    /**
     * calculate the position and initiate the clicklistener
     */
    public ngOnInit(): void {
        // set the position
        this.top = this.event.pageY -22 + 'px';
        this.left = this.event.pageX + 8 + 'px';

        // initiate the click listener
        this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        // this.contextmenulistener = this.renderer.listen("document", "contextmenu", (event) => this.onClick(event));
    }

    /**
     * if we still have a listener then cancel it
     */
    public ngOnDestroy(): void {
        if(this.clickListener) this.clickListener();
        if(this.contextmenulistener) this.contextmenulistener();
    }

    /**
     * handle the document onclick event
     *
     * @param event
     */
    public onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            if(this.clickListener) this.clickListener();
            if(this.contextmenulistener) this.contextmenulistener();
            this.close();
        }
    }

    get popoverStyle() {
        return {
            top: this.top,
            left: this.left
        };
    }

    /**
     * close the popover
     */
    public close() {
        this.self.destroy();
    }

}
