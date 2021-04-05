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
import {Component, Input, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {language} from '../../services/language.service';
import {modellist} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {SystemResizeDirective} from "../../directives/directives/systemresize";
import {layout} from "../../services/layout.service";
import {Subscription} from "rxjs";

/**
 * renders the header row for a list view table
 */
@Component({
    selector: '[object-list-header]',
    templateUrl: './src/objectcomponents/templates/objectlistheader.html',
    providers: [view]
})
export class ObjectListHeader implements OnDestroy{

    @ViewChildren(SystemResizeDirective) private resizeElements: QueryList<SystemResizeDirective>;

    /**
     * an action set ot be applied to the list actions
     */
    @Input() private actionset: string = '';

    /**
     * show the select column as first column
     */
    @Input() private showSelectColumn: boolean = true;

    /**
     * display the row action menu or hide the column
     */
    @Input() private showRowActionMenu: boolean = true;

    /**
     * keep all suibscriptions
     */
    private subscriptions: Subscription = new Subscription();

    constructor(private modellist: modellist, private language: language, private view: view, private elementRef: ElementRef, private layout: layout, private cdref: ChangeDetectorRef) {
        this.view.labels = 'short';

        // register to listfield changes
        this.subscriptions.add(this.modellist.listfield$.subscribe(data => this.cdref.detectChanges()));
    }

    /**
     * unsubscribe all subscritopions on Destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * returns if the layout is set to small
     */
    get isSmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the listfields
     */
    get listfields() {
        return this.modellist.listfields;
    }

    /**
     * a getter to return the module from the modellist service
     */
    get module() {
        return this.modellist.module;
    }

    /**
     * return the column width if set
     * @param columnId
     */
    private columnWidth(columnId?) {
        let listfield = this.listfields.find(lf => lf.id == columnId);
        return listfield.width ? listfield.width + '%' : (100 / this.listfields.length) + '%';
    }

    /**
     * returns if a given fielsd is set sortable in teh fieldconfig
     *
     * @param field the field from the fieldset
     */
    private isSortable(field): boolean {
        if (field.fieldconfig.sortable === true) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the field as sort parameter
     *
     * @param field the field from the fieldset
     */
    private setSortField(field): void {
        if (this.isSortable(field)) {
            this.modellist.setSortField(field.field);
        }
    }

    private onresize(e) {
        let elementWidths = {};
        let totalwidth = 0;

        this.resizeElements.forEach(element => {
            let elementWidth = element.getElementWidth();
            totalwidth += elementWidth;
            elementWidths[element.resizeid] = element.getElementWidth();
        });

        for (let listfield of this.listfields) {
            listfield.width = Math.round((elementWidths[listfield.id] / totalwidth) * 100);
        }
    }
}
