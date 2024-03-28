/**
 * @module ObjectFields
 */
import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from "../../services/metadata.service";
import {Router} from "@angular/router";
import {fieldGeneric} from "./fieldgeneric";
import {backend} from "../../services/backend.service";
import {configurationService} from "../../services/configuration.service";
import {broadcast} from "../../services/broadcast.service";
import {subscription} from "../../services/subscription.service";

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

    /**
     * set to true to set the displayname to the field we have in focus
     * this is only valid if we get this from treeallocation and not if the config comes from the fieldconfig
     * Legacy Support - to be removed in future releases when we discontinue the legacy support
     *
     * @private
     */
    private setFieldName: boolean = false;

    /**
     * holds eascape key listener
     * @private
     */
    public escKeyListener: any;

    @ViewChild('focusEl') focusElement: ElementRef;
    @ViewChild('categoryTree') categoryTree: ElementRef;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public backend: backend,
        public config: configurationService,
        public elementRef: ElementRef,
        public renderer: Renderer2,
        public changeDetectorRef: ChangeDetectorRef,
        public broadcast: broadcast
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
            let r = moduleDefs.categorytrees.find(t => t.module_field == this.fieldname);
            if(r) {
                this.treeid = r.syscategorytree_id;
                if(r.module_field_c1) this.categoryFields.push(r.module_field_c1);
                if(r.module_field_c2) this.categoryFields.push(r.module_field_c2);
                if(r.module_field_c3) this.categoryFields.push(r.module_field_c3);
                if(r.module_field_c4) this.categoryFields.push(r.module_field_c4);

                // in case we have this kind of setup set the fieldname
                this.setFieldName = true;
            }
        }

        if(!this.treeid) {
            this.treeid = this.fieldconfig.treeid;
            if(this.fieldconfig.category1) this.categoryFields.push(this.fieldconfig.category1);
            if(this.fieldconfig.category2) this.categoryFields.push(this.fieldconfig.category2);
            if(this.fieldconfig.category3) this.categoryFields.push(this.fieldconfig.category3);
            if(this.fieldconfig.category4) this.categoryFields.push(this.fieldconfig.category4);
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
                    // emit that the tree has been loaded
                    this.broadcast.broadcastMessage('categories.loaded', this.treeid);
                }
            );
        }

        // subvscribe to the brioadcast when the categories are loaded
        this.subscriptions.add(
            this.broadcast.message$.subscribe( message => {
                if (message.messagetype === 'categories.loaded' && message.messagedata === this.treeid) {
                    this.changeDetectorRef.detectChanges();
                }
            })
        )
    }

    public ngOnDestroy() {
        super.ngOnDestroy();
        // kill the listeners
        if(this.escKeyListener) this.escKeyListener();
        if(this.clickListener) this.clickListener();
    }

    get categories(){
        if(!this.treeid) return [];
        let categories = this.config.getData('categories');
        return categories ? categories[this.treeid] : [];
    }

    /**
     * the name of the property to sort on that is set in the fieldconfig
     * 2 possible values for now node_key | node_name
     * default is node_key
     */
    get sortby(){
        return this.fieldconfig.sortby;
    }

    get hasFavorites(){
        return this.categories.filter(c => c.favorite).length > 0;
    }

    public openDropDown(){
        if(!this.dropDownOpen){
            this.dropDownOpen = true;
            this.subscribeToESCKeyUp();
            // this.clickListener = this.renderer.listen("document", "click", (event) => this.onClick(event));
        }
    }

    /**
     * actions to perform when ESC key is pressed
     */
    public subscribeToESCKeyUp() {
        this.escKeyListener = this.renderer.listen('document', 'keyup', (event: KeyboardEvent) => {
            if (event.key != 'Escape') return;
            this.dropDownOpen = false;
            this.resetTmpSearchTerm();
        });
    }

    /**
     * @deprecated: use (click) event in template
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
        let i = 0;
        while(i < this.categoryFields.length){
            let levelvalue = this.model.getField(this.categoryFields[i]);

            // if we do not have a value break
            if(!levelvalue) break;

            // otherwise try to find the category
            let cat = this.categories.find(c => {
                if(c.node_key != levelvalue) return false;

                if(!lastId && c.parent_id != '' && !!c.parent_id) return false;

                return !lastId || c.parent_id == lastId;
            });
            if(cat) {
                values.push((this.language.getLabel(cat.node_name)));
                lastId = cat.id;
                i++;
            } else {
                break;
            }
        }

        // get the display name
        let d = values.length == 0 ? undefined : values.join('/');

        // set the name on the model so we are sure we have it
        if(d != this.value) this.model.setField(this.fieldname, d, true);

        // if we do not have any values
        return d;
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
        let i = 0
        let categories = selected.levels
        while(i < this.categoryFields.length) {
            if(categories[i]){
                fields[this.categoryFields[i]] = this.categories.find(c => c.id == categories[i]).node_key;
            } else {
                fields[this.categoryFields[i]] = undefined;
            }
            i++;
        }



        // set the adddata
        if(this.fieldconfig.addparams && selected.category?.add_params){
            fields[this.fieldconfig.addparams] = selected.category.add_params
        }

        // set the fields silent
        this.model.setFields(fields, true);

        // rebuild the fields value to set the field name
        fields = [];
        // set the name displayvalue to the field
        if(this.setFieldName) fields[this.fieldname] = this.display_value;
        // set the name field
        if(this.fieldconfig.setname) fields.name = this.display_value;
        // update if we have any fields to update
        if(Object.getOwnPropertyNames(fields).length > 0) this.model.setFields(fields);

        // close the dropdown
        this.dropDownOpen = false;

        // reset serachterm and fav
        this.searchterm = undefined;
        this.searchfavorites = false;



        // kill the listeners for the open dropdown
        if(this.escKeyListener) this.escKeyListener();
        if(this.clickListener) this.clickListener();
    }

    /**
     * clears the categories
     * set empty string so that empty value for removed categories can be sent
     * @private
     */
    public clearCategories() {
        let i = 0;
        let fields: any = {};
        while(i < this.categoryFields.length){
            fields[this.categoryFields[i]] = '';
            i++
        }
        // clear the fieldname
        fields[this.fieldname] = undefined;

        this.model.setFields(fields);

        this.resetTmpSearchTerm();
    }

    /**
     * focus on input field
     */
    public focusInputField() {
        setTimeout(() => {
            const element = this.renderer.selectRootElement(this.focusElement.nativeElement);
            element.focus();
        }, 200);
    }

    /**
     * Listen event if click outside of element
     * @param targetElement
     */
    @HostListener('document:click', ['$event.target'])
    public onPageClick(targetElement) {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (!clickedInside) {
            this.dropDownOpen = false;
        }
    }

    public search(_e) {
        // handle the key pressed
        if (this.searchTimeOut) window.clearTimeout(this.searchTimeOut);
        this.searchTimeOut = window.setTimeout(() => {
            this.searchterm = this.tempsearchterm
        }, 1000);

        if(this.tempsearchterm != ''){
            this.openDropDown();
        }
    }

    /**
     * set empty string in tempsearchterm
     */
    public resetTmpSearchTerm(){
        this.tempsearchterm = '';
    }
}
