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
 * @module ObjectComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';
import {Subscription} from "rxjs";
import {ListTypeI} from "../../services/interfaces.service";
import {modal} from "../../services/modal.service";
import {skip} from "rxjs/operators";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectList implements OnDestroy, OnInit {

    /**
     * the subscription to the modellist
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * the componentconfig
     */
    public componentconfig: any = {};

    /**
     * returns the actionset from the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if the listservic eis loading
     */
    get isloading() {
        return this.modellist.isLoading;
    }

    constructor(public router: Router,
                public cdRef: ChangeDetectorRef,
                public metadata: metadata,
                public modellist: modellist,
                public language: language,
                public injector: Injector,
                public modal: modal,
                public layout: layout) {
    }

    /**
     * call to initialize the component
     */
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

        this.loadComponentConfig();

        this.chooseFields();

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        if (!this.modellist.loadFromSession()) {
            this.getListData();
        }

        this.subscriptions.add(
            this.modellist.listType$.pipe(skip(1)).subscribe(newType =>
                this.handleListTypeChange(newType)
            )
        );

        this.subscriptions.add(
            this.modellist.listDataChanged$.subscribe(() => {
                this.cdRef.detectChanges();
            })
        );
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    private handleListTypeChange(newType: ListTypeI) {
        this.cdRef.detectChanges();
        if (newType.listcomponent != 'ObjectList') return;
        this.chooseFields();
        this.getListData();
    }

    /**
     * load the component config and set the disable autoload value from the model list service if undefined
     * @private
     */
    private loadComponentConfig() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        if ('disableAutoloadListAll' in this.componentconfig) return;
        this.componentconfig.disableAutoloadListAll = this.modellist.disableAutoloadListAll;
    }

    /**
     * trigger get list data on the service if autoload is not disabled and the list type is not "all" or reset the list data
     * @private
     */
    private getListData() {
        if (this.modellist.currentList.id != 'all' || !this.componentconfig?.disableAutoloadListAll) {
            this.modellist.getListData().subscribe(() =>
                this.cdRef.detectChanges()
            );
        } else {
            this.modellist.resetListData();
        }
    }

    /**
     * getter if the list config allows inline editing
     */
    get inlineedit() {
        return this.componentconfig.inlineedit;
    }

    /**
     * a getter if the view is considered small
     * to render the view properly
     */
    get issmall() {
        return this.layout.screenwidth == 'small';
    }

    /**
     * returns the sortfield from the config
     */
    get sortfield() {
        return this.componentconfig.sortfield;
    }

    /**
     * returns the sortdirection from the componentconfig
     */
    get sortdirection() {
        return this.componentconfig.sortdirection ? this.componentconfig.sortdirection : 'ASC';
    }

    /**
     * unsubscribe from the model list subscription
     * reset the use cache value in case other component does not use cache
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
        this.modellist.useCache = false;
    }

    /**
     * displays rownumbers if set in the config
     */
    get rowNumbers() {
        return this.componentconfig.rownumbers === true;
    }

    /**
     * gets if the config has no autoload set
     */
    get noAutoLoad() {
        return this.componentconfig.noautoload === true;
    }

    /**
     * returns if the list can load more records
     */
    get canLoadMore() {
        return this.modellist.canLoadMore();
    }

    /**
     * load more items from teh manual pushed button
     *
     * @private
     */
    private loadMore() {
        this.modellist.loadMoreList();
    }

    /**
     * manages the scroll event for the infinite Scroll
     */
    private onScroll() {
        if (!this.noAutoLoad) {
            this.modellist.loadMoreList();
        }
    }

    /**
     * trackby function to optimize performance onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }

    /**
     * opens the modal allowing the user to choose and select the display fields when no field defs are defined and no current list fields are defined
     */
    private chooseFields() {
        if (this.modellist.isCustomList() && this.modellist.listfields.length == 0 && this.modellist.getFieldDefs()?.length == 0 && this.modellist.checkAccess('edit')) {
            this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
        }
    }
}
