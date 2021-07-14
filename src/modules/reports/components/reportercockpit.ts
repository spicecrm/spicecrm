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
    templateUrl: './src/modules/reports/templates/reportercockpit.html'
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
    protected allFields: any[] = [];

    constructor(private backend: backend,
                private modellist: modellist,
                private language: language,
                private configuration: configurationService,
                private metadata: metadata) {
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
    private initialize() {

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
    private handleListTypeChange(newType: ListTypeI) {
        if (newType.listcomponent != 'ReporterCockpit') return;
        this.modellist.reLoadList();
    }


    /**
     * load reports categories from backend the get the list data by the service
     */
    private loadCategories() {
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
    private setBuckets(categories) {
        this.modellist.buckets = {
            bucketfield: 'category_name',
            bucketitems: categories.map(category => ({
                bucket: category.name,
                values: {},
                items: 0
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
