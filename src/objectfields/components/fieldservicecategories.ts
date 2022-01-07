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
    templateUrl: '../templates/fieldservicecategories.html'
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
        public backend:backend,
        public config:configurationService,
    )
    {
        super(model, view, language, metadata, router);

        if( !this.config.getData('service_categories') ) {
            this.config.setData('service_categories', []);
            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest('configuration/spiceui/core/servicecategories').subscribe(
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
            if( this.model.getField(field_name) && this.categories[this.model.getField(field_name)] ) {
                txt += this.language.getLabel(this.categories[this.model.getField(field_name)].name) + '\\';
            } else {
                break;
            }
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
            if( categories[i] ) {
                this.model.setField(this.fields[i], categories[i].id);
            } else {
                this.model.setField(this.fields[i], '');
            }
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
    }

    unchooseCategories()
    {
        let modelFields: any = {};
        for(let field of this.fields){
            modelFields[field] = '';
        }
        this.model.setFields(modelFields);
    }
}
