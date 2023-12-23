/**
 * @module ModuleReports
 */
import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {backend} from '../../../services/backend.service';
import {configurationService} from "../../../services/configuration.service";

/**
 * renders a selector for the field based on the category tree
 */
@Component({
    selector: 'reporter-filter-item-category',
    templateUrl: '../templates/reporterfilteritemcategory.html'
})
export class ReporterFilterItemCategory implements OnInit, OnChanges {

    /**
     * generic inputs for the field
     */
    @Input() public field: string = '';
    @Input() public isMultiSelect: boolean = false;
    @Input() public wherecondition: any = {};

    /**
     * the fieldname in focus
     */
    public fieldName: string;

    /**
     * the module in focus
     */
    public moduleName: string;

    /**
     * the treeid for the field
     */
    public treeid: string = null;

    /**
     * holds the category field name
     * @private
     */
    private categoryField: string;

    /**
     * category nodes for a spefcific level object key category node_key value node_name
     * @private
     */
    public categoryNodes: any[] = [];

    /**
     * hlds the value internally
     */
    public _value: any = [];

    constructor(public metadata: metadata, public backend: backend, public config: configurationService) {
    }

    /**
     * on init determine the field and load the options
     */
    public ngOnInit() {
        let pathArray = this.wherecondition.path.split('::');

        // get the entries in the path
        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        this.fieldName = fieldArray[1];

        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                this.moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                this.moduleName = field.module;
                break;
        }

        // get the category options
        this.getCategoryptions();
        this.initializeValueArray();
    }


    /**
     * initialize value on changes
     */
    public ngOnChanges() {
        this.initializeValueArray();
    }


    /**
     * if no nodes are loaded the filter shoudl remian disabled
     */
    get isDisabled() {
        return this.categoryNodes.length == 0;
    }

    /**
     * getter for the value
     */
    get value() {
        return this._value;
    }

    /**
     * setter for the value
     *
     * @param value
     */
    set value(value) {
        if (this.isMultiSelect) {
            this._value = value;
            value = value.join(',');
        }
        this.wherecondition[this.field] = value;
        this.wherecondition[this.field + 'key'] = this.wherecondition[this.field];
    }

    /**
     * initialize the array
     */
    public initializeValueArray() {
        const value = this.wherecondition[this.field + 'key'] ? this.wherecondition[this.field + 'key'] : this.wherecondition[this.field];
        this._value = this.isMultiSelect ? (!!value ? value.split(',') : []) : value;
    }

    /**
     * loads the options for the category
     */
    public getCategoryptions() {
        // if we have module and fieldname we can get the otpions locally .. otherwise we try remote
        if (this.moduleName && this.fieldName) {
            this.treeid = this.getTreeId(this.moduleName, this.fieldName);

            // if wee have no treeid return and do nothing
            if(!this.treeid) return;

            // get the categories
            let categories = this.config.getData('categories');

            // if we do not have the categories load them
            if(!categories[this.treeid]){
                // load all categories which are needed to display the choosen categories...
                this.backend.getRequest(`configuration/spiceui/core/categorytrees/${this.treeid}/categorytreenodes`).subscribe(
                    (res: any) => {
                        if(!categories) categories = {};
                        categories[this.treeid] = res;
                        this.buildOptionsFromCategories(res);
                        this.config.setData('categories', categories);
                    }
                );
            } else {
                this.buildOptionsFromCategories(categories[this.treeid]);
            }
        }
    }

    /**
     * deterine the treeid and the tree field
     * @private
     */
    private getTreeId(module, field): string {

        let treeId;
        const moduleDefs = this.metadata.getModuleDefs(module);

        if (!moduleDefs?.categorytrees) return treeId;

        moduleDefs.categorytrees.some(t => {
            const moduleField = Object.keys(t).find(key => t[key] == field);
            if (moduleField) {
                treeId = t.syscategorytree_id;
                this.categoryField = moduleField;
                return true;
            } else {
                return false;
            }
        });

        return treeId;
    }

    /**
     * set category nodes by level and if we hiot the proper level build the options and exit
     *
     * @param categories
     * @private
     */
    private buildOptionsFromCategories(categories) {

        if (!categories || categories.length == 0) return;

        let level = 2;
        const categoriesByLevel = {1: categories.filter(c => !c.parent_id)};

        // if the category field is level 1 no need to use while set the category nodes immediately
        if (this.categoryField.endsWith('1')) {
            this.categoryNodes = categoriesByLevel[1].map(n => {
                return {
                    id: n.id,
                    node_name: n.node_name,
                    node_key: n.node_key
                }
            }).sort((a, b) => a.node_name.localeCompare(b.node_name));
            return;
        }

        // start from level 2, level 1 is already set
        while (level <= 4) {

            categoriesByLevel[level] = [];

            categoriesByLevel[level - 1].forEach(parentCat => {
                categoriesByLevel[level] = categoriesByLevel[level].concat(categories.filter(c => c.parent_id == parentCat.id));
            });

            if (this.categoryField.endsWith(String(level))) {
                this.categoryNodes = categoriesByLevel[level].map(n => {
                    return {
                        id: n.id,
                        node_name: n.node_name,
                        node_key: n.node_key
                    }
                }).sort((a, b) => a.node_name.localeCompare(b.node_name));


                break;
            }
            level++;
        }
    }

}
