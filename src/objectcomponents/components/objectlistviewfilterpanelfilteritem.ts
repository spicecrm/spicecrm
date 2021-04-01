/*
SpiceUI 2018.10.001

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
    Component,
    Input,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    OnInit,
    OnDestroy,
    Renderer2,
    EventEmitter,
    Output, AfterViewInit
} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";

import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';
import {language} from '../../services/language.service';
import {userpreferences} from '../../services/userpreferences.service';
import {SystemFilterBuilderFilterExpression} from "../../systemcomponents/components/systemfilterbuilderfilterexpression";

declare var _: any;

/**
 * displays a filter item
 */
@Component({
    selector: 'object-listview-filter-panel-filter-item',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilteritem.html',
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
    ]
})
export class ObjectListViewFilterPanelFilterItem extends SystemFilterBuilderFilterExpression implements OnDestroy, AfterViewInit {
    @ViewChild('popover', {read: ViewContainerRef, static: true}) private popover: ViewContainerRef;

    /**
     * boolean if the popover is open
     */
    private showPopover: boolean = false;

    /**
     * helper listener to close the popup when a click happens outside
     */
    private clickListener: any = null;

    /**
     * list of fieldtypes that shoudl not be allowed for filtering
     */
    private excludedFieldtypes: string[] = ['link', 'relate', 'email'];

    /**
     * an emitter to indicate that the current item should be deleted by the user
     */
    @Output() public deleteItem: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        public backend: backend,
        public language: language,
        public metadata: metadata,
        private elementRef: ElementRef,
        private modellist: modellist,
        private renderer: Renderer2,
        private userpreferences: userpreferences
    ) {
        super(backend, language, metadata);

        // set the module from the modellist
        this.module = this.modellist.module;
    }


    /**
     * returns the operator label
     */
    get operatorLabel() {
        if (this.operator) {
            return this.operators[this.operatortype].find(item => item.operator == this.operator).name;
        } else {
            return '';
        }
    }

    public ngAfterViewInit() {

        // if we do not have a fieldvalue open the popover
        if (!this.field || this.field == '') this.openPopover();
    }

    /**
     * ensure the clicklistener is destoryed if the component is desctored if we have an active listener
     */
    public ngOnDestroy() {
        if (this.clickListener) {
            this.clickListener();
        }
    }

    /**
     * show the popover
     */
    private onClick() {
        this.openPopover();
    }

    /**
     * opens the popover
     */
    private openPopover() {
        if (!this.showPopover) {
            this.showPopover = true;
            // this.clickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
            return;
        }
    }

    private onFocus(event) {
        window.setTimeout(() => {
            event.target.blur();
        }, 250);
    }

    /**
     * closes the popover
     */
    private closePopover() {
        this.showPopover = false;
    }

    /**
     * registers a listener top the click on the document and checks wehter the clock was in the popover or outside
     *
     * @param event
     */
    private onDocumentClick(event: MouseEvent): void {
        if (this.showPopover) {
            if (!this.elementRef.nativeElement.contains(event.target)) {
                this.showPopover = false;
                this.clickListener();
            }
        }
    }

    /**
     * positions the popover properly
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
     * display the name oif the field used for the filter resp the labe that it is a new filter
     */
    private getDisplayName() {
        return this.field ? this.language.getFieldDisplayName(this.modellist.module, this.field) : this.language.getLabel('LBL_NEW_FILTER');
    }

    /**
     * emits that the filter shopudl be deleted
     */
    private deleteFilter() {
        this.deleteItem.emit(true);
    }

    /**
     * returns a proper formated value for the filter value field
     *
     * @param value
     */
    private interpretvalue(value) {
        try {
            let operator = this.operators[this.operatortype].find(item => item.operator == this.operator);
            switch (operator.value1) {
                case 'date':
                    return this.userpreferences.formatDate(value);
                    break;
                case 'integer':
                    return this.userpreferences.formatMoney(parseInt(value, 10));
                    break;
                case 'enum':
                    return this.language.getFieldDisplayOptionValue(this.module, this.field, value);
                    break;
                case 'relate':
                    if(!value) return '';
                    let valueitems = value.split('::');
                    if(valueitems.length < 2) return value;
                    return valueitems[1];
                    break;
                case 'multienum':
                    let retvalues = [];
                    let values = _.isArray(value) ? value : value.split(',');
                    for (let thisvalue of values) {
                        retvalues.push(this.language.getFieldDisplayOptionValue(this.module, this.field, thisvalue));
                    }
                    return retvalues.join(', ');
                    break;
                default:
                    return value;
            }
        } catch (e) {
            return value;
        }
    }

}
