/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {take} from 'rxjs/operators';
import {backend} from '../../../services/backend.service';
import {modellist} from '../../../services/modellist.service';
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modal} from "../../../services/modal.service";
import {modelutilities} from "../../../services/modelutilities.service";
import { helper } from '../../../services/helper.service';
import { model } from '../../../services/model.service';

/* @ignore */
declare var _: any;

@Component({
    selector: "folder-view-tree",
    templateUrl: "./src/modules/folders/templates/folderviewtree.html"
})

export class FolderViewTree implements OnInit {

    @Output() private folderId = new EventEmitter();

    private _selectedItem: string = null;

    /*
    * selectedItem: string
    */
    private set selectedItem( val: string ) {
        this.folderId.emit(val);
        if ( val === this._selectedItem ) return;
        this._selectedItem = val;
        this.setAggregate( val );
        this.model.setField('folder_id', val );
    }

    /*
    * selectedItem: string
    */
    private get selectedItem(): string {
        return this._selectedItem;
    }

    /*
    * tree: array
    * */
    public tree: any[] = [];

    /**
     * object[]
     * [
     *   {
     *     id: string,
     *     parent_id: string,
     *     parent_sequence: number,
     *     name: string,
     *   }
     * ]
     */
    public sourceList: any[] = [];

    private itemRelations: any[] = [];

    private isLoading = true;

    private showTree = true;

    constructor( private backend: backend, private modellist: modellist, private language: language,
                 private toast: toast, private modal: modal , private modelutilies: modelutilities, private helper: helper, private model: model ) {}

    /*
    * getting all folders from database
    * */
    public ngOnInit() {
        let moduleName = 'Documents';
        this.backend.getRequest('module/Folders/' + moduleName)
            .pipe(take(1))
            .subscribe(data => {
                this.sourceList = data.list;
                this.buildTree();
                this.isLoading = false;
                let folderIdFromList = this.getFolderIdFromList();
                if ( folderIdFromList !== null ) this.handleClick( folderIdFromList );
            });
    }

    /*
    * building relations between parent and child folder
    * */
    private buildItemRelations() {
        this.itemRelations = [];
        let indexes = {};
        this.sourceList.forEach( ( item, i ) => indexes[item.id] = i );
        this.sourceList.forEach( ( item, i ) => {
            this.itemRelations[i] = { parent: item.parent_id ? indexes[item.parent_id] : null, childs: [] };
        });
        this.sourceList.forEach( ( item, i ) => {
            if ( item.parent_id ) this.itemRelations[this.itemRelations[i].parent].childs.push(i);
        });
    }

    /*
    * @reset tree
    * @sort by sequence
    * @add treeItem recursively
    * @set hasChildren
    */
    private buildTree() {
        this.tree = [];
        this.sortSourceList();
        this.addTreeItem();
        this.setHasChildren();
        this.buildItemRelations();
    }

    /*
    * group the sourceList items by parent_id to succeed sorting the children by parent_sequence without
    * loosing the parent children order
    * @sort by name
    * @group by parent_id
    * @reset sourceList
    * @sort by parent_sequence
    */
    private sortSourceList() {
        this.language.sortObjects( this.sourceList, 'name');
    }

    /*
    * recursive method to push the sourceList items to the tree array with the correct parent child order
    * and add the necessary systemTreeDefs values for the item behaviours handling.
    * @param parentId: string = ''
    * @param level: number = 1
    * @set systemTreeDefs
    * @push sourceList Item to tree array
    * @call self and pass the id as parentId and the level +1
    * @structure systemTreeDefs: object
    * {
    *   level: number,
    *   expanded: boolean,
    *   isSelected: boolean,
    *   hasChildren: boolean
    * }
    */
    private addTreeItem(parentId = '', level = 1) {
        for (let item of this.sourceList) {
            if (!item.parent_id && parentId == '' || item.parent_id == parentId) {
                if (!item.systemTreeDefs) {
                    item.systemTreeDefs = {};
                }
                item.systemTreeDefs.expanded = !!item.systemTreeDefs.expanded;
                item.systemTreeDefs.level = level;
                item.systemTreeDefs.isSelected = this.selectedItem == item.id;
                this.tree.push(item);
                if (item.systemTreeDefs.expanded) {
                    this.addTreeItem(item.id, level + 1);
                }
            }
        }
    }

    /*
    * @set hasChildren for each tree item from the sourceList
    */
    private setHasChildren() {
        this.tree.forEach(item => {
            item.systemTreeDefs.hasChildren = this.sourceList.some(i => i.parent_id == item.id);
        });
    }

    /*
    * @param id: string
    * @set item.systemTreeDefs.expanded
    * @build tree
    */
    private handleExpand(id) {
        this.sourceList.some(item => {
            if (item.id == id) {
                item.systemTreeDefs.expanded = !item.systemTreeDefs.expanded;
                return true;
            }
        });
        this.buildTree();
    }

    /*
    * select the item and unselect the previous selected item from the tree.
    * @param id: string
    * @set? item.systemTreeDefs.isSelected
    * @set? selectedItem
    * @handle? expand
    * @emit id by @output selectedItemChange
    */
    private handleClick(id) {
        this.tree.some(item => {
            if (item.id === id) {
                if ( !item.systemTreeDefs?.isSelected ) {
                    item.systemTreeDefs.isSelected = true;
                    this.selectedItem = id;
                }
                return true;
            }
        });
        this.tree.some(item => {
            if (item.id != id && item.systemTreeDefs?.isSelected) {
                item.systemTreeDefs.isSelected = false;
                return true;
            }
        });
    }

    /*
    * unselect folder
    * */
    private unselectActiveTreeItem() {
        this.tree.some( item => {
            if( item.systemTreeDefs?.isSelected ) {
                item.systemTreeDefs.isSelected = false;
                return true;
            }
        });
    }

    /*
    * check folder id and setting aggregate for it
    * */
    private setAggregate( folderId ) {
        if ( !folderId ) folderId = '#not#set#';
        let aggdata = this.helper.encodeBase64('{"key":"'+folderId+'","displayName":"'+folderId+'"}');
        if ( !this.modellist.checkAggregate('folder_id', aggdata )) {
            this.modellist.removeAggregatesOfField('folder_id');
            this.modellist.setAggregate('folder_id', aggdata );
            this.modellist.reLoadList();
        }
    }

    /*
    * getting folder id from currently selected aggregate
    * */
    public getFolderIdFromList() {
        let folderId = null;
        this.modellist.selectedAggregates.some( item => {
            let dummy = item.split('::',2);
            if ( dummy[0] === 'folder_id') {
                let aggdataObject = JSON.parse( this.helper.decodeBase64( dummy[1] ));
                folderId = aggdataObject.key;
            }
        });
        if ( folderId === '#not#set#' ) folderId = '';
        return folderId;
    }

    /*
    * remove all aggregates filters
    * */
    private removeAllAggregates() {
        this.modellist.removeAggregatesOfField('folder_id');
        this.modellist.reLoadList();
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    private trackByFn(index, item) {
        return item.id;
    }

    /*
    * add new parent folder with backend request
    * */
    private addFolder( parentId: string = null, index: number = null ): void {
        this.modal.prompt('input', null, 'Folder Name')
            .pipe(take(1))
            .subscribe(folderName => {
                if ( folderName ) {
                    folderName = folderName.trim();
                    if ( folderName ) {
                        let folder = {
                            name: folderName,
                            parent_id: parentId ? parentId : undefined,
                            module: 'Documents',
                            id: this.modelutilies.generateGuid()
                        };
                        this.backend.postRequest( 'module/Folders/' + folder.id, {}, folder ).pipe( take( 1 ) ).subscribe( () => {
                                this.toast.sendToast( this.language.getLabel( 'MSG_FOLDER_SUCCESSFULY_ADDED' ), 'success' );
                                this.sourceList.push( folder );
                                if( index !== null && this.tree[index] ) this.tree[index].systemTreeDefs.expanded = true;
                                this.buildTree();
                            },
                            error => {
                                this.toast.sendToast( this.language.getLabel( 'LBL_ERROR' ), 'error' );
                            } );
                    }
                }
            });
    }

    /*
    * delete folder from tree, when it's a parent folder also all children folders
    * */
    private removeFolderFromList( id: string ) {
        let itemsToDelete: any[] = [];
        this.sourceList.find( ( item, i ) => {
           if ( item.id === id ) {
               this.deleteItemsRecursive( i, itemsToDelete );
               return true;
           }
        });
        itemsToDelete.sort().reverse().forEach( ( item, i ) => {
            this.sourceList.splice( itemsToDelete[i], 1 );
            this.itemRelations.splice( itemsToDelete[i], 1 );
        });
        this.buildTree();
    }

    /*
    * deleting all child folders
    * */
    private deleteItemsRecursive( index, toDelete: number[] ) {
        toDelete.push(index);
        this.itemRelations[index].childs.forEach( item => this.deleteItemsRecursive( item, toDelete ));
    }

    /*
    * select all documents that don't have any folder
    * */
    private selectOutsideFolders() {
        this.selectedItem = '';
        this.unselectActiveTreeItem();
    }

   /*
   * backend request, that save new folder for particular document by drag and drop
   * */
    private drop( documentData, folderItem ) {
        this.backend.postRequest('module/Documents/'+documentData.item.data.id, {}, {folder_id:folderItem.id}).subscribe( response => {
            // Reload list, but before give elastic a chance with a little bit of timeout:
            window.setTimeout( () => this.modellist.reLoadList(true), 500 );
        });
    }

    /*
    * change direction of chevron
    * */
    public toggleTree() {
        this.showTree = !this.showTree;
    }

}
