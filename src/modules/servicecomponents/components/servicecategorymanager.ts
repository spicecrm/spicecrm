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
    templateUrl: './src/modules/servicecomponents/templates/servicecategorymanager.html',
})
export class ServiceCategoryManagerComponent {
    private category_tree = [];
    private levels = [];
    private max_levels = 4;
    private loading = true;
    private selected_categorys = [];
    private edit_category: object = null;
    private service_queues = [];

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private config: configurationService,
        private utils: modelutilities,
        private toast: toast,
    ) {
        // getting the category tree...
        if (!this.config.getData('service_category_tree')) {
            this.backend.getRequest('spiceui/core/servicecategories/tree').subscribe(
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

    private initializeTree(tree) {
        this.category_tree = tree;
        // getting max levels...

        for (let i = 0; i < this.max_levels; i++) {
            this.levels[i] = [];
        }
        this.levels[0] = this.category_tree;
        this.loading = false;
    }


    private resetLevels(start_lvl = 0) {
        for (let lvl = start_lvl; lvl < this.max_levels; lvl++) {
            this.levels[lvl] = [];
        }
        this.selected_categorys.splice(start_lvl, this.max_levels - start_lvl);
    }

    /**
     * triggered on mouseenter, selects a category to go deeper
     */
    private select(cat) {
        this.selected_categorys[cat.level] = cat;
        if (cat.categories) {
            this.levels[cat.level + 1] = cat.categories;
            this.resetLevels(cat.level + 2);
        } else {
            this.resetLevels(cat.level + 1);
        }
    }

    private addCategory(parent = null) {
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

    private removeCategory(cat) {
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

    private edit(cat) {
        this.selected_categorys[cat.level] = cat;
        this.edit_category = cat;
    }

    private save() {
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

    private isCategorySelected(cat): boolean {
        for (let c of this.selected_categorys) {
            if (c.id == cat.id) return true;
        }
        return false;
    }

}
