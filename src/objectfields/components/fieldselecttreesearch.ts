/**
 * @module ObjectFields
 */
import {Component,  EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'select-tree-search',
    templateUrl: '../templates/fieldselecttreesearch.html'
})
export class fieldSelectTreeSearch
{
    @Input() search:string;
    @Input() treekey;
    sel_fields = [];
    selected_categorys = [];
    @Output('choose') choose_emitter = new EventEmitter();

    constructor(
        public model:model,
        public backend:backend,
        public config:configurationService,
        public language:language,
    )
    {

    }

    ngOnInit(){
        if( !this.config.getData('select_tree_tree') )
        {
            this.backend.getRequest('configuration/spiceui/core/selecttree/tree/'+ this.treekey).subscribe(
                (res:any) => {
                    this.config.setData('select_tree_tree', res);
                    this.flatteningOutCategoryTree(res);
                }
            );
        }
        else {
            this.flatteningOutCategoryTree(this.config.getData('select_tree_tree'));
        }
    }


    get results()
    {
        return this.sel_fields.filter((e) => {return e.display_name.includes(this.search)});
    }

    flatteningOutCategoryTree(tree)
    {
        for(let cat of tree)
        {
            cat.parents = [];
            this.loopThroughTree(cat);
        }
    }

    public loopThroughTree(cat)
    {
        cat.display_name = '';
        if( cat.parents.length > 0 ) {
            for (let p of cat.parents) {
                cat.display_name += this.language.getLabel(p.name) + '\\';
            }
        }
        cat.display_name += this.language.getLabel(cat.name);

        this.sel_fields.push(cat);

        if(cat.childs)
        {
            for(let c of cat.childs)
            {
                c.parents = [...cat.parents];
                c.parents.push(cat);

                this.loopThroughTree(c);
            }
        }
    }

    choose(cat)
    {
        let cats = [...cat.parents];
        cats.push(cat);
        this.choose_emitter.emit(cats);
    }
}
