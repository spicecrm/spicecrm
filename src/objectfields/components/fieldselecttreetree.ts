/**
 * @module ObjectFields
 */
import {Component, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'select-tree-tree',
    templateUrl: '../templates/fieldselecttreetree.html'
})
export class fieldSelectTreeTree
{
    select_tree = [];
    // hardcoded till now... maybe evaluate after getting the tree?
    @Input() maxlevels = 4;
    @Input() treekey;

    // holds the current categories of each level...
    levels:any[] = [];
    selected_fields = [];
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
    }

    ngOnInit(){

        // getting the category tree...
        if( !this.config.getData('select_tree_tree') )
        {
            this.backend.getRequest('configuration/spiceui/core/selecttree/tree/'+ this.treekey).subscribe(
                (res:any) => {
                    this.config.setData('select_tree_tree', res);
                    this.select_tree = res;
                    // console.log("select_tree1", this.select_tree);
                    // this.select_tree.sort(function(a, b){return a.name - b.name});

                    this.select_tree.sort(function(a, b){
                        var x = a.name.toLowerCase();
                        var y = b.name.toLowerCase();
                        if (x < y) {return -1;}
                        if (x > y) {return 1;}
                        return 0;
                    });

                    this.levels[0] = this.select_tree;
                    this.loading = false;
                }
            );
        }
        else {
            var select_tree = this.config.getData('select_tree_tree');

            select_tree.sort(function(a, b){
                var x = a.name.toLowerCase();
                var y = b.name.toLowerCase();
                if (x < y) {return -1;}
                if (x > y) {return 1;}
                return 0;
            });

            this.levels[0] = select_tree;
            this.loading = false;
        }
    }

    resetLevels(start_lvl = 0)
    {
        for(let lvl = start_lvl; lvl < this.maxlevels; lvl++)
        {
            this.levels[lvl] = [];
        }
        this.selected_fields.splice(start_lvl,this.maxlevels - start_lvl);
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    select(cat)
    {
        this.selected_fields[cat.level] = cat;
        if(cat.childs) {
            this.levels[cat.level + 1] = cat.childs;
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
        this.selected_fields[cat.level] = cat;
        this.choose_emitter.emit(this.selected_fields);
    }

    isCategorySelected(cat):boolean
    {
        for(let c of this.selected_fields)
        {
            if( c.id == cat.id )
                return true;
        }
        return false;
    }
}
