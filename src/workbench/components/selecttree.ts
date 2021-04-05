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
 * @module WorkbenchModule
 */
import {
    Component,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {configurationService} from "../../services/configuration.service";

import { modal } from '../../services/modal.service';
import {SelectTreeAddDialog} from "./selecttreeadddialog";

@Component({
    templateUrl: './src/workbench/templates/selecttree.html',
})
export class SelectTreeComponent {
    currentSelectTree: string = '';

    category_tree = [];
    levels = [];
    max_levels = 4;
    loading = true;
    selected_categorys = [];
    edit_category: object = null;
    service_queues = [];
    trees = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private config: configurationService,
        private utils: modelutilities,
        private toast: toast,
        private modalservice: modal
    ) {
        this.loadTrees(true);
    }


    private addTree() {
        this.modalservice.openModal('SelectTreeAddDialog').subscribe( modal => {
            modal.instance.tree$.subscribe( event => { this.updateTree(event); });
        });
    }

    private updateTree(e) {
        this.loadTrees();
        this.currentSelectTree = e.id;
        this.loadSelectTree(this.currentSelectTree);
    }


    private loadTrees(selectloadfirst = false) {
        if( !this.config.getData('select_trees')) {
            this.backend.getRequest('spiceui/core/selecttree/trees').subscribe(
                (res: any) => {
                    // this.config.setData('select_trees', res);
                    this.trees = res;

                    if(selectloadfirst) {
                        if(this.trees.length > 0) {
                            this.currentSelectTree = this.trees[0].id;
                            this.loadSelectTree(this.currentSelectTree);
                        }else {
                            this.loading = false;
                        }
                    }
                }
            );
        }
    }

    private loadSelectTree(currentSelectTree) {

        this.edit_category = null;

        this.backend.getRequest('spiceui/core/selecttree/tree/'+ currentSelectTree).subscribe(
            (res: any) => {
                this.config.setData('select_tree', res);
                this.initializeTree(res);
            }
        );
    }



    private initializeTree(tree) {
        this.category_tree = tree;





        // getting max levels...

        for(let i = 0; i < this.max_levels; i++) {
            this.levels[i] = [];
        }
        this.levels[0] = this.category_tree;
        this.loading = false;
    }


    private resetLevels(start_lvl = 0) {
        for(let lvl = start_lvl; lvl < this.max_levels; lvl++) {
            this.levels[lvl] = [];
        }
        this.selected_categorys.splice(start_lvl,this.max_levels - start_lvl);
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    private select(cat) {
        this.selected_categorys[cat.level] = cat;
        if(cat.childs) {
            this.levels[cat.level + 1] = cat.childs;
            this.resetLevels(cat.level + 2);
        }else {
            this.resetLevels(cat.level+1);
        }
    }

    private addCategory(parent = null) {
        let cat = {
            id: this.utils.generateGuid(),
            name: 'new Field...',
            keyname: null,
            parent_id: null,
            tree: this.currentSelectTree,
            selectable: 0,
            favorite: 0,
            level: 0,
        };

        if( parent ) {
            if( !parent.childs ) {
                parent.childs = [];
            }
            cat.parent_id = parent.id;
            cat.level = parent.level + 1;
            if( cat.level > this.max_levels ) {
                this.max_levels = cat.level;
            }
            parent.childs.push(cat);
            this.levels[parent.level + 1] = parent.childs;
        }else {
            this.category_tree.push(cat);
            this.levels[0] = this.category_tree;
        }

        this.select(cat);
        this.edit(cat);
    }

    private removeCategory(cat) {
        if( cat.childs ) {
            let r = confirm('Are you sure you want to delete this Category? There are '+cat.childs.length+' Subcategories which will be get deleted too!');
            if( !r ) {
                return false;
            }
        }

        if(cat == this.edit_category ) {
            this.edit_category = null;
        }

        let i = 0;
        for(let c of this.category_tree)
        {

            if( c == cat ) {
                this.category_tree.splice(i,1);
                return true;
            }

            searchThroughTree(c, cat);
            i++;
        }

        function searchThroughTree(current, searched) {
            if(current.childs) {
                for(let i = 0; i < current.childs.length; i++) {
                    if(current.childs[i] == searched) {
                        current.childs.splice(i,1);
                        return true;
                    }
                    searchThroughTree(current.childs[i], searched);
                }
            }
            return false;
        }
    }
    private edit(cat) {
        this.selected_categorys[cat.level] = cat;
        this.edit_category = cat;
    }

    private save() {
        this.backend.postRequest('spiceui/core/selecttree/tree', null, this.category_tree).subscribe(
            (success) => {

                this.toast.sendToast('changes saved');
            },
            (error) => {
                this.toast.sendAlert('saving failed!');
                console.error(error);
            }
        );
    }

    private isCategorySelected(cat): boolean {
        for(let c of this.selected_categorys)
        {
            if( c.id == cat.id ) {
                return true;
            }
        }
        return false;
    }
}
