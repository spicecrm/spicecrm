/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

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
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfiltermyitems.html',
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
    private onChange: (value: string) => void;
    private onTouched: () => void;

    /**
     * a reference to the popover
     */
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    /**
     * defines if the popover is visible or not
     */
    private showPopover: boolean = false;

    /**
     * the filter value
     */
    private _filterValue: string = 'all';

    /**
     * helper listener to close the popup when a click happens outside
     */
    private clickListener: any = null;

    constructor(private renderer: Renderer2, private elementRef: ElementRef, private language: language, private modellist: modellist) {

    }

    /**
     * a function that handöles the click registered by the renderer
     */
    private onClick() {
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
    private closePopover() {
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
    private onDocumentClick(event: MouseEvent): void {
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
    private getPopoverStyle() {
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
