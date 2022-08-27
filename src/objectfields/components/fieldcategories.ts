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
    templateUrl: '../templates/fieldcategories.html'
})
export class fieldCategories extends fieldGeneric implements OnInit, OnDestroy {

    /**
     * the searchterm entered and used in the categories search
     *
     * @private
     */
    public searchterm: string;

    /**
     * a temp searchterm the input ties to to have a short delay so the reponse is acceptable
     */
    public tempsearchterm: string;

    /**
     * set to true if favorites shoudl be displayed resp searched
     *
     * @private
     */
    public searchfavorites: boolean = false;

    /**
     * the click lisetner that listenes to any click evbent outside of the element
     */
    public clickListener: any;

    /**
     * if the dropwodn is open
     *
     * @private
     */
    public dropDownOpen: boolean = false;

    /**
     * the search timeout
     */
    public searchTimeOut: any = undefined;

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

    public openDropDown(){
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
    public onClick(event): void {
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

                return !lastId || c.parent_id == lastId;
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

    public setFavorites(e: MouseEvent){
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
    public chooseCategories(selected) {
        let fields: any = {};
        let i = 1
        let categories = selected.levels
        while(i <= 4) {
            if(this.fieldconfig['category'+i] && categories[i-1]){
                fields[this.fieldconfig['category'+i]] = this.categories.find(c => c.id == categories[i-1]).node_key;
            } else {
                break;
            }
            i++;
        }

        // set the adddata
        if(this.fieldconfig.addparams && selected.category?.add_params){
            fields[this.fieldconfig.addparams] = selected.category.add_params
        }

        // set the fields
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
    public clearCategories() {
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

    public search(_e) {
        // handle the key pressed
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
        this.searchTimeOut = window.setTimeout(() => {
            this.searchterm = this.tempsearchterm
        }, 1000);
    }

}
