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
import {Component,  EventEmitter, Input, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

@Component({
    selector: 'select-tree-search',
    templateUrl: './src/objectfields/templates/fieldselecttreesearch.html'
})
export class fieldSelectTreeSearch
{
    @Input() search:string;
    @Input() treekey;
    sel_fields = [];
    selected_categorys = [];
    @Output('choose') choose_emitter = new EventEmitter();

    constructor(
        private model:model,
        private backend:backend,
        private config:configurationService,
        private language:language,
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

    private loopThroughTree(cat)
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
