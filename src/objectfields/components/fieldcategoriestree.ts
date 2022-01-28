/**
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
    selector: 'field-categories-tree',
    templateUrl: '../templates/fieldcategoriestree.html',
    animations: [
        trigger('treeanimation', [
            state('true', style({'margin-left': '-34%', 'margin-right': '34%'})),
            state('false', style({'margin-left': '0px', 'margin-right': '0px'})),
            transition('true => false', [
                animate('.2s')
            ]),
            transition('false => true', [
                animate('.2s'),
            ])
        ])
    ]
})
export class fieldCategoriesTree {

    /**
     * the selected levels
     */
    levels: any[] = [undefined, undefined, undefined, undefined];

    /**
     * the emitter for the selected category
     */
    @Output() category: EventEmitter<any> = new EventEmitter<any>();

    /**
     * indicates that we are loading
     *
     * @private
     */
    public loading: boolean = true;

    /**
     * the categories
     *
     * @private
     */
    @Input() public categories: any[] = [];

    /**
     * a searchterm
     *
     * @private
     */
    @Input() public searchTerm: string;

    /**
     * set to true to display the favorites and allow searching there
     *
     * @private
     */
    @Input() public searchFavorites: boolean = false;

    constructor(
        public model: model,
        public backend: backend,
        public config: configurationService,
        public language: language,
    ) {

    }

    /**
     * determine if we shoudl display level 4 and there is a level 4
     */
    get shifttree() {
        return !!this.levels[2] && this.categories.filter(c => c.parent_id == this.levels[2]).length > 0;
    }

    /**
     * returns if the node has children
     *
     * @param node
     * @private
     */
    public hasChildren(node) {
        return this.categories.filter(c => c.parent_id == node.id).length > 0;
    }

    /**
     * get the node style
     * @param n
     */
    public nodeStyle(n){
        if(n.selectable){
            return {
                'cursor': 'pointer',
                'text-decoration': 'underline'
            }
        }

        return {
            cursor: 'default'
        }
    }

    /**
     * get the categories for the level
     *
     * @param level
     * @private
     */
    public levelCategories(level) {
        switch (level) {
            case 0:
                return this.categories.filter(c => !c.parent_id || c.parent_id == '').sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1);
                break;
            default:
                return this.levels[level - 1] ? this.categories.filter(c => c.parent_id == this.levels[level - 1]).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1 ) : [];
                break;
        }
    }

    /**
     * returns the full qualified matching nodes for a searchterm
     *
     * @private
     */
    public getMatchedNodes() {
        return this.buildSelectableCategories().filter(i => {
            return this.matchTerms(i.map(x => x.node_name).join(), this.searchTerm);
        });
    }

    /**
     * matches to multiple terms
     *
     * @param haystack
     * @param needle
     * @private
     */
    private matchTerms(haystack, needle){
        let needles = needle.split(' ').map(x => x.trim());

        for(let n of needles){
            if(haystack.toLowerCase().indexOf(n.toLowerCase()) < 0) return false;
        }

        return true;
    }

    /**
     * returns the full qualified matching nodes for a searchterm
     *
     * @private
     */
    public getFavoriteNodes() {
        // let cats = this.categories.filter(c => c.node_name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) >= 0);
        let cats = this.categories.filter(c => c.favorite);

        let fullcategories = []
        for (let cat of cats) {
            fullcategories.push(this.buildFullCategories(cat));
        }

        // if we have a searchterm filter by that
        if (this.searchTerm) {
            return fullcategories.filter(i => {
                // return i.filter(sn => this.matchTerms(sn.node_name, this.searchTerm)).length > 0;
                return this.matchTerms(i.map(x => x.node_name).join(), this.searchTerm);
            });
        }

        return fullcategories;
    }

    /**
     * builds the full aray for all selectable categories
     *
     * @private
     */
    private buildSelectableCategories(): any[]{
        let sc = [];
        for(let c of this.categories.filter(tc => tc.selectable)){
            sc.push(this.buildFullCategories(c));
        }
        return sc;
    }

    /**
     * builds the full categories by filling the array up
     *
     * @param category
     */
    public buildFullCategories(category) {
        let thisCategory = category;
        let item: any[] = [{id: thisCategory.id, node_name: thisCategory.node_name}];

        while (thisCategory.parent_id) {
            thisCategory = this.categories.find(c => c.id == thisCategory.parent_id);
            if(!thisCategory) break;
            item.unshift({id: thisCategory.id, node_name: thisCategory.node_name})
        }

        return item;
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    public select(level, cat) {
        this.levels[level] = cat.id;
        // reset all selected levels higher than the current depth
        level++;
        while (level < 3) {
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
    public isCategorySelected(level, cat): boolean {
        return this.levels[level] == cat.id;
    }

    /**
     * choose a category
     *
     * @param cat
     * @private
     */
    public choose(level, cat) {
        if(cat.selectable) {
            this.select(level, cat);
            this.category.emit({levels: [...this.levels], category: cat});
            this.levels = [undefined, undefined, undefined, undefined];
        }
    }

    /**
     * select a node from teh search or fav list
     *
     * @param node
     * @private
     */
    public selectNode(node) {
        let levels = [];
        for (let cat of node) {
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
