/**
 * @module ObjectComponents
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {layout} from '../../services/layout.service';
import {modellist} from '../../services/modellist.service';
import {Subscription} from "rxjs";

/**
 * renders the modellist
 */
@Component({
    selector: 'object-list',
    templateUrl: './src/objectcomponents/templates/objectlist.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObjectList implements OnDestroy {

    /**
     * all fields that are available
     */
    private allFields: any[] = [];

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

    constructor(public router: Router, public cdRef: ChangeDetectorRef, public metadata: metadata, public modellist: modellist, public language: language, public layout: layout) {

        this.subscriptions.add(this.modellist.listDataChanged$.subscribe(() => {
            this.cdRef.detectChanges();
        }));
        // get the confih
        this.componentconfig = this.metadata.getComponentConfig('ObjectList', this.modellist.module);

        // set the limit for the loading
        this.modellist.loadlimit = 50;

        // load the list and initialize from sesson data if this is set
        this.loadList(true);

        // subscribe to changes of the listtype
        this.subscriptions.add(this.modellist.listtype$.subscribe(newType => this.switchListtype()));
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
     * unsubscribe from the modellist subscription
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * handle the listtype when this is switched and reload the listdefs and the listdata
     */
    private switchListtype() {
        this.loadList();
    }

    /**
     * function to load the listdata. Checks on the listdata if the component is the same .. if yes .. no reload is needed
     * this can happen when the list is loaded from the appdata service that cahces the previous list
     *
     * @param loadfromcache
     */
    private loadList(loadfromcache: boolean = false) {

        if (this.modellist.listData.listcomponent != 'ObjectList') {
            let requestedFields = [];
            for (let entry of this.allFields) {
                if (requestedFields.indexOf(entry.field) == -1) {
                    requestedFields.push(entry.field);
                }
            }
            if (this.sortfield) {
                this.modellist.setSortField(this.sortfield, this.sortdirection, false);
            }
            this.modellist.getListData(requestedFields).subscribe(() => this.cdRef.detectChanges());
        }
    }

    /**
     * manages the scroll event for the infinited Scroll
     *
     * @param e
     */
    private onScroll() {
        this.modellist.loadMoreList();
    }

    /**
     * trackby function to opütimize performnce onm the for loop
     *
     * @param index
     * @param item
     */
    protected trackbyfn(index, item) {
        return item.id;
    }
}
