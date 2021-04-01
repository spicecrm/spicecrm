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
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output, SimpleChanges} from "@angular/core";
import {backend} from "../../services/backend.service";
import {language} from "../../services/language.service";
import {modelutilities} from "../../services/modelutilities.service";

/**
 * @ignore
 */
declare var _: any;


@Component({
    selector: "system-module-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemmoduletreeitem.html"
})

export class SystemModuleTreeItem {

    /**
     * @input selectedItemPath: string
     */
    @Input() public selectedNodeId: string = '';

    /**
     * the level we are on
     */
    @Input() public level: number = 1;

    /**
     * the level we are on
     */
    @Input() public path: string;

    /**
     * the module of the item
     */
    @Input() public module: string;

    /**
     * the name to be displayed
     */
    @Input() public name: string;

    /**
     * nodedata
     */
    @Input() public nodedata: any;

    /**
     * if the node is expanded
     */
    private expanded: boolean = false;

    /**
     * the items
     */
    private nodeitems: any[] = [];

    /**
     *  indicates if the treeitem is loading
     */
    private isLoaded: boolean = false;

    /**
     *  indicates if the treeitem is loading
     */
    private isLoading: boolean = false;

    /**
     * set the button to disabled
     */
    private disabled = false;

    /**
     * event emitter when an item is selected
     */
    @Output() private itemSelected: EventEmitter<any> = new EventEmitter<any>();

    constructor(private backend: backend, private language: language, private modelUtilities: modelutilities) {

    }

    get isSelected() {
        return this.selectedNodeId == this.nodedata.nodeId;
    }

    get icon() {
        return this.isLoading ? 'spinner' : 'chevronright';
    }

    /**
     * load the data from the backend
     */
    private loadItems() {
        this.isLoading = true;
        this.backend.getRequest('dictionary/browser/' + this.module + '/nodes').subscribe(items => {
            if (items) {
                this.nodeitems = items
                    .map(item => {
                        item.nodeId = this.modelUtilities.generateGuid();
                        item.displayname = !!item.label ? this.language.getLabel(item.label) : this.language.getModuleName(item.module);
                        return item;
                    })
                    .sort((a, b) => !!a.displayname && !!b.displayname ? a.displayname > b.displayname ? 1 : -1 : 0);
            }

            this.isLoading = false;
            this.isLoaded = true;
            if (this.nodeitems.length > 0) {
                this.expanded = true;
            } else {
                this.disabled = true;
            }
        });
    }

    /**
     * toggle the treeitem open
     */
    private expandItem() {
        // if is loading do nothing
        if (this.isLoading) return;

        // check if we are laoded
        if (!this.isLoaded) {
            this.loadItems();
        } else {
            this.expanded = !this.expanded;
        }
    }

    /**
     * handler to emit when a node is selected
     */
    private nodeSelected() {
        this.itemSelected.emit({
            path: this.path,
            module: this.module,
            nodeId: !this.nodedata ? 'root' : this.nodedata.nodeId
        });
    }

    private emitSelected(data) {
        // enrich the path
        data.path = this.path + '::' + data.path;

        // emit the path
        this.itemSelected.emit(data);
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.nodeId;
    }

}
