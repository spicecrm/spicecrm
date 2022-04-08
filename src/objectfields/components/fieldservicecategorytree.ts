/**
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'field-service-category-tree',
    templateUrl: '../templates/fieldservicecategorytree.html'
})
export class fieldServiceCategoryTree
{
    category_tree = [];
    // hardcoded till now... maybe evaluate after getting the tree?
    @Input() maxlevels = 4;
    // holds the current categories of each level...
    levels:any[] = [];
    selected_categorys = [];
    @Output('choose') choose_emitter = new EventEmitter();

    // loading indicator
    public loading: boolean = true;

    constructor(
        public model:model,
        public backend:backend,
        public config:configurationService,
        public language:language,
    )
    {
        this.resetLevels();
        // getting the category tree...
        if( !this.config.getData('service_category_tree') )
        {
            this.backend.getRequest('configuration/spiceui/core/servicecategories/tree').subscribe(
                (res:any) => {
                    //console.log(res);
                    this.config.setData('service_category_tree', res);
                    this.category_tree = res;
                    this.levels[0] = this.category_tree;
                    this.loading = false;
                }
            );
        }
        else {
            this.category_tree = this.config.getData('service_category_tree');
            this.levels[0] = this.category_tree;
            this.loading = false;
        }
    }

    resetLevels(start_lvl = 0)
    {
        for(let lvl = start_lvl; lvl < this.maxlevels; lvl++)
        {
            this.levels[lvl] = [];
        }
        this.selected_categorys.splice(start_lvl,this.maxlevels - start_lvl);
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    select(cat)
    {
        this.selected_categorys[cat.level] = cat;
        if(cat.categories) {
            this.levels[cat.level + 1] = cat.categories;
            this.resetLevels(cat.level + 2);
        }
        else{
            this.resetLevels(cat.level+1);
        }
    }

    /**
     * triggered on click, selects a category finally and emits the 'choose' output
     */
    choose(cat)
    {
        this.selected_categorys[cat.level] = cat;
        this.choose_emitter.emit(this.selected_categorys);
    }

    isCategorySelected(cat):boolean
    {
        for(let c of this.selected_categorys)
        {
            if( c.id == cat.id )
                return true;
        }
        return false;
    }
}
