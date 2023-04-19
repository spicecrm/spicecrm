/**
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, Output,} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'field-service-category-search',
    templateUrl: '../templates/fieldservicecategorysearch.html'
})
export class fieldServiceCategorySearch
{
    @Input() search:string;
    categories = [];
    selected_categorys = [];
    @Output('choose') choose_emitter = new EventEmitter();

    constructor(
        public model:model,
        public backend:backend,
        public config:configurationService,
        public language:language,
    )
    {
        if( !this.config.getData('service_category_tree') )
        {
            this.backend.getRequest('configuration/spiceui/core/servicecategories/tree').subscribe(
                (res:any) => {
                    // console.log(res);
                    this.config.setData('service_category_tree', res);
                    this.flatteningOutCategoryTree(res);
                }
            );
        }
        else {
            this.flatteningOutCategoryTree(this.config.getData('service_category_tree'));
        }
    }

    get results()
    {
        return this.categories.filter((e) => {return e.display_name.toLowerCase().includes(this.search.toLowerCase())});
    }

    flatteningOutCategoryTree(tree)
    {
        for(let cat of tree)
        {
            cat.parents = [];
            this.loopThroughTree(cat);
        }
        // console.log(this.categories);
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

        this.categories.push(cat);

        if(cat.categories)
        {
            for(let c of cat.categories)
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
