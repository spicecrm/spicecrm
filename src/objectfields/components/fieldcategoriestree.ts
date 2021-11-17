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
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'field-categories-tree',
    templateUrl: './src/objectfields/templates/fieldcategoriestree.html'
})
export class fieldCategoriesTree implements OnInit {

    /**
     * the selected levels
     */
    levels: any[] = [];

    /**
     * the emitter for the selected category
     */
    @Output() category: EventEmitter<any> = new EventEmitter<any>();

    // loading indicator
    private loading: boolean = true;

    /**
     * the categories
     *
     * @private
     */
    @Input() private categories: any[] = [];

    /**
     * a searchterm
     *
     * @private
     */
    @Input() private searchTerm: string;

    /**
     * set to true to display the favorites and allow searching there
     *
     * @private
     */
    @Input() private searchFavorites: boolean = false;

    /**
     * the depth of the current tree
     *
     * @private
     */
    private depth: number = 1;


    constructor(
        private model: model,
        private backend: backend,
        private config: configurationService,
        private language: language,
    ) {

    }

    public ngOnInit() {
        this.determineDepth();
    }

    private determineDepth() {
        let level0 = this.categories.filter(c => !c.parent_id);
        for (let level0Node of level0) {
            let nodeLevel = this.getNodeDepth(level0Node, 1);
            if (nodeLevel > this.depth) this.depth = nodeLevel;
        }

        this.levels = Array(this.depth).fill(null);
    }

    private getNodeDepth(node, level) {
        let children = this.categories.filter(c => c.parent_id == node.id);
        if (children.length > 0) {
            level++;
            for (let child of children) {
                let totalLevel = this.getNodeDepth(child, level);
                if (totalLevel > level) level = totalLevel;
            }
            return level;
        } else {
            return level;
        }
    }

    /**
     * returns if the node has children
     *
     * @param node
     * @private
     */
    private hasChildren(node) {
        return this.categories.filter(c => c.parent_id == node.id).length > 0;
    }

    /**
     * get the categories for the level
     *
     * @param level
     * @private
     */
    private levelCategories(level) {
        switch (level) {
            case 0:
                return this.categories.filter(c => !c.parent_id);
                break;
            default:
                return this.categories.filter(c => c.parent_id == this.levels[level - 1]);
                break;
        }
    }

    /**
     * returns the full qualified matching nodes for a searchterm
     *
     * @private
     */
    private getMatchedNodes() {
        let cats = this.categories.filter(c => c.node_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0);

        let fullcategories = []
        for (let cat of cats) {
            fullcategories.push(this.buildFullCategories(cat));
        }
        return fullcategories;
    }

    /**
     * returns the full qualified matching nodes for a searchterm
     *
     * @private
     */
    private getFavoriteNodes() {
        // let cats = this.categories.filter(c => c.node_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0);
        let cats = this.categories.filter(c => c.favorite);

        // if we have a searchterm apply this as well
        if(this.searchTerm){
            cats = cats.filter(c => c.node_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0);
        }

        let fullcategories = []
        for (let cat of cats) {
            fullcategories.push(this.buildFullCategories(cat));
        }
        return fullcategories;
    }

    private buildFullCategories(category, subnodes: boolean = false) {
        let thisCategory = category;
        let item: any[] = [{id: thisCategory.id, node_name: thisCategory.node_name}];

        while (thisCategory.parent_id) {
            thisCategory = this.categories.find(c => c.id == thisCategory.parent_id)
            item.unshift({id: thisCategory.id, node_name: thisCategory.node_name})
        }

        return item;
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    private select(level, cat) {
        this.levels[level] = cat.id;
        // reset all selected levels higher than the current depth
        level++;
        while (level < this.depth) {
            this.levels[level] = undefined;
            level++;
        }
    }

    /**
     * returns if the category is the selected one for this level
     *
     * @param level
     * @param cat
     */
    private isCategorySelected(level, cat): boolean {
        return this.levels[level] == cat.id;
    }

    /**
     * choose a category
     *
     * @param cat
     * @private
     */
    private choose(level, cat) {
        this.select(level, cat);
        this.category.emit(this.levels);
    }

    /**
     * select a node from teh search or fav list
     *
     * @param node
     * @private
     */
    private selectNode(node){
        let levels = [];
        for(let cat of node){
            levels.push(cat.id);
        }
        this.category.emit(levels);
    }

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     */
    public trackByFn(index, item): string | number {
        return item.id;
    }
}
