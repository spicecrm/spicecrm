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
import {Component, OnInit, EventEmitter, Output, ViewChild, ViewContainerRef, OnDestroy, Input} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {model} from '../../services/model.service';
import {modellist, relateFilter} from '../../services/modellist.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {metadata} from '../../services/metadata.service';
import {Subscription} from "rxjs";
import {ObjectModalModuleLookupHeader} from "./objectmodalmodulelookupheader";

/**
 * provides a lookup modal with a modellist and the option to select a model
 */
@Component({
    selector: 'object-modal-module-lookup',
    templateUrl: './src/objectcomponents/templates/objectmodalmodulelookup.html',
    providers: [view, modellist, model],
    styles: [
        '::ng-deep table.singleselect tr:hover td { cursor: pointer; }',
    ]
})
export class ObjectModalModuleLookup implements OnInit, OnDestroy {

    @ViewChild('tablecontent', {read: ViewContainerRef, static: true}) private tablecontent: ViewContainerRef;
    @ViewChild(ObjectModalModuleLookupHeader) private headercontent: ObjectModalModuleLookupHeader;

    /**
     * the search term entered
     */
    public searchTerm: string = '';

    /**
     * referemce to self to allow closing the modal window
     */
    public self: any = {};

    /**
     * set to true to enable multiselect, default to false
     */
    public multiselect: boolean = false;

    /**
     * the mdule for the list
     */
    public module: string = '';

    /**
     * a module filter id to be applied to the search
     */
    public modulefilter: string = '';

    /**
     * a relate filter for the modellist
     */
    @Input() private relatefilter: relateFilter;


    /**
     * a collection of subscriptions to be cancelled once the component is destroyed
     */
    private subscriptions: Subscription = new Subscription();

    /**
     * emits when an item is selected and which items are selected
     */
    @Output() private selectedItems: EventEmitter<any> = new EventEmitter<any>();

    /**
     * emits the used search term
     */
    @Output() private usedSearchTerm: EventEmitter<string> = new EventEmitter<string>();

    constructor(public language: language, public modellist: modellist, public metadata: metadata, public modelutilities: modelutilities, public model: model, public layout: layout) {
        // subscribe to changes of the listtype
        this.subscriptions.add(this.modellist.listtype$.subscribe(newType => this.switchListtype()));

    }

    /**
     * get the style for the content so the table can scroll with fixed header
     */
    private contentStyle() {
        if(this.headercontent) {
            let headerRect = this.headercontent.element.nativeElement.getBoundingClientRect();

            return {
                height: `calc(100% - ${headerRect.height}px)`
            };
        } else {
            return {
                height: `100%`
            };
        }
    }

    /**
     * a getter that builds teh request fields from the listfields from the modellistservice
     */
    get requestfields() {
        let requestfields = [];
        for (let listfield of this.modellist.listfields) {
            if (requestfields.indexOf(listfield.field) != -1) {
                requestfields.push(listfield.field);
            }
        }
        return requestfields;
    }

    /**
     * returns treu if we have a small screen factor
     */
    get smallView() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * loads the modellist and sets the various paramaters
     */
    public ngOnInit() {
        // this.model.module = this.module;
        this.modellist.modulefilter = this.modulefilter;
        this.modellist.relatefilter = this.relatefilter;
        // this.modellist.setModule(this.module, true);
        this.modellist.module = this.module;

        // set hte module on the model
        this.model.module = this.module;

        // if we have a searchterm .. start the search
        if (this.searchTerm != '') {
            this.doSearch();
        }
    }

    /**
     * unsubscribe from teh list type change
     */
    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the change of listtype
     */
    private switchListtype() {
        /**
        if (this.modellist.module) {
            this.modellist.reLoadList();
        }*/
    }

    /**
     * tigger the search
     */
    private doSearch() {
        this.modellist.searchTerm = this.searchTerm;
        this.modellist.getListData(this.requestfields);
    }

    /**
     * scroll event handler for the infinite scrolling in the window
     * @param e
     */
    private onScroll(e) {
        let element = this.tablecontent.element.nativeElement;
        if (element.scrollTop + element.clientHeight + 50 > element.scrollHeight) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * closes the popup
     */
    private closePopup() {
        this.usedSearchTerm.emit(this.modellist.searchTerm);
        this.self.destroy();
    }


    get selectedCount() {
        return this.modellist.getSelectedCount();
    }

    public selectItems() {
        this.selectedItems.emit(this.modellist.getSelectedItems());
        this.usedSearchTerm.emit(this.searchTerm);
        this.self.destroy();
    }

    public clickRow(event, item) {
        if (!this.multiselect) {
            this.selectedItems.emit([item]);
            this.usedSearchTerm.emit(this.searchTerm);
            this.self.destroy();
        }
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
}
