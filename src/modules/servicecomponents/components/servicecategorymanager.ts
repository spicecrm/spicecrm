/**
 * @module ServiceComponentsModule
 */
import {
    Component,
} from '@angular/core';
import {modelutilities} from '../../../services/modelutilities.service';
import {backend} from '../../../services/backend.service';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {toast} from "../../../services/toast.service";
import {configurationService} from "../../../services/configuration.service";


@Component({
    templateUrl: '../templates/servicecategorymanager.html',
})
export class ServiceCategoryManagerComponent {
    public category_tree = [];
    public levels = [];
    public max_levels = 4;
    public loading = true;
    public selected_categorys = [];
    public edit_category: any = null;
    public service_queues = [];

    constructor(
        public backend: backend,
        public metadata: metadata,
        public language: language,
        public config: configurationService,
        public utils: modelutilities,
        public toast: toast,
    ) {
        // getting the category tree...
        if (!this.config.getData('service_category_tree')) {
            this.backend.getRequest('configuration/spiceui/core/servicecategories/tree').subscribe(
                (res: any) => {
                    this.config.setData('service_category_tree', res);
                    this.initializeTree(res);
                }
            );
        } else {
            this.initializeTree(this.config.getData('service_category_tree'));
        }

        this.backend.getRequest('module/ServiceQueues', {limit: -99}).subscribe(
            (res: any) => {
                for (let r of res.list) {
                    this.service_queues.push(this.utils.backendModel2spice('ServiceQueues', r));

                }
            }
        );
    }

    public initializeTree(tree) {
        this.category_tree = tree;
        // getting max levels...

        for (let i = 0; i < this.max_levels; i++) {
            this.levels[i] = [];
        }
        this.levels[0] = this.category_tree;
        this.loading = false;
    }


    public resetLevels(start_lvl = 0) {
        for (let lvl = start_lvl; lvl < this.max_levels; lvl++) {
            this.levels[lvl] = [];
        }
        this.selected_categorys.splice(start_lvl, this.max_levels - start_lvl);
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    public select(cat) {
        this.selected_categorys[cat.level] = cat;
        if (cat.categories) {
            this.levels[cat.level + 1] = cat.categories;
            this.resetLevels(cat.level + 2);
        } else {
            this.resetLevels(cat.level + 1);
        }
    }

    public addCategory(parent = null) {
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

        if (parent) {
            if (!parent.categories) {
                parent.categories = [];
            }
            cat.parent_id = parent.id;
            cat.level = parent.level + 1;
            if (cat.level > this.max_levels) this.max_levels = cat.level;

            parent.categories.push(cat);
            this.levels[parent.level + 1] = parent.categories;
        } else {
            this.category_tree.push(cat);
            this.levels[0] = this.category_tree;
        }

        this.select(cat);
        this.edit(cat);
    }

    public removeCategory(cat) {
        if (cat.categories) {
            let r = confirm('Are you sure you want to delete this Category? There are ' + cat.categories.length + ' Subcategories which will be get deleted too!');
            if (!r) return false;
        }

        if (cat == this.edit_category) {
            this.edit_category = null;
        }

        let i = 0;
        for (let c of this.category_tree) {

            if (c == cat) {
                this.category_tree.splice(i, 1);
                return true;
            }

            searchThroughTree(c, cat);
            i++;
        }

        function searchThroughTree(current, searched) {
            if (current.categories) {
                for (let i = 0; i < current.categories.length; i++) {
                    if (current.categories[i] == searched) {
                        current.categories.splice(i, 1);
                        return true;
                    }

                    searchThroughTree(current.categories[i], searched);
                }
            }
            return false;
        }
    }

    public edit(cat) {
        this.selected_categorys[cat.level] = cat;
        this.edit_category = cat;
    }

    public save() {
        this.backend.postRequest('configuration/spiceui/core/servicecategories/tree', null, this.category_tree).subscribe(
            (success) => {
                this.toast.sendToast('changes saved');
            },
            (error) => {
                this.toast.sendAlert('saving failed!');
                console.error(error);
            }
        );
    }

    public isCategorySelected(cat): boolean {
        for (let c of this.selected_categorys) {
            if (c.id == cat.id) return true;
        }
        return false;
    }

}
