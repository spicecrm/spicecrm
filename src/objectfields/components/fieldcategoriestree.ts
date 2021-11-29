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
    templateUrl: './src/objectfields/templates/fieldcategoriestree.html',
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

    constructor(
        private model: model,
        private backend: backend,
        private config: configurationService,
        private language: language,
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
                return this.categories.filter(c => !c.parent_id || c.parent_id == '');
                break;
            default:
                return this.levels[level - 1] ? this.categories.filter(c => c.parent_id == this.levels[level - 1]): [];
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
        if (this.searchTerm) {
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
        this.category.emit([...this.levels]);
        this.levels = [undefined, undefined, undefined, undefined];
    }

    /**
     * select a node from teh search or fav list
     *
     * @param node
     * @private
     */
    private selectNode(node) {
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
