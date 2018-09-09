import {
    Component,
} from '@angular/core';
import {modelutilities} from '../../services/modelutilities.service';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {toast} from "../../services/toast.service";
import {AppDataService} from "../../services/appdata.service";
import {configurationService} from "../../services/configuration.service";


@Component({
    templateUrl: './src/workbench/templates/servicecategorymanager.html',
})
export class ServiceCategoryManagerComponent
{
    category_tree = [];
    levels = [];
    max_levels = 4;
    loading = true;
    selected_categorys = [];
    edit_category:object = null;
    service_queues = [];

    constructor(
        private appdata: AppDataService,
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private config: configurationService,
        private utils: modelutilities,
        private toast: toast,
    ) {
        // getting the category tree...
        if( !this.config.getData('service_category_tree') )
        {
            this.backend.getRequest('spiceui/core/servicecategories/tree').subscribe(
                (res:any) => {
                    //console.log(res);
                    this.config.setData('service_category_tree', res);
                    this.initializeTree(res);
                }
            );
        }
        else {
            this.initializeTree(this.config.getData('service_category_tree'));
        }

        this.backend.all('ServiceQueues', {}).subscribe(
            (res:any) => {
                //console.log(res);
                this.service_queues = res;

            }
        );
    }

    initializeTree(tree)
    {
        //console.log(tree);
        this.category_tree = tree;
        // getting max levels...

        for(let i = 0; i < this.max_levels; i++)
        {
            this.levels[i] = [];
        }
        this.levels[0] = this.category_tree;
        this.loading = false;
    }


    resetLevels(start_lvl = 0)
    {
        for(let lvl = start_lvl; lvl < this.max_levels; lvl++)
        {
            this.levels[lvl] = [];
        }
        this.selected_categorys.splice(start_lvl,this.max_levels - start_lvl);
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

    addCategory(parent = null)
    {
        let cat = {
            id: this.utils.generateGuid(),
            name: 'new Category...',
            keyname: null,
            parent_id: null,
            selectable: 0,
            favorite: 0,
            servicequeue_id: null,
            level: 0,
        };

        if( parent )
        {
            if( !parent.categories )
            {
                parent.categories = [];
            }
            cat.parent_id = parent.id;
            cat.level = parent.level + 1;
            if( cat.level > this.max_levels )
                this.max_levels = cat.level;

            parent.categories.push(cat);
            this.levels[parent.level + 1] = parent.categories;
        }
        else {
            this.category_tree.push(cat);
            this.levels[0] = this.category_tree;
        }

        this.select(cat);
        this.edit(cat);
    }

    removeCategory(cat)
    {
        if( cat.categories )
        {
            let r = confirm('Are you sure you want to delete this Category? There are '+cat.categories.length+' Subcategories which will be get deleted too!');
            if( !r )
                return false;
        }

        if(cat == this.edit_category )
        {
            this.edit_category = null;
        }

        let i = 0;
        for(let c of this.category_tree)
        {

            if( c == cat )
            {
                this.category_tree.splice(i,1);
                return true;
            }

            searchThroughTree(c, cat);
            i++;
        }

        function searchThroughTree(current, searched)
        {
            if(current.categories)
            {
                for(let i = 0; i < current.categories.length; i++)
                {
                    if(current.categories[i] == searched){
                        current.categories.splice(i,1);
                        return true;
                    }

                    searchThroughTree(current.categories[i], searched);
                }
            }
            return false;
        }
    }

    edit(cat)
    {
        this.selected_categorys[cat.level] = cat;
        this.edit_category = cat;
    }

    save()
    {
        this.backend.postRequest('spiceui/core/servicecategories/tree', null, this.category_tree).subscribe(
            (success) => {

                this.toast.sendToast('changes saved');
            },
            (error) => {
                this.toast.sendAlert('saving failed!');
                console.error(error);
            }
        );
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