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
    templateUrl: './src/objectfields/templates/fieldlabelpopover.html'
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
    private clickListener: any;
    private contextmenulistener: any;

    private fieldlabel: string = '';
    private fieldname: string = '';
    private fieldconfig: any = {};

    /**
     * the offset from the top
     */
    private top = '0px';

    /**
     * the offset from left
     */
    private left = '0px';

    constructor(
        private language: language,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        @Optional() private model: model
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
    private onClick(event): void {
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
    private close() {
        this.self.destroy();
    }

}
