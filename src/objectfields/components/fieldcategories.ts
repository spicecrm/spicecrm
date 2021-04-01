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
import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "./fieldgeneric";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

/**
 * documentation: https://spicecrm.gitbooks.io/spicecrm-ui/content/component-directory/fields/service-categories.html
 * created by Sebastian Franz
 */
@Component({
    selector: 'field-service-categories',
    templateUrl: './src/objectfields/templates/fieldcategories.html'
})
export class fieldServiceCategories extends fieldGeneric
{
    readonly fields = ['sysservicecategory_id1','sysservicecategory_id2','sysservicecategory_id3','sysservicecategory_id4'];
    show_tree:boolean = false;
    show_search:boolean = false;
    search:string;
    categories = [];

    constructor(
        public model:model,
        public view:view,
        public language:language,
        public metadata:metadata,
        public router:Router,
        private backend:backend,
        private config:configurationService,
    )
    {
        super(model, view, language, metadata, router);

        if( !this.config.getData('service_categories') ) {
            this.config.setData('service_categories', []);
            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest('spiceui/core/servicecategories').subscribe(
                (res: any) => {
                    this.categories = res;
                    this.config.setData('service_categories', res);
                }
            );
        }
        else {
            this.categories = this.config.getData('service_categories');
        }
    }

    get display_value()
    {
        let txt = '';
        for(let field_name of this.fields)
        {
            if( this.model.data[field_name] && this.categories[this.model.data[field_name]] )
                txt += this.language.getLabel(this.categories[this.model.data[field_name]].name)+'\\';
            else
                break;
        }
        // remove the last slash...
        txt = txt.substring(0,txt.length -1);
        return txt;
    }

    get maxlevels(){
        return this.fieldconfig.maxlevels ? this.fieldconfig.maxlevels : 3;
    }

    checkUserAction(e)
    {
        if( !this.search )
        {
            this.show_tree = true;
            this.show_search = false;
        }
        else {
            this.show_tree = false;
            this.show_search = true;
        }
    }

    /**
     * chooses categories and stores it in model.data with the corresponding field
     * it also looks for the last category with a corresponding queue to set this too
     * @param categories = array of category objects, all lvls from top to lowest
     */
    chooseCategories(categories)
    {
        this.show_search = false;
        this.show_tree = false;
        // setting model.data values
        for(let i = 0; i < this.fields.length; i++)
        {
            if( categories[i] )
                this.model.setField(this.fields[i], categories[i].id);
            else
                this.model.setField(this.fields[i], '');
        }
        this.search = null;

        // look from bottom to top and find a queue!
        for(let i = categories.length-1; i >= 0; i--)
        {
            let cat = categories[i];
            if( cat.servicequeue_id )
            {
                this.model.setField('servicequeue_id', cat.servicequeue_id);
                this.model.setField('servicequeue_name', cat.servicequeue_name);
                break;
            }
        }
        //console.log(this.model.data);
    }

    unchooseCategories()
    {
        for(let i = 0; i < this.fields.length; i++)
        {
            this.model.data[this.fields[i]] = '';
        }
    }
}
