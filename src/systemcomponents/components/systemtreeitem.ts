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
 * @module SystemComponents
 */
import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: "system-tree-item",
    templateUrl: "./src/systemcomponents/templates/systemtreeitem.html"
})

export class SystemTreeItem {
    /*
    * @output onItemAdd: object
    * {
    *   id: string = parentId,
    *   name: string = parentName
    * }
    */
    @Output() public onItemAdd: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @output toggleExpandedChange: string = item.id
    */
    @Output() public toggleExpandedChange: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @output dragPositionChange: object:
    * {
    *   id: string = item.id,
    *   position: string
    * }
    */
    @Output() public dragPositionChange: EventEmitter<any> = new EventEmitter<any>();
    /*
    * @input item: object
    * {
    *     id: string,
    *     parent_id: string,
    *     parent_sequence: number,
    *     name: string,
    *     systemTreeDefs: object
    * }
    */
    @Input() public item: any = [];
    /*
    * @input config: object
    */
    @Input() private config: any = {};
    /*
    * @input isDragging: boolean
    */
    @Input() private isDragging: boolean = false;
    private dragPosition: string = '';

    /*
    * @param parentId: string
    * @param parentName: string
    * @emit object by @Output onItemAdd
    */
    public addItem(parentId, parentName) {
        this.onItemAdd.emit({id: parentId, name: parentName});
    }

    /*
    * @param item: object
    * @param e?: MouseEvent
    * @stop MouseEvent propagation
    * @emit object: {id: string = parentId, name: string = parentName} by @output onItemAdd
    */
    public expand(item, e?) {
        this.toggleExpandedChange.emit(item.id);
        if (e && e.stopPropagation) e.stopPropagation();
    }

    /*
    * @param position: string
    * @set dragPosition
    * @emit null | object by @output dragPositionChange
    */
    private setPosition(position) {
        this.dragPosition = position;
        if (!this.isDragging) return;
        this.dragPositionChange.emit(!position ? null : {id: this.item.id, position});
    }
}
