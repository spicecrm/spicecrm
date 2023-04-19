/**
 * @module ObjectFields
 */
import {Component, ElementRef, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "./fieldgeneric";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";

/**
 * renders a field to choose from teh category tree
 */
@Component({
    selector: 'field-category',
    templateUrl: '../templates/fieldcategory.html'
})
export class fieldCategory extends fieldGeneric implements OnInit, OnDestroy {


    /**
     * holds the tree id .. here for legacy purposes
     *
     * @private
     */
    private treeid: string;

    /**
     * holds the category fields
     *
     * @private
     */
    private categoryFields: string[] = [];

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public config: configurationService,
        public elementRef: ElementRef,
        public renderer: Renderer2
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();

        // get the categories
        let categories = this.config.getData('categories');

        // first try to determine by module
        let moduleDefs = this.metadata.getModuleDefs(this.model.module);

        if(moduleDefs.categorytrees){
            let r = moduleDefs.categorytrees.find(t => t.module_field_c1 == this.fieldname || t.module_field_c2 == this.fieldname || t.module_field_c3 == this.fieldname || t.module_field_c4 == this.fieldname);
            if(r) {
                this.treeid = r.syscategorytree_id;
            }
        }

        if (this.treeid && (!categories || !categories[this.treeid])) {
            if (!categories) categories = {};
            // set this in any case so we don't load multiple times
            categories[this.treeid] = [];
            this.config.setData('categories', categories);

            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.treeid}/categorytreenodes`).subscribe(
                (res: any) => {
                    categories[this.treeid] = res;
                    this.config.setData('categories', categories);
                }
            );
        }
    }

    get categories(){
        let categories = this.config.getData('categories');
        return categories ? categories[this.treeid] : [];
    }

    // get the display value
    get display_value() {
        let n = this.categories.find(n => n.node_key == this.value)
        return n ? n.node_name : this.value;
        // return `I am a category ${this.value}`;
    }
}
