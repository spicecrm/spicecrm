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
 * @module ObjectFields
 */
import {Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'field-service-category-tree',
    templateUrl: './src/objectfields/templates/fieldcategorytree.html'
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
    private loading: boolean = true;

    constructor(
        private model:model,
        private backend:backend,
        private config:configurationService,
        private language:language,
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
        //console.log(cat);
        this.selected_categorys[cat.level] = cat;
        if(cat.categories) {
            this.levels[cat.level + 1] = cat.categories;
            this.resetLevels(cat.level + 2);
        }
        else{
            this.resetLevels(cat.level+1);
        }

        //console.log(this.levels);
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
