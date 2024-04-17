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
import {duplicatedmodels} from "../../services/duplicatedmodels.service";

@Component({
    selector: 'object-relatedlist-duplicates',
    templateUrl: '../templates/objectrelatedduplicates.html',
    providers: [relatedmodels, duplicatedmodels]
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

    constructor(
        public model: model,
        public metadata: metadata,
        public broadcast: broadcast,
        public relatedmodels: relatedmodels,
        public duplicatedModels: duplicatedmodels) {
    }

    /**
     * load the duplicates and subscribe to the broadcast
     */
    public ngOnInit() {
        // check if the module has a dup check at all
        if (this.metadata.getModuleDuplicatecheck(this.model.module)) {

            this.getRelatedData();

            // check duplicates
            this.duplicatedModels.checkDuplicates();

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
     * builds the items for the related list
     */
    public getRelatedData() {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.model.module;
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
                this.duplicatedModels.showDuplicatesByStatus(this.duplicatedModels.selectedStatus);
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
