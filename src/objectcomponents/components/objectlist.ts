/**
 * @module ObjectComponents
 */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';
import {Subscription} from "rxjs";
import {ListTypeI} from "../../services/interfaces.service";

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

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        if (!this.modellist.loadFromSession()) {
            this.getListData();
        }

        this.subscriptions.add(
            this.modellist.listType$.subscribe(newType =>
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
     * trigger get list data on the service of autoload is not disabled and the list type is not "all"
     * @private
     */
    private getListData() {
        if (this.modellist.currentList.id != 'all' || !this.componentconfig?.disableAutoloadListAll) {
            this.modellist.getListData().subscribe(() =>
                this.cdRef.detectChanges()
            );
        }
    }

    /**
     * getter if the listconfig allows inline editing
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
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * manages the scroll event for the infinite Scroll
     *
     * @param e
     */
    private onScroll() {
        this.modellist.loadMoreList();
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
}
