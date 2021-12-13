/**
 * @module ModuleSpiceTimeStream
 */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, OnDestroy, OnInit
} from '@angular/core';
import {modellist} from '../../../services/modellist.service';
import {userpreferences} from '../../../services/userpreferences.service';
import {language} from '../../../services/language.service';
import {ListTypeI} from "../../../services/interfaces.service";
import {Subscription} from "rxjs";

/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'spice-timestream',
    templateUrl: '../templates/spicetimestream.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpiceTimestream implements OnInit, OnDestroy {

    /**
     * holds the various subscriptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();


    /**
     * the timestream object
     *
     * @private
     */
    public timestream: any = {
        period: 'y',
        dateStart: null,
        dateEnd: null,
    };



    constructor(
        public language: language,
        public userpreferences: userpreferences,
        public modellist: modellist,
        public cdRef: ChangeDetectorRef
    ) {

        // subscribe to changes of the list type
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

        // this.modellist.getListData();

    }

    public ngOnInit() {
        // set the buckets to null
        this.modellist.buckets = {};

        if (!this.modellist.loadFromSession()) {
            this.getListData();
        }
    }

    /**
     * make sure we cancel all subscriptions
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * trigger get list data on the service if autoload is not disabled and the list type is not "all" or reset the list data
     * @private
     */
    public getListData() {
        if (this.modellist.currentList.id != 'all') {
            this.modellist.getListData().subscribe(() =>
                this.cdRef.detectChanges()
            );
        } else {
            this.modellist.resetListData();
        }
    }

    /**
     * handle the list type change to reload the data only if for this component to prevent possible actions after destroy
     * @param newType
     * @private
     */
    public handleListTypeChange(newType: ListTypeI) {
        this.cdRef.detectChanges();
        if (newType.listcomponent != 'SpiceTimestream') return;
        this.getListData();
    }

}
