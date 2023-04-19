/**
 * @module ModuleReports
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {backend} from '../../../services/backend.service';
import {modellist} from "../../../services/modellist.service";
import {metadata} from "../../../services/metadata.service";
import {configurationService} from "../../../services/configuration.service";
import {language} from "../../../services/language.service";
import {Subscription} from "rxjs";
import {ListTypeI} from "../../../services/interfaces.service";
import {skip} from "rxjs/operators";

/**
 * renders the reporter cockpit
 */
@Component({
    selector: 'reporter-cockpit',
    templateUrl: '../templates/reportercockpit.html'
})
export class ReporterCockpit implements OnInit, OnDestroy {

    public componentconfig: any = {};

    /**
     * the subscription to the modellist
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * holds the cockpits returned from teh abckend in which reports are sorted in
     */
    public allFields: any[] = [];

    constructor(public backend: backend,
                public modellist: modellist,
                public language: language,
                public configuration: configurationService,
                public metadata: metadata) {
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
        this.initialize();
    }

    /**
     * subscribe to detect list data changes
     * load the component config
     * call to get the list data
     * @private
     */
    public initialize() {

        this.componentconfig = this.metadata.getComponentConfig('ReporterCockpit', this.modellist.module);

        // set the limit for the loading
        this.modellist.loadlimit = 15;

        this.loadCategories();

        if (this.sortField) {
            this.modellist.setSortField(this.sortField, this.sortDirection);
        }

        this.subscriptions.add(
            this.modellist.listType$.pipe(skip(1)).subscribe(newType =>
                this.handleListTypeChange(newType)
            )
        );
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    public handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'ReporterCockpit') return;
        this.modellist.reLoadList();
    }


    /**
     * load reports categories from backend the get the list data by the service
     */
    public loadCategories() {
        const categories = this.configuration.getData('reportcategories');
        if (!categories) {
            this.backend.getRequest('module/KReports/categoriesmanager/categories').subscribe(categories => {
                if (!categories) return;
                this.setBuckets(categories);
                this.modellist.getListData();
            });
        } else {
            this.setBuckets(categories);
            this.modellist.getListData();
        }
    }

    /**
     * set the buckets on the model list service from the loaded categories
     * @param categories
     * @private
     */
    public setBuckets(categories) {
        this.modellist.buckets = {
            bucketfield: 'category_name',
            buckettotal: [],
            bucketitems: categories.map(category => ({
                bucket: category.name,
                values: {},
                items: 0,
                hidden: false
            }))
        };
    }

    /**
     * reset the buckets on destroy
     */
    public ngOnDestroy(): void {
        this.modellist.buckets = {};
    }

    /**
     * load more items for single bucket
     * @param bucket
     */
    public loadMore(bucket) {
        this.modellist.loadMoreBucketList(bucket);
    }

    /**
     * @param categoryName: string
     * @return filtered list items by category
     */
    public getCategoryReports(categoryName) {
        return this.modellist.listData.list.filter(item => item.category_name == categoryName);
    }
}
