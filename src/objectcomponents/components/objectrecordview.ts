/**
 * @module ObjectComponents
 */
import {
    ComponentFactoryResolver, Component,
    ElementRef, OnInit, OnDestroy
} from '@angular/core';

import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {broadcast} from '../../services/broadcast.service';
import {favorite} from '../../services/favorite.service';
import {navigation} from '../../services/navigation.service';
import {navigationtab} from '../../services/navigationtab.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-recordview',
    templateUrl: '../templates/objectrecordview.html',
    providers: [model]
})
export class ObjectRecordView implements OnInit, OnDestroy {
    /**
     * the name of the module
     * @private
     */
    public moduleName: any = '';

    /**
     * the componentconfig
     * @private
     */
    public componentconfig: any = {};

    /**
     * any subnscriptions thois component might have that need to be destroyed when the component is destroyed
     * @private
     */
    public componentSubscriptions: Subscription = new Subscription();

    /**
     * indicates if the model here is loaded
     *
     * @private
     */
    public modelloaded: boolean = false;

    constructor(
        public broadcast: broadcast,
        public navigation: navigation,
        public navigationtab: navigationtab,
        public activatedRoute: ActivatedRoute,
        public metadata: metadata,
        public model: model,
        public favorite: favorite,
    ) {

    }

    public ngOnInit() {
        // this.moduleName = this.activatedRoute.params['value'].module;
        this.moduleName = this.navigationtab.activeRoute.params.module;

        // set theenavigation paradigm
        // this.navigation.setActiveModule(this.moduleName);

        // get the bean details
        this.model.module = this.moduleName;
        this.model.id = this.navigationtab.activeRoute.params.id;

        // retrieve the model data
        this.model.getData(true, 'detailview', true, true).subscribe({
            next: data => {
                // this.navigationtab.setTabInfo({displayname: data.summary_text, displaymodule: this.model.module});
                this.modelloaded = true;
            },
            error: () =>{
                this.navigationtab.closeTab();
            }
        });

        /**
         * load the component config
         */
        this.componentconfig = this.metadata.getComponentConfig('ObjectRecordView', this.moduleName);

        /**
         * subscribe to the broadcast
         */
        this.componentSubscriptions.add(
            this.broadcast.message$.subscribe(message => {
                this.handleMessage(message);
            })
        );

        /**
         * subscribe to the model data changes
         */
        this.componentSubscriptions.add(
            this.model.data$.subscribe(() => this.setTabTitle())
        );

    }

    /**
     * unsbscribe from all subscriptions
     */
    public ngOnDestroy() {
        this.componentSubscriptions.unsubscribe();
    }

    /**
     * react to model changes if the happen outside of the scope
     *
     * @param message
     */
    public handleMessage(message: any) {
        switch (message.messagetype) {

            case 'model.save':
                if (this.model.module === message.messagedata.module && this.model.id === message.messagedata.id) {
                    this.model.setData(message.messagedata.data);

                    // update the tab info
                    this.navigationtab.setTabInfo({
                        displayname: message.messagedata.data.summary_text,
                        displaymodule: this.model.module
                    });
                }
                break;
        }
    }

    public setTabTitle() {
        this.navigationtab.setTabInfo({
            displayname: this.model.getField('summary_text'),
            displaymodule: this.model.module
        });
    }
}
