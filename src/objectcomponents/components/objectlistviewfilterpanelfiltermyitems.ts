/**
 * @module ObjectComponents
 */

import {
    ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, Renderer2, ElementRef, forwardRef
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {animate, style, transition, trigger} from "@angular/animations";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'object-listview-filter-panel-filter-myitems',
    templateUrl: '../templates/objectlistviewfilterpanelfiltermyitems.html',
    animations: [
        trigger('animatepopover', [
            transition(':enter', [
                style({opacity: 0}),
                animate('.25s', style({opacity: 1}))
            ]),
            transition(':leave', [
                style({opacity: '1'}),
                animate('.25s', style({opacity: 0}))
            ])
        ])
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ObjectListViewFilterPanelFilterMyItems),
            multi: true
        }
    ]
})
export class ObjectListViewFilterPanelFilterMyItems implements ControlValueAccessor {

    // for the value accessor
    public onChange: (value: string) => void;
    public onTouched: () => void;

    /**
     * a reference to the popover
     */
    @ViewChild('popover', {read: ViewContainerRef, static: true}) public popover: ViewContainerRef;

    /**
     * defines if the popover is visible or not
     */
    public showPopover: boolean = false;

    /**
     * the filter value
     */
    public _filterValue: string = 'all';

    /**
     * helper listener to close the popup when a click happens outside
     */
    public clickListener: any = null;

    constructor(public renderer: Renderer2, public elementRef: ElementRef, public language: language, public modellist: modellist) {

    }

    /**
     * a function that handöles the click registered by the renderer
     */
    public onClick() {
        if (!this.showPopover) {
            this.showPopover = true;
            this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
            return;
        }
    }

    /**
     * a getter for the filter value
     */
    get filterValue() {
        return this._filterValue;
    }

    /**
     * a setter that sets the internal value and triggers the emitter for the ngModel
     *
     * @param value the new value
     */
    set filterValue(value) {
        this._filterValue = value;
        this.onChange(value);
    }

    /**
     * close the popover and if a cxlicklistener is defined close that one
     */
    public closePopover() {
        this.showPopover = false;
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * if registered hjandle the document click
     *
     * @param event the event pased oin from the renderer
     */
    public onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            const clickedInside = this.elementRef.nativeElement.contains(event.target);
            if (!clickedInside) {
                this.closePopover();
            }
        }
    }

    /**
     * handle the popover style as this gets positioned properly
     */
    public getPopoverStyle() {
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        let poprect = this.popover.element.nativeElement.getBoundingClientRect();
        return {
            position: 'fixed',
            top: (rect.top + ((rect.height - poprect.height) / 2)) + 'px',
            left: (rect.left - poprect.width - 15) + 'px'
        };
    }

    /**
     * Set the function to be called
     * when the control receives a change event.
     *
     * @param fn a function
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called
     * when the control receives a touch event.
     *
     * @param fn a function
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Write a new value to the element.
     *
     * @param value value to be executed when there is a change in contenteditable
     */
    public writeValue(value: any): void {
        // this._time = value ? value : '';
        if (value) {
            this._filterValue = value;
        } else {
            this._filterValue = '';
        }
    }

}
