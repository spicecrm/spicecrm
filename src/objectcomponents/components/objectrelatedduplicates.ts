/**
 * @module ObjectComponents
 */
import {Component, AfterViewInit, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: '../templates/objectrelatedduplicates.html'
})
export class ObjectRelatedDuplicates implements OnInit, OnDestroy {
    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * the loaded list of duplicates
     *
     * @private
     */
    public duplicates: any[] = [];

    /**
     * the complete duplicate count
     *
     * @private
     */
    public duplicatecount: number = 0;

    /**
     * the toggle to open or close the panel
     *
     * @private
     */
    public hideDuplicates: boolean = true;

    /**
     * indicates if we are loading
     *
     * @private
     */
    public isLoading: boolean = false;

    /**
     * holds component subscriptions
     *
     * @private
     */
    public subscriptions: Subscription = new Subscription();

    constructor(public model: model, public broadcast: broadcast) {

    }

    /**
     * load the duplicates and subscribe to the broadcast
     */
    public ngOnInit() {
        // check duplicates
        this.checkDuplicates();

        // add a listener to the broadcast service
        this.subscriptions.add(
            this.broadcast.message$.subscribe(message => this.handleMessage(message))
        );
    }

    /**
     * handle the unsubscribe whenthe component is destroyed
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * hande the message and delete a duplicate if it has been merged
     *
     * @param message
     * @private
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'model.delete':
                if (message.messagedata.module == this.model.module) {
                    let dupIndex = this.duplicates.findIndex(d => d.id == message.messagedata.id);
                    if (dupIndex >= 0) {
                        this.duplicates.splice(dupIndex, 1);
                        this.duplicatecount--;
                    }
                }
                break;
        }
    }

    /**
     * toggle the panel open or closed
     *
     * @param e
     * @private
     */
    public toggleDuplicates(e: MouseEvent) {
        e.stopPropagation();
        this.hideDuplicates = !this.hideDuplicates;
    }

    /**
     * checks for duplicates
     *
     * @private
     */
    public checkDuplicates() {
        this.isLoading = true;
        this.model.duplicateCheck().subscribe(
            data => {
                this.duplicates = data.records;
                this.duplicatecount = data.count;
                this.isLoading = false;
            },
            error => {
                this.isLoading = false;
            }
        );
    }

    /**
     * used for the toggle icon
     */
    get iconStyle() {
        if (this.hideDuplicates) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }
}
