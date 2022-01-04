/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnDestroy,
    OnInit
} from '@angular/core';
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
    templateUrl: '../templates/objectlist.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

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
     * Show drag handle and provide drag&drop functionality.
     */
    @Input() public dragAndDrop = false;

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
     * returns the actionset from the config
     */
    get actionset() {
        return this.componentconfig.actionset;
    }

    /**
     * returns if the list service is loading
     */
    get isloading() {
        return this.modellist.isLoading;
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
     * call to initialize the component
     */
    public ngOnInit() {
        this.initialize();
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
     * load more items from teh manual pushed button
     *
     * @private
     */
    public loadMore() {
        this.modellist.loadMoreList();
    }

    /**
     * manages the scroll event for the infinite Scroll
     */
    public onScroll() {
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
    public trackbyfn(index, item) {
        return item.id;
    }

    /**
     * subscribe to detect list data changes
     * load the component config
     * call to get the list data
     * @private
     */
    public initialize() {

        this.loadComponentConfig();

        this.chooseFields();

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // set the buckets to null
        this.modellist.buckets = {};

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
    public handleListTypeChange(newType: ListTypeI) {
        this.cdRef.detectChanges();
        if (newType.listcomponent != 'ObjectList') return;
        this.chooseFields();
        this.getListData();
    }

    /**
     * load the component config and set the disable autoload value from the model list service if undefined
     * @private
     */
    public loadComponentConfig() {
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);
        if ('disableAutoloadListAll' in this.componentconfig) return;
        this.componentconfig.disableAutoloadListAll = this.modellist.disableAutoloadListAll;
    }

    /**
     * trigger get list data on the service if autoload is not disabled and the list type is not "all" or reset the list data
     * @private
     */
    public getListData() {
        if (this.modellist.currentList.id != 'all' || !this.componentconfig?.disableAutoloadListAll) {
            this.modellist.getListData().subscribe(() =>
                this.cdRef.detectChanges()
            );
        } else {
            this.modellist.resetListData();
        }
    }

    /**
     * opens the modal allowing the user to choose and select the display fields when no field defs are defined and no current list fields are defined
     */
    public chooseFields() {
        if (this.modellist.isCustomList() && this.modellist.listfields.length == 0 && this.modellist.getFieldDefs()?.length == 0 && this.modellist.checkAccess('edit')) {
            this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
        }
    }
}
