/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    OnDestroy,
    OnInit,
    ViewChild
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
import {CdkVirtualScrollViewport} from "@angular/cdk/scrolling";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html',
    changeDetection: ChangeDetectionStrategy.OnPush,

})
export class ObjectList implements OnDestroy, OnInit {
    /**
     * the subscription to the modellist
     */
    public subscriptions: Subscription = new Subscription();
    public virtualScrolling: boolean = true;
    /**
     * true if the scrollbar in the table is visible
     */
    public scrollbarVisible: boolean = false;
    /**
     * the componentconfig
     */
    public componentconfig: any = {};
    /**
     * holds the item height
     */
    public itemHeight: number = 33;
    /**
     * holds the scroll timeout
     */
    public scrollTimeout: number;
    /**
     * holds the total items indices
     */
    public indices: number[];
    /**
     * holds the total items indices
     */
//    public loadedIndices: {[key: number]: number} = {};

    public loadedIndices = [];

    /**
     * holds page's current position
     */
    public currentPosition = window.pageYOffset;


    /**
     * holds a reference to the virtual scroll viewport component
     * @private
     */
    @ViewChild(CdkVirtualScrollViewport) private scrollViewport: CdkVirtualScrollViewport;

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
     * handle viewport scroll to load more entries
     */
    public onViewportScroll(index: number) {

        // checking the scroll direction in the browser

        if (index === 0) {
            return;
        }
        console.log('index: ', index);

        if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);

        // adding 20 to the index when index is reached
        let loadindexUp = index + 20;
        let loadindexDown = index - 20;

        this.scrollTimeout = window.setTimeout(() => {

            // loading more as soon as the index+20 is reached when scrolled
            let triggerLoadMore = !(loadindexUp in this.loadedIndices) && loadindexDown > 0;

            if (triggerLoadMore) {
                this.scrollDown();

                // change offset when index is reached
                this.modellist.offset = loadindexUp;

                // logic for loadlimit -- loading either 50 items, or when end is reached the rest is loaded
                this.modellist.loadlimit = this.modellist.listData.totalcount - this.modellist.offset < this.modellist.loadlimit ? this.modellist.listData.totalcount - this.modellist.offset : 50;

                // deleting first 40 items from the array
                this.loadedIndices.splice(0, 40);
                // console.log('loaded indices when false: ', this.loadedIndices);

                this.modellist.loadMoreList();

            } else {
                this.scrollUp();
                }
            }
        , 500);
    }

    /**
     * tracking if the user is scrollig down
     */
    public scrollDown() {
        let scroll = this.scrollViewport.elementRef.nativeElement.scrollTop;
        if (scroll >= this.currentPosition) {
            console.log('scrollDown');
        }
        this.currentPosition = scroll;
    }

    /**
     * tracking if the user is scrolling up
     */
    public scrollUp() {
        let scroll = this.scrollViewport.elementRef.nativeElement.scrollTop;
        if (scroll <= this.currentPosition) {
            console.log('scrollUp');
        }
        this.currentPosition = scroll;
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

                this.scrollbarVisible = (this.modellist.listData.list.length * this.itemHeight) > this.scrollViewport.elementRef.nativeElement.getBoundingClientRect().height;
                this.handleLoadedData();
                this.cdRef.detectChanges();
            })
        );
    }

    /**
     * handle loaded data
     */
    public handleLoadedData() {

        const offset = this.modellist.offset ?? 0;

        if (this.modellist.listData.list.length > 0) {
            Array(this.modellist.loadlimit).fill(0).forEach((_,i) => {
                this.loadedIndices[offset + i] = this.modellist.listData.list[i];
            });
        }

        if (this.modellist.listData.totalcount > 0) {
            this.indices = Array.from({length: this.modellist.listData.totalcount}, (_,i) => i);
        }
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
     * opens the modal allowing the user to choose and select the display fields when no field defs are defined and no current list fields are defined
     */
    private chooseFields() {
        if (this.modellist.isCustomList() && this.modellist.listfields.length == 0 && this.modellist.getFieldDefs()?.length == 0 && this.modellist.checkAccess('edit')) {
            this.modal.openModal('ObjectListViewSettingsSetfieldsModal', true, this.injector);
        }
    }

}
