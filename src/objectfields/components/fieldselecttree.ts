/**
 * @module ObjectFields
 */
import {Component, ElementRef,  Renderer2} from '@angular/core';
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
    selector: 'select-tree',
    templateUrl: '../templates/fieldselecttree.html'
})
export class fieldSelectTree extends fieldGeneric {
    public fields = [];

    public show_tree: boolean = false;
    public show_search: boolean = false;
    public search: string;
    public sel_fields = [];

    public clickListener: any;


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

        if(this.fields.length < 1) {
            this.fields.push(this.fieldconfig.value1);
            this.fields.push(this.fieldconfig.value2);
            this.fields.push(this.fieldconfig.value3);
            this.fields.push(this.fieldconfig.value4);
        }

        if( !this.config.getData('select_tree') ) {
            this.config.setData('select_tree', []);
            // load all select_fields which are needed to display the choosen select_fields...
            this.backend.getRequest('configuration/spiceui/core/selecttree/list/'+ this.fieldconfig.key).subscribe(
                (res: any) => {
                    this.sel_fields = res;
                    this.config.setData('select_tree', res);
                }
            );
        } else {
            this.sel_fields = this.config.getData('select_tree');
        }
    }


    get display_value() {
        let txt = '';
        for(let field_keyname of this.fields) {
            if (this.model.getField(field_keyname)) {
                let field_name = "";
                for(let key in this.sel_fields) {
                    if(this.sel_fields[key].keyname === this.model.getField(field_keyname)) {
                        field_name = this.sel_fields[key].name;
                    }
                }
                txt += this.language.getLabel(field_name) + ' \\ ';
            } else {
                break;
            }
        }
        // remove the last slash...
        txt = txt.substring(0,txt.length -2);
        return txt;
    }


    get maxlevels() {
        return this.fieldconfig.maxlevels ? this.fieldconfig.maxlevels : 4;
    }

    public checkUserAction(e) {

        if( !this.search ) {
            this.show_tree = true;
            this.show_search = false;
        } else {
            this.show_tree = false;
            this.show_search = true;
        }
    }

    /**
     * chooses select_fields and stores it in model.data with the corresponding field
     * it also looks for the last category with a corresponding queue to set this too
     * @param select_fields = array of category objects, all lvls from top to lowest
     */
    public chooseSelField(sel_fields) {

        this.show_search = false;
        this.show_tree = false;
        // setting model.data values
        for(let i = 0; i < this.fields.length; i++) {
            if( sel_fields[i] ) {
                let value = sel_fields[i].keyname != "" ? sel_fields[i].keyname : sel_fields[i].name;
                this.model.setField(this.fields[i], value);
            } else {
                this.model.setField(this.fields[i], '');
            }
        }
        this.search = null;

    }

    public unchooseSelField() {

        let modelFields: any = {};
        for(let field of this.fields){
            modelFields[field] = '';
        }
        this.model.setFields(modelFields);
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.show_tree = false;
        }
    }
    public onFocus() {
        this.show_tree = true;
        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }
}
