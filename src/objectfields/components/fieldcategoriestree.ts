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
        return !!this.levels[1] && this.has4Levels(this.levels[1]);// this.categories.filter(c => c.parent_id == this.levels[2]).length > 0;
    }

    /**
     * returns if we have 4 levels under the second level
     * ensures that if we have 4 levels this is left open
     *
     * @param level1
     * @private
     */
    private has4Levels(level1){
        for(let level2 of this.categories.filter(c => c.parent_id == level1)){
            if(this.categories.filter(c => c.parent_id == level2.id).length > 0) {
                return true
            };
        }
        return false;
    }

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
     * returns if the node has children
     *
     * @param node
     * @private
     */
    public hasChildren(node) {
        return this.categories.filter(c => c.parent_id == node.id).length > 0;
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
                return this.levels[level - 1] ? this.categories.filter(c => c.parent_id == this.levels[level - 1]).sort((a, b) => parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1) : [];
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
            return this.matchTerms(i.levels.map(x => x.node_name).join(), this.searchTerm);
        }).sort((a, b) => this.compareFullCategories(a.levels, b.levels));
    }

    /**
     * matches to multiple terms
     *
     * @param haystack
     * @param needle
     * @private
     */
    private matchTerms(haystack, needle) {
        let needles = needle.split(' ').map(x => x.trim());

        for (let n of needles) {
            if (haystack.toLowerCase().indexOf(n.toLowerCase()) < 0) return false;
        }

        return true;
    }

    /**
     * returns the full qualified matching nodes for a searchterm
     *
     * @private
     */
    public getFavoriteNodes() {
        // buidl the full selectable categfories that have at least one favorite in there
        let fullcategories = this.buildSelectableCategories(true);

        // if we have a searchterm filter by that
        if (this.searchTerm) {
            return fullcategories.filter(i => {
                return this.matchTerms(i.levels.map(x => x.node_name).join(), this.searchTerm);
            });
        }

        return fullcategories.sort((a, b) => this.compareFullCategories(a.levels, b.levels));
    }

    /**
     * builds the full aray for all selectable categories
     *
     * @private
     */
    private buildSelectableCategories(favorites: boolean = false): any[] {
        let sc = [];
        for (let c of this.categories.filter(tc => tc.selectable)) {
            let fc = this.buildFullCategories(c);
            if (favorites !== true || fc.filter(x => x.favorite).length > 0) sc.push({levels: fc, cat: c});
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
        let item: any[] = [{
            id: thisCategory.id,
            node_name: thisCategory.node_name,
            favorite: thisCategory.favorite,
            node_key: thisCategory.node_key
        }];

        while (thisCategory.parent_id) {
            thisCategory = this.categories.find(c => c.id == thisCategory.parent_id);
            if (!thisCategory) break;
            item.unshift({
                id: thisCategory.id,
                node_name: thisCategory.node_name,
                favorite: thisCategory.favorite,
                node_key: thisCategory.node_key
            })
        }

        return item;
    }

    /**
     * compares two categories base on key or name
     * ToDo: implement this functionality that sorts based on different criteria also
     *
     * @param a
     * @param b
     * @private
     */
    private compareFullCategories(a, b, sortcriteria: 'node_name' | 'node_key' = 'node_name') {
        return a.map(x => x.node_name).join().localeCompare(b.map(x => x.node_name).join());
    }

    /**
     * function to compare two nodes on the level
     * ToDo: Implement .. lower levels if equl shoudl come first .. depper ones later .. to build recursive function
     *
     * @param a
     * @param b
     * @param level
     * @param sortcriteria
     * @private
     */
    private compareFullCategorylevels(a, b, level: number, sortcriteria: 'node_name' | 'node_key' = 'node_key') {

    }

    /**
     * compares two nodes
     *
     * @param a
     * @param b
     * @param sortcriteria
     * @private
     */
    private compareNodes(a, b, sortcriteria: 'node_name' | 'node_key' = 'node_key') {
        switch (sortcriteria) {
            case 'node_name':
                return a.node_name.localeCompare(b.node_name);
                break;
            case 'node_key':
                // if the nodes match return 0
                if (a.node_key == b.node_key) return 0;
                // otherwise return the sort result
                return parseFloat(a.node_key) > parseFloat(b.node_key) ? 1 : -1
                break;
        }
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
        if (cat.selectable) {
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
        for (let cat of node.levels) {
            levels.push(cat.id);
        }
        this.category.emit({levels: [...levels], category: node.cat});

        // reset the term and the favs
        this.searchTerm = '';
        this.searchFavorites = false;
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

    /**
     * A function that defines how to track changes for items in the iterable (ngForOf).
     * https://angular.io/api/common/NgForOf#properties
     * @param index
     * @param item
     */
    public trackByCatId(index, item): string | number {
        return item.cat.id;
    }
}
