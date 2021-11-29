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
    selector: 'field-categories',
    templateUrl: './src/objectfields/templates/fieldcategories.html'
})
export class fieldCategories extends fieldGeneric implements OnInit, OnDestroy {

    /**
     * the searchterm entered and used in the categories search
     *
     * @private
     */
    private searchterm: string;

    /**
     * set to true if favorites shoudl be displayed resp searched
     *
     * @private
     */
    private searchfavorites: boolean = false;

    /**
     * the click lisetner that listenes to any click evbent outside of the element
     */
    private clickListener: any;

    /**
     * if the dropwodn is open
     *
     * @private
     */
    private dropDownOpen: boolean = false;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
        private config: configurationService,
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        super.ngOnInit();

        // get the categories
        let categories = this.config.getData('categories');

        if (!categories || !categories[this.fieldconfig.treeid]) {
            if (!categories) categories = {};
            // set this in any case so we don't load multiple times
            categories[this.fieldconfig.treeid] = [];
            this.config.setData('categories', categories);

            // load all categories which are needed to display the choosen categories...
            this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.fieldconfig.treeid}/categorytreenodes`).subscribe(
                (res: any) => {
                    categories[this.fieldconfig.treeid] = res;
                    this.config.setData('categories', categories);
                }
            );
        }
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
        if(this.clickListener) this.clickListener();
    }

    get categories(){
        let categories = this.config.getData('categories');
        return categories ? categories[this.fieldconfig.treeid] : [];
    }

    get hasFavorites(){
        return this.categories.filter(c => c.favorite).length > 0;
    }

    private openDropDown(){
        if(!this.dropDownOpen){
            this.dropDownOpen = true;
            this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        }
    }

    /**
     * handle the click event on the document
     *
     * @param event
     */
    private onClick(event): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.dropDownOpen = false;
            this.clickListener();
        }
    }


    // get the display value
    get display_value() {
        let values = [];
        let lastId;
        let i = 1;
        while(i <= 4 && this.fieldconfig['category'+i]){
            let levelvalue = this.model.getField(this.fieldconfig['category'+i]);

            // if we do not have a value break
            if(!levelvalue) break;

            // otherwise try to find the category
            let cat = this.categories.find(c => {
                if(c.node_key != levelvalue) return false;

                if(!lastId && c.parent_id != '' && !!c.parent_id) return false;

                return c.parent_id == lastId;
            });
            if(cat) {
                values.push((cat.node_name));
                lastId = cat.id;
                i++;
            } else {
                break;
            }
        }

        // if we do not have any values
        return values.length == 0 ? undefined : values.join('/');
    }

    private setFavorites(e: MouseEvent){
        e.stopPropagation();
        e.preventDefault();
        this.searchfavorites = !this.searchfavorites;

        if(!this.dropDownOpen) this.dropDownOpen = true;
    }

    /**
     * chooses categories and stores it in model.data with the corresponding field
     * it also looks for the last category with a corresponding queue to set this too
     * @param categories = array of category objects, all lvls from top to lowest
     */
    private chooseCategories(categories) {
        let fields: any = {};
        let i = 1
        while(i <= 4) {
            if(this.fieldconfig['category'+i] && categories[i-1]){
                fields[this.fieldconfig['category'+i]] = this.categories.find(c => c.id == categories[i-1]).node_key;
            } else {
                break;
            }
            i++;
        }
        this.model.setFields(fields);

        // set the name field
        if(this.fieldconfig.setname) {
            this.model.setField('name', this.display_value);
        }

        // close the dropdown
        this.dropDownOpen = false;

        // reset serachterm and fav
        this.searchterm = undefined;
        this.searchfavorites = false;

        // kill the listener for the open dropdown
        if(this.clickListener) this.clickListener();
    }

    /**
     * clears the categories
     *
     * @private
     */
    private clearCategories() {
        let i = 1;
        let fields: any = {};
        while(i <= 4){
            if(this.fieldconfig['category'+i]){
                fields[this.fieldconfig['category'+i]] = undefined;
            }
            i++
        }
        this.model.setFields(fields);
    }

}
