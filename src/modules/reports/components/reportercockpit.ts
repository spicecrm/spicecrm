/**
 * @module ModuleReports
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";
import {language} from "../../../services/language.service";

/**
 * renders the reporter cockpit
 */
@Component({
    selector: 'reporter-cockpit',
    templateUrl: './src/modules/reports/templates/reportercockpit.html'
})
export class ReporterCockpit implements OnInit, OnDestroy {

    public componentconfig: any = {};
    /**
     * holds the cockpits returned from teh abckend in which reports are sorted in
     */
    protected allFields: any[] = [];

    constructor(private backend: backend,
                private modellist: modellist,
                private language: language,
                private configuration: configurationService,
                private metadata: metadata) {
        this.componentconfig = this.metadata.getComponentConfig('ReporterCockpit', this.modellist.module);
    }

    /**
     * returns the sortfield from the config
     */
    get sortField() {
        return this.componentconfig.sortfield;
    }

    /**
     * @return sortdirection: string from the componentconfig
     */
    get sortDirection() {
        return this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC';
    }

    public ngOnInit() {
        this.loadCategories();
    }


    /**
     * load reports categories from backend
     */
    private loadCategories() {
        const categories = this.configuration.getData('reportcategories');
        if (!categories) {
            this.backend.getRequest('kreporter/categoriesmanager/categories').subscribe(categories => {
                if (!!categories) this.loadList(categories);
            });
        } else {
            this.loadList(categories);
        }
    }

    /**
     * reset the buckets on destroy
     */
    public ngOnDestroy(): void {
        this.modellist.buckets = {};
        this.modellist.reLoadList();
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     */
    private loadList(categories) {

        const bucketItems = categories.map(category => ({
            bucket: category.name,
            values: {},
            items: 0
        }));

        if (this.sortField) {
            this.modellist.setSortField(this.sortField, this.sortDirection, false);
        }
        this.modellist.buckets = {
            bucketfield: 'category_name',
            bucketitems: bucketItems
        };
        this.modellist.loadlimit = 15;

        this.modellist.getListData();
    }

    /**
     * load more items for single bucket
     * @param bucket
     */
    private loadMore(bucket) {
        this.modellist.loadMoreBucketList(bucket);
    }

    /**
     * @param categoryName: string
     * @return filtered list items by category
     */
    private getCategoryReports(categoryName) {
        return this.modellist.listData.list.filter(item => item.category_name == categoryName);
    }
}
