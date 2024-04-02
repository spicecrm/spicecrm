/**
 * @module ObjectComponents
 */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {Subscription} from "rxjs";
import {relatedmodels} from "../../services/relatedmodels.service";
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: '../templates/objectrelatedduplicates.html',
    providers: [relatedmodels]
})
export class ObjectRelatedDuplicates implements OnInit, OnDestroy {
    /**
     * the component config
     */
    public componentconfig: any = {};

    /**
     * the fieldset config
     */
    public fieldset: string;

    /**
     * indicates to show the panel
     *
     * it is hidden if no dup check is done for the module or if no duplicates are found
     */
    public showPanel: boolean = false;

    /**
     * the loaded list of duplicates
     */
    public duplicates: any[] = [];

    /**
     * the toggle to open or close the panel
     */
    public hideDuplicates: boolean = false;

    /**
     * holds component subscriptions
     */
    public subscriptions: Subscription = new Subscription();

    /**
     * holds listfields of related model
     */
    public listfields: any[];

    /**
     * manages the toggle
     * shows/hides accepted duplicate Beans in the panel/list
     */
    public toggleValue: boolean = false;

    constructor(
        public model: model,
        public metadata: metadata,
        public broadcast: broadcast,
        public relatedmodels: relatedmodels,
        private toast: toast,
        private language: language) {
    }

    /**
     * load the duplicates and subscribe to the broadcast
     */
    public ngOnInit() {
        // check if the module has a dup check at all
        if (this.metadata.getModuleDuplicatecheck(this.model.module)) {
            // check duplicates
            this.checkDuplicates();

            // add a listener to the broadcast service
            this.subscriptions.add(
                this.broadcast.message$.subscribe(message => this.handleMessage(message))
            );
        }

        this.componentconfig = this.metadata.getComponentConfig('ObjectRelatedDuplicates', this.model.module);

        if (this.componentconfig.fieldset) {
            this.fieldset = this.componentconfig.fieldset;
            this.listfields = this.metadata.getFieldSetFields(this.componentconfig.fieldset);
        }
    }

    /**
     * handle the unsubscribe when the component is destroyed
     */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /**
     * used for the toggle icon
     */
    get arrowIconStyle() {
        if (this.hideDuplicates) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }

    /**
     * retrieves duplicate Beans from backend
     */
    public checkDuplicates() {
        this.relatedmodels.isloading = true;
        this.model.duplicateCheck().subscribe({
            next: (data) => {
                // save duplicate checked ids in a separate array
                this.relatedmodels.acceptedDuplicates = data.acceptedDuplicates;
                this.duplicates = data.records;
                this.relatedmodels.count = data.count;

                this.getRelatedData();

                // if we have duplicates show the panel
                if (this.relatedmodels.count > 0) this.showPanel = true;
                this.relatedmodels.isloading = false;
            }, error: () => {
                this.relatedmodels.isloading = false;
                this.toast.sendToast(this.language.getLabel('LBL_ERROR'), 'error');
            }
        });
    }

    /**
     * builds the items for the related list
     */
    public getRelatedData() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.model.module;
        this.showAcceptedDuplicates(this.toggleValue);
    }

    /**
     * manages the visibility of checked accepted duplicates
     */
    public showAcceptedDuplicates(value: boolean) {
        if (value) {
            let itemsArr: any[] = [];
            this.relatedmodels.items = itemsArr.concat(this.duplicates, this.relatedmodels.acceptedDuplicates);
        } else {
            this.relatedmodels.items = this.duplicates;
        }
    }

    /**
     * hande the message and delete a duplicate if it has been merged
     * @param message
     */
    public handleMessage(message) {
        switch (message.messagetype) {
            case 'model.delete':
                if (message.messagedata.module == this.model.module) {
                    let dupIndex = this.duplicates.findIndex(d => d.id == message.messagedata.id);
                    if (dupIndex >= 0) {
                        this.duplicates.splice(dupIndex, 1);
                        this.relatedmodels.count--;
                    }
                }
                break;
            case 'duplicates.reload':

                if (message.messagedata.deletedAcceptedDuplicate) {
                    this.duplicates.push(message.messagedata.deletedAcceptedDuplicate);

                    if (this.relatedmodels.acceptedDuplicates.length == 0) {
                        this.toggleValue = false;
                    }
                    this.showAcceptedDuplicates(this.toggleValue);

                } else {
                    if(!this.toggleValue) {
                        // remove the checked duplicate Bean from items
                        this.relatedmodels.items = this.relatedmodels.items.filter(item => item.id != message.messagedata.newAcceptedDuplicate.id);
                        this.duplicates = this.relatedmodels.items;
                    } else {
                        // remove new accepted duplicate from duplicates array
                        this.duplicates = this.duplicates.filter(item => item.id != message.messagedata.newAcceptedDuplicate.id);
                    }
                }
                break;
        }
    }

    /**
     * toggle the panel open or closed
     * @param e
     */
    public showDuplicates(e: MouseEvent) {
        e.stopPropagation();
        this.hideDuplicates = !this.hideDuplicates;
    }

}
